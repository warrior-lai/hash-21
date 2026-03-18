# Hash21

**Permanencia para la obra. Soberanía para el artista.**

Hash21 es una plataforma de arte curado sobre Bitcoin. Galería, certificación on-chain y tienda Lightning-native — sin intermediarios, sin permisos, sin censura.

🌐 **[hash21.studio](https://hash21.studio)**

---

## Arquitectura

```
hash21.studio/
├── index.html        # Página principal (galería + creadores + blog + eventos)
├── style.css         # Estilos globales
├── app.js            # UI: particles, lightbox, carousel, menú, newsletter
├── zap.js            # Sistema de Zaps (LNbits + QR + polling)
├── lang.js           # i18n ES/EN
├── shop/
│   └── index.html    # Tienda de objetos de diseño (LNURL-pay checkout)
├── verify/
│   └── index.html    # Verificación pública de certificados on-chain
├── blocklab/
│   └── index.html    # Block Lab: arte, soberanía y Bitcoin
├── faq/              # Preguntas frecuentes
├── terms/            # Términos de uso
├── privacy/          # Política de privacidad
├── certification/    # Proceso de certificación
└── img/              # Obras, avatares, assets
```

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3 (vanilla), JavaScript (ES6+) |
| Pagos | LNbits API (invoice creation + polling), LNURL-pay |
| Certificación | OpenTimestamps (SHA-256 → bloque Bitcoin) |
| QR | qrcode.js v1.5.1 |
| i18n | Sistema custom ES/EN (lang.js) |
| Analytics | Google Analytics 4 |
| Hosting | GitHub Pages |
| DNS/SSL | Cloudflare |

**Zero dependencies server-side. Zero frameworks. Pure web.**

## Features

### ⚡ Zap System (Lightning Tips)
- Botón ⚡ en cada obra y cada perfil de artista
- Montos predefinidos (21, 210, 2,100, 21K sats) + monto personalizado
- Mensaje opcional del zapper
- Invoice generado vía LNbits API
- QR code client-side + copy invoice + open in wallet
- **Detección automática de pago** via polling al endpoint LNbits
- Confirmación visual instantánea al detectar pago
- Timeout a 5 min con mensaje de expiración

### 🛒 Shop — Objetos de Diseño
- Tienda de joyas y objetos inspirados en Bitcoin
- Checkout con LNURL-pay via Lightning Address
- QR code generado client-side
- Opciones post-pago: envío sin KYC (Telegram) o con dirección
- Precios en sats, actualizados

### 📜 Certificación On-Chain
- Certificados de registro vinculados a un bloque de Bitcoin (OpenTimestamps)
- SHA-256 del archivo original → timestamp en blockchain
- Prueba de existencia en el tiempo, permanente e incensurable
- Verificación pública en [hash21.studio/verify](https://hash21.studio/verify)

### 🌐 Bilingüe
- Español / English completo
- Switcher persistente en toda la plataforma

### 👥 Hub de Creadores
- Perfiles de artistas con avatar, bio, motto, links, Lightning Address
- Galería individual por artista
- Zap directo al artista

## Payment Flow

```
Usuario selecciona monto
        ↓
Frontend → LNbits API (POST /api/v1/payments)
        ↓
LNbits genera invoice (bolt11)
        ↓
Frontend muestra QR + invoice copiable
        ↓
Usuario paga con cualquier Lightning wallet
        ↓
Frontend polls LNbits (GET /api/v1/payments/{hash})
        ↓
paid: true → confirmación visual ⚡
```

## Filosofía

Hash21 nace de una premisa: **el arte necesita soberanía, no plataformas**.

- Sin custody de las obras
- Sin intermediarios en los pagos
- Sin permisos para publicar
- Certificación vinculada a Bitcoin, no a una empresa

El artista mantiene el control. La blockchain provee la permanencia.

## Desarrollo Local

```bash
# Clonar
git clone https://github.com/warrior-lai/hash-21.git
cd hash-21

# Servir (cualquier servidor estático)
python3 -m http.server 8000
# o
npx serve .
```

No hay build step. No hay bundler. Abrí `index.html` y funciona.

## Licencia

© 2025-2026 Hash21. Todos los derechos reservados.
Las obras de arte son propiedad de sus respectivos artistas.
