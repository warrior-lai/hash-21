import { describe, it, expect } from 'vitest'

const API = 'https://hash21-backend.vercel.app/api'
const SITE = 'https://hash21.studio'

describe('Integration Tests', () => {
  
  describe('Site Availability', () => {
    it('should serve main site', async () => {
      const res = await fetch(SITE)
      expect(res.ok).toBe(true)
    })

    it('should serve shop', async () => {
      const res = await fetch(`${SITE}/shop`)
      expect(res.ok).toBe(true)
    })

    it('should serve verify page', async () => {
      const res = await fetch(`${SITE}/verify`)
      expect(res.ok).toBe(true)
    })

    it('should serve sitemap', async () => {
      const res = await fetch(`${SITE}/sitemap.xml`)
      expect(res.ok).toBe(true)
    })

    it('should serve robots.txt', async () => {
      const res = await fetch(`${SITE}/robots.txt`)
      expect(res.ok).toBe(true)
    })
  })

  describe('API Health', () => {
    it('should respond to artists endpoint', async () => {
      const res = await fetch(`${API}/artists`)
      expect(res.ok).toBe(true)
    })

    it('should respond to works endpoint', async () => {
      const res = await fetch(`${API}/works`)
      expect(res.ok).toBe(true)
    })

    it('should respond to products endpoint', async () => {
      const res = await fetch(`${API}/products`)
      expect(res.ok).toBe(true)
    })

    it('should have CORS headers', async () => {
      const res = await fetch(`${API}/artists`)
      expect(res.headers.get('access-control-allow-origin')).toBe('*')
    })
  })

  describe('Data Integrity', () => {
    it('works should reference existing artists', async () => {
      const [works, artists] = await Promise.all([
        fetch(`${API}/works`).then(r => r.json()),
        fetch(`${API}/artists`).then(r => r.json())
      ])
      
      const artistIds = new Set(artists.map(a => a.id))
      works.forEach(work => {
        if (work.artist_id) {
          expect(artistIds.has(work.artist_id)).toBe(true)
        }
      })
    })
  })
})
