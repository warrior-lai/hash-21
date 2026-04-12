import { useState } from 'react'
import './Header.css'

export function Header({ nostr, onCreateClick }) {
  const [showMenu, setShowMenu] = useState(false)

  const statusColor = {
    disconnected: '#8a8580',
    connecting: '#d4a84b',
    connected: '#5a8a5a',
    error: '#8a4a4a'
  }

  const statusText = {
    disconnected: 'Desconectado',
    connecting: 'Conectando...',
    connected: `${nostr.connectedRelays.length} relays`,
    error: nostr.error || 'Error'
  }

  const shortNpub = nostr.user?.npub 
    ? `${nostr.user.npub.slice(0, 12)}...${nostr.user.npub.slice(-4)}`
    : ''

  return (
    <header className="header">
      <div className="header-left">
        <a href="/" className="back-link">← Galería</a>
        <a href="/subastas/" className="logo">
          HASH<span>21</span>
        </a>
      </div>

      <div className="header-right">
        <div className="relay-status">
          <span 
            className="relay-dot" 
            style={{ background: statusColor[nostr.status] }}
          />
          <span className="relay-text">{statusText[nostr.status]}</span>
          {nostr.status === 'error' && (
            <button className="retry-btn" onClick={nostr.reconnect}>
              Reintentar
            </button>
          )}
        </div>

        <button 
          className="create-btn"
          onClick={onCreateClick}
        >
          + Crear Subasta
        </button>

        {nostr.user ? (
          <div className="user-menu">
            <button className="user-btn" onClick={() => setShowMenu(!showMenu)}>
              🟣 {shortNpub}
            </button>
            {showMenu && (
              <div className="dropdown">
                <button onClick={nostr.logout}>Desconectar</button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="connect-btn"
            onClick={nostr.loginWithExtension}
            disabled={nostr.status !== 'connected'}
          >
            Conectar Nostr
          </button>
        )}
      </div>
    </header>
  )
}
