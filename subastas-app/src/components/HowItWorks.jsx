import './HowItWorks.css'

export function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'CONECTÁ NOSTR',
      desc: 'Tu clave pública es tu identidad. Sin emails, sin contraseñas.'
    },
    {
      num: '2',
      title: 'EXPLORÁ SUBASTAS',
      desc: 'Obras de artistas verificados. Cada subasta es un evento Nostr.'
    },
    {
      num: '3',
      title: 'PUJÁ Y FIRMÁ',
      desc: 'Tu puja queda registrada en los relays, firmada con tu clave.'
    },
    {
      num: '4',
      title: 'PAGÁ DIRECTO',
      desc: 'Lightning invoice directo al artista. Cero intermediarios.'
    }
  ]

  return (
    <section className="how-it-works">
      <h2>Cómo Funciona</h2>
      <p className="how-subtitle">Protocolo abierto, pagos directos, verificación criptográfica</p>
      
      <div className="steps">
        {steps.map((step, i) => (
          <div key={i} className="step-card">
            <span className="step-num">{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="tech-footer">
        <div className="tech-item">
          <span className="tech-label">EVENTOS</span>
          <span className="tech-value">Kind 30020, 1021, 1022</span>
        </div>
        <div className="tech-item">
          <span className="tech-label">PAGOS</span>
          <span className="tech-value">Lightning (NIP-57)</span>
        </div>
        <div className="tech-item">
          <span className="tech-label">CUSTODIA</span>
          <span className="tech-value">Ninguna</span>
        </div>
      </div>
    </section>
  )
}
