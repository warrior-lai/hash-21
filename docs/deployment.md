# Deployment

## Frontend (GitHub Pages)

1. Push to `main` branch
2. GitHub Pages auto-deploys from `/` (root)
3. Custom domain: `hash21.studio`

```bash
git push origin main
# Deploys in ~1 minute
```

## Backend (Vercel)

1. Push to `main` branch of Hash21-Backend
2. Vercel auto-deploys
3. Or manual redeploy from Vercel dashboard

### Environment Variables (Vercel)

Required:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `HASH21_NOSTR_NSEC`

Optional:
- `SUPABASE_SERVICE_ROLE_KEY` (for user management)

### Manual Redeploy

1. Go to Vercel → Hash21-Backend → Deployments
2. Click latest deployment → ⋮ → Redeploy
3. Uncheck "Use existing Build Cache"
4. Redeploy

## Database (Supabase)

No deployment needed — managed service.

### Migrations

Run SQL directly in Supabase SQL Editor:
```sql
-- Example: add column
ALTER TABLE works ADD COLUMN new_field TEXT;
```

## Testing

```bash
cd hash-21
./test.sh
# Should show: ✅ All 38 tests passed
```
