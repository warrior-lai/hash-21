// Vercel serverless function — proxies image upload to nostr.build
// This avoids CORS issues when uploading from the browser

export const config = {
  api: {
    bodyParser: false, // we handle raw body
  },
  maxDuration: 30,
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://subastas.hash21.studio')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Read raw body
    const chunks = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const body = Buffer.concat(chunks)

    if (body.length > 10 * 1024 * 1024) {
      return res.status(413).json({ error: 'File too large (max 10MB)' })
    }

    // Detect content type from the request
    const contentType = req.headers['content-type'] || 'image/jpeg'

    // Build multipart form for nostr.build
    const boundary = '----Hash21Upload' + Date.now()
    const filename = 'artwork.' + (contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg')

    const multipartBody = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
        `Content-Type: ${contentType}\r\n\r\n`
      ),
      body,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ])

    // Upload to nostr.build
    const response = await fetch('https://nostr.build/api/v2/upload/files', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: multipartBody,
    })

    const data = await response.json()

    if (data?.status === 'success' && data?.data?.[0]?.url) {
      return res.status(200).json({ url: data.data[0].url })
    }

    // Fallback: void.cat
    const voidRes = await fetch('https://void.cat/upload', {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body,
    })

    if (voidRes.ok) {
      const voidData = await voidRes.json()
      if (voidData?.file?.url) {
        return res.status(200).json({ url: voidData.file.url })
      }
    }

    return res.status(502).json({ error: 'No se pudo subir la imagen a ningún servicio' })

  } catch (e) {
    console.error('[Upload API]', e)
    return res.status(500).json({ error: 'Error interno al subir imagen' })
  }
}
