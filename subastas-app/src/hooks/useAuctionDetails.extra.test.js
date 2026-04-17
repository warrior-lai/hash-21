import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatRelativeTime } from './useAuctionDetails'

describe('formatRelativeTime edge cases', () => {
  beforeEach(() => {
    // Fix Date.now to a known value for deterministic tests
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-17T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const now = Math.floor(new Date('2026-04-17T12:00:00Z').getTime() / 1000)

  it('returns "ahora" for current timestamp', () => {
    expect(formatRelativeTime(now)).toBe('ahora')
  })

  it('returns "ahora" for 59 seconds ago', () => {
    expect(formatRelativeTime(now - 59)).toBe('ahora')
  })

  it('returns "hace 1m" for exactly 60 seconds ago', () => {
    expect(formatRelativeTime(now - 60)).toBe('hace 1m')
  })

  it('returns "hace 59m" for 59 minutes ago', () => {
    expect(formatRelativeTime(now - 59 * 60)).toBe('hace 59m')
  })

  it('returns "hace 1h" for exactly 1 hour ago', () => {
    expect(formatRelativeTime(now - 3600)).toBe('hace 1h')
  })

  it('returns "hace 23h" for 23 hours ago', () => {
    expect(formatRelativeTime(now - 23 * 3600)).toBe('hace 23h')
  })

  it('returns "hace 1d" for exactly 24 hours ago', () => {
    expect(formatRelativeTime(now - 86400)).toBe('hace 1d')
  })

  it('returns "hace 6d" for 6 days ago', () => {
    expect(formatRelativeTime(now - 6 * 86400)).toBe('hace 6d')
  })

  it('returns formatted date for exactly 7 days ago', () => {
    const result = formatRelativeTime(now - 7 * 86400)
    // Should be a date string, not "hace Xd"
    expect(result).not.toContain('hace')
    expect(result).toMatch(/\d+/)
  })

  it('returns formatted date for 30 days ago', () => {
    const result = formatRelativeTime(now - 30 * 86400)
    expect(result).not.toContain('hace')
  })

  it('returns formatted date for 365 days ago', () => {
    const result = formatRelativeTime(now - 365 * 86400)
    expect(result).not.toContain('hace')
  })

  it('handles boundary between minutes and hours (3599s = 59m)', () => {
    expect(formatRelativeTime(now - 3599)).toBe('hace 59m')
  })

  it('handles boundary between hours and days (86399s = 23h)', () => {
    expect(formatRelativeTime(now - 86399)).toBe('hace 23h')
  })

  it('handles boundary between days and date (604799s = 6d)', () => {
    expect(formatRelativeTime(now - 604799)).toBe('hace 6d')
  })

  it('returns "ahora" for 1 second ago', () => {
    expect(formatRelativeTime(now - 1)).toBe('ahora')
  })

  it('returns formatted date string for old dates (contains day and month)', () => {
    // 2026-03-01 timestamp
    const march1 = Math.floor(new Date('2026-03-01T00:00:00Z').getTime() / 1000)
    const result = formatRelativeTime(march1)
    expect(result).toMatch(/1 mar/i)
  })
})
