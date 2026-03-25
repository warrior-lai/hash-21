import { describe, it, expect } from 'vitest'

// Certification helpers
function isValidCertificateHash(hash) {
  return typeof hash === 'string' && /^[a-f0-9]{64}$/.test(hash)
}

function getCertificateStatus(work) {
  if (!work.certificate_hash) return 'none'
  if (work.certificate_block) return 'certified'
  return 'pending'
}

function getMempoolUrl(block) {
  return `https://mempool.space/block/${block}`
}

function getVerifyUrl(hash) {
  return `https://hash21.studio/verify?hash=${hash}`
}

describe('Certificate Hash Validation', () => {
  it('should accept valid SHA-256 hash', () => {
    expect(isValidCertificateHash('de7c5e1b744c9339d4aeef4703ca17f10e9991913fab8b83f0cb4279547be44d')).toBe(true)
  })

  it('should reject invalid hashes', () => {
    expect(isValidCertificateHash('tooshort')).toBe(false)
    expect(isValidCertificateHash('')).toBe(false)
    expect(isValidCertificateHash(null)).toBe(false)
    expect(isValidCertificateHash(123)).toBe(false)
    expect(isValidCertificateHash('UPPERCASE0000000000000000000000000000000000000000000000000000000')).toBe(false)
  })
})

describe('Certificate Status', () => {
  it('should return none for uncertified work', () => {
    expect(getCertificateStatus({})).toBe('none')
    expect(getCertificateStatus({ title: 'Test' })).toBe('none')
  })

  it('should return pending for submitted but unconfirmed', () => {
    expect(getCertificateStatus({ certificate_hash: 'abc123' })).toBe('pending')
  })

  it('should return certified when block exists', () => {
    expect(getCertificateStatus({ 
      certificate_hash: 'abc123', 
      certificate_block: 936387 
    })).toBe('certified')
  })
})

describe('URL Generation', () => {
  it('should generate mempool URL', () => {
    expect(getMempoolUrl(936387)).toBe('https://mempool.space/block/936387')
  })

  it('should generate verify URL', () => {
    const url = getVerifyUrl('abc123')
    expect(url).toBe('https://hash21.studio/verify?hash=abc123')
  })
})
