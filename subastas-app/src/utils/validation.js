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

// Session management
export const checkSession = () => {
  const data = JSON.parse(localStorage.getItem('hash21-user') || '{}')
  if (data.expiresAt && Date.now() > data.expiresAt) {
    localStorage.removeItem('hash21-user')
    return null
  }
  return data.pubkey ? data : null
}

export const saveSession = (userData) => {
  localStorage.setItem('hash21-user', JSON.stringify({
    ...userData,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }))
}

export const clearSession = () => {
  localStorage.removeItem('hash21-user')
}
