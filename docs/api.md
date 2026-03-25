# API Reference

Base URL: `https://hash21-backend.vercel.app/api`

## Artists

### GET /artists
List all artists.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Artist Name",
    "slug": "artist-name",
    "bio_es": "Bio in Spanish",
    "bio_en": "Bio in English",
    "lightning_address": "artist@wallet.com",
    "status": "active",
    "links": { "instagram": "...", "twitter": "..." }
  }
]
```

### POST /artists
Create artist. **Admin only.**

### PUT /artists
Update artist.

### DELETE /artists
Delete artist.

---

## Works

### GET /works
List all works with artist info.

**Response:**
```json
[
  {
    "id": "uuid",
    "title_es": "Title",
    "title_en": "Title EN",
    "description_es": "...",
    "image_url": "https://...",
    "technique": "Mixed media",
    "dimensions": "100x100",
    "year": 2026,
    "price_sats": 100000,
    "status": "available",
    "certificate_hash": "sha256...",
    "certificate_block": 936387,
    "certificate_status": "certified",
    "artists": { "name": "Artist" }
  }
]
```

### POST /works
Create work.

### PUT /works
Update work.

---

## Products

### GET /products
List all products.

### POST /products
Create product.

### PUT /products
Update product.

---

## Users

### GET /users
List all users. ⚠️ Currently public.

### POST /users
Create user.

**Body:**
```json
{
  "email": "user@example.com",
  "role": "artist",
  "artist_id": "uuid or null"
}
```

### PUT /users
Update user.

### DELETE /users
Delete user.

---

## Certification

### POST /certify
Certify a work on-chain.

**Body:**
```json
{
  "work_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "hash": "sha256...",
  "timestamp": "2026-03-25T..."
}
```

### GET /verify?hash=...
Verify a certificate hash.

**Response:**
```json
{
  "found": true,
  "work": { ... },
  "artist": { ... },
  "block": 936387
}
```

### GET /certificate-pdf?work_id=...
Generate certificate PDF (HTML).

---

## Zaps

### POST /zap
Create zap request (NIP-57).

**Body:**
```json
{
  "artist_id": "uuid",
  "amount": 1000,
  "comment": "Great work!"
}
```

---

## Invoice

### POST /invoice
Generate LNURL invoice.

**Body:**
```json
{
  "product_id": "uuid",
  "amount_sats": 5000
}
```
