import { useLang } from '../i18n'
import './Hero.css'

export function Hero() {
  const { t } = useLang()
  
  return (
    <section className="hero">
      <span className="hero-label">NOSTR NATIVE AUCTIONS</span>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
    </section>
  )
}
