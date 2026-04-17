// URL validation
export const validateImageUrl = (url) => {
  if (!url) return false
  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('URL debe ser http o https')
    }
    return true
  } catch {
    return false
  }
}

// File validation
export const validateFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Solo se aceptan imágenes JPG, PNG, GIF o WebP')
  }
  if (file.size > maxSize) {
    throw new Error('La imagen no puede superar 5MB')
  }
  return true
}

// Rate limiting
const COOLDOWN_MS = 60 * 1000 // 1 minuto

export const checkRateLimit = () => {
  const last = localStorage.getItem('hash21-last-publish')
  if (last && Date.now() - parseInt(last) < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - parseInt(last))) / 1000)
    throw new Error(`Esperá ${remaining} segundos antes de crear otra subasta`)
  }
}

export const setLastPublish = () => {
  localStorage.setItem('hash21-last-publish', Date.now().toString())
}

// --- Encrypted session management (AES-GCM via Web Crypto) ---

const SESSION_KEY = 'hash21-user'
const CRYPTO_KEY_NAME = 'hash21-ck'

// Derive a CryptoKey from a stable per-origin secret.
// We generate a random key on first use and store it in sessionStorage
// (not localStorage) so it's wiped when the tab closes — an XSS attacker
// that reads localStorage can't decrypt without the ephemeral key.
async function getCryptoKey() {
  let raw = sessionStorage.getItem(CRYPTO_KEY_NAME)
  if (!raw) {
    const buf = crypto.getRandomValues(new Uint8Array(32))
    raw = btoa(String.fromCharCode(...buf))
    sessionStorage.setItem(CRYPTO_KEY_NAME, raw)
  }
  const keyBytes = Uint8Array.from(atob(raw), c => c.charCodeAt(0))
  return crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', false, ['encrypt', 'decrypt'])
}

async function encryptData(plaintext) {
  const key = await getCryptoKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(plaintext)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  // Store as base64: iv + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(ciphertext), iv.length)
  return btoa(String.fromCharCode(...combined))
}

async function decryptData(stored) {
  try {
    const key = await getCryptoKey()
    const combined = Uint8Array.from(atob(stored), c => c.charCodeAt(0))
    const iv = combined.slice(0, 12)
    const ciphertext = combined.slice(12)
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
    return new TextDecoder().decode(decrypted)
  } catch {
    // Key mismatch (new tab) or tampered data — session invalid
    return null
  }
}

// Public API — async but callers already await in useEffect

export const checkSession = async () => {
  const stored = localStorage.getItem(SESSION_KEY)
  if (!stored) return null

  // Handle legacy plaintext sessions (migrate on next save)
  let data
  try {
    data = JSON.parse(stored)
  } catch {
    // Encrypted format
    const json = await decryptData(stored)
    if (!json) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    try { data = JSON.parse(json) } catch { return null }
  }

  if (data.expiresAt && Date.now() > data.expiresAt) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
  return data.pubkey ? data : null
}

export const saveSession = async (userData) => {
  const json = JSON.stringify({
    ...userData,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  })
  const encrypted = await encryptData(json)
  localStorage.setItem(SESSION_KEY, encrypted)
}

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(CRYPTO_KEY_NAME)
}
