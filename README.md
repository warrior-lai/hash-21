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
Frontend (GitHub Pages)              Backend (Vercel)
hash21.studio/                       hash21-backend.vercel.app/
├── index.html    (galería)          ├── api/zap.js    (firma NIP-57 + invoice)
├── style.css     (estilos)          ├── api/check.js  (verifica pago en relays)
├── app.js        (UI)               └── api/health.js (health check)
├── zap.js        (zap client)
├── lang.js       (i18n ES/EN)
├── shop/         (tienda LNURL-pay)
├── verify/       (certificación on-chain)
├── blocklab/     (arte + soberanía)
├── test.sh       (28 tests automatizados)
├── faq.html
├── terms.html
├── privacy.html
├── certification.html
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

### 📜 Certificación On-Chain
- Certificados de registro vinculados a un bloque de Bitcoin (OpenTimestamps)
- SHA-256 del archivo original → timestamp en blockchain
- Prueba de existencia en el tiempo, permanente e incensurable
- Verificación pública en [hash21.studio/verify](https://hash21.studio/verify)

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

© 2025-2026 Hash21. Todos los derechos reservados.
Las obras de arte son propiedad de sus respectivos artistas.
