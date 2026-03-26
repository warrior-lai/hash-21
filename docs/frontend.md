# Frontend — Hash21

## Overview

Frontend vanilla JS desplegado en GitHub Pages. Zero frameworks, zero bundlers.

**Repo:** https://github.com/warrior-lai/hash-21
**URL:** https://hash21.studio

---

## Estructura

```
hash-21/
├── index.html          # Galería principal
├── app.js              # Lógica de galería + zaps
├── lang.js             # i18n ES/EN
├── style.css           # Estilos globales
├── shop/
│   ├── index.html      # Tienda
│   ├── shop.js         # Lógica de productos
│   └── style.css
├── admin/
│   ├── index.html      # Panel de administración
│   └── (inline JS)
├── verify/
│   └── index.html      # Verificación de certificados
├── faq/
├── terms/
├── privacy/
├── certification/
├── docs/               # Documentación técnica
│   ├── api/
│   │   ├── openapi.yaml
│   │   └── index.html  # Swagger UI
│   ├── architecture.md
│   ├── backend.md
│   ├── frontend.md
│   ├── security.md
│   └── deployment.md
├── sitemap.xml
├── robots.txt
├── tests/              # Tests con Vitest
├── package.json
├── vitest.config.js
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Galería dinámica con obras |
| `/shop` | Tienda con productos Lightning |
| `/admin` | Panel CRUD (requiere login) |
| `/verify` | Verificación pública de certificados |
| `/faq` | Preguntas frecuentes |
| `/terms` | Términos y condiciones |
| `/privacy` | Política de privacidad |
| `/certification` | Info sobre certificación |

---

## Tecnologías

| Tech | Uso |
|------|-----|
| HTML5 | Estructura |
| CSS3 | Estilos, responsive, dark theme |
| JavaScript ES6+ | Lógica, sin frameworks |
| qrcode.js | Generación de QR para invoices |
| Supabase JS | Cliente de base de datos |
| WebSocket | Conexión a Nostr relays |

---

## i18n (Internacionalización)

Archivo: `lang.js`

```javascript
const LANG = {
  es: { title: "Galería", buy: "Comprar", ... },
  en: { title: "Gallery", buy: "Buy", ... }
};
```

Detección automática por `navigator.language` o toggle manual.

---

## Galería Dinámica

`app.js` carga obras desde Supabase:

```javascript
const { data: works } = await supabase
  .from('works')
  .select('*, artists(name, lightning_address)')
  .eq('status', 'available');
```

Cada obra muestra:
- Imagen con lightbox
- Título, técnica, dimensiones
- Botón de zap
- Badge de certificación (si tiene)

---

## Sistema de Zaps

```javascript
// 1. Usuario elige monto
// 2. Llamar backend
const res = await fetch(`${API}/zap`, {
  method: 'POST',
  body: JSON.stringify({ artist_id, amount, comment })
});
const { invoice, payment_hash } = await res.json();

// 3. Mostrar QR
QRCode.toCanvas(canvas, invoice);

// 4. Poll para detectar pago
const check = await fetch(`${API}/check?payment_hash=${payment_hash}`);
if (check.paid) showSuccess();
```

---

## Admin Panel

Login con Supabase Auth:
```javascript
const { data, error } = await sb.auth.signInWithPassword({ 
  email, password 
});
```

Roles:
- **admin**: ve todo
- **artist**: ve solo sus obras/productos

Secciones:
- Dashboard (stats)
- Artistas (CRUD)
- Obras (CRUD + certificar)
- Productos (CRUD)
- Usuarios (solo admin)
- Certificados

---

## Deploy

Push a `main` → GitHub Pages auto-deploya.

Custom domain: `hash21.studio` configurado en repo settings.

---

## Testing

```bash
npm install
npm test              # Correr tests
npm run test:coverage # Ver coverage
```

59 tests cubriendo API, helpers, integración.

---

## Desarrollo Local

```bash
npm run dev
# → http://localhost:3000
```

O simplemente:
```bash
python3 -m http.server 8000
# → http://localhost:8000
```
