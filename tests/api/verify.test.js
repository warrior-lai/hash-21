import { describe, it, expect } from 'vitest'

const API = 'https://hash21-backend.vercel.app/api'

describe('Verify API', () => {
  const VALID_HASH = 'de7c5e1b744c9339d4aeef4703ca17f10e9991913fab8b83f0cb4279547be44d'
  const INVALID_HASH = '0000000000000000000000000000000000000000000000000000000000000000'

  it('should find certified work by hash', async () => {
    const res = await fetch(`${API}/verify?hash=${VALID_HASH}`)
    const data = await res.json()
    
    expect(data.found).toBe(true)
    expect(data.work).toBeDefined()
    expect(data.work.certificate_hash).toBe(VALID_HASH)
  })

  it('should return not found for invalid hash', async () => {
    const res = await fetch(`${API}/verify?hash=${INVALID_HASH}`)
    const data = await res.json()
    
    expect(data.found).toBe(false)
  })

  it('should return error for missing hash', async () => {
    const res = await fetch(`${API}/verify`)
    const data = await res.json()
    
    expect(data.error).toBeDefined()
  })
})
