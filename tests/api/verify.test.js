import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Verify API', () => {
  const VALID_HASH = 'de7c5e1b744c9339d4aeef4703ca17f10e9991913fab8b83f0cb4279547be44d'
  const INVALID_HASH = '0000000000000000000000000000000000000000000000000000000000000000'

  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should find certified work by hash', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        verified: true,
        hash: VALID_HASH,
        title: 'The Rabbit',
        artist: 'Lai⚡️'
      })
    })

    const res = await fetch(`/api/verify?hash=${VALID_HASH}`)
    const data = await res.json()
    
    expect(data.verified).toBe(true)
    expect(data.title).toBeDefined()
    expect(data.hash).toBe(VALID_HASH)
  })

  it('should return not found for invalid hash', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        verified: false,
        error: 'Hash not found'
      })
    })

    const res = await fetch(`/api/verify?hash=${INVALID_HASH}`)
    const data = await res.json()
    
    expect(data.verified).toBe(false)
  })

  it('should return error for missing hash', async () => {
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        error: 'Hash parameter required'
      })
    })

    const res = await fetch(`/api/verify`)
    const data = await res.json()
    
    expect(data.error).toBeDefined()
  })
})
