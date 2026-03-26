# Backend — Hash21

## Overview

Backend serverless desplegado en Vercel. API REST que conecta con Supabase, Nostr relays y OpenTimestamps.

**Repo:** https://github.com/warrior-lai/Hash21-Backend
**URL:** https://hash21-backend.vercel.app/api

---

## Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/artists` | GET, POST, PUT, DELETE | CRUD artistas |
| `/works` | GET, POST, PUT, DELETE | CRUD obras |
| `/products` | GET, POST, PUT, DELETE | CRUD productos |
| `/users` | GET, POST, PUT, DELETE | CRUD usuarios |
| `/zap` | POST | Crear zap request NIP-57 |
| `/check` | GET | Detectar pago en Nostr relays |
| `/invoice` | POST | Generar invoice LNURL-pay |
| `/certify` | POST | Certificar obra en OpenTimestamps |
| `/verify` | GET | Verificar certificado por hash |
| `/certificate-pdf` | GET | Generar HTML del certificado |
| `/log-zap` | POST | Registrar zap en stats |

---

## Estructura de Archivos

```
Hash21-Backend/
├── api/
│   ├── artists.js
│   ├── works.js
│   ├── products.js
│   ├── users.js
│   ├── zap.js
│   ├── check.js
│   ├── invoice.js
│   ├── certify.js
│   ├── verify.js
│   ├── certificate-pdf.js
│   ├── log-zap.js
│   └── lib/
│       └── supabase.js
├── package.json
└── vercel.json
```

---

## Variables de Entorno

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `SUPABASE_URL` | URL del proyecto Supabase | ✅ |
| `SUPABASE_ANON_KEY` | Key pública de Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Key admin (para crear usuarios) | ⚠️ Opcional |
| `HASH21_NOSTR_NSEC` | Private key Nostr para firmar zaps | ✅ |

---

## Base de Datos (Supabase)

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `artists` | Perfiles de artistas |
| `works` | Obras de arte |
| `products` | Productos de la tienda |
| `users` | Usuarios del sistema (admin, artista) |
| `zap_logs` | Registro de zaps |

### Campos de Certificación (works)

```sql
certificate_hash    TEXT      -- SHA-256 de la imagen
certificate_block   INTEGER   -- Bloque de Bitcoin
certificate_date    TIMESTAMP -- Fecha de certificación
certificate_status  TEXT      -- none | pending | certified
```

---

## Flujos

### Zap (NIP-57)

```
1. Frontend → POST /zap { artist_id, amount, comment }
2. Backend firma zap request (kind 9734) con NSEC
3. Backend pide invoice a Lightning Address del artista
4. Backend retorna { invoice, payment_hash }
5. Frontend muestra QR
6. Usuario paga
7. Frontend → GET /check?payment_hash=...
8. Backend escucha zap receipt (kind 9735) en relays
9. Retorna { paid: true } cuando detecta
```

### Certificación

```
1. Admin → POST /certify { work_id }
2. Backend descarga imagen de work.image_url
3. Calcula SHA-256
4. Envía hash a OpenTimestamps
5. Guarda hash en DB con status=pending
6. OTS ancla en Bitcoin (1-12 horas)
7. Admin actualiza certificate_block manualmente o via cron
```

---

## Deploy

Push a `main` → Vercel auto-deploya.

Para redeploy manual:
1. Vercel Dashboard → Hash21-Backend
2. Deployments → último → ⋮ → Redeploy

---

## Límites

- **Vercel Hobby:** máximo 12 funciones serverless
- **Actualmente:** 11 funciones
