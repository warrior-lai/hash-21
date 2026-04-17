// Sanitize untrusted Nostr event data before rendering
// React escapes JSX text by default, but we add defense-in-depth
// for URLs, edge cases, and any future dangerouslySetInnerHTML usage.

// Strip HTML tags from text (defense-in-depth over React's escaping)
export function sanitizeText(str, maxLength = 1000) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/<[^>]*>/g, '')   // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // strip control chars
    .slice(0, maxLength)
    .trim()
}

// Validate and sanitize URLs — only allow http: and https:
export function sanitizeUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return ''
  try {
    const parsed = new URL(url.trim())
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href
    }
  } catch {
    // invalid URL
  }
  return ''
}

// Validate a Lightning/bolt11 invoice string
export function sanitizeInvoice(invoice) {
  if (typeof invoice !== 'string') return ''
  const clean = invoice.trim().toLowerCase()
  // bolt11 invoices start with 'lnbc' (mainnet) or 'lntb'/'lnbcrt' (test)
  if (/^ln(bc|tb|bcrt)[\da-z]+$/.test(clean)) {
    return invoice.trim()
  }
  return ''
}

// Sanitize an entire auction object parsed from a Nostr event
export function sanitizeAuction(raw) {
  return {
    ...raw,
    title: sanitizeText(raw.title, 200),
    description: sanitizeText(raw.description, 2000),
    image: sanitizeUrl(raw.image),
    artist: sanitizeText(raw.artist, 200),
    nip05: sanitizeText(raw.nip05, 200),
    lnaddr: sanitizeText(raw.lnaddr, 200),
  }
}

// Sanitize a profile object from Kind 0
export function sanitizeProfile(raw) {
  if (!raw) return null
  return {
    ...raw,
    name: sanitizeText(raw.name, 100),
    displayName: sanitizeText(raw.displayName, 100),
    picture: sanitizeUrl(raw.picture),
    banner: sanitizeUrl(raw.banner),
    about: sanitizeText(raw.about, 500),
    nip05: sanitizeText(raw.nip05, 200),
    lud16: sanitizeText(raw.lud16, 200),
  }
}
