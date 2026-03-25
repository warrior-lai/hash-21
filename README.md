# Hash21

<p align="center">
  <img src="https://hash21.studio/img/obra1.jpg" alt="Hash21" width="400">
</p>

<p align="center">
  <strong>Permanencia para la obra. Soberanía para el artista.</strong>
</p>

<p align="center">
  <a href="https://hash21.studio">🌐 Live Demo</a> •
  <a href="https://hash21.studio/verify">🔍 Verificar Obra</a> •
  <a href="https://hash21.studio/shop">🛒 Tienda</a> •
  <a href="https://github.com/warrior-lai/hash-21/tree/main/docs">📚 Docs</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.3.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/Bitcoin-Lightning-orange" alt="Lightning">
  <img src="https://img.shields.io/badge/Nostr-NIP--57-purple" alt="Nostr">
  <img src="https://img.shields.io/badge/tests-59-brightgreen" alt="Tests">
  <img src="https://img.shields.io/badge/coverage-70%25-yellowgreen" alt="Coverage">
</p>

---

## 🎯 ¿Qué es Hash21?

Hash21 es una plataforma de arte inspirado en Bitcoin.

Una galería viva donde los artistas publican, certifican y venden sus obras y objetos de diseño directamente.

- 📜 **Certificación on-chain** para garantizar existencia y permanencia
- ⚡ **Pagos Lightning-native** para una economía sin fricción

Sin intermediarios. Sin permisos. Sin censura.

**El artista se convierte en soberano. Bitcoin asegura la permanencia.**

---

## ✅ Features en Producción

| Feature | Descripción |
|---------|-------------|
| ⚡ **Zap System (NIP-57)** | Propinas Lightning con firma Nostr server-side |
| 🌩️ **WebLN (Alby)** | 1-click payment desde extensión |
| 💳 **LNURL-pay** | Invoice directo desde wallet del artista |
| 🛒 **Shop Lightning** | Productos con checkout QR, precios en sats |
| 📜 **Certificación On-Chain** | OpenTimestamps → hash anclado en Bitcoin |
| 🔍 **Verificación Pública** | Cualquiera puede verificar existencia |
| 👥 **Hub de Artistas** | Perfiles con bio, links, Lightning Address |
| 🎨 **Galería Dinámica** | Obras desde Supabase con lightbox |
| 🔐 **Admin Panel** | CRUD completo + gestión de usuarios + roles |
| 👤 **Sistema de Usuarios** | Roles (admin/artista), autogestión |
| 🌍 **Bilingüe** | Español / English |
| 📱 **Responsive** | Mobile + desktop |

---

## 🔗 Links

| Recurso | URL |
|---------|-----|
| **Producción** | https://hash21.studio |
| **API Backend** | https://hash21-backend.vercel.app |
| **Verificación** | https://hash21.studio/verify |
| **Tienda** | https://hash21.studio/shop |
| **Admin** | https://hash21.studio/admin |

### Repositorios

| Repo | Stack | Deploy |
|------|-------|--------|
| [hash-21](https://github.com/warrior-lai/hash-21) | HTML/CSS/JS | GitHub Pages |
| [Hash21-Backend](https://github.com/warrior-lai/Hash21-Backend) | Node.js + Vercel | Vercel Serverless |

---

## 🚀 Quick Start

### Prerequisitos

- Node.js 18+
- npm

### Instalación

```bash
# Clonar
git clone https://github.com/warrior-lai/hash-21.git
cd hash-21

# Instalar dependencias
npm install

# Correr tests
npm test

# Levantar dev server
npm run dev
```

### Variables de entorno

Copiá `.env.example` a `.env` y completá:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
HASH21_NOSTR_NSEC=nsec1...
```

---

## 🧪 Testing

```bash
npm test              # Correr todos los tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Estructura de Tests

```
/tests
  /api              # Tests de endpoints
    artists.test.js
    works.test.js
    products.test.js
    verify.test.js
    integration.test.js
  /helpers          # Tests de utilidades
    hash.test.js
    validation.test.js
```

### Cobertura

| Área | Cobertura |
|------|-----------|
| API endpoints | ✅ |
| Hash generation | ✅ |
| Input validation | ✅ |
| XSS sanitization | ✅ |
| Integration | ✅ |

---

## 🏗️ Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────┐
│    Frontend     │────▶│  Vercel API     │────▶│   Supabase   │
│  GitHub Pages   │     │  (Serverless)   │     │  (Postgres)  │
└─────────────────┘     └─────────────────┘     └──────────────┘
                                │
                        ┌───────┴───────┐
                        ▼               ▼
                ┌───────────┐   ┌─────────────┐
                │   Nostr   │   │OpenTimestamps│
                │  Relays   │   │  (Bitcoin)   │
                └───────────┘   └─────────────┘
```

Ver documentación completa en [`/docs`](docs/):
- [architecture.md](docs/architecture.md) — Arquitectura detallada
- [api.md](docs/api.md) — Referencia de API
- [security.md](docs/security.md) — Seguridad y manejo de secrets
- [deployment.md](docs/deployment.md) — Guía de deploy

---

## 🛠️ Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript ES6+ (vanilla) |
| Backend | Vercel Serverless (Node.js) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Pagos | NIP-57, LNURL-pay, Lightning Address |
| Certificación | OpenTimestamps (SHA-256 → Bitcoin) |
| Testing | Vitest + coverage |
| Hosting | GitHub Pages + Vercel |

---

## 📜 Certificación On-Chain

Hash21 certifica obras usando **OpenTimestamps**, el estándar abierto para timestamps en Bitcoin.

### ¿Qué certifica?

- ✅ Prueba de que un archivo existía en un momento determinado
- ✅ Inmutable: una vez anclado en Bitcoin, no se puede alterar
- ✅ Verificable por cualquiera sin confiar en Hash21

### Verificación

```bash
# Via web
https://hash21.studio/verify?hash=de7c5e1b...

# Via API
curl https://hash21-backend.vercel.app/api/verify?hash=de7c5e1b...
```

---

## ⚡ Zap System (NIP-57)

Propinas Lightning directas al artista con detección automática de pago.

```
Usuario elige monto → Backend firma zap request (kind 9734)
         ↓
Backend pide invoice via Lightning Address del artista
         ↓
Usuario paga → WoS publica zap receipt (kind 9735)
         ↓
Frontend detecta receipt → ¡Gracias! ⚡
```

**Sats van directo a la wallet del artista — cero intermediarios.**

---

## 🔜 Roadmap

### Alineado con [Hackathons La Crypta 2026](https://hackaton.lacrypta.ar/hackathons.html)

#### ✅ #1 FOUNDATIONS — Lightning Payments (Marzo 2026)
**Estado: LIVE**

Sistema completo de pagos Lightning implementado:
- ⚡ **Zaps NIP-57** — Propinas con firma Nostr server-side
- 🌩️ **WebLN (Alby)** — Pago 1-click desde extensión del navegador
- 💳 **LNURL-pay** — Invoice directo a wallet del artista
- 🛒 **Shop** — 8 productos con checkout QR y precios en sats
- 📜 **Certificación On-Chain** — OpenTimestamps anclado en Bitcoin
- 🔍 **Verificación Pública** — Cualquiera verifica sin confiar en Hash21

---

#### 🔜 #2 IDENTITY — Nostr Identity (Abril 2026)
**Estado: Pendiente**

Identidad soberana para artistas:
- 👤 **Login con Nostr (NIP-07)** — Sin email, sin password, tu clave es tu identidad
- ✅ **NIP-05 verificado** — `artista@hash21.studio` como verificación
- 🔐 **Firma de obras** — Cada obra firmada con la clave del artista
- 🎭 **Perfil descentralizado** — Bio y links desde Nostr, no desde nuestra DB

---

#### 🔜 #3 ZAPS — Lightning + Nostr (Mayo 2026)
**Estado: Pendiente**

Zaps visibles y sociales:
- 💜 **Zap receipts en galería** — Ver quién zappeó cada obra
- 🏆 **Rankings de zaps** — Top obras más zappeadas
- 📊 **Stats públicos** — Total sats recibidos por artista
- 🔔 **Notificaciones Nostr** — Artista recibe DM cuando lo zappean

---

#### 🔜 #4 COMMERCE — Lightning Stores (Junio 2026)
**Estado: Parcial**

E-commerce completo:
- 🛒 **Checkout mejorado** — Carrito, múltiples items
- 📦 **Gestión de stock** — Inventario en tiempo real
- 🚚 **Envíos** — Integración con correo, tracking
- 🧾 **Órdenes** — Historial, estados, confirmaciones
- 💱 **Precios dinámicos** — Conversión BTC/USD en tiempo real

---

#### 🔜 #5 MEDIA — Decentralized Storage (Julio 2026)
**Estado: Pendiente**

Almacenamiento soberano:
- 📸 **Upload a Blossom** — Imágenes en servidores distribuidos
- 🌐 **IPFS para obras** — Hash permanente, sin servidor central
- 🔗 **Links inmutables** — La imagen nunca desaparece
- 📁 **Backup automático** — Redundancia en múltiples nodos

---

#### 🔜 #6 AI AGENTS — Bots & Automation (Agosto 2026)
**Estado: Pendiente**

Automatización inteligente:
- 🤖 **Bot Telegram** — Notificaciones de ventas y zaps
- 📱 **Bot Discord** — Updates para comunidad del artista
- 🔔 **Alertas automáticas** — Nuevo zap, nueva venta, nuevo seguidor
- 📈 **Reportes semanales** — Stats enviados automáticamente

---

#### 🔜 #7 INFRASTRUCTURE — Nodes & Routing (Septiembre 2026)
**Estado: Pendiente**

Infraestructura propia:
- 🏗️ **BTCPay Server** — Servidor de pagos propio
- ⚡ **LNbits** — Wallet y extensiones Lightning
- 🔌 **Nodo propio** — Sin dependencia de terceros
- 🛡️ **Self-hosted** — Control total de la infraestructura

---

#### 🔜 #8 INTEGRATION — Full-Stack (Octubre 2026)
**Estado: En desarrollo**

Plataforma completa multi-artista:
- 🌐 **Onboarding artistas** — Registro, verificación, perfil
- 🎨 **Dashboard artista** — Gestión de obras, ventas, stats
- 👥 **Colaboraciones** — Obras con múltiples artistas
- 🏛️ **Galerías/Curadores** — Roles adicionales
- 📱 **App móvil** — PWA instalable

---

### Otros Features Planeados

| Feature | Descripción | Prioridad | Estado |
|---------|-------------|-----------|--------|
| **Autenticidad real** | Firma Nostr + identidad verificada + OP_RETURN en Bitcoin | 🔴 Alta | Roadmap |
| **Autogestión artistas** | Registro público, login, editar perfil y obras | 🔴 Alta | En desarrollo |
| **Upload imágenes** | Subir imágenes desde admin sin URL externa | 🔴 Alta | Endpoint listo |
| **Dashboard analytics** | Métricas por artista: views, zaps, ventas | 🟡 Media | Pendiente |
| **Notificaciones** | Email y/o Telegram para eventos importantes | 🟡 Media | Pendiente |
| **PWA** | App instalable en móvil desde el navegador | 🟢 Baja | Pendiente |
| **Dark/Light mode** | Toggle de tema en la UI | 🟢 Baja | Pendiente |
| **Múltiples idiomas** | Más allá de ES/EN (PT, DE, etc) | 🟢 Baja | Pendiente |

---

## 📄 Documentación

| Documento | Descripción |
|-----------|-------------|
| [CHANGELOG.md](CHANGELOG.md) | Historial de versiones |
| [docs/api.md](docs/api.md) | Referencia de API |
| [docs/architecture.md](docs/architecture.md) | Arquitectura |
| [docs/security.md](docs/security.md) | Seguridad |
| [docs/deployment.md](docs/deployment.md) | Deploy |

---

## 🤝 Contribuir

1. Fork el repo
2. Creá tu branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Abrí un Pull Request

---

## 📄 Licencia

[MIT License](LICENSE) — El código es open source.

Las obras de arte son propiedad de sus respectivos artistas.

---

<p align="center">
  <a href="https://hash21.studio">hash21.studio</a> •
  Built with 🧡 on Bitcoin
</p>
