import { describe, it, expect } from 'vitest'
import { NostrBunker } from './nip46'

describe('NIP-46 Bunker', () => {
  describe('parseBunkerUri', () => {
    const bunker = new NostrBunker()

    it('parses a valid bunker URI', () => {
      const pk = 'a'.repeat(64)
      const uri = `nostr+bunker://${pk}?relay=wss://relay.test.com&secret=mysecret`
      const result = bunker.parseBunkerUri(uri)
      expect(result.remotePubkey).toBe(pk)
      expect(result.relay).toBe('wss://relay.test.com')
      expect(result.secret).toBe('mysecret')
    })

    it('uses default relay when not specified', () => {
      const pk = 'b'.repeat(64)
      const uri = `nostr+bunker://${pk}`
      const result = bunker.parseBunkerUri(uri)
      expect(result.remotePubkey).toBe(pk)
      expect(result.relay).toBe('wss://relay.nsec.app')
      expect(result.secret).toBe('')
    })

    it('throws on invalid prefix', () => {
      expect(() => bunker.parseBunkerUri('https://example.com')).toThrow('nostr+bunker')
    })

    it('throws on invalid pubkey length', () => {
      expect(() => bunker.parseBunkerUri('nostr+bunker://tooshort')).toThrow('Pubkey del bunker inválida')
    })

    it('throws on empty URI', () => {
      expect(() => bunker.parseBunkerUri('')).toThrow()
    })
  })

  describe('instance management', () => {
    it('starts disconnected', () => {
      const bunker = new NostrBunker()
      expect(bunker.socket).toBeNull()
      expect(bunker.userPubkey).toBeNull()
      expect(bunker.remotePubkey).toBeNull()
    })

    it('disconnect clears state', () => {
      const bunker = new NostrBunker()
      bunker.userPubkey = 'test'
      bunker.remotePubkey = 'test2'
      bunker.disconnect()
      expect(bunker.userPubkey).toBeNull()
      expect(bunker.remotePubkey).toBeNull()
      expect(bunker.clientSk).toBeNull()
    })
  })
})
