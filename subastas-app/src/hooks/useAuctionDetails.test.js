import { describe, it, expect } from 'vitest'
import { formatRelativeTime } from './useAuctionDetails'

describe('formatRelativeTime', () => {
  const now = Math.floor(Date.now() / 1000)

  it('shows "ahora" for recent timestamps', () => {
    expect(formatRelativeTime(now - 30)).toBe('ahora')
  })

  it('shows minutes for recent timestamps', () => {
    expect(formatRelativeTime(now - 120)).toBe('hace 2m')
    expect(formatRelativeTime(now - 3500)).toBe('hace 58m')
  })

  it('shows hours for older timestamps', () => {
    expect(formatRelativeTime(now - 7200)).toBe('hace 2h')
    expect(formatRelativeTime(now - 43200)).toBe('hace 12h')
  })

  it('shows days for even older timestamps', () => {
    expect(formatRelativeTime(now - 86400)).toBe('hace 1d')
    expect(formatRelativeTime(now - 259200)).toBe('hace 3d')
  })

  it('shows date for very old timestamps', () => {
    const oldTimestamp = now - (8 * 24 * 60 * 60) // 8 days ago
    const result = formatRelativeTime(oldTimestamp)
    // Should contain a month abbreviation
    expect(result).toMatch(/\d+ \w+/)
  })
})
