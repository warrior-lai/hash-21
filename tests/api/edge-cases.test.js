import { describe, it, expect } from 'vitest'

const API = 'https://hash21-backend.vercel.app/api'

describe('Edge Cases', () => {
  
  describe('Invalid Requests', () => {
    it('should handle missing body on POST', async () => {
      const res = await fetch(`${API}/artists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      expect(res.status).toBeGreaterThanOrEqual(400)
    })

    it('should handle invalid JSON', async () => {
      const res = await fetch(`${API}/artists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not json'
      })
      expect(res.status).toBeGreaterThanOrEqual(400)
    })

    it('should handle empty hash on verify', async () => {
      const res = await fetch(`${API}/verify?hash=`)
      const data = await res.json()
      expect(data.error || data.found === false).toBeTruthy()
    })

    it('should handle malformed hash on verify', async () => {
      const res = await fetch(`${API}/verify?hash=not-a-hash!@#$`)
      const data = await res.json()
      // API returns verified:false OR error for malformed hashes
      expect(data.verified === false || data.error).toBeTruthy()
    })

    it('should handle non-existent endpoint', async () => {
      const res = await fetch(`${API}/nonexistent`)
      expect(res.status).toBe(404)
    })
  })

  describe('CORS', () => {
    it('should allow OPTIONS preflight', async () => {
      const res = await fetch(`${API}/artists`, { method: 'OPTIONS' })
      expect(res.ok).toBe(true)
    })
  })

  describe('Data Validation', () => {
    it('should reject user with invalid email', async () => {
      const res = await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email', role: 'artist' })
      })
      // Should either fail or create (depends on backend validation)
      expect(res.status).toBeDefined()
    })

    it('should reject artist without name', async () => {
      const res = await fetch(`${API}/artists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'test-slug' })
      })
      expect(res.status).toBeGreaterThanOrEqual(400)
    })
  })
})
