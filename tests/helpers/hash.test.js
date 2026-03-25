import { describe, it, expect } from 'vitest'

// SHA-256 hash function (browser-compatible simulation)
async function sha256(data) {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

describe('SHA-256 Hashing', () => {
  it('should generate 64-character hex string', async () => {
    const hash = await sha256('test')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[a-f0-9]+$/)
  })

  it('should be deterministic', async () => {
    const hash1 = await sha256('hello world')
    const hash2 = await sha256('hello world')
    expect(hash1).toBe(hash2)
  })

  it('should produce different hashes for different inputs', async () => {
    const hash1 = await sha256('input1')
    const hash2 = await sha256('input2')
    expect(hash1).not.toBe(hash2)
  })

  it('should match known hash', async () => {
    // SHA-256 of "test"
    const hash = await sha256('test')
    expect(hash).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
  })
})
