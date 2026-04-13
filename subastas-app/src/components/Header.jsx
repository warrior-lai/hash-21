import { useState } from 'react'
import { useLang } from '../i18n'
import './Header.css'

export function Header({ nostr, onCreateClick }) {
  const [showMenu, setShowMenu] = useState(false)
  const { lang, toggleLang, t } = useLang()

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
              🟢 {shortNpub}
            </button>
            {showMenu && (
              <div className="dropdown">
                <button onClick={nostr.logout}>SALIR</button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="connect-btn"
            onClick={nostr.loginWithExtension}
            disabled={nostr.status !== 'connected'}
          >
            {t('header.connect')}
          </button>
        )}
      </div>
    </header>
  )
}
