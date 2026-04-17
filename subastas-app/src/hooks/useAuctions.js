import { useState, useEffect, useCallback, useRef } from 'react'
import { sanitizeAuction } from '../utils/sanitize'

// Upload image via our serverless proxy (avoids CORS issues)
async function uploadImage(dataUrl) {
  const res = await fetch(dataUrl)
  const blob = await res.blob()

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': blob.type || 'image/jpeg' },
    body: blob
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'No se pudo subir la imagen. Probá pegando una URL directa.')
  }

  const data = await response.json()
  if (!data?.url) throw new Error('No se obtuvo URL de la imagen')
  return data.url
}

export function useAuctions(nostr) {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)
  const nostrRef = useRef(nostr)
  const showAllRef = useRef(showAll)
  
  // Keep refs updated
  useEffect(() => {
    nostrRef.current = nostr
  }, [nostr])

  useEffect(() => {
    showAllRef.current = showAll
  }, [showAll])

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
    const filters = showAllRef.current 
      ? [{ kinds: [30020], limit: 100 }]
      : [{ kinds: [30020], '#t': ['hash21'], limit: 50 }]
    
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

        const auction = sanitizeAuction({
          id: event.id,
          pubkey: event.pubkey,
          title: tags.title || 'Sin título',
          description: tags.summary || event.content || '',
          image: tags.image || '',
          artist: tags.artist || '',
          nip05: tags.nip05 || '',
          lnaddr: tags.lnaddr || '',
          startPrice: parseInt(tags.start_price || '0'),
          currentBid: parseInt(tags.current_bid || tags.start_price || '0'),
          reservePrice: parseInt(tags.reserve_price || '0'),
          startTime: parseInt(tags.start_time || event.created_at),
          endTime,
          status,
          bids: []
        })

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
  const createAuction = useCallback(async ({ title, description, image, artistName, nip05, lightningAddress, startPrice, reservePrice, duration }) => {
    if (typeof window.nostr === 'undefined') {
      throw new Error('Necesitás extensión Nostr (Alby)')
    }
    
    // Get pubkey directly from extension
    const pubkey = await window.nostr.getPublicKey()

    const now = Math.floor(Date.now() / 1000)
    const auctionId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${now}`

    // ImageUpload component already provides a hosted URL
    const imageUrl = image

    const tags = [
      ['d', auctionId],
      ['t', 'hash21'],
      ['title', title],
      ['summary', description || ''],
      ['image', imageUrl],
      ['start_price', startPrice.toString()],
      ['currency', 'sats'],
      ['start_time', now.toString()],
      ['end_time', (now + duration).toString()]
    ]

    if (artistName) tags.push(['artist', artistName])
    if (nip05) tags.push(['nip05', nip05])
    if (lightningAddress) tags.push(['lnaddr', lightningAddress])
    if (reservePrice) tags.push(['reserve_price', reservePrice.toString()])

    const event = {
      kind: 30020,
      created_at: now,
      tags,
      content: description || title
    }

    // Sign event via extension
    const signedEvent = await window.nostr.signEvent(event)
    if (!signedEvent?.sig) throw new Error('Firma cancelada')
    
    // Publish the SIGNED event to relays (no double-signing)
    const n = nostrRef.current
    if (n?.publishSigned) {
      await n.publishSigned(signedEvent)
    }
    
    // Add to local state immediately
    const newAuction = {
      id: signedEvent.id,
      pubkey: signedEvent.pubkey,
      title,
      description,
      image: imageUrl,
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
  }, [nostr.status, showAll])  // Re-fetch when toggling showAll

  return {
    auctions,
    loading,
    error,
    showAll,
    setShowAll,
    fetchAuctions,
    createAuction,
    placeBid
  }
}
