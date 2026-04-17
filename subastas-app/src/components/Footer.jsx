import { useState } from 'react'
import { useLang } from '../i18n'
import './Footer.css'

const SECTIONS = {
  nostr: 'nostr',
  setup: 'setup',
  none: null
}

export function Footer() {
  const { t } = useLang()
  const [expanded, setExpanded] = useState(SECTIONS.none)

  const toggle = (section) => {
    setExpanded(prev => prev === section ? SECTIONS.none : section)
  }

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-content">
        
        <div className="footer-faq">
          {/* Nostr section */}
          <button 
            className={`footer-faq-trigger ${expanded === SECTIONS.nostr ? 'active' : ''}`}
            onClick={() => toggle(SECTIONS.nostr)}
            aria-expanded={expanded === SECTIONS.nostr}
          >
            <span>🔑 ¿Qué es Nostr?</span>
            <span className="footer-faq-arrow">{expanded === SECTIONS.nostr ? '−' : '+'}</span>
          </button>

          {expanded === SECTIONS.nostr && (
            <div className="footer-faq-content">
              <p>
                <strong>Nostr</strong> es un protocolo abierto para identidad digital descentralizada. 
                No es una app, no es una empresa — es un estándar libre.
              </p>
              <p>
                Tu <strong>clave Nostr</strong> es tu identidad: firmás tus obras, tus pujas y tus 
                transacciones con ella. No necesitás email, no necesitás password, no necesitás 
                permiso de nadie.
              </p>
              <p>
                Funciona con <strong>relays</strong> (servidores que transmiten mensajes). Si un relay 
                te censura, te conectás a otro. Tu identidad es tuya, no de la plataforma.
              </p>
              <div className="footer-faq-links">
                <a href="https://nostr.com" target="_blank" rel="noopener noreferrer">
                  Aprender más sobre Nostr →
                </a>
                <a href="https://www.youtube.com/results?search_query=what+is+nostr+protocol" target="_blank" rel="noopener noreferrer">
                  Videos explicativos →
                </a>
              </div>
            </div>
          )}

          {/* Setup section */}
          <button 
            className={`footer-faq-trigger ${expanded === SECTIONS.setup ? 'active' : ''}`}
            onClick={() => toggle(SECTIONS.setup)}
            aria-expanded={expanded === SECTIONS.setup}
          >
            <span>🎨 Soy artista, ¿qué necesito para crear una subasta?</span>
            <span className="footer-faq-arrow">{expanded === SECTIONS.setup ? '−' : '+'}</span>
          </button>

          {expanded === SECTIONS.setup && (
            <div className="footer-faq-content">
              <div className="footer-steps">
                <div className="footer-step">
                  <span className="footer-step-num">1</span>
                  <div>
                    <strong>Instalá una extensión Nostr en tu browser</strong>
                    <p>
                      Es como una wallet de identidad. Recomendamos:
                    </p>
                    <div className="footer-extension-links">
                      <a href="https://getalby.com" target="_blank" rel="noopener noreferrer">
                        ⚡ <strong>Alby</strong> — wallet + signing (la más completa)
                      </a>
                      <a href="https://chromewebstore.google.com/detail/nos2x/kpgefcfmnafjgpblomihpgcdlhiodkdc" target="_blank" rel="noopener noreferrer">
                        🔐 <strong>nos2x</strong> — solo signing (más liviana)
                      </a>
                    </div>
                  </div>
                </div>

                <div className="footer-step">
                  <span className="footer-step-num">2</span>
                  <div>
                    <strong>Creá tu clave Nostr</strong>
                    <p>
                      La extensión te guía. Vas a obtener una <strong>clave pública</strong> (npub) 
                      que es tu identidad visible, y una <strong>clave privada</strong> (nsec) que 
                      nunca debés compartir.
                    </p>
                  </div>
                </div>

                <div className="footer-step">
                  <span className="footer-step-num">3</span>
                  <div>
                    <strong>Conectate en Hash21</strong>
                    <p>
                      Hacé click en <strong>"Conectar Nostr"</strong> arriba. La extensión te pide 
                      permiso y listo — ya podés crear subastas, pujar y subir obras.
                    </p>
                  </div>
                </div>

                <div className="footer-step">
                  <span className="footer-step-num">4</span>
                  <div>
                    <strong>Opcional: configurá tu Lightning Address</strong>
                    <p>
                      Para recibir pagos directo a tu wallet. Podés usar{' '}
                      <a href="https://getalby.com" target="_blank" rel="noopener noreferrer">Alby</a>,{' '}
                      <a href="https://www.walletofsatoshi.com" target="_blank" rel="noopener noreferrer">Wallet of Satoshi</a> u otra 
                      wallet Lightning.
                    </p>
                  </div>
                </div>
              </div>

              <div className="footer-tip">
                💡 <strong>Tip:</strong> Si tenés NIP-05 verificado (usuario@dominio.com), 
                tu perfil muestra un badge ✓ dorado en tus subastas.
              </div>
            </div>
          )}
        </div>

        <div className="footer-bottom">
          <div className="footer-brand">
            <a href="https://hash21.studio">HASH<span>21</span></a>
            <span className="footer-separator">·</span>
            <span>Built on Bitcoin & Nostr</span>
          </div>
          <div className="footer-links">
            <a href="https://hash21.studio/faq">FAQ</a>
            <a href="https://hash21.studio/terms">Términos</a>
            <a href="https://hash21.studio/privacy">Privacidad</a>
            <a href="https://github.com/warrior-lai/hash-21" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
