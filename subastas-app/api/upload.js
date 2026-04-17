// Vercel serverless function — proxies image upload to nostr.build
// Avoids CORS issues when uploading from the browser

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    // Vercel provides the body as a Buffer when we read from the stream
    const chunks = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const body = Buffer.concat(chunks)

    if (!body.length) {
      return res.status(400).json({ error: 'No se recibió archivo' })
    }

    if (body.length > 10 * 1024 * 1024) {
      return res.status(413).json({ error: 'Archivo muy grande (máx 10MB)' })
    }

    const contentType = req.headers['content-type'] || 'image/jpeg'
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : contentType.includes('gif') ? 'gif' : 'jpg'

    // --- Try nostr.build using native FormData (Node 18+) ---
    try {
      const blob = new Blob([body], { type: contentType })
      const fd = new FormData()
      fd.append('file', blob, `artwork.${ext}`)

      const r = await fetch('https://nostr.build/api/v2/upload/files', {
        method: 'POST',
        body: fd
      })

      if (r.ok) {
        const data = await r.json()
        const url = data?.status === 'success' && data?.data?.[0]?.url
        if (url) return res.status(200).json({ url })
      }
      console.warn('[Upload] nostr.build response:', r.status)
    } catch (e) {
      console.warn('[Upload] nostr.build error:', e.message)
    }

    // --- Fallback: void.cat ---
    try {
      const r2 = await fetch('https://void.cat/upload', {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body
      })

      if (r2.ok) {
        const data = await r2.json()
        if (data?.file?.url) return res.status(200).json({ url: data.file.url })
      }
      console.warn('[Upload] void.cat response:', r2.status)
    } catch (e) {
      console.warn('[Upload] void.cat error:', e.message)
    }

    // --- Fallback 2: nostrimg.com ---
    try {
      const blob = new Blob([body], { type: contentType })
      const fd = new FormData()
      fd.append('image', blob, `artwork.${ext}`)

      const r3 = await fetch('https://nostrimg.com/api/upload', {
        method: 'POST',
        body: fd
      })

      if (r3.ok) {
        const data = await r3.json()
        if (data?.data?.link) return res.status(200).json({ url: data.data.link })
      }
    } catch (e) {
      console.warn('[Upload] nostrimg error:', e.message)
    }

    return res.status(502).json({ error: 'No se pudo subir la imagen. Probá con una URL directa.' })

  } catch (e) {
    console.error('[Upload] Fatal:', e)
    return res.status(500).json({ error: 'Error interno: ' + e.message })
  }
}
