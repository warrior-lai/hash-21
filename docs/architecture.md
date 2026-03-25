# Hash21 Architecture

## Overview

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Frontend  │────▶│  Vercel API     │────▶│   Supabase   │
│ GitHub Pages│     │  (Serverless)   │     │  (Postgres)  │
└─────────────┘     └─────────────────┘     └──────────────┘
                            │
                    ┌───────┴───────┐
                    ▼               ▼
            ┌───────────┐   ┌─────────────┐
            │   Nostr   │   │ OpenTimestamps│
            │  Relays   │   │   Calendar   │
            └───────────┘   └─────────────┘
```

## Components

### Frontend (hash-21 repo)
- **Stack:** Vanilla HTML/CSS/JS
- **Hosting:** GitHub Pages
- **Domain:** hash21.studio

### Backend (Hash21-Backend repo)
- **Stack:** Node.js serverless functions
- **Hosting:** Vercel
- **Endpoints:** 11 functions (limit: 12 on Hobby plan)

### Database
- **Provider:** Supabase (PostgreSQL)
- **Tables:** artists, works, products, users, zaps

### External Services
- **Nostr:** Zap requests/receipts (NIP-57)
- **OpenTimestamps:** On-chain certification
- **Lightning:** Direct payments via LNURL-pay

## Data Flow

### Zaps
1. User clicks zap → Frontend creates zap request
2. Backend signs with nsec → sends to Nostr relay
3. User pays Lightning invoice
4. Relay broadcasts zap receipt (kind 9735)
5. Frontend detects payment via relay subscription

### Certification
1. Admin clicks certify → Backend fetches image
2. SHA-256 hash calculated
3. Hash submitted to OpenTimestamps
4. OTS returns timestamp proof
5. After ~1-12h, proof anchored in Bitcoin block
