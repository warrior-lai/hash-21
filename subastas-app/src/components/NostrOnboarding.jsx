import './NostrOnboarding.css'

export function NostrOnboarding({ onBack, titleId }) {
  return (
    <div className="nostr-onboarding">
      <button className="login-back" onClick={onBack}>← Volver</button>

      <h2 id={titleId} className="nostr-onboarding-title">¿Qué es Nostr?</h2>
      <p className="nostr-onboarding-desc">
        Un protocolo abierto para identidad digital. Tu clave es tu identidad — sin emails, sin passwords, sin intermediarios.
      </p>

      <div className="nostr-onboarding-card">
        <h3>¿Por qué lo usamos?</h3>
        <p>
          Para que firmes tus obras y pujas con tu identidad soberana. Nadie puede censurarte ni borrarte.
        </p>
      </div>

      <div className="nostr-onboarding-card">
        <h3>¿Cómo empiezo?</h3>
        <div className="nostr-onboarding-steps">
          <div className="nostr-onboarding-step">
            <span className="nostr-onboarding-step-number">1</span>
            <div>
              <strong>Instalá una extensión</strong>
              <p>
                <a href="https://getalby.com" target="_blank" rel="noopener noreferrer">⚡ Alby</a>{' '}
                o{' '}
                <a href="https://github.com/niccokunzmann/nos2x#installing" target="_blank" rel="noopener noreferrer">🔐 nos2x</a>
              </p>
            </div>
          </div>
          <div className="nostr-onboarding-step">
            <span className="nostr-onboarding-step-number">2</span>
            <div>
              <strong>Creá tu clave</strong>
              <p>La extensión te guía paso a paso</p>
            </div>
          </div>
          <div className="nostr-onboarding-step">
            <span className="nostr-onboarding-step-number">3</span>
            <div>
              <strong>Volvé acá</strong>
              <p>Hacé click en "Conectar Nostr"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="nostr-onboarding-actions">
        <button className="nostr-onboarding-btn-primary" onClick={onBack}>
          Ya tengo Nostr
        </button>
        <a
          href="https://nostr.com"
          target="_blank"
          rel="noopener noreferrer"
          className="nostr-onboarding-link"
        >
          Aprender más →
        </a>
      </div>
    </div>
  )
}
