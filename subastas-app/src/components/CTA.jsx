import { useLang } from '../i18n'
import './CTA.css'

export function CTA({ onCreateClick, isConnected }) {
  const { t } = useLang()
  
  return (
    <section className="cta-section">
      <h2>{t('cta.title')}</h2>
      <p>{t('cta.subtitle')}</p>
      <div className="cta-buttons">
        <button 
          className="cta-btn" 
          onClick={() => document.getElementById('subastas')?.scrollIntoView({ behavior: 'smooth' })}
        >
          {t('cta.explore')}
        </button>
        <button className="cta-btn primary" onClick={onCreateClick}>
          {t('cta.create')}
        </button>
      </div>
    </section>
  )
}
