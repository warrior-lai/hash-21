import { useLang } from '../i18n'
import './HowItWorks.css'

export function HowItWorks() {
  const { t } = useLang()
  
  const steps = [
    {
      num: '1',
      title: t('how.step1.title'),
      desc: t('how.step1.desc')
    },
    {
      num: '2',
      title: t('how.step2.title'),
      desc: t('how.step2.desc')
    },
    {
      num: '3',
      title: t('how.step3.title'),
      desc: t('how.step3.desc')
    },
    {
      num: '4',
      title: t('how.step4.title'),
      desc: t('how.step4.desc')
    }
  ]

  return (
    <section className="how-it-works">
      <h2>{t('how.title')}</h2>
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
          <span className="tech-label">PROTOCOLO</span>
          <span className="tech-value">Nostr — 8 NIPs</span>
        </div>
        <div className="tech-item">
          <span className="tech-label">EVENTOS</span>
          <span className="tech-value">Kind 30020, 1021, 1, 0</span>
        </div>
        <div className="tech-item">
          <span className="tech-label">IDENTIDAD</span>
          <span className="tech-value">NIP-07 / NIP-46 / NIP-05</span>
        </div>
        <div className="tech-item">
          <span className="tech-label">PAGOS</span>
          <span className="tech-value">Lightning (NIP-57)</span>
        </div>
        <div className="tech-item">
          <span className="tech-label">SEGURIDAD</span>
          <span className="tech-value">NIP-98 / NIP-44 / AES-GCM</span>
        </div>
        <div className="tech-item">
          <span className="tech-label">CUSTODIA</span>
          <span className="tech-value">Cero — P2P directo</span>
        </div>
      </div>
    </section>
  )
}
