# Hash21

<p align="center">
  <img src="https://hash21.studio/img/obra1.jpg" alt="Hash21" width="400">
</p>

<p align="center">
  <strong>Permanencia para la obra. Soberanía para el artista.</strong>
</p>

<p align="center">
  <a href="https://hash21.studio">🌐 Live Demo</a> •
  <a href="https://staging.hash21.studio">🧪 Staging</a> •
  <a href="https://hash21.studio/verify">🔍 Verificar Obra</a> •
  <a href="https://hash21.studio/shop">🛒 Tienda</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/Bitcoin-Lightning-orange" alt="Lightning">
  <img src="https://img.shields.io/badge/Nostr-NIP--57-purple" alt="Nostr">
  <img src="https://img.shields.io/badge/tests-38%20passed-brightgreen" alt="Tests">
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

## 🔗 Links

| Recurso | URL |
|---------|-----|
| **Producción** | https://hash21.studio |
| **Staging** | https://staging.hash21.studio |
| **API Backend** | https://hash21-backend.vercel.app |
| **Verificación On-Chain** | https://hash21.studio/verify |
| **Tienda Lightning** | https://hash21.studio/shop |
| **Admin Panel** | https://hash21.studio/admin |

### Repositorios

| Repo | Stack | Deploy |
|------|-------|--------|
| [hash-21](https://github.com/warrior-lai/hash-21) | HTML/CSS/JS | GitHub Pages |
| [Hash21-Backend](https://github.com/warrior-lai/Hash21-Backend) | Node.js + Vercel | Vercel Serverless |

---

## ✅ Features en Producción

| Feature | Descripción |
|---------|-------------|
| ⚡ **Zap System (NIP-57)** | Propinas Lightning con firma Nostr server-side |
| 🌩️ **WebLN (Alby)** | 1-click payment desde extensión |
| 💳 **LNURL-pay** | Invoice directo desde wallet del artista |
| 🛒 **Shop Lightning** | 8 productos, checkout con QR, precios en sats |
| 📜 **Certificación On-Chain** | OpenTimestamps → hash anclado en Bitcoin |
| 🔍 **Verificación Pública** | Cualquiera puede verificar autenticidad |
| 👥 **Hub de Artistas** | Perfiles con bio, links, Lightning Address |
| 🎨 **Galería Dinámica** | 6 obras desde Supabase con lightbox |
| 🔐 **Admin Panel** | CRUD completo + gestión de usuarios |
| 🌍 **Bilingüe** | Español / English |
| 📱 **Responsive** | Mobile + desktop |
| ✅ **Tests** | 38 automatizados |

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

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (GitHub Pages)                                │
│                                                                  │
│  hash21.studio/           staging.hash21.studio/                │
│  ├── index.html           ├── (misma estructura)                │
│  ├── shop/                                                       │
│  ├── admin/                                                      │
│  ├── verify/                                                     │
│  └── blocklab/                                                   │
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
│  └── upload.js       (imágenes)                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                 │
│                        (Supabase)                                │
│                                                                  │
│  Tables: artists, works, products, users, zap_logs             │
└─────────────────────────────────────────────────────────────────┘
```

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
| Hosting | GitHub Pages (frontend) + Vercel (backend) |
| DNS/SSL | Cloudflare |

---

## 🧪 Tests

```bash
./test.sh

# Output:
# ⚡ Hash21 Test Suite
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔧 Backend — 11 tests
# 📜 Certification — 6 tests  
# 🗄️ Database API — 4 tests
# 🌐 Frontend — 8 tests
# 📦 Assets — 10 tests
# 🔒 SSL — 2 tests
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Total: 38 tests | ✅ 38 passed
```

---

## 🚀 Desarrollo Local

```bash
# Frontend
git clone https://github.com/warrior-lai/hash-21.git
cd hash-21
python3 -m http.server 8000
# → http://localhost:8000

# Backend
git clone https://github.com/warrior-lai/Hash21-Backend.git
cd Hash21-Backend
npm install
cp .env.example .env
# Agregar HASH21_NOSTR_NSEC, SUPABASE_URL, SUPABASE_KEY
vercel dev
# → http://localhost:3000
```

**No hay build step en el frontend. No hay bundler. Abrí `index.html` y funciona.**

---

## 🔜 Roadmap

### Alineado con [Hackathons La Crypta 2026](https://hackaton.lacrypta.ar/hackathons.html)

| Hackathon | Tema | Feature para Hash21 | Estado |
|-----------|------|---------------------|--------|
| **#1 FOUNDATIONS** | Lightning Payments | ⚡ Zaps NIP-57 + LNURL-pay | ✅ Live |
| **#2 IDENTITY** | Nostr Identity | 👤 Login con Nostr (NIP-07) | 🔜 Pendiente |
| **#3 ZAPS** | Lightning + Nostr | 💜 Zap receipts en galería, rankings | 🔜 Pendiente |
| **#4 COMMERCE** | Lightning Stores | 🛒 Checkout completo, stock, envíos | 🔜 Parcial |
| **#5 MEDIA** | Decentralized Storage | 📸 Upload a Blossom, IPFS para obras | 🔜 Pendiente |
| **#6 AI AGENTS** | Bots & Automation | 🤖 Bot Telegram para zaps, notificaciones | 🔜 Pendiente |
| **#7 INFRASTRUCTURE** | Nodes & Routing | 🏗️ BTCPay Server propio, LNbits | 🔜 Pendiente |
| **#8 INTEGRATION** | Full-Stack | 🌐 App completa multi-artista | 🔜 En desarrollo |

### Otros features planeados

| Feature | Prioridad | Estado |
|---------|-----------|--------|
| Autogestión artistas (registro, login, perfil) | 🔴 Alta | En desarrollo |
| Upload imágenes desde admin | 🔴 Alta | Endpoint listo |
| Dashboard analytics por artista | 🟡 Media | Pendiente |
| Notificaciones (email/Telegram) | 🟡 Media | Pendiente |
| PWA (installable) | 🟢 Baja | Pendiente |

---

## 🤝 Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 Licencia

[MIT License](LICENSE) — El código es open source.

Las obras de arte son propiedad de sus respectivos artistas y NO están cubiertas por esta licencia.

---

## 🧡 Filosofía

Hash21 nace de una premisa: **el arte necesita soberanía, no plataformas**.

- Sin custody de las obras
- Sin intermediarios en los pagos  
- Sin permisos para publicar
- Certificación vinculada a Bitcoin, no a una empresa

**Permanencia para la obra. Soberanía para el artista. ⚡**

---

<p align="center">
  <a href="https://hash21.studio">hash21.studio</a> •
  Built with 🧡 on Bitcoin
</p>
