import { useState } from 'react'
import { useLang } from '../i18n'
import { useProfile } from '../utils/profile'
import { LoginModal } from './LoginModal'
import './LoginModal.css'
import './Header.css'

export function Header({ nostr, onCreateClick, onDashboardClick }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const { lang, toggleLang, t } = useLang()
  const { profile } = useProfile(nostr.user?.pubkey)
  
  const userName = profile?.displayName || profile?.name || null
  const userPicture = profile?.picture || null

  const statusText = nostr.status === 'connecting' 
    ? t('header.connecting')
    : nostr.status === 'connected' 
      ? `${nostr.connectedRelays.length} ${t('header.relays')}`
      : nostr.status === 'error' 
        ? 'Error' 
        : ''

  const shortNpub = nostr.user?.npub 
    ? `${nostr.user.npub.slice(0, 8)}...`
    : ''

  return (
    <header className="header">
      <div className="header-left">
        <a href="https://hash21.studio" className="back-link">{t('header.gallery')}</a>
        <a href="https://hash21.studio" className="logo">
          HASH<span>21</span>
        </a>
      </div>

      <div className="header-right">
        <button className="lang-btn" onClick={toggleLang}>
          {lang === 'es' ? 'EN' : 'ES'}
        </button>
        
        <div className="relay-status">
          <span className="relay-dot" data-status={nostr.status} />
          <span>{statusText}</span>
        </div>

        <button className="create-btn" onClick={onCreateClick}>
          {t('header.create')}
        </button>

        {nostr.user ? (
          <div className="user-menu">
            <button className="user-btn" onClick={() => setShowMenu(!showMenu)}>
              {userPicture ? (
                <img src={userPicture} alt="" className="user-avatar" />
              ) : (
                <span className="user-avatar-placeholder">
                  {userName?.[0]?.toUpperCase() || '👤'}
                </span>
              )}
              <span className="user-name">{userName || shortNpub}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            {showMenu && (
              <div className="dropdown">
                <button onClick={() => { setShowMenu(false); onDashboardClick?.(); }}>
                  🎨 Mis Subastas
                </button>
                <button onClick={nostr.logout}>SALIR</button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="connect-btn"
            onClick={() => setShowLogin(true)}
          >
            {t('header.connect')}
          </button>
        )}

        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onLoginExtension={nostr.loginWithExtension}
            onLoginBunker={nostr.loginWithBunker}
            onLoginNpub={nostr.loginWithNpub}
            nostrStatus={nostr.status}
          />
        )}
      </div>
    </header>
  )
}
