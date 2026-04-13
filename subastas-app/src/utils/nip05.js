// NIP-05 Verification
// Format: name@domain.com -> checks domain.com/.well-known/nostr.json

export async function verifyNip05(nip05, pubkey) {
  if (!nip05 || !pubkey) return false
  
  try {
    const [name, domain] = nip05.split('@')
    if (!name || !domain) return false
    
    const url = `https://${domain}/.well-known/nostr.json?name=${name}`
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    })
    
    if (!response.ok) return false
    
    const data = await response.json()
    const registeredPubkey = data.names?.[name]
    
    return registeredPubkey === pubkey
  } catch (e) {
    console.error('[NIP-05] Verification failed:', e)
    return false
  }
}

// Cache verified pubkeys to avoid repeated requests
const verifiedCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function isVerified(nip05, pubkey) {
  if (!nip05 || !pubkey) return false
  
  const cacheKey = `${nip05}:${pubkey}`
  const cached = verifiedCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.verified
  }
  
  const verified = await verifyNip05(nip05, pubkey)
  verifiedCache.set(cacheKey, { verified, timestamp: Date.now() })
  
  return verified
}

// Hook for React components
import { useState, useEffect } from 'react'

export function useNip05Verification(nip05, pubkey) {
  const [verified, setVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!nip05 || !pubkey) {
      setLoading(false)
      return
    }
    
    isVerified(nip05, pubkey)
      .then(setVerified)
      .finally(() => setLoading(false))
  }, [nip05, pubkey])
  
  return { verified, loading }
}
