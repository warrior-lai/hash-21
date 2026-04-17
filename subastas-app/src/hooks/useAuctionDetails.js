import { useState, useEffect, useCallback } from 'react'
import { fetchProfile } from '../utils/profile'
import { sanitizeText } from '../utils/sanitize'

const RELAYS = [
  'wss://nos.lol',
  'wss://relay.primal.net',
  'wss://relay.damus.io'
]

// Fetch bids and comments for an auction
export function useAuctionDetails(auctionId) {
  const [bids, setBids] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auctionId) {
      setLoading(false)
      return
    }

    const fetchDetails = async () => {
      setLoading(true)
      const allBids = []
      const allComments = []
      const seenBids = new Set()
      const seenComments = new Set()

      // Try each relay
      for (const relayUrl of RELAYS) {
        try {
          const { bids: relayBids, comments: relayComments } = await fetchFromRelay(relayUrl, auctionId)
          
          for (const bid of relayBids) {
            if (!seenBids.has(bid.id)) {
              seenBids.add(bid.id)
              allBids.push(bid)
            }
          }
          
          for (const comment of relayComments) {
            if (!seenComments.has(comment.id)) {
              seenComments.add(comment.id)
              allComments.push(comment)
            }
          }
        } catch (e) {
          console.warn(`[Details] Failed to fetch from ${relayUrl}:`, e.message)
        }
      }

      // Fetch profiles for all unique pubkeys
      const pubkeys = new Set([
        ...allBids.map(b => b.pubkey),
        ...allComments.map(c => c.pubkey)
      ])
      
      const profiles = {}
      await Promise.all([...pubkeys].map(async (pk) => {
        const profile = await fetchProfile(pk)
        if (profile) profiles[pk] = profile
      }))

      // Enrich with profiles
      const enrichedBids = allBids.map(b => ({
        ...b,
        profile: profiles[b.pubkey] || null
      })).sort((a, b) => b.amount - a.amount) // Sort by amount desc

      const enrichedComments = allComments.map(c => ({
        ...c,
        profile: profiles[c.pubkey] || null
      })).sort((a, b) => a.createdAt - b.createdAt) // Sort by time asc

      setBids(enrichedBids)
      setComments(enrichedComments)
      setLoading(false)
    }

    fetchDetails()
  }, [auctionId])

  // Post a comment
  const postComment = useCallback(async (text) => {
    if (!auctionId || !text.trim()) return
    
    if (typeof window.nostr === 'undefined') {
      throw new Error('Necesitás extensión Nostr')
    }

    const pubkey = await window.nostr.getPublicKey()
    const now = Math.floor(Date.now() / 1000)

    const event = {
      kind: 1,
      created_at: now,
      tags: [
        ['e', auctionId, '', 'root'],
        ['t', 'hash21-comment']
      ],
      content: text.trim()
    }

    const signedEvent = await window.nostr.signEvent(event)
    if (!signedEvent?.sig) throw new Error('Firma cancelada')

    // Publish to relays
    await publishToRelays(signedEvent)

    // Add to local state
    const profile = await fetchProfile(pubkey)
    setComments(prev => [...prev, {
      id: signedEvent.id,
      pubkey,
      content: text.trim(),
      createdAt: now,
      profile
    }])

    return signedEvent
  }, [auctionId])

  return { bids, comments, loading, postComment }
}

function fetchFromRelay(relayUrl, auctionId) {
  return new Promise((resolve) => {
    const ws = new WebSocket(relayUrl)
    const bids = []
    const comments = []
    let resolved = false
    let eoseCount = 0
    const EXPECTED_EOSE = 2 // bids + comments

    const finish = () => {
      if (!resolved) {
        resolved = true
        ws.close()
        resolve({ bids, comments })
      }
    }

    const timeout = setTimeout(finish, 5000)

    ws.onopen = () => {
      // Request bids (Kind 1021 with 'e' tag)
      ws.send(JSON.stringify([
        'REQ', 'bids',
        { kinds: [1021], '#e': [auctionId], limit: 100 }
      ]))
      
      // Request comments (Kind 1 with 'e' tag)
      ws.send(JSON.stringify([
        'REQ', 'comments',
        { kinds: [1], '#e': [auctionId], '#t': ['hash21-comment'], limit: 50 }
      ]))
    }

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data)
        
        if (data[0] === 'EVENT') {
          const subId = data[1]
          const event = data[2]
          
          if (subId === 'bids' && event.kind === 1021) {
            const amountTag = event.tags.find(t => t[0] === 'amount')
            const amount = amountTag ? parseInt(amountTag[1]) : 0
            
            bids.push({
              id: event.id,
              pubkey: event.pubkey,
              amount,
              createdAt: event.created_at
            })
          } else if (subId === 'comments' && event.kind === 1) {
            comments.push({
              id: event.id,
              pubkey: event.pubkey,
              content: sanitizeText(event.content, 2000),
              createdAt: event.created_at
            })
          }
        } else if (data[0] === 'EOSE') {
          // Wait for BOTH subscriptions to finish
          eoseCount++
          if (eoseCount >= EXPECTED_EOSE) {
            clearTimeout(timeout)
            finish()
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    ws.onerror = () => {
      clearTimeout(timeout)
      finish()
    }
  })
}

async function publishToRelays(event) {
  const promises = RELAYS.map(relayUrl => {
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(relayUrl)
        const timeout = setTimeout(() => {
          ws.close()
          resolve(false)
        }, 5000)
        
        ws.onopen = () => {
          ws.send(JSON.stringify(['EVENT', event]))
        }
        
        ws.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data)
            if (data[0] === 'OK') {
              clearTimeout(timeout)
              ws.close()
              resolve(true)
            }
          } catch (e) {}
        }
        
        ws.onerror = () => {
          clearTimeout(timeout)
          resolve(false)
        }
      } catch (e) {
        resolve(false)
      }
    })
  })
  
  await Promise.all(promises)
}

// Format relative time
export function formatRelativeTime(timestamp) {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp

  if (diff < 60) return 'ahora'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`
  
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}
