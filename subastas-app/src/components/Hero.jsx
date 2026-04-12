import './Hero.css'

export function Hero({ onCreateClick, isConnected }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Subastas de Arte</h1>
        <p className="hero-subtitle">
          Descentralizadas sobre Nostr. Pujá con Bitcoin Lightning. Sin intermediarios.
        </p>
        <div className="hero-actions">
          <a href="#subastas" className="hero-btn">Explorar Subastas</a>
          {isConnected && (
            <button className="hero-btn primary" onClick={onCreateClick}>
              + Crear Subasta
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
