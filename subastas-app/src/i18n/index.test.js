import { describe, it, expect } from 'vitest'
import { LangProvider, useLang, translations } from './index'

describe('i18n index exports', () => {
  it('exports LangProvider', () => {
    expect(LangProvider).toBeDefined()
    expect(typeof LangProvider).toBe('function')
  })

  it('exports useLang', () => {
    expect(useLang).toBeDefined()
    expect(typeof useLang).toBe('function')
  })

  it('exports translations object', () => {
    expect(translations).toBeDefined()
    expect(translations).toHaveProperty('es')
    expect(translations).toHaveProperty('en')
  })
})
