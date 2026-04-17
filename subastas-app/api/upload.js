// Vercel serverless proxy — uploads image to freeimage.host
// Needed because image hosts don't support browser CORS

import { Blob, FormData } from 'node:buffer'

export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    // With bodyParser enabled, req.body is a Buffer for binary content-types
    const body = req.body
    if (!body || !body.length) {
      return res.status(400).json({ error: 'No file received' })
    }

    const contentType = req.headers['content-type'] || 'image/jpeg'

    // --- freeimage.host (free, no auth, proven working) ---
    try {
      const blob = new Blob([body], { type: contentType })
      const fd = new FormData()
      fd.append('source', blob, 'artwork.jpg')
      fd.append('type', 'file')
      fd.append('action', 'upload')

      const r = await fetch('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', {
        method: 'POST',
        body: fd
      })

      if (r.ok) {
        const data = await r.json()
        if (data?.image?.url) {
          return res.status(200).json({ url: data.image.url })
        }
      }
      const text = await r.text()
      console.warn('[Upload] freeimage.host:', r.status, text.slice(0, 200))
    } catch (e) {
      console.warn('[Upload] freeimage.host error:', e.message)
    }

    // --- nostr.build (requires NIP-98 but try anyway for future compat) ---
    try {
      const blob = new Blob([body], { type: contentType })
      const fd = new FormData()
      fd.append('file', blob, 'artwork.jpg')

      const r = await fetch('https://nostr.build/api/v2/upload/files', {
        method: 'POST',
        body: fd
      })

      if (r.ok) {
        const data = await r.json()
        if (data?.status === 'success' && data?.data?.[0]?.url) {
          return res.status(200).json({ url: data.data[0].url })
        }
      }
    } catch (e) {
      console.warn('[Upload] nostr.build error:', e.message)
    }

    return res.status(502).json({ error: 'No se pudo subir la imagen' })
  } catch (e) {
    console.error('[Upload] Fatal:', e)
    return res.status(500).json({ error: e.message })
  }
}
