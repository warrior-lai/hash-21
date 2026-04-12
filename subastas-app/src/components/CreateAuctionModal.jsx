import { useState } from 'react'
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
    startPrice: '',
    reservePrice: '',
    duration: 86400
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    if (!form.startPrice || parseInt(form.startPrice) < 1000) {
      setError('El precio mínimo es 1000 sats')
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
        startPrice: parseInt(form.startPrice),
        reservePrice: form.reservePrice ? parseInt(form.reservePrice) : 0,
        duration: form.duration
      })
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
            />
          </div>

          <div className="form-group">
            <label>Imagen (URL)</label>
            <input
              type="url"
              value={form.image}
              onChange={e => setForm({ ...form, image: e.target.value })}
              placeholder="https://nostr.build/..."
            />
            {form.image && (
              <img 
                src={form.image} 
                alt="Preview" 
                className="image-preview"
                onError={e => e.target.style.display = 'none'}
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
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio inicial (sats)</label>
              <input
                type="number"
                value={form.startPrice}
                onChange={e => setForm({ ...form, startPrice: e.target.value })}
                placeholder="10000"
                min="1000"
              />
            </div>
            <div className="form-group">
              <label>Reserva (opcional)</label>
              <input
                type="number"
                value={form.reservePrice}
                onChange={e => setForm({ ...form, reservePrice: e.target.value })}
                placeholder="Mínimo para venta"
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
