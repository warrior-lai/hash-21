import { useState, useEffect } from 'react'
import './Modal.css'

function formatTimeLeft(endTime) {
  const now = Math.floor(Date.now() / 1000)
  const diff = endTime - now

  if (diff <= 0) return 'Finalizada'

  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const mins = Math.floor((diff % 3600) / 60)
  const secs = diff % 60

  if (days > 0) return `${days}d ${hours}h ${mins}m`
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`
  return `${mins}m ${secs}s`
}

export function AuctionDetailModal({ auction, onClose, onBid, user }) {
  const [bidAmount, setBidAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(auction.endTime))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(formatTimeLeft(auction.endTime))
    }, 1000)
    return () => clearInterval(interval)
  }, [auction.endTime])

  const minBid = auction.currentBid + 1000
  const isEnded = auction.endTime <= Math.floor(Date.now() / 1000)

  const handleBid = async () => {
    setError('')
    const amount = parseInt(bidAmount)

    if (!amount || amount < minBid) {
      setError(`La puja mínima es ${minBid.toLocaleString()} sats`)
      return
    }

    setLoading(true)
    try {
      await onBid(auction.id, amount)
      setBidAmount('')
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="auction-detail">
          {auction.image && (
            <img 
              src={auction.image} 
              alt={auction.title}
              className="auction-detail-image"
            />
          )}

          <div>
            <h2 className="auction-detail-title">{auction.title}</h2>
            {auction.description && (
              <p className="auction-detail-desc">{auction.description}</p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#8a8580', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Puja actual
                </div>
                <div style={{ fontSize: '20px', fontWeight: '500', color: '#9a7b4f' }}>
                  ⚡ {auction.currentBid.toLocaleString()} sats
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#8a8580', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {isEnded ? 'Estado' : 'Finaliza en'}
                </div>
                <div style={{ fontSize: '16px' }}>
                  {timeLeft}
                </div>
              </div>
            </div>

            {!isEnded && user && (
              <>
                <div className="bid-form">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    placeholder={`Mínimo ${minBid.toLocaleString()} sats`}
                    min={minBid}
                  />
                  <button onClick={handleBid} disabled={loading}>
                    {loading ? '...' : 'Pujar'}
                  </button>
                </div>
                {error && <p className="form-error" style={{ marginTop: '12px' }}>{error}</p>}
              </>
            )}

            {!isEnded && !user && (
              <p style={{ color: '#8a8580', fontSize: '13px', textAlign: 'center' }}>
                Conectá tu Nostr para pujar
              </p>
            )}

            {isEnded && (
              <p style={{ color: '#8a8580', fontSize: '13px', textAlign: 'center', padding: '16px', background: '#f5f4f2' }}>
                Esta subasta ha finalizado
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
