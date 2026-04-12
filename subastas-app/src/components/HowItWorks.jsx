import './HowItWorks.css'

export function HowItWorks() {
  const steps = [
    {
      icon: '🔑',
      title: 'Conectá tu Nostr',
      desc: 'Usá tu extensión (Alby, nos2x) para firmar con tu identidad'
    },
    {
      icon: '🖼',
      title: 'Creá o Pujá',
      desc: 'Publicá tu obra o pujá en subastas activas'
    },
    {
      icon: '⚡',
      title: 'Pagá con Lightning',
      desc: 'El pago va directo al artista. Sin custodia, sin comisiones'
    }
  ]

  return (
    <section className="how-it-works">
      <h2>Cómo Funciona</h2>
      <div className="steps">
        {steps.map((step, i) => (
          <div key={i} className="step">
            <span className="step-icon">{step.icon}</span>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
      <div className="tech-note">
        <strong>100% Descentralizado:</strong> Las subastas viven en la red Nostr (Kind 30020). 
        Los pagos son P2P via Lightning. Hash21 no custodia fondos.
      </div>
    </section>
  )
}
