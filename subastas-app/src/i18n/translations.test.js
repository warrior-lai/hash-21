import { describe, it, expect } from 'vitest'
import { translations } from './translations'

describe('translations', () => {
  it('has ES and EN languages', () => {
    expect(translations).toHaveProperty('es')
    expect(translations).toHaveProperty('en')
  })

  it('ES and EN have same keys', () => {
    const esKeys = Object.keys(translations.es).sort()
    const enKeys = Object.keys(translations.en).sort()
    expect(esKeys).toEqual(enKeys)
  })

  it('no empty translations', () => {
    for (const lang of ['es', 'en']) {
      for (const [key, value] of Object.entries(translations[lang])) {
        expect(value, `${lang}.${key} should not be empty`).not.toBe('')
      }
    }
  })

  it('has required keys', () => {
    const requiredKeys = [
      'header.gallery',
      'header.create',
      'hero.title',
      'auctions.title',
      'cta.title'
    ]
    
    for (const key of requiredKeys) {
      expect(translations.es).toHaveProperty(key)
      expect(translations.en).toHaveProperty(key)
    }
  })
})
