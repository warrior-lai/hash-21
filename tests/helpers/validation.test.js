import { describe, it, expect } from 'vitest'

// Validation helpers
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidLightningAddress(address) {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(address)
}

function isValidHash(hash) {
  return /^[a-f0-9]{64}$/.test(hash)
}

function sanitizeInput(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

describe('Email Validation', () => {
  it('should accept valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co')).toBe(true)
  })

  it('should reject invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('no@domain')).toBe(false)
    expect(isValidEmail('@nodomain.com')).toBe(false)
  })
})

describe('Lightning Address Validation', () => {
  it('should accept valid lightning addresses', () => {
    expect(isValidLightningAddress('user@walletofsatoshi.com')).toBe(true)
    expect(isValidLightningAddress('artist@getalby.com')).toBe(true)
  })

  it('should reject invalid addresses', () => {
    expect(isValidLightningAddress('invalid')).toBe(false)
    expect(isValidLightningAddress('')).toBe(false)
  })
})

describe('Hash Validation', () => {
  it('should accept valid SHA-256 hash', () => {
    expect(isValidHash('de7c5e1b744c9339d4aeef4703ca17f10e9991913fab8b83f0cb4279547be44d')).toBe(true)
  })

  it('should reject invalid hashes', () => {
    expect(isValidHash('tooshort')).toBe(false)
    expect(isValidHash('GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')).toBe(false)
    expect(isValidHash('')).toBe(false)
  })
})

describe('XSS Sanitization', () => {
  it('should escape HTML special characters', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
  })

  it('should handle null/undefined', () => {
    expect(sanitizeInput(null)).toBe('')
    expect(sanitizeInput(undefined)).toBe('')
  })

  it('should preserve normal text', () => {
    expect(sanitizeInput('Hello World')).toBe('Hello World')
  })
})
