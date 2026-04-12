import { useState, useEffect, useCallback, useRef } from 'react'

export function useAuctions(nostr) {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const nostrRef = useRef(nostr)
  
  // Keep ref updated
  useEffect(() => {
    nostrRef.current = nostr
  }, [nostr])

  // Fetch auctions from relays
  const fetchAuctions = useCallback(() => {
    const n = nostrRef.current
    console.log('[Auctions] fetchAuctions called')
    
    if (!n || n.status !== 'connected') {
      console.log('[Auctions] Not connected, skipping')
      return
    }

    console.log('[Auctions] Starting fetch...')
    setLoading(true)
    setError(null)

    const now = Math.floor(Date.now() / 1000)
    const seen = new Set()
    const newAuctions = []

    // Subscribe to Kind 30020 (auctions)
    const filters = [{ kinds: [30020], limit: 50 }]
    
    const timeout = setTimeout(() => {
      console.log('[Auctions] Timeout reached, found:', newAuctions.length, 'auctions')
      setLoading(false)
    }, 3000)

    const unsub = n.subscribe(filters, (event) => {
      if (seen.has(event.id)) return
      seen.add(event.id)

      try {
        const tags = Object.fromEntries(
          event.tags.filter(t => t.length >= 2).map(t => [t[0], t[1]])
        )

        const endTime = parseInt(tags.end_time || '0')
        const status = endTime > now ? 'active' : 'ended'

        const auction = {
          id: event.id,
          pubkey: event.pubkey,
          title: tags.title || 'Sin título',
          description: tags.summary || event.content || '',
          image: tags.image || '',
          startPrice: parseInt(tags.start_price || '0'),
          currentBid: parseInt(tags.current_bid || tags.start_price || '0'),
          reservePrice: parseInt(tags.reserve_price || '0'),
          startTime: parseInt(tags.start_time || event.created_at),
          endTime,
          status,
          bids: []
        }

        newAuctions.push(auction)
        setAuctions([...newAuctions].sort((a, b) => b.startTime - a.startTime))
      } catch (e) {
        console.error('Error parsing auction:', e)
      }
    })

    return () => {
      clearTimeout(timeout)
      unsub?.()
    }
  }, [])  // Empty deps - uses ref

  // Create auction
  const createAuction = useCallback(async ({ title, description, image, startPrice, reservePrice, duration }) => {
    const n = nostrRef.current
    if (!n?.user) throw new Error('Conectá tu Nostr primero')

    const now = Math.floor(Date.now() / 1000)
    const auctionId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${now}`

    const event = {
      kind: 30020,
      created_at: now,
      tags: [
        ['d', auctionId],
        ['title', title],
        ['summary', description || ''],
        ['image', image],
        ['start_price', startPrice.toString()],
        ['currency', 'sats'],
        ['start_time', now.toString()],
        ['end_time', (now + duration).toString()]
      ],
      content: description || title
    }

    if (reservePrice) {
      event.tags.push(['reserve_price', reservePrice.toString()])
    }

    const signed = await n.publish(event)
    
    // Add to local state immediately
    const newAuction = {
      id: signed.id,
      pubkey: signed.pubkey,
      title,
      description,
      image,
      startPrice,
      currentBid: startPrice,
      reservePrice: reservePrice || 0,
      startTime: now,
      endTime: now + duration,
      status: 'active',
      bids: []
    }
    
    setAuctions(prev => [newAuction, ...prev])
    return newAuction
  }, [])  // Empty deps - uses ref

  // Place bid
  const placeBid = useCallback(async (auctionId, amount) => {
    const n = nostrRef.current
    if (!n?.user) throw new Error('Conectá tu Nostr primero')

    const now = Math.floor(Date.now() / 1000)
    
    const event = {
      kind: 1021,
      created_at: now,
      tags: [
        ['e', auctionId],
        ['amount', amount.toString()],
        ['currency', 'sats']
      ],
      content: `Bid ${amount} sats`
    }

    await n.publish(event)

    // Update local state
    setAuctions(prev => prev.map(a => {
      if (a.id === auctionId && amount > a.currentBid) {
        return { ...a, currentBid: amount }
      }
      return a
    }))
  }, [])  // Empty deps - uses ref

  // Auto-fetch when connected - only depends on status string
  useEffect(() => {
    console.log('[Auctions] useEffect triggered, status:', nostr.status)
    
    if (nostr.status === 'connected') {
      console.log('[Auctions] Connected! Calling fetchAuctions')
      fetchAuctions()
    } else if (nostr.status === 'error' || nostr.status === 'disconnected') {
      console.log('[Auctions] Error or disconnected, stopping loading')
      setLoading(false)
    } else {
      console.log('[Auctions] Still connecting, setting 4s timeout')
      const timeout = setTimeout(() => {
        console.log('[Auctions] Timeout: stopping loading')
        setLoading(false)
      }, 4000)
      return () => clearTimeout(timeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nostr.status])  // Only status string, not the whole object

  return {
    auctions,
    loading,
    error,
    fetchAuctions,
    createAuction,
    placeBid
  }
}
