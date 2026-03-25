import { describe, it, expect, beforeAll } from 'vitest'

const API = 'https://hash21-backend.vercel.app/api'

describe('Works API', () => {
  let works = []

  beforeAll(async () => {
    const res = await fetch(`${API}/works`)
    works = await res.json()
  })

  it('should return array of works', () => {
    expect(Array.isArray(works)).toBe(true)
  })

  it('should have required fields', () => {
    if (works.length > 0) {
      const work = works[0]
      expect(work).toHaveProperty('id')
      expect(work).toHaveProperty('title_es')
      expect(work).toHaveProperty('image_url')
      expect(work).toHaveProperty('status')
    }
  })

  it('should include artist relation', () => {
    const withArtist = works.filter(w => w.artists)
    expect(withArtist.length).toBeGreaterThan(0)
  })

  it('certified works should have block number', () => {
    const certified = works.filter(w => w.certificate_status === 'certified')
    certified.forEach(work => {
      expect(work.certificate_block).toBeDefined()
      expect(typeof work.certificate_block).toBe('number')
    })
  })
})
