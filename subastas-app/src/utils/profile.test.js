import { describe, it, expect } from 'vitest'
import { formatPubkey } from './profile'

describe('profile utils', () => {
  describe('formatPubkey', () => {
    it('formats a hex pubkey', () => {
      const pk = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
      expect(formatPubkey(pk)).toBe('abcdef12...7890')
    })

    it('returns empty for null/empty', () => {
      expect(formatPubkey('')).toBe('')
      expect(formatPubkey(null)).toBe('')
      expect(formatPubkey(undefined)).toBe('')
    })
  })
})
