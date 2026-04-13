import { describe, it, expect, vi } from 'vitest'
import { verifyNip05, isVerified } from './nip05'

describe('NIP-05 verification', () => {
  it('returns false for empty inputs', async () => {
    expect(await verifyNip05('', '')).toBe(false)
    expect(await verifyNip05(null, 'pubkey')).toBe(false)
    expect(await verifyNip05('name@domain.com', null)).toBe(false)
  })

  it('returns false for invalid nip05 format', async () => {
    expect(await verifyNip05('invalid', 'pubkey')).toBe(false)
    expect(await verifyNip05('nodomain', 'pubkey')).toBe(false)
  })

  it('parses nip05 correctly', async () => {
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        names: {
          'test': 'abc123pubkey'
        }
      })
    })

    const result = await verifyNip05('test@example.com', 'abc123pubkey')
    expect(result).toBe(true)

    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/.well-known/nostr.json?name=test',
      expect.any(Object)
    )
  })

  it('returns false when pubkey does not match', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        names: {
          'test': 'differentpubkey'
        }
      })
    })

    const result = await verifyNip05('test@example.com', 'mypubkey')
    expect(result).toBe(false)
  })

  it('caches verification results', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ names: { 'cached': 'pk123' } })
    })

    // First call
    await isVerified('cached@test.com', 'pk123')
    // Second call should use cache
    await isVerified('cached@test.com', 'pk123')

    // Should only fetch once
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
