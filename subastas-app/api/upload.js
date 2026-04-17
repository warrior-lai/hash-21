// Vercel serverless proxy — uploads image to freeimage.host

export const config = {
  api: { bodyParser: false }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body = await readBody(req)

    if (!body.length) {
      return res.status(400).json({ error: 'No file received' })
    }

    if (body.length > 6 * 1024 * 1024) {
      return res.status(413).json({ error: 'Max 5MB' })
    }

    const contentType = req.headers['content-type'] || 'image/jpeg'
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
    const filename = `artwork.${ext}`

    // Build multipart manually
    const boundary = '----Hash21' + Date.now()
    const parts = []

    parts.push(Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="source"; filename="${filename}"\r\n` +
      `Content-Type: ${contentType}\r\n\r\n`
    ))
    parts.push(body)
    parts.push(Buffer.from('\r\n'))

    parts.push(Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="type"\r\n\r\nfile\r\n`
    ))

    parts.push(Buffer.from(
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="action"\r\n\r\nupload\r\n`
    ))

    parts.push(Buffer.from(`--${boundary}--\r\n`))

    const multipartBody = Buffer.concat(parts)

    const r = await fetch('https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: multipartBody
    })

    const data = await r.json()

    if (data?.image?.url) {
      return res.status(200).json({ url: data.image.url })
    }

    console.error('[Upload] freeimage:', r.status, JSON.stringify(data).slice(0, 300))
    return res.status(502).json({ error: 'Upload failed: ' + (data?.error?.message || 'unknown') })

  } catch (e) {
    console.error('[Upload] Fatal:', e.message)
    return res.status(500).json({ error: e.message })
  }
}
