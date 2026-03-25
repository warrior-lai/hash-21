import { describe, it, expect, beforeAll } from 'vitest'

const API = 'https://hash21-backend.vercel.app/api'

describe('Products API', () => {
  let products = []

  beforeAll(async () => {
    const res = await fetch(`${API}/products`)
    products = await res.json()
  })

  it('should return array of products', () => {
    expect(Array.isArray(products)).toBe(true)
  })

  it('should have price in sats', () => {
    products.forEach(product => {
      if (product.price_sats) {
        expect(typeof product.price_sats).toBe('number')
        expect(product.price_sats).toBeGreaterThan(0)
      }
    })
  })
})
