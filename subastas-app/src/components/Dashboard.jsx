import { useState, useEffect } from 'react'
import { useProfile, formatPubkey } from '../utils/profile'
import { useLang } from '../i18n'
import './Dashboard.css'

export function Dashboard({ user, auctions, onClose, onCreateClick, onAuctionClick }) {
  const { t } = useLang()
  const { profile } = useProfile(user?.pubkey)
  const [activeTab, setActiveTab] = useState('auctions')

  // Filter user's auctions and bids
  const myAuctions = auctions.filter(a => a.pubkey === user?.pubkey)
  const myBids = auctions.filter(a => 
    a.bids?.some(b => b.pubkey === user?.pubkey) || 
    // Also check if user placed a bid (from auction detail)
    a.pubkey !== user?.pubkey
  ).filter(a => a.pubkey !== user?.pubkey) // Exclude own auctions

  const activeAuctions = myAuctions.filter(a => a.status === 'active')
  const endedAuctions = myAuctions.filter(a => a.status === 'ended')

  const userName = profile?.displayName || profile?.name || formatPubkey(user?.pubkey)
  const userPicture = profile?.picture || ''

  return (
    <div className="dashboard-overlay" onClick={onClose}>
      <div className="dashboard" onClick={e => e.stopPropagation()}>
        <button className="dashboard-close" onClick={onClose}>×</button>

        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-user">
            {userPicture ? (
              <img src={userPicture} alt="" className="user-avatar-lg" />
            ) : (
              <div className="user-avatar-lg placeholder">
                {userName[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div>
              <h2>{userName}</h2>
              <span className="user-pubkey">{formatPubkey(user?.pubkey)}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🎨</span>
            <div className="stat-content">
              <span className="stat-label">Mis Subastas</span>
              <span className="stat-value">{myAuctions.length}</span>
              <span className="stat-sub">{activeAuctions.length} activas</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⚡</span>
            <div className="stat-content">
              <span className="stat-label">Mis Pujas</span>
              <span className="stat-value">{myBids.length}</span>
              <span className="stat-sub">participando</span>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✓</span>
            <div className="stat-content">
              <span className="stat-label">Completadas</span>
              <span className="stat-value">{endedAuctions.length}</span>
              <span className="stat-sub">finalizadas</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'auctions' ? 'active' : ''}`}
            onClick={() => setActiveTab('auctions')}
          >
            🎨 Mis Subastas <span className="tab-count">{myAuctions.length}</span>
          </button>
          <button
            className={`tab ${activeTab === 'bids' ? 'active' : ''}`}
            onClick={() => setActiveTab('bids')}
          >
            ⚡ Mis Pujas <span className="tab-count">{myBids.length}</span>
          </button>
        </div>

        {/* Content */}
        <div className="dashboard-content">
          {activeTab === 'auctions' && (
            <>
              <div className="content-header">
                <h3>Mis Subastas</h3>
                <button className="create-btn-sm" onClick={onCreateClick}>
                  + Crear Subasta
                </button>
              </div>

              {activeAuctions.length > 0 && (
                <div className="auction-section">
                  <h4>Activas <span className="section-count">{activeAuctions.length}</span></h4>
                  <div className="auction-grid">
                    {activeAuctions.map(auction => (
                      <AuctionMiniCard 
                        key={auction.id} 
                        auction={auction} 
                        onClick={() => onAuctionClick(auction)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {endedAuctions.length > 0 && (
                <div className="auction-section">
                  <h4>Finalizadas <span className="section-count">{endedAuctions.length}</span></h4>
                  <div className="auction-grid">
                    {endedAuctions.map(auction => (
                      <AuctionMiniCard 
                        key={auction.id} 
                        auction={auction}
                        onClick={() => onAuctionClick(auction)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {myAuctions.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">🎨</span>
                  <p>Aún no creaste ninguna subasta</p>
                  <button className="create-btn-sm" onClick={onCreateClick}>
                    Crear mi primera subasta
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'bids' && (
            <>
              <div className="content-header">
                <h3>Mis Pujas</h3>
              </div>

              {myBids.length > 0 ? (
                <div className="auction-grid">
                  {myBids.map(auction => (
                    <AuctionMiniCard 
                      key={auction.id} 
                      auction={auction}
                      onClick={() => onAuctionClick(auction)}
                      showBidStatus
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">⚡</span>
                  <p>Aún no participaste en ninguna subasta</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function AuctionMiniCard({ auction, onClick, showBidStatus }) {
  const isEnded = auction.status === 'ended'
  const timeLeft = formatTimeLeft(auction.endTime)

  return (
    <div className="auction-mini-card" onClick={onClick}>
      <div className="mini-card-image">
        {auction.image ? (
          <img src={auction.image} alt={auction.title} />
        ) : (
          <div className="mini-placeholder">🖼</div>
        )}
        <span className={`mini-status ${isEnded ? 'ended' : 'active'}`}>
          {isEnded ? 'Finalizada' : 'Activa'}
        </span>
      </div>
      <div className="mini-card-body">
        <h5>{auction.title}</h5>
        <div className="mini-meta">
          <span className="mini-bid">⚡ {auction.currentBid.toLocaleString()}</span>
          {!isEnded && <span className="mini-time">{timeLeft}</span>}
        </div>
      </div>
    </div>
  )
}

function formatTimeLeft(endTime) {
  const now = Math.floor(Date.now() / 1000)
  const diff = endTime - now
  if (diff <= 0) return 'Finalizada'
  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  if (days > 0) return `${days}d ${hours}h`
  const mins = Math.floor((diff % 3600) / 60)
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}
