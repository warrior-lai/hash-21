import './CTA.css'

export function CTA({ onCreateClick, isConnected }) {
  return (
    <section className="cta-section">
      <h2>¿Listo para empezar?</h2>
      <p>Creá tu primera subasta en menos de un minuto</p>
      <div className="cta-buttons">
        <a href="#subastas" className="cta-btn">Explorar Subastas</a>
        <button className="cta-btn primary" onClick={onCreateClick}>
          Crear Subasta
        </button>
      </div>
    </section>
  )
}
