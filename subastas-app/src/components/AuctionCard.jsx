import { useState, useEffect } from 'react'
import { useNip05Verification } from '../utils/nip05'
import './AuctionCard.css'

function formatTimeLeft(endTime) {
  const now = Math.floor(Date.now() / 1000)
  const diff = endTime - now

  if (diff <= 0) return 'Finalizada'

  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const mins = Math.floor((diff % 3600) / 60)

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

export function AuctionCard({ auction, onClick }) {
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(auction.endTime))
  const [imgError, setImgError] = useState(false)
  const { verified } = useNip05Verification(auction.nip05, auction.pubkey)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(formatTimeLeft(auction.endTime))
    }, 1000)
    return () => clearInterval(interval)
  }, [auction.endTime])

  const isEnding = auction.endTime - Math.floor(Date.now() / 1000) < 3600
  const isEnded = auction.status === 'ended'

  return (
    <div className="auction-card" onClick={onClick}>
      <div className="auction-image">
        {!imgError && auction.image ? (
          <img 
            src={auction.image} 
            alt={auction.title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="image-placeholder">
            <span>🖼</span>
          </div>
        )}
      </div>

      <div className="auction-body">
        <span className={`auction-status ${isEnded ? 'ended' : isEnding ? 'ending' : 'active'}`}>
          {isEnded ? 'Finalizada' : isEnding ? 'Terminando' : 'Activa'}
        </span>

        <h3 className="auction-title">{auction.title}</h3>
        
        {auction.artist && (
          <p className="auction-artist">
            {auction.artist}
            {verified && <span className="verified-badge" title="NIP-05 Verificado">✓</span>}
          </p>
        )}

        <div className="auction-meta">
          <div className="meta-item">
            <span className="meta-label">Puja actual</span>
            <span className="meta-value gold">⚡ {auction.currentBid.toLocaleString()}</span>
          </div>
          <div className="meta-item right">
            <span className="meta-label">Finaliza</span>
            <span className="meta-value">{timeLeft}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
