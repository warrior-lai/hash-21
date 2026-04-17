import { useState, useRef } from 'react'
import { validateImageUrl, validateFile, checkRateLimit, setLastPublish } from '../utils/validation'
import './Modal.css'

const DURATIONS = [
  { value: 3600, label: '1 hora' },
  { value: 21600, label: '6 horas' },
  { value: 43200, label: '12 horas' },
  { value: 86400, label: '1 día' },
  { value: 259200, label: '3 días' },
  { value: 604800, label: '7 días' }
]

export function CreateAuctionModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    artistName: '',
    nip05: '',
    lightningAddress: '',
    startPrice: '10000',
    reservePrice: '',
    duration: 86400
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file) => {
    try {
      validateFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target.result)
        setForm({ ...form, image: e.target.result })
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('Ingresá un título')
      return
    }
    if (!form.image.trim()) {
      setError('Ingresá URL de la imagen')
      return
    }
    // Validate URL if it's not a data URL (uploaded file)
    if (!form.image.startsWith('data:') && !validateImageUrl(form.image)) {
      setError('URL inválida. Debe ser http:// o https://')
      return
    }
    if (!form.startPrice || parseInt(form.startPrice) < 1000) {
      setError('El precio mínimo es 1000 sats')
      return
    }
    if (parseInt(form.startPrice) > 999999999) {
      setError('El precio máximo es 999,999,999 sats')
      return
    }

    // Rate limiting
    try {
      checkRateLimit()
    } catch (err) {
      setError(err.message)
      return
    }

    // Check if extension available
    if (typeof window.nostr === 'undefined') {
      setError('Necesitás una extensión Nostr (Alby). Instalá desde getalby.com')
      return
    }

    setLoading(true)
    try {
      await onCreate({
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        artistName: form.artistName.trim(),
        nip05: form.nip05.trim(),
        lightningAddress: form.lightningAddress.trim(),
        startPrice: parseInt(form.startPrice),
        reservePrice: form.reservePrice ? parseInt(form.reservePrice) : 0,
        duration: form.duration
      })
      setLastPublish()
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Crear Subasta</h2>
        <p className="modal-subtitle">Publicá tu obra en 1 minuto</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Nombre de la obra"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label>Imagen de la obra</label>
            <div 
              className={`upload-area ${dragActive ? 'drag-active' : ''} ${previewUrl ? 'has-preview' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="upload-preview" />
              ) : (
                <>
                  <span className="upload-icon">↑</span>
                  <span className="upload-text">Click o arrastrá una imagen</span>
                  <span className="upload-hint">PNG, JPG hasta 5MB</span>
                </>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button 
              type="button" 
              className="url-toggle"
              onClick={() => setShowUrlInput(!showUrlInput)}
            >
              o pegá una URL
            </button>
            {showUrlInput && (
              <input
                type="url"
                value={form.image}
                onChange={e => {
                  setForm({ ...form, image: e.target.value })
                  setPreviewUrl(e.target.value)
                }}
                placeholder="https://nostr.build/..."
                maxLength={500}
                style={{ marginTop: '8px' }}
              />
            )}
          </div>

          <div className="form-group">
            <label>Descripción (opcional)</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Técnica, medidas, historia..."
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nombre del artista</label>
              <input
                type="text"
                value={form.artistName}
                onChange={e => setForm({ ...form, artistName: e.target.value })}
                placeholder="Abstract Lai"
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label>Lightning Address</label>
              <input
                type="text"
                value={form.lightningAddress}
                onChange={e => setForm({ ...form, lightningAddress: e.target.value })}
                placeholder="artista@getalby.com"
                maxLength={100}
              />
            </div>
          </div>

          <div className="form-group">
            <label>NIP-05 (verificación)</label>
            <input
              type="text"
              value={form.nip05}
              onChange={e => setForm({ ...form, nip05: e.target.value })}
              placeholder="nombre@dominio.com"
              maxLength={100}
            />
            <span className="field-hint">Si tenés NIP-05 verificado, aparecerá el badge ✓</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio inicial (sats)</label>
              <input
                type="number"
                value={form.startPrice}
                onChange={e => setForm({ ...form, startPrice: e.target.value })}
                placeholder="10000"
                min={1000}
                max={999999999}
              />
            </div>
            <div className="form-group">
              <label>Reserva (opcional)</label>
              <input
                type="number"
                value={form.reservePrice}
                onChange={e => setForm({ ...form, reservePrice: e.target.value })}
                placeholder="Mínimo para venta"
                min={0}
                max={999999999}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Duración</label>
            <select
              value={form.duration}
              onChange={e => setForm({ ...form, duration: parseInt(e.target.value) })}
            >
              {DURATIONS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Firmando...' : 'Crear Subasta'}
          </button>

          <p className="form-note">Se firmará con tu clave Nostr</p>
        </form>
      </div>
    </div>
  )
}
