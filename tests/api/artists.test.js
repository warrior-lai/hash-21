import { describe, it, expect, beforeAll } from 'vitest'

const API = 'https://hash21-backend.vercel.app/api'

describe('Artists API', () => {
  let artists = []

  beforeAll(async () => {
    const res = await fetch(`${API}/artists`)
    artists = await res.json()
  })

  it('should return array of artists', () => {
    expect(Array.isArray(artists)).toBe(true)
  })

  it('should have required fields', () => {
    if (artists.length > 0) {
      const artist = artists[0]
      expect(artist).toHaveProperty('id')
      expect(artist).toHaveProperty('name')
      expect(artist).toHaveProperty('slug')
    }
  })

  it('should have lightning_address for active artists', () => {
    const active = artists.filter(a => a.status === 'active')
    active.forEach(artist => {
      expect(artist.lightning_address).toBeDefined()
    })
  })
})
