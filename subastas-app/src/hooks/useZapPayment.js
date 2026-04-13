import { useState, useEffect, useCallback, useRef } from 'react'

const API = 'https://hash21-backend.vercel.app/api'
const RELAYS = [
  'wss://nos.lol',
  'wss://relay.primal.net',
  'wss://relay.damus.io'
]

export function useZapPayment() {
  const [status, setStatus] = useState('idle') // idle, loading, waiting, paid, error
  const [invoice, setInvoice] = useState('')
  const [error, setError] = useState('')
  const checkIntervalRef = useRef(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [])

  // Create zap invoice and start listening for payment
  const createZapInvoice = useCallback(async ({ 
    lightningAddress, 
    amount, 
    auctionId, 
    auctionTitle,
    recipientPubkey 
  }) => {
    setStatus('loading')
    setError('')
    setInvoice('')

    try {
      // 1. Request zap invoice from backend
      const response = await fetch(`${API}/zap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lnAddress: lightningAddress,
          amount: amount * 1000, // Convert sats to millisats
          comment: `Pago subasta: ${auctionTitle}`,
          eventId: auctionId,
          recipientPubkey
        })
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Error al crear invoice')
      }

      const data = await response.json()
      
      if (!data.invoice) {
        throw new Error('No se recibió invoice')
      }

      setInvoice(data.invoice)
      setStatus('waiting')

      // 2. Start polling for payment
      const paymentHash = data.paymentHash || extractPaymentHash(data.invoice)
      
      if (paymentHash) {
        startPaymentCheck(paymentHash, auctionId)
      }

      return {
        invoice: data.invoice,
        paymentHash
      }

    } catch (e) {
      setError(e.message)
      setStatus('error')
      throw e
    }
  }, [])

  // Poll backend for payment confirmation
  const startPaymentCheck = useCallback((paymentHash, auctionId) => {
    // Clear any existing interval
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current)
    }

    let attempts = 0
    const maxAttempts = 60 // 5 minutes max (5s intervals)

    checkIntervalRef.current = setInterval(async () => {
      attempts++
      
      if (attempts > maxAttempts) {
        clearInterval(checkIntervalRef.current)
        setStatus('idle')
        return
      }

      try {
        // Check via backend
        const response = await fetch(`${API}/check?eventId=${auctionId}`)
        const data = await response.json()

        if (data.paid) {
          clearInterval(checkIntervalRef.current)
          setStatus('paid')
          return
        }

        // Also check relays for zap receipt
        const paid = await checkRelaysForZap(auctionId)
        if (paid) {
          clearInterval(checkIntervalRef.current)
          setStatus('paid')
        }

      } catch (e) {
        console.warn('[Zap] Check error:', e)
      }
    }, 5000) // Check every 5 seconds
  }, [])

  // Check relays for Kind 9735 zap receipt
  const checkRelaysForZap = async (auctionId) => {
    for (const relayUrl of RELAYS) {
      try {
        const found = await checkRelayForZap(relayUrl, auctionId)
        if (found) return true
      } catch (e) {
        // Continue to next relay
      }
    }
    return false
  }

  // Reset state
  const reset = useCallback(() => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current)
    }
    setStatus('idle')
    setInvoice('')
    setError('')
  }, [])

  return {
    status,
    invoice,
    error,
    createZapInvoice,
    reset,
    isPaid: status === 'paid',
    isWaiting: status === 'waiting',
    isLoading: status === 'loading'
  }
}

// Helper: Check single relay for zap receipt
function checkRelayForZap(relayUrl, auctionId) {
  return new Promise((resolve) => {
    const ws = new WebSocket(relayUrl)
    let resolved = false

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true
        ws.close()
        resolve(false)
      }
    }, 3000)

    ws.onopen = () => {
      // Request Kind 9735 (zap receipts) referencing the auction
      ws.send(JSON.stringify([
        'REQ', 'zap',
        { kinds: [9735], '#e': [auctionId], limit: 1 }
      ]))
    }

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data)
        if (data[0] === 'EVENT' && data[2]?.kind === 9735) {
          clearTimeout(timeout)
          resolved = true
          ws.close()
          resolve(true)
        } else if (data[0] === 'EOSE') {
          clearTimeout(timeout)
          resolved = true
          ws.close()
          resolve(false)
        }
      } catch (e) {}
    }

    ws.onerror = () => {
      clearTimeout(timeout)
      if (!resolved) {
        resolved = true
        resolve(false)
      }
    }
  })
}

// Helper: Extract payment hash from bolt11 invoice
function extractPaymentHash(invoice) {
  // Simple extraction - payment hash is usually in the invoice
  // For proper decoding would need a bolt11 library
  return null
}
