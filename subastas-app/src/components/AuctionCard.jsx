import { useState, useEffect } from 'react'
import { useNip05Verification } from '../utils/nip05'
import { useProfile, formatPubkey } from '../utils/profile'
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
  const { profile } = useProfile(auction.pubkey)
  
  // Use profile nip05 if auction doesn't have one
  const nip05 = auction.nip05 || profile?.nip05 || ''
  const { verified } = useNip05Verification(nip05, auction.pubkey)
  
  // Display name: auction.artist > profile.displayName > profile.name > shortened pubkey
  const artistName = auction.artist || profile?.displayName || profile?.name || formatPubkey(auction.pubkey)
  const artistPicture = profile?.picture || ''

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
        
        <div className="auction-artist">
          {artistPicture && (
            <img 
              src={artistPicture} 
              alt={artistName}
              className="artist-avatar"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <span className="artist-name">
            {artistName}
            {verified && <span className="verified-badge" title="NIP-05 Verificado">✓</span>}
          </span>
        </div>

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
