import { describe, it, expect } from 'vitest'

// Formatting helpers
function formatSats(sats) {
  if (sats >= 1000000) return (sats / 1000000).toFixed(2) + 'M'
  if (sats >= 1000) return (sats / 1000).toFixed(1) + 'k'
  return sats.toString()
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-AR')
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function truncate(str, max) {
  if (!str || str.length <= max) return str
  return str.substring(0, max - 3) + '...'
}

describe('Sats Formatting', () => {
  it('should format small amounts', () => {
    expect(formatSats(500)).toBe('500')
    expect(formatSats(999)).toBe('999')
  })

  it('should format thousands with k', () => {
    expect(formatSats(1000)).toBe('1.0k')
    expect(formatSats(5500)).toBe('5.5k')
    expect(formatSats(21000)).toBe('21.0k')
  })

  it('should format millions with M', () => {
    expect(formatSats(1000000)).toBe('1.00M')
    expect(formatSats(2100000)).toBe('2.10M')
  })
})

describe('Date Formatting', () => {
  it('should format ISO date to locale', () => {
    const formatted = formatDate('2026-03-25T12:00:00Z')
    expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
  })
})

describe('Slugify', () => {
  it('should create URL-safe slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('Café Ñoño')).toBe('cafe-nono')
    expect(slugify('  Spaces  ')).toBe('spaces')
  })

  it('should handle special characters', () => {
    expect(slugify('Art & Design!')).toBe('art-design')
    expect(slugify('100% Bitcoin')).toBe('100-bitcoin')
  })
})

describe('Truncate', () => {
  it('should truncate long strings', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...')
  })

  it('should not truncate short strings', () => {
    expect(truncate('Hi', 10)).toBe('Hi')
  })

  it('should handle null/undefined', () => {
    expect(truncate(null, 10)).toBe(null)
    expect(truncate(undefined, 10)).toBe(undefined)
  })
})
