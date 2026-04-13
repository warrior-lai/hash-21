// NIP-46 Nostr Connect (Bunker)
// Allows remote signing via a bunker server

const BUNKER_RELAYS = [
  'wss://relay.nsec.app',
  'wss://relay.getalby.com/v1'
]

export class NostrConnect {
  constructor() {
    this.socket = null
    this.pubkey = null
    this.secretKey = null
    this.bunkerPubkey = null
    this.pendingRequests = new Map()
  }

  // Parse nostr+bunker:// URI
  parseBunkerUri(uri) {
    // Format: nostr+bunker://<bunker-pubkey>?relay=wss://...&secret=...
    if (!uri.startsWith('nostr+bunker://')) {
      throw new Error('URI inválida. Debe empezar con nostr+bunker://')
    }

    const url = new URL(uri.replace('nostr+bunker://', 'https://'))
    const bunkerPubkey = url.hostname
    const relay = url.searchParams.get('relay') || BUNKER_RELAYS[0]
    const secret = url.searchParams.get('secret')

    return { bunkerPubkey, relay, secret }
  }

  // Connect to bunker
  async connect(bunkerUri) {
    const { bunkerPubkey, relay, secret } = this.parseBunkerUri(bunkerUri)
    this.bunkerPubkey = bunkerPubkey
    this.secret = secret

    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(relay)
      
      const timeout = setTimeout(() => {
        this.socket.close()
        reject(new Error('Timeout conectando al bunker'))
      }, 10000)

      this.socket.onopen = async () => {
        clearTimeout(timeout)
        try {
          // Request pubkey from bunker
          const pubkey = await this.requestPubkey()
          this.pubkey = pubkey
          resolve({ pubkey, bunkerPubkey })
        } catch (e) {
          reject(e)
        }
      }

      this.socket.onerror = () => {
        clearTimeout(timeout)
        reject(new Error('Error conectando al relay del bunker'))
      }

      this.socket.onmessage = (msg) => {
        this.handleMessage(msg)
      }
    })
  }

  // Request pubkey from bunker
  async requestPubkey() {
    const id = Math.random().toString(36).slice(2)
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject })
      
      const request = {
        id,
        method: 'get_public_key',
        params: []
      }

      // In a full implementation, this would be encrypted
      // For now, we use a simplified flow
      this.socket.send(JSON.stringify(['REQ', id, { kinds: [24133] }]))
      
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id)
          reject(new Error('Timeout esperando respuesta del bunker'))
        }
      }, 15000)
    })
  }

  // Handle incoming messages
  handleMessage(msg) {
    try {
      const data = JSON.parse(msg.data)
      if (data[0] === 'EVENT') {
        const event = data[2]
        // Process bunker response
        if (event.kind === 24133) {
          // NIP-46 response
          const content = JSON.parse(event.content)
          const pending = this.pendingRequests.get(content.id)
          if (pending) {
            this.pendingRequests.delete(content.id)
            if (content.error) {
              pending.reject(new Error(content.error))
            } else {
              pending.resolve(content.result)
            }
          }
        }
      }
    } catch (e) {
      console.error('[NIP-46] Error parsing message:', e)
    }
  }

  // Sign event via bunker
  async signEvent(event) {
    const id = Math.random().toString(36).slice(2)
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject })
      
      // Request signature
      const request = {
        id,
        method: 'sign_event',
        params: [JSON.stringify(event)]
      }

      // Send request (would be encrypted in full implementation)
      this.socket.send(JSON.stringify(['EVENT', {
        kind: 24133,
        content: JSON.stringify(request),
        tags: [['p', this.bunkerPubkey]],
        created_at: Math.floor(Date.now() / 1000)
      }]))

      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id)
          reject(new Error('Timeout esperando firma del bunker'))
        }
      }, 30000)
    })
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.pubkey = null
    this.bunkerPubkey = null
  }
}

// Singleton instance
let bunkerInstance = null

export function getBunker() {
  if (!bunkerInstance) {
    bunkerInstance = new NostrConnect()
  }
  return bunkerInstance
}

// React hook
import { useState, useCallback } from 'react'

export function useBunkerLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loginWithBunker = useCallback(async (bunkerUri) => {
    setLoading(true)
    setError(null)

    try {
      const bunker = getBunker()
      const { pubkey, bunkerPubkey } = await bunker.connect(bunkerUri)
      
      // Save to localStorage
      localStorage.setItem('hash21-auth', JSON.stringify({
        method: 'bunker',
        pubkey,
        bunkerPubkey,
        bunkerUri,
        loggedIn: true,
        timestamp: Date.now()
      }))
      
      return { pubkey, bunkerPubkey }
    } catch (e) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  return { loginWithBunker, loading, error }
}
