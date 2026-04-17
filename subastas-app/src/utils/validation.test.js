import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateImageUrl, validateFile, checkRateLimit, setLastPublish, checkSession, saveSession, clearSession } from './validation'

describe('validation utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('validateImageUrl', () => {
    it('accepts valid http/https URLs', () => {
      expect(validateImageUrl('https://example.com')).toBe(true)
      expect(validateImageUrl('http://test.com/path')).toBe(true)
      expect(validateImageUrl('https://sub.domain.com/img.jpg')).toBe(true)
    })

    it('rejects invalid URLs', () => {
      expect(validateImageUrl('javascript:alert(1)')).toBe(false)
      expect(validateImageUrl('data:text/html')).toBe(false)
      expect(validateImageUrl('ftp://server.com')).toBe(false)
      expect(validateImageUrl('not-a-url')).toBe(false)
      expect(validateImageUrl('')).toBe(false)
    })
  })

  describe('validateFile', () => {
    it('accepts valid image files', () => {
      const validFile = { type: 'image/jpeg', size: 1000 }
      expect(validateFile(validFile)).toBe(true)
    })

    it('rejects invalid file types', () => {
      const invalidFile = { type: 'application/javascript', size: 1000 }
      expect(() => validateFile(invalidFile)).toThrow('Solo se aceptan')
    })

    it('rejects files over 5MB', () => {
      const largeFile = { type: 'image/jpeg', size: 6 * 1024 * 1024 }
      expect(() => validateFile(largeFile)).toThrow('5MB')
    })
  })

  describe('rate limiting', () => {
    it('allows first publish', () => {
      expect(() => checkRateLimit()).not.toThrow()
    })

    it('blocks rapid publishes', () => {
      setLastPublish()
      expect(() => checkRateLimit()).toThrow('Esper\u00e1')
    })
  })

  describe('session management', () => {
    it('saves and retrieves session', async () => {
      await saveSession({ pubkey: 'abc123' })
      const session = await checkSession()
      expect(session).not.toBeNull()
      expect(session.pubkey).toBe('abc123')
    })

    it('clears session', async () => {
      await saveSession({ pubkey: 'abc123' })
      clearSession()
      expect(await checkSession()).toBeNull()
    })

    it('returns null for expired session', async () => {
      // Legacy plaintext format — checkSession handles migration
      localStorage.setItem('hash21-user', JSON.stringify({
        pubkey: 'abc',
        expiresAt: Date.now() - 1000
      }))
      expect(await checkSession()).toBeNull()
    })
  })
})
