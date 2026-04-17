// Fetch Nostr profile (Kind 0) for a pubkey
import { useState, useEffect } from 'react'
import { sanitizeProfile } from './sanitize'

const profileCache = new Map()
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

const RELAYS = [
  'wss://nos.lol',
  'wss://relay.primal.net',
  'wss://relay.damus.io'
]

export async function fetchProfile(pubkey) {
  if (!pubkey) return null
  
  // Check cache
  const cached = profileCache.get(pubkey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.profile
  }
  
  // Try each relay
  for (const relayUrl of RELAYS) {
    try {
      const profile = await fetchFromRelay(relayUrl, pubkey)
      if (profile) {
        profileCache.set(pubkey, { profile, timestamp: Date.now() })
        return profile
      }
    } catch (e) {
      console.warn(`[Profile] Failed to fetch from ${relayUrl}:`, e.message)
    }
  }
  
  return null
}

function fetchFromRelay(relayUrl, pubkey) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(relayUrl)
    const subId = 'profile_' + Math.random().toString(36).slice(2)
    let resolved = false
    
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true
        ws.close()
        resolve(null)
      }
    }, 5000)
    
    ws.onopen = () => {
      ws.send(JSON.stringify([
        'REQ',
        subId,
        { kinds: [0], authors: [pubkey], limit: 1 }
      ]))
    }
    
    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data)
        if (data[0] === 'EVENT' && data[2]?.kind === 0) {
          clearTimeout(timeout)
          resolved = true
          ws.close()
          
          const content = JSON.parse(data[2].content)
          resolve(sanitizeProfile({
            name: content.name || content.display_name || '',
            displayName: content.display_name || content.name || '',
            picture: content.picture || '',
            about: content.about || '',
            nip05: content.nip05 || '',
            lud16: content.lud16 || content.lud06 || '',
            banner: content.banner || ''
          }))
        } else if (data[0] === 'EOSE') {
          // End of stored events - no profile found
          clearTimeout(timeout)
          resolved = true
          ws.close()
          resolve(null)
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    ws.onerror = () => {
      clearTimeout(timeout)
      if (!resolved) {
        resolved = true
        reject(new Error('WebSocket error'))
      }
    }
  })
}

// React hook
export function useProfile(pubkey) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!pubkey) {
      setLoading(false)
      return
    }
    
    // Check cache first (sync)
    const cached = profileCache.get(pubkey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setProfile(cached.profile)
      setLoading(false)
      return
    }
    
    setLoading(true)
    fetchProfile(pubkey)
      .then(setProfile)
      .finally(() => setLoading(false))
  }, [pubkey])
  
  return { profile, loading }
}

// Format pubkey for display (npub or shortened hex)
export function formatPubkey(pubkey) {
  if (!pubkey) return ''
  return pubkey.slice(0, 8) + '...' + pubkey.slice(-4)
}
