import { useState, useEffect } from 'react'
import { useProfile } from '../utils/profile'
import { useNip05Verification } from '../utils/nip05'
import { useAuctionDetails, formatRelativeTime } from '../hooks/useAuctionDetails'
import { useZapPayment } from '../hooks/useZapPayment'
import './Modal.css'

function formatTimeLeft(endTime) {
  const now = Math.floor(Date.now() / 1000)
  const diff = endTime - now

  if (diff <= 0) return 'Finalizada'

  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  const mins = Math.floor((diff % 3600) / 60)
  const secs = diff % 60

  if (days > 0) return `${days}d ${hours}h ${mins}m`
  if (hours > 0) return `${hours}h ${mins}m ${secs}s`
  return `${mins}m ${secs}s`
}

export function AuctionDetailModal({ auction, onClose, onBid, user }) {
  const [bidAmount, setBidAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(auction.endTime))
  const [showPayment, setShowPayment] = useState(false)
  const [invoice, setInvoice] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('pending') // pending, paid, error
  
  const { profile } = useProfile(auction.pubkey)
  const nip05 = auction.nip05 || profile?.nip05 || ''
  const { verified } = useNip05Verification(nip05, auction.pubkey)
  const artistName = auction.artist || profile?.displayName || profile?.name || auction.pubkey?.slice(0, 8) + '...'
  const lightningAddress = auction.lnaddr || profile?.lud16 || ''
  
  const { bids, comments, loading: detailsLoading, postComment } = useAuctionDetails(auction.id)
  const [commentText, setCommentText] = useState('')
  const [postingComment, setPostingComment] = useState(false)
  const [activeTab, setActiveTab] = useState('bids') // 'bids' | 'comments'
  
  const zap = useZapPayment()

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(formatTimeLeft(auction.endTime))
    }, 1000)
    return () => clearInterval(interval)
  }, [auction.endTime])

  // Use highest bid from relay data, fallback to auction's stored currentBid
  const highestBid = bids.length > 0 ? bids[0].amount : auction.currentBid
  const minBid = highestBid + 1000
  const isEnded = auction.endTime <= Math.floor(Date.now() / 1000)

  const handleBid = async () => {
    setError('')
    const amount = parseInt(bidAmount)

    if (!amount || amount < minBid) {
      setError(`La puja mínima es ${minBid.toLocaleString()} sats`)
      return
    }

    setLoading(true)
    try {
      await onBid(auction.id, amount)
      setBidAmount('')
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }} role="dialog" aria-modal="true" aria-labelledby="auction-detail-title">
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="auction-detail">
          {auction.image && (
            <img 
              src={auction.image} 
              alt={auction.title}
              className="auction-detail-image"
            />
          )}

          <div>
            <h2 id="auction-detail-title" className="auction-detail-title">{auction.title}</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              {profile?.picture && (
                <img 
                  src={profile.picture} 
                  alt={artistName}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <div>
                <span style={{ fontSize: '13px', color: '#1a1a1a' }}>
                  {artistName}
                  {verified && (
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: '14px', 
                      height: '14px', 
                      background: '#9a7b4f', 
                      color: 'white', 
                      borderRadius: '50%', 
                      fontSize: '9px', 
                      marginLeft: '6px'
                    }}>✓</span>
                  )}
                </span>
                {nip05 && (
                  <span style={{ fontSize: '11px', color: '#8a8580', display: 'block' }}>{nip05}</span>
                )}
              </div>
            </div>
            
            {auction.description && (
              <p className="auction-detail-desc">{auction.description}</p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#8a8580', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Puja actual
                </div>
                <div style={{ fontSize: '20px', fontWeight: '500', color: '#9a7b4f' }}>
                  ⚡ {highestBid.toLocaleString()} sats
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#8a8580', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {isEnded ? 'Estado' : 'Finaliza en'}
                </div>
                <div style={{ fontSize: '16px' }}>
                  {timeLeft}
                </div>
              </div>
            </div>

            {!isEnded && user && (
              <>
                <div className="bid-form">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    placeholder={`Mínimo ${minBid.toLocaleString()} sats`}
                    min={minBid}
                  />
                  <button onClick={handleBid} disabled={loading}>
                    {loading ? '...' : 'Pujar'}
                  </button>
                </div>
                {error && <p className="form-error" style={{ marginTop: '12px' }}>{error}</p>}
              </>
            )}

            {!isEnded && !user && (
              <p style={{ color: '#8a8580', fontSize: '13px', textAlign: 'center' }}>
                Conectá tu Nostr para pujar
              </p>
            )}

            {isEnded && (
              <div style={{ background: '#f5f4f2', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                
                {/* Payment completed */}
                {zap.isPaid && (
                  <>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                    <p style={{ color: '#22c55e', fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                      ¡Pago recibido!
                    </p>
                    <p style={{ color: '#8a8580', fontSize: '13px' }}>
                      Gracias por tu compra. El artista ha sido notificado.
                    </p>
                  </>
                )}

                {/* Waiting for payment */}
                {zap.isWaiting && (
                  <>
                    <p style={{ color: '#1a1a1a', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>
                      ⚡ Esperando pago...
                    </p>
                    
                    {/* QR Code placeholder - would use qrcode lib */}
                    <div style={{ 
                      background: 'white', 
                      padding: '16px', 
                      borderRadius: '8px', 
                      marginBottom: '16px',
                      wordBreak: 'break-all',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      maxHeight: '80px',
                      overflow: 'auto'
                    }}>
                      {zap.invoice}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
                      <button
                        onClick={() => navigator.clipboard.writeText(zap.invoice)}
                        style={{
                          background: 'transparent',
                          color: '#9a7b4f',
                          border: '1px solid #9a7b4f',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        📋 Copiar
                      </button>
                      <button
                        onClick={() => window.open(`lightning:${zap.invoice}`, '_blank')}
                        style={{
                          background: '#9a7b4f',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ⚡ Abrir Wallet
                      </button>
                    </div>
                    
                    <p style={{ color: '#8a8580', fontSize: '11px' }}>
                      El pago se detectará automáticamente
                    </p>
                  </>
                )}

                {/* Initial state - show pay button */}
                {!zap.isPaid && !zap.isWaiting && (
                  <>
                    <p style={{ color: '#1a1a1a', fontSize: '14px', marginBottom: '12px', fontWeight: '500' }}>
                      🎯 Subasta finalizada
                    </p>
                    
                    {lightningAddress ? (
                      <>
                        <p style={{ color: '#8a8580', fontSize: '13px', marginBottom: '16px' }}>
                          Pagar al artista: <strong style={{ color: '#9a7b4f' }}>{lightningAddress}</strong>
                        </p>
                        <button
                          onClick={async () => {
                            try {
                              await zap.createZapInvoice({
                                lightningAddress,
                                amount: highestBid,
                                auctionId: auction.id,
                                auctionTitle: auction.title,
                                recipientPubkey: auction.pubkey
                              })
                            } catch (e) {
                              // Error already handled in hook
                            }
                          }}
                          disabled={zap.isLoading}
                          style={{
                            background: '#9a7b4f',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: zap.isLoading ? 'wait' : 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            opacity: zap.isLoading ? 0.7 : 1
                          }}
                        >
                          {zap.isLoading ? 'Generando...' : `⚡ Pagar ${highestBid.toLocaleString()} sats`}
                        </button>
                        
                        {zap.error && (
                          <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '12px' }}>
                            {zap.error}
                          </p>
                        )}
                      </>
                    ) : (
                      <p style={{ color: '#8a8580', fontSize: '13px' }}>
                        Contactá al artista para coordinar el pago
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Tabs: Bid History / Comments */}
            <div style={{ marginTop: '24px', borderTop: '1px solid #e5e0d8', paddingTop: '20px' }}>
              <div style={{ display: 'flex', gap: '0', marginBottom: '16px', borderBottom: '1px solid #e5e0d8' }}>
                <button
                  onClick={() => setActiveTab('bids')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'bids' ? '2px solid #9a7b4f' : '2px solid transparent',
                    color: activeTab === 'bids' ? '#9a7b4f' : '#8a8580',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  ↿ Historial de Pujas ({bids.length})
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'comments' ? '2px solid #9a7b4f' : '2px solid transparent',
                    color: activeTab === 'comments' ? '#9a7b4f' : '#8a8580',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  💬 Comentarios ({comments.length})
                </button>
              </div>

              {/* Bid History Tab */}
              {activeTab === 'bids' && (
                <div>
                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#f5f4f2', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#8a8580', textTransform: 'uppercase', marginBottom: '4px' }}>
                        ⚡ Puja más alta
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '500', color: '#9a7b4f' }}>
                        {highestBid.toLocaleString()} sats
                      </div>
                    </div>
                    <div style={{ background: '#f5f4f2', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#8a8580', textTransform: 'uppercase', marginBottom: '4px' }}>
                        👥 Participantes
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: '500' }}>
                        {new Set(bids.map(b => b.pubkey)).size}
                      </div>
                    </div>
                  </div>

                  {/* Bid list */}
                  {detailsLoading ? (
                    <p style={{ color: '#8a8580', fontSize: '13px', textAlign: 'center', padding: '20px' }}>Cargando...</p>
                  ) : bids.length === 0 ? (
                    <p style={{ color: '#8a8580', fontSize: '13px', textAlign: 'center', padding: '20px' }}>Aún no hay pujas</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                      {bids.map((bid, idx) => (
                        <div key={bid.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          background: idx === 0 ? 'rgba(154, 123, 79, 0.1)' : '#f5f4f2',
                          borderRadius: '8px',
                          border: idx === 0 ? '1px solid #9a7b4f' : 'none'
                        }}>
                          <span style={{ color: '#8a8580', fontSize: '12px', width: '24px' }}>#{idx + 1}</span>
                          {bid.profile?.picture ? (
                            <img src={bid.profile.picture} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e5e0d8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#8a8580' }}>
                              {(bid.profile?.name || bid.pubkey)?.[0]?.toUpperCase() || '?'}
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '500' }}>
                              {bid.profile?.displayName || bid.profile?.name || bid.pubkey.slice(0, 8) + '...'}
                            </div>
                            <div style={{ fontSize: '11px', color: '#8a8580' }}>
                              {formatRelativeTime(bid.createdAt)}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: '#9a7b4f' }}>
                              ⚡ {bid.amount.toLocaleString()}
                            </div>
                            {idx === 0 && (
                              <span style={{ fontSize: '10px', background: '#9a7b4f', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Líder</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === 'comments' && (
                <div>
                  {/* Add comment */}
                  {user && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          placeholder="Agregar comentario..."
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            border: '1px solid #e5e0d8',
                            borderRadius: '8px',
                            fontSize: '13px'
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && commentText.trim()) {
                              handlePostComment()
                            }
                          }}
                        />
                        <button
                          onClick={handlePostComment}
                          disabled={postingComment || !commentText.trim()}
                          style={{
                            padding: '10px 16px',
                            background: '#9a7b4f',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            opacity: postingComment || !commentText.trim() ? 0.5 : 1
                          }}
                        >
                          {postingComment ? '...' : 'Enviar'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Comment list */}
                  {detailsLoading ? (
                    <p style={{ color: '#8a8580', fontSize: '13px', textAlign: 'center', padding: '20px' }}>Cargando...</p>
                  ) : comments.length === 0 ? (
                    <p style={{ color: '#8a8580', fontSize: '13px', textAlign: 'center', padding: '20px' }}>Aún no hay comentarios</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                      {comments.map(comment => (
                        <div key={comment.id} style={{ display: 'flex', gap: '10px' }}>
                          {comment.profile?.picture ? (
                            <img src={comment.profile.picture} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e5e0d8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: '#8a8580' }}>
                              {(comment.profile?.name || comment.pubkey)?.[0]?.toUpperCase() || '?'}
                            </div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                              <span style={{ fontWeight: '500' }}>
                                {comment.profile?.displayName || comment.profile?.name || comment.pubkey.slice(0, 8) + '...'}
                              </span>
                              <span style={{ color: '#8a8580', marginLeft: '8px' }}>
                                {formatRelativeTime(comment.createdAt)}
                              </span>
                            </div>
                            <div style={{ fontSize: '13px', color: '#1a1a1a' }}>
                              {comment.content}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  async function handlePostComment() {
    if (!commentText.trim() || postingComment) return
    setPostingComment(true)
    try {
      await postComment(commentText)
      setCommentText('')
    } catch (e) {
      alert('Error: ' + e.message)
    } finally {
      setPostingComment(false)
    }
  }
}
