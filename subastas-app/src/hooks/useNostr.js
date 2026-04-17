import { useState, useEffect, useCallback, useRef } from 'react'
import { nip19 } from 'nostr-tools'
import { checkSession, saveSession, clearSession } from '../utils/validation'

const RELAYS = [
  'wss://nos.lol',
  'wss://relay.primal.net',
  'wss://relay.snort.social',
  'wss://relay.damus.io'
]

const CONNECTION_TIMEOUT = 5000

export function useNostr() {
  const [status, setStatus] = useState('disconnected') // disconnected | connecting | connected | error
  const [connectedRelays, setConnectedRelays] = useState([])
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const socketsRef = useRef([])
  const reconnectTimeoutRef = useRef(null)

  // Connect to relays
  const connect = useCallback(() => {
    console.log('[Nostr] Connecting to relays...')
    setStatus('connecting')
    setError(null)
    const connected = []
    let resolved = false

    // Cleanup old connections
    socketsRef.current.forEach(ws => ws.close())
    socketsRef.current = []

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true
        if (connected.length > 0) {
          setStatus('connected')
          setConnectedRelays([...connected])
        } else {
          setStatus('error')
          setError('No se pudo conectar a ningún relay')
        }
      }
    }, CONNECTION_TIMEOUT)

    RELAYS.forEach(url => {
      try {
        const ws = new WebSocket(url)
        socketsRef.current.push(ws)

        ws.onopen = () => {
          console.log('[Nostr] Connected to:', url)
          connected.push(url)
          setConnectedRelays([...connected])
          if (!resolved && connected.length >= 2) {
            resolved = true
            clearTimeout(timeout)
            setStatus('connected')
            console.log('[Nostr] Status: connected')
          }
        }

        ws.onerror = (e) => {
          console.error('[Nostr] Error connecting to:', url, e)
        }

        ws.onclose = () => {
          const idx = connected.indexOf(url)
          if (idx > -1) connected.splice(idx, 1)
          setConnectedRelays([...connected])
          // If all relays dropped, auto-reconnect after 3s
          if (connected.length === 0 && resolved) {
            setStatus('disconnected')
            reconnectTimeoutRef.current = setTimeout(connect, 3000)
          }
        }
      } catch (e) {
        console.error('WebSocket error:', url, e)
      }
    })

    return () => clearTimeout(timeout)
  }, [])

  // Reconnect
  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    reconnectTimeoutRef.current = setTimeout(connect, 1000)
  }, [connect])

  // Login with extension (NIP-07)
  const loginWithExtension = useCallback(async () => {
    if (typeof window.nostr === 'undefined') {
      throw new Error('No se encontró extensión Nostr. Instalá Alby: getalby.com')
    }

    const pubkey = await window.nostr.getPublicKey()
    const npub = nip19.npubEncode(pubkey)
    const userData = { pubkey, npub, method: 'extension' }
    setUser(userData)
    saveSession(userData)
    return userData
  }, [])

  // Login with npub
  const loginWithNpub = useCallback((npubInput) => {
    try {
      const { type, data } = nip19.decode(npubInput)
      if (type !== 'npub') throw new Error('Formato inválido')
      const userData = { pubkey: data, npub: npubInput, method: 'npub' }
      setUser(userData)
      saveSession(userData)
      return userData
    } catch (e) {
      throw new Error('npub inválido')
    }
  }, [])

  // Logout
  const logout = useCallback(() => {
    setUser(null)
    clearSession()
  }, [])

  // Publish an already-signed event (no re-signing)
  const publishSigned = useCallback(async (signedEvent) => {
    let published = 0
    const promises = socketsRef.current
      .filter(ws => ws.readyState === WebSocket.OPEN)
      .map(ws => new Promise(resolve => {
        try {
          ws.send(JSON.stringify(['EVENT', signedEvent]))
          published++
          resolve(true)
        } catch {
          resolve(false)
        }
      }))

    await Promise.all(promises)
    if (published === 0) throw new Error('No hay relays conectados')
  }, [])

  // Publish event (signs first, then sends)
  const publish = useCallback(async (event) => {
    if (typeof window.nostr === 'undefined') {
      throw new Error('Necesitás extensión Nostr para firmar')
    }

    const signedEvent = await window.nostr.signEvent(event)
    if (!signedEvent?.sig) throw new Error('Firma cancelada')

    await publishSigned(signedEvent)
    return signedEvent
  }, [publishSigned])

  // Subscribe to events
  const subscribe = useCallback((filters, onEvent) => {
    const subId = Math.random().toString(36).slice(2)
    const handlers = []
    
    socketsRef.current
      .filter(ws => ws.readyState === WebSocket.OPEN)
      .forEach(ws => {
        ws.send(JSON.stringify(['REQ', subId, ...filters]))
        
        const handler = (msg) => {
          try {
            const data = JSON.parse(msg.data)
            if (data[0] === 'EVENT' && data[1] === subId) {
              onEvent(data[2])
            }
          } catch {}
        }
        
        ws.addEventListener('message', handler)
        handlers.push({ ws, handler })
      })

    // Cleanup: remove listeners AND close subscription
    return () => {
      handlers.forEach(({ ws, handler }) => {
        ws.removeEventListener('message', handler)
      })
      socketsRef.current
        .filter(ws => ws.readyState === WebSocket.OPEN)
        .forEach(ws => {
          try { ws.send(JSON.stringify(['CLOSE', subId])) } catch {}
        })
    }
  }, [])

  // Auto-connect and restore session
  useEffect(() => {
    console.log('[Nostr] useEffect mounting, calling connect()')
    connect()

    const savedUser = checkSession()
    if (savedUser) {
      setUser(savedUser)
    }

    return () => {
      socketsRef.current.forEach(ws => ws.close())
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    status,
    connectedRelays,
    user,
    error,
    connect,
    reconnect,
    loginWithExtension,
    loginWithNpub,
    logout,
    publish,
    publishSigned,
    subscribe
  }
}
