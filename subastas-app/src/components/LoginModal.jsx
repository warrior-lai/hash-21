import { useState } from 'react'
import { NostrOnboarding } from './NostrOnboarding'
import './Modal.css'

const LOGIN_METHODS = {
  CHOOSE: 'choose',
  EXTENSION: 'extension',
  BUNKER: 'bunker',
  NPUB: 'npub'
}

export function LoginModal({ onClose, onLoginExtension, onLoginBunker, onLoginNpub, nostrStatus }) {
  const [method, setMethod] = useState(LOGIN_METHODS.CHOOSE)
  const [bunkerUri, setBunkerUri] = useState('')
  const [npubInput, setNpubInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleExtension = async () => {
    setLoading(true)
    setError('')
    try {
      await onLoginExtension()
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBunker = async () => {
    if (!bunkerUri.trim()) {
      setError('Pegá tu bunker URI')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onLoginBunker(bunkerUri.trim())
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNpub = async () => {
    if (!npubInput.trim()) {
      setError('Pegá tu npub')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onLoginNpub(npubInput.trim())
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Method selection screen
  if (method === LOGIN_METHODS.CHOOSE) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal login-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
          <button className="modal-close" onClick={onClose}>×</button>

          <div className="login-header">
            <h2 id="login-modal-title">Conectar Nostr</h2>
            <p className="modal-subtitle">Elegí cómo querés firmar</p>
          </div>

          <div className="login-methods">
            {/* Extension (NIP-07) */}
            <button
              className="login-method-btn"
              onClick={() => {
                if (typeof window.nostr !== 'undefined') {
                  handleExtension()
                } else {
                  setMethod(LOGIN_METHODS.EXTENSION)
                }
              }}
              disabled={nostrStatus !== 'connected'}
            >
              <span className="login-method-icon">🔑</span>
              <div className="login-method-info">
                <strong>Extensión del browser</strong>
                <span>Alby, nos2x u otra extensión NIP-07</span>
              </div>
              <span className="login-method-arrow">→</span>
            </button>

            {/* Bunker (NIP-46) */}
            <button
              className="login-method-btn"
              onClick={() => setMethod(LOGIN_METHODS.BUNKER)}
              disabled={nostrStatus !== 'connected'}
            >
              <span className="login-method-icon">📱</span>
              <div className="login-method-info">
                <strong>Bunker remoto</strong>
                <span>Amber, nsecBunker — firmá desde tu celu</span>
              </div>
              <span className="login-method-arrow">→</span>
            </button>

            {/* Read-only npub */}
            <button
              className="login-method-btn"
              onClick={() => setMethod(LOGIN_METHODS.NPUB)}
            >
              <span className="login-method-icon">👁️</span>
              <div className="login-method-info">
                <strong>Solo lectura (npub)</strong>
                <span>Ver subastas sin poder firmar</span>
              </div>
              <span className="login-method-arrow">→</span>
            </button>
          </div>

          {nostrStatus !== 'connected' && (
            <p className="login-relay-warning">⏳ Conectando a relays...</p>
          )}
        </div>
      </div>
    )
  }

  // Extension not found — show NostrOnboarding
  if (method === LOGIN_METHODS.EXTENSION) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal login-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="login-onboarding-title">
          <button className="modal-close" onClick={onClose}>×</button>
          <NostrOnboarding
            onBack={() => { setMethod(LOGIN_METHODS.CHOOSE); setError('') }}
            titleId="login-onboarding-title"
          />
        </div>
      </div>
    )
  }

  // Bunker login
  if (method === LOGIN_METHODS.BUNKER) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal login-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="login-bunker-title">
          <button className="modal-close" onClick={onClose}>×</button>

          <div className="login-header">
            <button className="login-back" onClick={() => { setMethod(LOGIN_METHODS.CHOOSE); setError('') }}>← Volver</button>
            <h2 id="login-bunker-title">Bunker Remoto</h2>
            <p className="modal-subtitle">Tu clave nunca toca el browser</p>
          </div>

          <div className="login-bunker-form">
            <label>Bunker URI</label>
            <input
              type="text"
              value={bunkerUri}
              onChange={e => { setBunkerUri(e.target.value); setError('') }}
              placeholder="nostr+bunker://pubkey?relay=wss://..."
              autoFocus
            />
            <span className="field-hint">
              Lo encontrás en Amber → Configuración → Nostr Connect, o en nsecBunker.
            </span>

            {error && <p className="form-error">{error}</p>}

            <button
              className="submit-btn"
              onClick={handleBunker}
              disabled={loading || !bunkerUri.trim()}
            >
              {loading ? 'Conectando... (aprobá en tu dispositivo)' : 'Conectar Bunker'}
            </button>

            <div className="login-bunker-info">
              <p><strong>¿Cómo funciona?</strong></p>
              <ol>
                <li>Pegás tu bunker URI acá</li>
                <li>Tu app (Amber/nsecBunker) recibe un pedido de conexión</li>
                <li>Aprobás en tu dispositivo</li>
                <li>Cada firma requiere tu aprobación — nunca es automática</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // npub read-only
  if (method === LOGIN_METHODS.NPUB) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal login-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="login-npub-title">
          <button className="modal-close" onClick={onClose}>×</button>

          <div className="login-header">
            <button className="login-back" onClick={() => { setMethod(LOGIN_METHODS.CHOOSE); setError('') }}>← Volver</button>
            <h2 id="login-npub-title">Solo lectura</h2>
            <p className="modal-subtitle">Podés ver pero no firmar</p>
          </div>

          <div className="login-npub-form">
            <label>Tu npub</label>
            <input
              type="text"
              value={npubInput}
              onChange={e => { setNpubInput(e.target.value); setError('') }}
              placeholder="npub1..."
              autoFocus
            />

            {error && <p className="form-error">{error}</p>}

            <button
              className="submit-btn"
              onClick={handleNpub}
              disabled={loading || !npubInput.trim()}
            >
              {loading ? 'Conectando...' : 'Entrar'}
            </button>

            <p className="login-hint">
              ⚠️ No vas a poder crear subastas ni pujar. Para eso necesitás extensión o bunker.
            </p>
          </div>
        </div>
      </div>
    )
  }
}
