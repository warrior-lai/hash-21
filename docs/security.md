# Security

## Secrets Management

All secrets are stored as environment variables in Vercel:

| Variable | Purpose | Exposure |
|----------|---------|----------|
| `SUPABASE_URL` | Database connection | Safe to expose |
| `SUPABASE_ANON_KEY` | Public API access | Safe to expose |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin operations | **NEVER expose** |
| `HASH21_NOSTR_NSEC` | Zap signing | **NEVER expose** |

## What Hash21 Controls

- ✅ Artist profiles and metadata
- ✅ Work/product catalog
- ✅ Certification hashes
- ✅ Zap routing (signs requests)

## What Hash21 Does NOT Control

- ❌ User funds (non-custodial)
- ❌ Lightning wallets (direct to artist)
- ❌ Private keys (except Nostr nsec for zaps)

## CORS

Backend allows all origins (`*`) for hackathon simplicity.
For production, restrict to:
- `https://hash21.studio`
- `https://staging.hash21.studio`

## Input Validation

- All user inputs sanitized with `esc()` / `escHtml()`
- SQL injection prevented by Supabase parameterized queries
- File uploads: images only, processed server-side

## Known Limitations

1. `/api/users` endpoint is public (list users) — add auth for production
2. No rate limiting on API endpoints
3. No CAPTCHA on forms
