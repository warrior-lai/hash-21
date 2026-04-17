import { describe, it, expect } from 'vitest'
import { translations } from './translations'

describe('i18n system', () => {
  const langs = Object.keys(translations)

  it('has ES and EN translations', () => {
    expect(langs).toContain('es')
    expect(langs).toContain('en')
  })

  it('all ES keys exist in EN', () => {
    const esKeys = Object.keys(translations.es)
    const enKeys = Object.keys(translations.en)
    for (const key of esKeys) {
      expect(enKeys, `Missing EN key: ${key}`).toContain(key)
    }
  })

  it('all EN keys exist in ES', () => {
    const esKeys = Object.keys(translations.es)
    const enKeys = Object.keys(translations.en)
    for (const key of enKeys) {
      expect(esKeys, `Missing ES key: ${key}`).toContain(key)
    }
  })

  it('no empty translation values', () => {
    for (const lang of langs) {
      for (const [key, value] of Object.entries(translations[lang])) {
        expect(value, `Empty value: ${lang}.${key}`).not.toBe('')
      }
    }
  })

  it('header keys exist in both languages', () => {
    const headerKeys = ['header.create', 'header.connect', 'header.connecting', 'header.relays', 'header.gallery']
    for (const key of headerKeys) {
      expect(translations.es[key], `Missing es.${key}`).toBeDefined()
      expect(translations.en[key], `Missing en.${key}`).toBeDefined()
    }
  })
})
