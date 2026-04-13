import './CTA.css'

export function CTA({ onCreateClick, isConnected }) {
  return (
    <section className="cta-section">
      <h2>¿Listo para empezar?</h2>
      <p>Creá tu primera subasta en menos de un minuto</p>
      <div className="cta-buttons">
        <button 
          className="cta-btn" 
          onClick={() => document.getElementById('subastas')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Explorar Subastas
        </button>
        <button className="cta-btn primary" onClick={onCreateClick}>
          Crear Subasta
        </button>
      </div>
    </section>
  )
}
