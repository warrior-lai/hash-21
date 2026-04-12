import { useState } from 'react'
import { AuctionCard } from './AuctionCard'
import './AuctionList.css'

export function AuctionList({ auctions, loading, showAll, onToggleShowAll, onSelect }) {
  const [filter, setFilter] = useState('all')

  const filtered = auctions.filter(a => {
    if (filter === 'all') return true
    if (filter === 'active') return a.status === 'active'
    if (filter === 'ended') return a.status === 'ended'
    return true
  })

  return (
    <section className="auction-list">
      <div className="list-header">
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <h2>Subastas</h2>
          <button 
            onClick={onToggleShowAll}
            style={{
              background: showAll ? '#9a7b4f' : 'transparent',
              color: showAll ? 'white' : '#8a8580',
              border: '1px solid #e5e2de',
              padding: '6px 12px',
              fontSize: '11px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            {showAll ? '🌐 Red Nostr' : 'Ver toda la red'}
          </button>
        </div>
        <div className="filters">
          {['all', 'active', 'ended'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Todas' : f === 'active' ? 'Activas' : 'Finalizadas'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Conectando a relays Nostr...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🖼</span>
          <p>No hay subastas {filter !== 'all' ? (filter === 'active' ? 'activas' : 'finalizadas') : 'publicadas aún'}</p>
          <p style={{fontSize: '13px', marginTop: '8px', color: '#8a8580'}}>Sé el primero en crear una</p>
        </div>
      ) : (
        <div className="auction-grid">
          {filtered.map(auction => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              onClick={() => onSelect(auction)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
