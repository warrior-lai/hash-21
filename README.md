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
  <img src="https://img.shields.io/badge/version-0.4.0-blue" alt="Version">
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
- **Sistema de subastas** descentralizadas sobre el protocolo Nostr

Sin intermediarios. Sin permisos. Sin censura.

**El artista se convierte en soberano. Bitcoin asegura la permanencia.**

---

## 🔭 Visión

Creemos que todo sistema que logra alinear antifragilidad, escalabilidad y beneficio real —mientras ya está siendo adoptado— deja de ser una posibilidad para convertirse en dirección.

Construimos la infraestructura que redefine la relación entre arte, propiedad y tiempo: un sistema donde cada obra física puede existir con una prueba verificable, permanente y soberana. Hash21 se apoya en Bitcoin como base antifrágil y avanza con una dirección clara hacia la independencia total y la máxima robustez técnica, donde la confianza deja de estar en una plataforma y pasa al protocolo.

Está diseñado para escalar en dos dimensiones —tecnológica y cultural— con la ambición de convertirse en un estándar abierto. Cada nueva obra certificada no es un caso aislado, es un bloque más en la construcción de un nuevo sistema de valor. A medida que crece, no se debilita: se fortalece. No depende de tendencias pasajeras ni queda obsoleto frente a la evolución tecnológica; su fundamento es estructural.

Sumamos valor bitcoinizando un nicho específico: concentrando piezas únicas con vocación de trascendencia, donde la escasez, la autoría y la permanencia dejan de ser conceptos difusos para volverse verificables. No buscamos volumen vacío, buscamos densidad de significado. Cada obra que entra eleva el estándar del sistema.

Su diferencial no es solo conceptual, es tangible. Hash21 ya cuenta con early adopters: artistas que no solo validan la propuesta, sino que la utilizan. Esto transforma la visión en evidencia. Hay uso, hay interés y hay una comunidad inicial que no solo adopta, sino que legitima y expande el sistema, incluso antes de su lanzamiento oficial. Cada nuevo participante no es un usuario más, es un nodo que acelera la consolidación del estándar.

Hash21 no es una herramienta. Es un sistema que desde el día 1 está en movimiento. Y todo sistema en movimiento —cuando tiene fundamento— se vuelve inevitable.

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
| 👤 **Sistema de Usuarios** | Roles (admin/artist/designer), registro abierto |
| 📄 **Certificados PDF** | Diseño premium, QR verificable, listo para enmarcar |
| ✍️ **Registro de Creadores** | Onboarding simple para artistas y diseñadores |
| 🌍 **Bilingüe** | Español / English |
| 📱 **Responsive** | Mobile + desktop |
| ⚡ **Subastas** | Sobre nostr|

---

## 🔗 Links

| Recurso | URL |
|---------|-----|
| **Producción** | https://hash21.studio |
| **API Backend** | https://hash21-backend.vercel.app/api |
| **Verificación** | https://hash21.studio/verify |
| **Tienda** | https://hash21.studio/shop |
| **Admin** | https://hash21.studio/admin |
| **Registro** | https://hash21.studio/register |

### Repositorios

| Repo | Stack | Deploy |
|------|-------|--------|
| [hash-21](https://github.com/warrior-lai/hash-21) | HTML/CSS/JS | GitHub Pages |
| [Hash21-Backend](https://github.com/warrior-lai/Hash21-Backend) | Node.js + Vercel | Vercel Serverless |

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (GitHub Pages)                                │
│                                                                  │
│  hash21.studio/                                                  │
│  ├── index.html    (galería dinámica)                           │
│  ├── shop/         (tienda Lightning)                           │
│  ├── admin/        (panel de gestión)                           │
│  ├── register/     (registro de creadores)                      │
│  ├── verify/       (verificación pública)                       │
│  └── blocklab/     (laboratorio)                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          BACKEND                                 │
│                  (Vercel Serverless)                             │
│                                                                  │
│  hash21-backend.vercel.app/api/                                 │
│  ├── zap.js          (firma NIP-57 + invoice)                   │
│  ├── check.js        (detecta pago en relays)                   │
│  ├── certify.js      (certificación OTS)                        │
│  ├── verify.js       (verificación pública)                     │
│  ├── certificate-pdf.js                                         │
│  ├── artists.js      (CRUD)                                     │
│  ├── works.js        (CRUD)                                     │
│  ├── products.js     (CRUD)                                     │
│  ├── users.js        (CRUD + roles)                             │
│  ├── log-zap.js      (stats)                                    │
│  └── invoice.js      (LNURL-pay)                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                 │
│                        (Supabase)                                │
│                                                                  │
│  Tables: artists, works, products, users, zap_logs              │
└─────────────────────────────────────────────────────────────────┘
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
- [docs/api/openapi.yaml](docs/api/openapi.yaml) — OpenAPI 3.0 spec
- [security.md](docs/security.md) — Seguridad y manejo de secrets
- [deployment.md](docs/deployment.md) — Guía de deploy

---

## 🛠️ Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript ES6+ (vanilla, zero frameworks) |
| Backend | Vercel Serverless (Node.js) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Pagos | NIP-57, LNURL-pay, Lightning Address → Wallet of Satoshi |
| Detección de pago | Nostr relays (kind 9734/9735) via WebSocket |
| Certificación | OpenTimestamps (SHA-256 → bloque Bitcoin) |
| QR | qrcode.js v1.5.1 |
| Testing | Vitest (59 tests) + coverage |
| API Docs | OpenAPI 3.0 / Swagger |
| Hosting | GitHub Pages (frontend) + Vercel (backend) |
| DNS/SSL | Cloudflare |

---

## 📜 Certificación On-Chain (OpenTimestamps)

Hash21 certifica obras usando **OpenTimestamps**, el estándar abierto para timestamps en Bitcoin.

### ¿Qué certifica?

- ✅ Prueba de que un archivo específico existía en un momento determinado
- ✅ Inmutable: una vez anclado en Bitcoin, no se puede alterar
- ✅ Verificable por cualquiera sin confiar en Hash21
- ❌ No certifica autoría — certifica **existencia en el tiempo**

### Flow técnico

```
1. Usuario hace click en "Certificar" en el admin
                    ↓
2. Backend descarga la imagen y calcula SHA-256
   Ejemplo: de7c5e1b744c9339d4aeef4703ca17f10e9991913fab8b83f0cb4279547be44d
                    ↓
3. Envía el hash a servidores de OpenTimestamps
   • a.pool.opentimestamps.org
   • b.pool.opentimestamps.org  
   • a.pool.eternitywall.com
                    ↓
4. OTS agrupa miles de hashes en un árbol Merkle
                    ↓
5. La raíz del árbol se incluye en una transacción de Bitcoin
                    ↓
6. Un minero incluye esa transacción en un bloque (1-12 horas)
                    ↓
7. El hash queda grabado PARA SIEMPRE en la blockchain
```

### ¿Por qué OpenTimestamps?

- 🔓 Estándar abierto, no propietario
- 💸 Gratuito (no requiere transacciones on-chain por cada hash)
- ✅ Verificable con `ots verify` (CLI) o en hash21.studio/verify
- 🏛️ Usado por: Internet Archive, Wikileaks, Tierion

### Verificación

```bash
# Via web
https://hash21.studio/verify?hash=de7c5e1b744c9339d4aeef4703ca17f10e9991913fab8b83f0cb4279547be44d

# Via API
curl https://hash21-backend.vercel.app/api/verify?hash=de7c5e1b...
```

---

## 🔨 Subastas Nostr (subastas.hash21.studio)

Sistema de subastas descentralizadas sobre el protocolo Nostr.

### Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                  SUBASTAS APP                         │
│               subastas.hash21.studio                   │
│                    (Vercel)                            │
│                                                        │
│  Stack: Vite + React                                   │
│  ├── src/hooks/useNostr.js    (conexión relays)       │
│  ├── src/hooks/useAuctions.js (CRUD subastas)        │
│  ├── src/utils/nip05.js       (verificación NIP-05)  │
│  └── src/utils/validation.js  (seguridad)            │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   NOSTR RELAYS                         │
│                                                        │
│  wss://nos.lol                                         │
│  wss://relay.primal.net                                │
│  wss://relay.snort.social                              │
│  wss://relay.damus.io                                  │
└─────────────────────────────────────────────────────┘
                         │
                ┌────────┴────────┐
                ▼                  ▼
┌─────────────────────┐  ┌─────────────────────┐
│   Extensión Nostr      │  │   Pagos Lightning   │
│   (Alby / nos2x)       │  │   (Lightning Addr)  │
│                        │  │                      │
│  - Firma eventos       │  │  - Directo al        │
│  - getPublicKey()      │  │    artista           │
│  - signEvent()         │  │  - Zero custodia     │
└─────────────────────┘  └─────────────────────┘
```

### Event Kinds

| Kind | Tipo | Descripción |
|------|------|-------------|
| **30020** | Subasta | Evento parameterized replaceable con datos de subasta |
| **1021** | Puja | Bid en una subasta específica |
| **1022** | Resultado | Cierre/ganador de subasta |

### Estructura de Evento de Subasta (Kind 30020)

```json
{
  "kind": 30020,
  "created_at": 1712973600,
  "pubkey": "<artist_pubkey>",
  "tags": [
    ["d", "roatan-bitcoin-1712973600"],
    ["t", "hash21"],
    ["title", "Roatan Bitcoin"],
    ["summary", "Acrílico sobre lienzo. 50x70cm..."],
    ["image", "https://hash21.studio/img/roatan-bitcoin.jpg"],
    ["artist", "Abstract Lai"],
    ["nip05", "lai@hash21.studio"],
    ["lnaddr", "abstractlai@getalby.com"],
    ["start_price", "100000"],
    ["currency", "sats"],
    ["start_time", "1712973600"],
    ["end_time", "1713578400"]
  ],
  "content": "Roatan Bitcoin - Acrílico sobre lienzo",
  "sig": "<signature>"
}
```

### Estructura de Evento de Puja (Kind 1021)

```json
{
  "kind": 1021,
  "created_at": 1712973700,
  "pubkey": "<bidder_pubkey>",
  "tags": [
    ["e", "<auction_event_id>"],
    ["amount", "150000"],
    ["currency", "sats"]
  ],
  "content": "Bid 150000 sats",
  "sig": "<signature>"
}
```

### NIP-05 Verificación

Los artistas con NIP-05 verificado muestran badge ✓ dorado:

```
1. Usuario crea subasta con nip05 tag
2. App fetch: https://{domain}/.well-known/nostr.json?name={name}
3. Compara pubkey registrada vs pubkey del evento
4. Si coincide → badge ✓ verificado
5. Cache de 5 minutos para evitar spam
```

### Seguridad Implementada

| Medida | Descripción |
|--------|-------------|
| **CSP** | Content-Security-Policy en index.html |
| **Headers** | X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| **Rate Limit** | 1 minuto entre creación de subastas |
| **Sesión 24h** | Expiración automática de localStorage |
| **maxLength** | Todos los inputs limitados |
| **URL Validation** | Solo http/https permitido |
| **MIME Check** | Validación de tipo de archivo en uploads |

### Links

| Recurso | URL |
|---------|-----|
| **App Live** | https://subastas.hash21.studio |
| **Código** | /subastas-app/ en este repo |
| **Vercel** | Auto-deploy desde main |

---

## ⚡ Zap System (NIP-57)

Propinas Lightning directas al artista con detección automática de pago.

```
Usuario elige monto → Frontend pide invoice al backend
                              ↓
Backend firma zap request (kind 9734) con key Nostr de Hash21
                              ↓
Backend pide invoice a WoS del artista via Lightning Address
                              ↓
Frontend muestra QR + invoice + "Open in wallet"
                              ↓
Usuario paga con cualquier Lightning wallet
                              ↓
WoS publica zap receipt (kind 9735) en relays Nostr
                              ↓
Backend detecta receipt → Frontend muestra "¡Gracias!" ⚡
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

#### ✅ #2 IDENTITY — Nostr Identity (Abril 2026)
**Estado: LIVE**

Identidad soberana para artistas:
- 👤 **Login con Nostr (NIP-07)** — Sin email, sin password, tu clave es tu identidad
- ✅ **NIP-05 verificado** — Badge ✓ en subastas de artistas verificados
- 🔐 **Firma de obras** — Cada subasta/puja firmada con la clave del artista
- 🎭 **Subastas Descentralizadas** — Sistema completo de subastas sobre Nostr

##### Implementado:
- ⚡ **subastas.hash21.studio** — App React de subastas descentralizadas
- 🔗 **Conexión a relays Nostr** — nos.lol, relay.primal.net, relay.snort.social
- 📝 **Crear subasta con firma Nostr** — NIP-07 (Alby, nos2x)
- 💰 **Pujar con firma Nostr** — Kind 1021
- ✅ **NIP-05 verificación** — Badge dorado en artistas verificados
- 🔐 **Login Nostr en admin/register** — Sin email requerido
- 🛡️ **Seguridad** — CSP, rate limiting, validaciones, sesión 24h

##### Pendiente:
- 🌐 **i18n toggle ES/EN** — Botón funcional (traducciones listas)
- 🖼️ **OG image** — Imagen para compartir en redes
- 🌙 **Dark mode toggle** — Tema oscuro opcional
- 📱 **Service Worker** — PWA completo offline

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

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para instrucciones de instalación, testing y desarrollo.

---

## 👥 Equipo

| Rol | Nombre | GitHub |
|-----|--------|--------|
| **Founder & Artist** | Lai⚡️ | [@warrior-lai](https://github.com/warrior-lai) |
| **AI Dev** | Ragnar 🪓 | — |

---

## 📄 Licencia

[MIT License](LICENSE) — El código es open source.

Las obras de arte son propiedad de sus respectivos artistas.

---

<p align="center">
  <strong>Permanencia para la obra. Soberanía para el artista. ⚡</strong>
</p>

<p align="center">
  <a href="https://hash21.studio">hash21.studio</a> •
  Built with 🧡 on Bitcoin
</p>
