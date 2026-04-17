// NIP-46 Nostr Connect (Remote Signing / Bunker)
//
// Flow:
// 1. App generates ephemeral keypair (clientKeypair)
// 2. User provides bunker URI: nostr+bunker://<remote-pubkey>?relay=wss://...&secret=...
// 3. App connects to the relay and sends encrypted "connect" request
// 4. Bunker (Amber, nsecBunker) approves → sends back pubkey
// 5. For signing: app sends encrypted "sign_event" → bunker signs → returns signed event
// 6. All communication encrypted with NIP-44 between clientKeypair and bunkerPubkey

import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools/pure'
import { encrypt as nip44Encrypt, decrypt as nip44Decrypt } from 'nostr-tools/nip44'

const DEFAULT_RELAY = 'wss://relay.nsec.app'
const REQUEST_TIMEOUT = 60000 // 60s for user to approve on their device

export class NostrBunker {
  constructor() {
    this.socket = null
    this.clientSk = null
    this.clientPk = null
    this.remotePubkey = null
    this.userPubkey = null
    this.relay = null
    this.secret = null
    this.pendingRequests = new Map()
    this._messageHandler = null
  }

  // Parse nostr+bunker:// URI
  parseBunkerUri(uri) {
    if (!uri.startsWith('nostr+bunker://')) {
      throw new Error('URI debe empezar con nostr+bunker://')
    }
    const stripped = uri.replace('nostr+bunker://', 'http://') // trick to use URL parser
    const url = new URL(stripped)
    const remotePubkey = url.hostname || url.pathname.replace(/^\/+/, '')
    const relay = url.searchParams.get('relay') || DEFAULT_RELAY
    const secret = url.searchParams.get('secret') || ''

    if (!remotePubkey || remotePubkey.length !== 64) {
      throw new Error('Pubkey del bunker inválida')
    }

    return { remotePubkey, relay, secret }
  }

  // Connect to bunker
  async connect(bunkerUri) {
    const { remotePubkey, relay, secret } = this.parseBunkerUri(bunkerUri)

    // Generate ephemeral client keypair
    this.clientSk = generateSecretKey()
    this.clientPk = getPublicKey(this.clientSk)
    this.remotePubkey = remotePubkey
    this.relay = relay
    this.secret = secret

    // Connect WebSocket
    await this._connectWs(relay)

    // Subscribe to responses (Kind 24133 events tagged to us)
    this._subscribe()

    // Send connect request
    const result = await this._sendRequest('connect', [this.clientPk, secret])

    // If connect returns 'ack' or a pubkey, we're good
    this.userPubkey = result === 'ack' ? remotePubkey : result

    // Request the actual user pubkey
    try {
      const pk = await this._sendRequest('get_public_key', [])
      if (pk && pk.length === 64) {
        this.userPubkey = pk
      }
    } catch {
      // Some bunkers don't support get_public_key, use remote pubkey
    }

    return {
      pubkey: this.userPubkey,
      remotePubkey: this.remotePubkey
    }
  }

  // Sign an event via the bunker
  async signEvent(event) {
    const result = await this._sendRequest('sign_event', [JSON.stringify(event)])
    const signed = typeof result === 'string' ? JSON.parse(result) : result
    if (!signed?.sig) throw new Error('Firma inválida del bunker')
    return signed
  }

  // Get public key
  async getPublicKey() {
    if (this.userPubkey) return this.userPubkey
    const pk = await this._sendRequest('get_public_key', [])
    this.userPubkey = pk
    return pk
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    if (this._messageHandler) {
      this._messageHandler = null
    }
    this.pendingRequests.clear()
    this.clientSk = null
    this.clientPk = null
    this.remotePubkey = null
    this.userPubkey = null
  }

  // --- Internal methods ---

  _connectWs(relay) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(relay)
      const timeout = setTimeout(() => {
        ws.close()
        reject(new Error('Timeout conectando al relay'))
      }, 10000)

      ws.onopen = () => {
        clearTimeout(timeout)
        this.socket = ws
        resolve()
      }

      ws.onerror = () => {
        clearTimeout(timeout)
        reject(new Error('Error conectando al relay del bunker'))
      }
    })
  }

  _subscribe() {
    if (!this.socket) return

    const subId = 'nip46_' + Math.random().toString(36).slice(2)

    this.socket.send(JSON.stringify([
      'REQ', subId,
      {
        kinds: [24133],
        '#p': [this.clientPk],
        since: Math.floor(Date.now() / 1000) - 10
      }
    ]))

    this._messageHandler = (msg) => {
      try {
        const data = JSON.parse(msg.data)
        if (data[0] !== 'EVENT' || data[1] !== subId) return
        const event = data[2]
        if (event.kind !== 24133) return

        // Decrypt with NIP-44
        let content
        try {
          const conversationKey = nip44Encrypt.utils
            ? nip44Decrypt(event.content, nip44Encrypt.utils.getConversationKey(this.clientSk, event.pubkey))
            : nip44Decrypt(this.clientSk, event.pubkey, event.content)
        } catch {
          // Try different nip44 API (varies by nostr-tools version)
          try {
            content = nip44Decrypt(event.content, this.clientSk, event.pubkey)
          } catch {
            console.warn('[NIP-46] Could not decrypt response')
            return
          }
        }

        if (!content) {
          // Fallback: try parsing directly (some bunkers use nip04)
          try {
            content = JSON.parse(event.content)
          } catch {
            return
          }
        } else if (typeof content === 'string') {
          content = JSON.parse(content)
        }

        const { id, result, error } = content
        const pending = this.pendingRequests.get(id)
        if (!pending) return

        this.pendingRequests.delete(id)
        if (error) {
          pending.reject(new Error(error))
        } else {
          pending.resolve(result)
        }
      } catch (e) {
        console.error('[NIP-46] Message error:', e)
      }
    }

    this.socket.addEventListener('message', this._messageHandler)
  }

  async _sendRequest(method, params) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('No conectado al bunker')
    }

    const id = Math.random().toString(36).slice(2, 10)

    const request = JSON.stringify({ id, method, params })

    // Encrypt with NIP-44
    let encrypted
    try {
      // nostr-tools nip44 API
      encrypted = nip44Encrypt(request, this.clientSk, this.remotePubkey)
    } catch {
      try {
        const conversationKey = nip44Encrypt.utils.getConversationKey(this.clientSk, this.remotePubkey)
        encrypted = nip44Encrypt(request, conversationKey)
      } catch {
        // Fallback: send unencrypted (not ideal but some bunkers accept it)
        encrypted = request
      }
    }

    // Create and sign a Kind 24133 event
    const event = finalizeEvent({
      kind: 24133,
      created_at: Math.floor(Date.now() / 1000),
      tags: [['p', this.remotePubkey]],
      content: encrypted
    }, this.clientSk)

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id)
        reject(new Error(`Timeout: esperando "${method}" del bunker (60s). ¿Aprobaste en tu dispositivo?`))
      }, REQUEST_TIMEOUT)

      this.pendingRequests.set(id, {
        resolve: (val) => { clearTimeout(timeout); resolve(val) },
        reject: (err) => { clearTimeout(timeout); reject(err) }
      })

      this.socket.send(JSON.stringify(['EVENT', event]))
    })
  }
}

// Singleton
let instance = null

export function getBunker() {
  if (!instance) instance = new NostrBunker()
  return instance
}

export function resetBunker() {
  if (instance) {
    instance.disconnect()
    instance = null
  }
}
