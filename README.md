# Hash21

**Permanencia para la obra. Soberanía para el artista.**

Hash21 es una plataforma de arte curado sobre Bitcoin. Galería, certificación on-chain y tienda Lightning-native — sin intermediarios, sin permisos, sin censura.

🌐 **[hash21.studio](https://hash21.studio)**

---

## ✅ Lo que funciona HOY (en producción)

| Feature | Estado | Detalles |
|---------|--------|----------|
| **Zap System (NIP-57)** | ✅ Live | Firma server-side + detección automática via Nostr relays |
| **WebLN (Alby)** | ✅ Live | 1-click payment desde extensión del navegador |
| **LNURL-pay** | ✅ Live | Invoice directo desde WoS del artista — sats sin intermediarios |
| **Shop Lightning** | ✅ Live | 8 productos, checkout con QR, precios en sats |
| **Certificación On-Chain** | ✅ Live | OpenTimestamps, 2 certificados emitidos (bloques #936387, #936793) |
| **Verificación pública** | ✅ Live | hash21.studio/verify |
| **Hub de Artistas** | ✅ Live | 4 artistas con perfil, bio, links, Lightning Address |
| **Galería** | ✅ Live | 6 obras con lightbox, carousel, grid expandible |
| **Backend API** | ✅ Live | CRUD artistas, obras, productos (Vercel + Supabase) |
| **Admin Panel** | ✅ Live | Login con Supabase Auth, gestión completa |
| **CMS dinámico** | ✅ Live | Shop carga desde Supabase, no hardcodeado |
| **Staging** | ✅ Live | staging.hash21.studio para preview |
| **Tests** | ✅ Live | 47 automatizados (28 frontend + 19 backend) |
| **Bilingüe** | ✅ Live | ES/EN completo en toda la plataforma |
| **Responsive** | ✅ Live | Mobile + desktop, touch targets ≥44px |
| **SSL** | ✅ Live | Cloudflare, ambos dominios |

## 🔜 Roadmap

| Feature | Prioridad | Descripción |
|---------|-----------|-------------|
| **Autogestión artistas** | 🔴 Alta | Registro, login, subir obras, gestionar perfil |
| **E-commerce completo** | 🔴 Alta | Stock, checkout con detección, envío integrado |
| **Upload imágenes** | 🔴 Alta | Subir fotos desde admin panel (endpoint ya existe) |
| **Certificación self-service** | 🟡 Media | Emitir certificados on-chain desde el admin |
| **Dashboard analytics** | 🟡 Media | Métricas de zaps, visitas, revenue por artista |
| **Notificaciones** | 🟡 Media | Email/Telegram al recibir zap o aprobación |
| **Lightning Address por artista** | 🟡 Media | Cada artista configura su wallet |
| **Stock management** | 🟡 Media | Control de inventario en tienda |
| **Galería dinámica** | 🟢 En staging | Obras cargan desde Supabase (ya funciona en staging) |
| **PWA** | 🟢 Baja | Installable en celular |

---

## Arquitectura

```
Frontend (GitHub Pages)              Backend (Vercel + Supabase)
hash21.studio/                       hash21-backend.vercel.app/api/
├── index.html    (galería)          ├── zap.js         (firma NIP-57 + invoice)
├── style.css     (estilos)          ├── check.js       (verifica pago en relays)
├── app.js        (UI)               ├── certify.js     (certificación OTS)
├── zap.js        (zap client)       ├── verify.js      (verificación pública)
├── lang.js       (i18n ES/EN)       ├── certificate-pdf.js (genera certificado)
├── shop/         (tienda)           ├── artists.js     (CRUD artistas)
├── admin/        (panel admin)      ├── works.js       (CRUD obras)
├── verify/       (verificación)     ├── products.js    (CRUD productos)
├── blocklab/     (arte + soberanía) ├── log-zap.js     (registro de zaps)
├── test.sh       (tests)            └── upload.js      (subida de imágenes)
└── img/          (obras, avatares)
```

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript ES6+ (vanilla, zero frameworks) |
| Backend | Vercel Serverless (Node.js) |
| Pagos (Zaps) | NIP-57, LNURL-pay, Lightning Address → Wallet of Satoshi |
| Detección de pago | Nostr relays (kind 9734 / 9735) via WebSocket server-side |
| Certificación | OpenTimestamps (SHA-256 → bloque Bitcoin) |
| QR | qrcode.js v1.5.1 |
| i18n | Sistema custom ES/EN (lang.js) |
| Analytics | Google Analytics 4 |
| Hosting | GitHub Pages (frontend) + Vercel (backend) |
| DNS/SSL | Cloudflare |

## Features

### ⚡ Zap System (NIP-57 — Lightning Tips)
Propinas Lightning directas al artista, con detección automática de pago.

**Flow:**
```
Usuario elige monto → Frontend pide invoice al backend
    ↓
Backend firma zap request (kind 9734) con key Nostr de Hash21
    ↓
Backend pide invoice a WoS del artista via Lightning Address
    ↓
Frontend muestra QR + invoice copiable + "Open in wallet"
    ↓
Usuario paga con cualquier Lightning wallet
    ↓
WoS recibe pago → publica zap receipt (kind 9735) en relays Nostr
    ↓
Backend pollea relays → detecta receipt → Frontend muestra "¡Gracias!" ⚡
```

- Montos predefinidos (21, 210, 2,100, 21K sats) + monto personalizado
- Mensaje opcional del zapper
- Sats van **directo** a la wallet del artista (no hay intermediarios)
- Timeout a 5 min con mensaje de expiración
- Fallback con botón "Ya pagué" si la detección falla

### 🛒 Shop — Objetos de Diseño
- Tienda de joyas y objetos inspirados en Bitcoin
- Checkout con LNURL-pay via Lightning Address
- QR code generado client-side
- Opciones post-pago: envío sin KYC (Telegram) o con dirección
- Precios en sats

### 📜 Certificación On-Chain (OpenTimestamps)

Hash21 certifica obras usando **OpenTimestamps**, el estándar abierto para timestamps en Bitcoin.

**¿Qué certifica?**
- Prueba de que un archivo específico (la imagen de la obra) existía en un momento determinado
- No certifica autoría — certifica **existencia en el tiempo**
- Inmutable: una vez anclado en un bloque de Bitcoin, no se puede alterar

**Flow técnico:**
```
1. Usuario hace click en "Certificar" en el admin
   ↓
2. Backend descarga la imagen de la obra
   ↓
3. Calcula el SHA-256 (huella digital única de 64 caracteres)
   Ejemplo: de7c5e1b744c9339d4aeef4703ca17f10e9991913fab8b83f0cb4279547be44d
   ↓
4. Envía el hash a servidores de OpenTimestamps (calendar servers)
   - a.pool.opentimestamps.org
   - b.pool.opentimestamps.org
   - a.pool.eternitywall.com
   ↓
5. OTS agrupa miles de hashes en un árbol Merkle
   ↓
6. La raíz del árbol se incluye en una transacción de Bitcoin
   ↓
7. Un minero incluye esa transacción en un bloque (1-12 horas)
   ↓
8. El bloque se mina → el hash queda grabado PARA SIEMPRE
   ↓
9. La obra aparece como "Certificada · Bloque #XXXXXX"
```

**¿Por qué OpenTimestamps?**
- Estándar abierto, no propietario
- Gratuito (no requiere transacciones on-chain por cada hash)
- Verificable por cualquiera sin confiar en Hash21
- Usado por: Internet Archive, Wikileaks, Tierion, Chainpoint

**Verificación pública:**
- [hash21.studio/verify](https://hash21.studio/verify) — ingresá el hash SHA-256
- También verificable con `ots verify` (CLI de OpenTimestamps)

**Endpoints:**
```
POST /api/certify     → Calcula hash + envía a OTS
GET  /api/verify      → Busca hash en la base de datos
GET  /api/certificate-pdf → Genera certificado visual
```

**Certificados emitidos:** 3 obras certificadas (The Rabbit, The Hole, Libertad)

### 🌐 Bilingüe
- Español / English completo
- Switcher persistente en toda la plataforma

### 👥 Hub de Creadores
- Perfiles de artistas con avatar, bio, motto, links
- Galería individual por artista
- Zap directo al artista

### 🧪 Tests Automatizados
```bash
./test.sh
# 28 tests: backend, frontend, assets, SSL
# ✅ 28/28 passed
```

## Repos

| Repo | Descripción |
|------|------------|
| [hash-21](https://github.com/warrior-lai/hash-21) | Frontend (GitHub Pages → hash21.studio) |
| [Hash21-Backend](https://github.com/warrior-lai/Hash21-Backend) | Backend API (Vercel → hash21-backend.vercel.app) |

## Filosofía

Hash21 nace de una premisa: **el arte necesita soberanía, no plataformas**.

- Sin custody de las obras
- Sin intermediarios en los pagos
- Sin permisos para publicar
- Certificación vinculada a Bitcoin, no a una empresa

El artista mantiene el control. La blockchain provee la permanencia.

## Desarrollo Local

```bash
# Frontend
git clone https://github.com/warrior-lai/hash-21.git
cd hash-21
python3 -m http.server 8000

# Backend
git clone https://github.com/warrior-lai/Hash21-Backend.git
cd Hash21-Backend
npm install
# Agregar HASH21_NOSTR_NSEC en .env
vercel dev
```

No hay build step en el frontend. No hay bundler. Abrí `index.html` y funciona.

## Licencia

MIT License — ver [LICENSE](LICENSE)

El código es open source. Las obras de arte son propiedad de sus respectivos artistas.
