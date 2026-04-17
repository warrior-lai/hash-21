import { describe, it, expect } from 'vitest'
import { sanitizeText, sanitizeUrl, sanitizeInvoice, sanitizeAuction, sanitizeProfile } from './sanitize'

describe('sanitize utils', () => {
  describe('sanitizeText', () => {
    it('strips HTML tags', () => {
      expect(sanitizeText('<script>alert("xss")</script>Hello')).toBe('alert("xss")Hello')
      expect(sanitizeText('<b>Bold</b> <i>Italic</i>')).toBe('Bold Italic')
      expect(sanitizeText('<img src=x onerror=alert(1)>')).toBe('')
    })

    it('strips control characters', () => {
      expect(sanitizeText('Hello\x00World')).toBe('HelloWorld')
      expect(sanitizeText('\x08test\x0B')).toBe('test')
    })

    it('respects maxLength', () => {
      expect(sanitizeText('abcdef', 3)).toBe('abc')
      expect(sanitizeText('short', 100)).toBe('short')
    })

    it('handles non-string input', () => {
      expect(sanitizeText(null)).toBe('')
      expect(sanitizeText(undefined)).toBe('')
      expect(sanitizeText(123)).toBe('')
    })

    it('trims whitespace', () => {
      expect(sanitizeText('  hello  ')).toBe('hello')
    })

    it('preserves normal text', () => {
      expect(sanitizeText('Acrílico sobre lienzo, 50x70cm')).toBe('Acrílico sobre lienzo, 50x70cm')
      expect(sanitizeText('Bitcoin ⚡ Lightning')).toBe('Bitcoin ⚡ Lightning')
    })
  })

  describe('sanitizeUrl', () => {
    it('allows http and https', () => {
      expect(sanitizeUrl('https://nostr.build/i/abc.jpg')).toBe('https://nostr.build/i/abc.jpg')
      expect(sanitizeUrl('http://example.com/img.png')).toBe('http://example.com/img.png')
    })

    it('blocks javascript: URIs', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('')
    })

    it('blocks data: URIs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('')
    })

    it('blocks other protocols', () => {
      expect(sanitizeUrl('ftp://evil.com/file')).toBe('')
      expect(sanitizeUrl('file:///etc/passwd')).toBe('')
    })

    it('handles empty/invalid input', () => {
      expect(sanitizeUrl('')).toBe('')
      expect(sanitizeUrl(null)).toBe('')
      expect(sanitizeUrl('not a url')).toBe('')
    })

    it('trims whitespace', () => {
      expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com/')
    })
  })

  describe('sanitizeInvoice', () => {
    it('accepts valid bolt11 invoices', () => {
      const invoice = 'lnbc100n1pjtest'
      expect(sanitizeInvoice(invoice)).toBe(invoice)
    })

    it('accepts testnet invoices', () => {
      expect(sanitizeInvoice('lntb100n1test')).toBe('lntb100n1test')
    })

    it('rejects invalid invoices', () => {
      expect(sanitizeInvoice('not-an-invoice')).toBe('')
      expect(sanitizeInvoice('')).toBe('')
      expect(sanitizeInvoice(null)).toBe('')
    })

    it('trims whitespace', () => {
      expect(sanitizeInvoice('  lnbc100n1test  ')).toBe('lnbc100n1test')
    })
  })

  describe('sanitizeAuction', () => {
    it('sanitizes all text fields', () => {
      const raw = {
        id: 'abc123',
        pubkey: 'def456',
        title: '<script>xss</script>My Art',
        description: '<img onerror=alert(1)>Nice piece',
        image: 'javascript:alert(1)',
        artist: '<b>Artist</b>',
        nip05: 'user@domain.com',
        lnaddr: 'user@getalby.com',
        startPrice: 100000,
        currentBid: 150000,
      }

      const clean = sanitizeAuction(raw)
      expect(clean.title).toBe('xssMy Art')
      expect(clean.description).toBe('Nice piece')
      expect(clean.image).toBe('') // javascript: blocked
      expect(clean.artist).toBe('Artist')
      expect(clean.nip05).toBe('user@domain.com')
      expect(clean.startPrice).toBe(100000) // numbers untouched
    })
  })

  describe('sanitizeProfile', () => {
    it('sanitizes profile fields', () => {
      const raw = {
        name: '<script>x</script>Lai',
        displayName: 'Abstract Lai',
        picture: 'https://nostr.build/avatar.jpg',
        banner: 'data:image/png;base64,evil',
        about: 'Artist & Bitcoin',
        nip05: 'lai@hash21.studio',
        lud16: 'lai@getalby.com',
      }

      const clean = sanitizeProfile(raw)
      expect(clean.name).toBe('xLai')
      expect(clean.displayName).toBe('Abstract Lai')
      expect(clean.picture).toBe('https://nostr.build/avatar.jpg')
      expect(clean.banner).toBe('') // data: blocked
      expect(clean.about).toBe('Artist & Bitcoin')
    })

    it('returns null for null input', () => {
      expect(sanitizeProfile(null)).toBeNull()
    })
  })
})
