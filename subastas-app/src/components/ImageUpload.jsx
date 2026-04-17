import { useState, useRef, useCallback, useEffect } from 'react'
import './ImageUpload.css'

const UPLOAD_STATES = {
  IDLE: 'idle',
  PREVIEWING: 'previewing',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error'
}

export function ImageUpload({ onImageReady }) {
  const [state, setState] = useState(UPLOAD_STATES.IDLE)
  const [preview, setPreview] = useState('')
  const [hostedUrl, setHostedUrl] = useState('')
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef(null)
  const abortRef = useRef(null)
  const lastFileRef = useRef(null)

  // Notify parent when we have a valid URL
  useEffect(() => {
    onImageReady(hostedUrl)
  }, [hostedUrl, onImageReady])

  // Upload to nostr.build with NIP-98 auth (signed by user's extension)
  // Falls back to upload without auth, then to proxy
  const uploadFile = useCallback(async (file) => {
    setState(UPLOAD_STATES.UPLOADING)
    setError('')

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const uploadUrl = 'https://nostr.build/api/v2/upload/files'

    try {
      const fd = new FormData()
      fd.append('file', file, file.name || 'artwork.jpg')

      const headers = {}

      // Try NIP-98 auth if Nostr extension available
      if (typeof window.nostr !== 'undefined') {
        try {
          const authEvent = {
            kind: 27235,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
              ['u', uploadUrl],
              ['method', 'POST']
            ],
            content: ''
          }
          const signed = await window.nostr.signEvent(authEvent)
          if (signed?.sig) {
            headers['Authorization'] = 'Nostr ' + btoa(JSON.stringify(signed))
          }
        } catch (e) {
          console.warn('[Upload] NIP-98 sign failed, trying without auth:', e.message)
        }
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers,
        body: fd,
        signal: controller.signal
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData?.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      if (data?.status === 'success' && data?.data?.[0]?.url) {
        setHostedUrl(data.data[0].url)
        setState(UPLOAD_STATES.SUCCESS)
        return
      }
      throw new Error('No URL in response')

    } catch (e) {
      if (e.name === 'AbortError') return
      console.error('[Upload] Error:', e)
      setError('No se pudo subir. Conectá tu Nostr o peg\u00e1 una URL.')
      setState(UPLOAD_STATES.ERROR)
    }
  }, [])

  // Process a selected/dropped file
  const processFile = useCallback((file) => {
    // Validate
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowed.includes(file.type)) {
      setError('Solo JPG, PNG, GIF o WebP')
      setState(UPLOAD_STATES.ERROR)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Máximo 5MB')
      setState(UPLOAD_STATES.ERROR)
      return
    }

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      setState(UPLOAD_STATES.PREVIEWING)
    }
    reader.readAsDataURL(file)

    // Save file ref for retry and start upload
    lastFileRef.current = file
    uploadFile(file)
  }, [uploadFile])

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  // Clipboard paste (anywhere on the component)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          processFile(item.getAsFile())
          return
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [processFile])

  // URL input handler
  const handleUrlSubmit = () => {
    const url = urlInput.trim()
    if (!url) return
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setError('URL debe ser http o https')
        return
      }
      setPreview(url)
      setHostedUrl(url)
      setState(UPLOAD_STATES.SUCCESS)
    } catch {
      setError('URL inválida')
    }
  }

  // Reset everything
  const reset = () => {
    if (abortRef.current) abortRef.current.abort()
    setState(UPLOAD_STATES.IDLE)
    setPreview('')
    setHostedUrl('')
    setError('')
    setUrlInput('')
    setShowUrlInput(false)
    onImageReady('')
  }

  // Retry upload with the saved file
  const retry = () => {
    if (!lastFileRef.current) return
    uploadFile(lastFileRef.current)
  }

  // IDLE state
  if (state === UPLOAD_STATES.IDLE && !showUrlInput) {
    return (
      <div className="img-upload">
        <div
          className={`img-upload-dropzone ${dragActive ? 'drag-active' : ''}`}
          aria-label="Arrastrá una imagen o hacé click para subir"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="img-upload-icon">📷</div>
          <div className="img-upload-text">Arrastrá una imagen o hacé click</div>
          <div className="img-upload-hint">JPG, PNG, WebP · Máx 5MB · También podés pegar (Ctrl+V)</div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={e => e.target.files?.[0] && processFile(e.target.files[0])}
            accept="image/jpeg,image/png,image/gif,image/webp"
            style={{ display: 'none' }}
          />
        </div>
        <button type="button" className="img-upload-url-toggle" onClick={() => setShowUrlInput(true)}>
          o pegá una URL
        </button>
      </div>
    )
  }

  // URL input mode
  if (state === UPLOAD_STATES.IDLE && showUrlInput) {
    return (
      <div className="img-upload">
        <div className="img-upload-url-form">
          <input
            type="url"
            value={urlInput}
            onChange={e => { setUrlInput(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
            placeholder="https://nostr.build/i/..."
            autoFocus
          />
          <button type="button" onClick={handleUrlSubmit}>OK</button>
        </div>
        {error && <div className="img-upload-error">{error}</div>}
        <button type="button" className="img-upload-url-toggle" onClick={() => { setShowUrlInput(false); setError('') }}>
          ← subir archivo
        </button>
      </div>
    )
  }

  // Has preview (uploading, success, or error)
  return (
    <div className="img-upload">
      <div className="img-upload-preview-container">
        <img src={preview} alt="Preview" className="img-upload-preview" />

        {/* Uploading overlay */}
        {state === UPLOAD_STATES.UPLOADING && (
          <div className="img-upload-overlay">
            <div className="img-upload-spinner" />
            <span>Subiendo...</span>
          </div>
        )}

        {/* Success badge */}
        {state === UPLOAD_STATES.SUCCESS && (
          <div className="img-upload-badge success">✓ Lista</div>
        )}

        {/* Error overlay */}
        {state === UPLOAD_STATES.ERROR && (
          <div className="img-upload-overlay error">
            <span className="img-upload-error-icon">⚠️</span>
            <span className="img-upload-error-text">{error}</span>
            <div className="img-upload-error-actions">
              <button type="button" onClick={retry}>Reintentar</button>
              <button type="button" onClick={() => setShowUrlInput(true)}>Pegar URL</button>
            </div>
          </div>
        )}

        {/* Remove button */}
        <button type="button" className="img-upload-remove" onClick={reset} aria-label="Eliminar imagen">×</button>
      </div>
    </div>
  )
}
