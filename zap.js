// Hash21 Zap System — NIP-57 with backend signing
// Sats go direct to artist's Wallet of Satoshi
// Backend signs zap requests, frontend listens for zap receipts on Nostr relays

const ZAP_API = 'https://hash21-backend.vercel.app/api/zap';

const ZAP_CHECK = ZAP_API.replace('/zap', '/check');

let currentZapTarget = {};
let selectedZapAmount = 0;
let zapLnurl = "";
let zapPollInterval = null;

// Zap counts stored in localStorage
function getZapCounts() {
  try { return JSON.parse(localStorage.getItem('h21_zaps') || '{}'); } catch(e) { return {}; }
}
function addZapCount(id, amount) {
  const counts = getZapCounts();
  if (!counts[id]) counts[id] = { total: 0, count: 0 };
  counts[id].total += amount;
  counts[id].count += 1;
  localStorage.setItem('h21_zaps', JSON.stringify(counts));
  updateZapDisplays();
}
function updateZapDisplays() {
  // First show localStorage counts (instant)
  const counts = getZapCounts();
  document.querySelectorAll('.zap-count').forEach(el => {
    const id = el.id.replace('zap-count-', '');
    if (counts[id] && counts[id].count > 0) {
      el.textContent = formatSatsShort(counts[id].total);
    }
  });
  // Then fetch real counts from Supabase (async update)
  fetchZapStats();
}

async function fetchZapStats() {
  try {
    const res = await fetch(ZAP_API.replace('/zap', '/log-zap'));
    const data = await res.json();
    if (!data.zaps) return;
    // Group by target_id
    const byTarget = {};
    data.zaps.forEach(z => {
      if (!byTarget[z.target_id]) byTarget[z.target_id] = { total: 0, count: 0 };
      byTarget[z.target_id].total += z.amount_sats;
      byTarget[z.target_id].count += 1;
    });
    document.querySelectorAll('.zap-count').forEach(el => {
      const id = el.id.replace('zap-count-', '');
      if (byTarget[id]) {
        el.textContent = formatSatsShort(byTarget[id].total);
      }
    });
  } catch(e) {}
}
function formatSatsShort(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return n.toString();
}

function openZap(id, name, type) {
  currentZapTarget = { id, name, type };
  document.getElementById('zapTargetName').textContent = name;
  document.getElementById('zapSelectPhase').style.display = 'block';
  document.getElementById('zapPayPhase').style.display = 'none';
  document.getElementById('zapSuccess').classList.remove('active');
  document.getElementById('zapModal').classList.add('active');
  document.getElementById('zapStatusText').textContent = '';
  document.body.style.overflow = 'hidden';
  document.querySelectorAll('.zap-amount-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('zapCustomAmount').value = '';
  selectedZapAmount = 0;
}

function closeZap() {
  document.getElementById('zapModal').classList.remove('active');
  document.body.style.overflow = '';
  if (zapPollInterval) { clearInterval(zapPollInterval); zapPollInterval = null; }
}

function selectZapAmount(amount) {
  selectedZapAmount = amount;
  document.querySelectorAll('.zap-amount-btn').forEach(b => b.classList.remove('selected'));
  event.target.classList.add('selected');
  document.getElementById('zapCustomAmount').value = '';
}

function onZapConfirmed(amount) {
  if (zapPollInterval) { clearInterval(zapPollInterval); zapPollInterval = null; }
  addZapCount(currentZapTarget.id, amount);
  
  // Log zap to Supabase
  fetch(ZAP_API.replace('/zap', '/log-zap'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      target_type: currentZapTarget.type || 'work',
      target_id: currentZapTarget.id,
      amount_sats: amount,
      message: document.getElementById('zapMessage') ? document.getElementById('zapMessage').value : ''
    })
  }).catch(() => {}); // fire and forget
  
  document.getElementById('zapSelectPhase').style.display = 'none';
  document.getElementById('zapPayPhase').style.display = 'none';
  document.getElementById('zapSuccess').classList.add('active');
  document.getElementById('zapStatusText').textContent = '';
  
  // Confetti effect
  zapConfetti();
  
  setTimeout(() => closeZap(), 5000);
}

// Poll backend for zap receipt confirmation
function pollZapReceipt(zapRequestId, recipientPubkey, since, amount) {
  const statusEl = document.getElementById('zapStatusText');
  const lang = document.documentElement.lang || 'es';
  statusEl.textContent = lang === 'en' ? 'Waiting for payment...' : 'Esperando pago...';
  statusEl.style.color = 'var(--gold)';
  
  let elapsed = 0;
  
  zapPollInterval = setInterval(async () => {
    elapsed += 3;
    
    // Animate dots
    const dots = '.'.repeat((elapsed % 9) / 3 + 1);
    statusEl.textContent = (lang === 'en' ? 'Waiting for payment' : 'Esperando pago') + dots;
    
    // Timeout after 5 min
    if (elapsed > 300) {
      clearInterval(zapPollInterval);
      zapPollInterval = null;
      statusEl.textContent = lang === 'en' ? 'Invoice expired. Try again.' : 'Invoice expirado. Intentá de nuevo.';
      statusEl.style.color = 'var(--text-dim)';
      return;
    }
    
    try {
      const res = await fetch(ZAP_CHECK + '?zapRequestId=' + zapRequestId + '&recipientPubkey=' + recipientPubkey + '&since=' + since);
      const data = await res.json();
      if (data.paid) {
        onZapConfirmed(amount);
      }
    } catch(e) {}
  }, 3000);
}

async function generateZapInvoice() {
  const custom = parseInt(document.getElementById('zapCustomAmount').value);
  const amount = custom > 0 ? custom : selectedZapAmount;
  if (!amount || amount < 1) {
    alert(document.documentElement.lang === 'en' ? 'Select an amount' : 'Seleccioná un monto');
    return;
  }
  selectedZapAmount = amount;
  const msg = document.getElementById('zapMessage').value || '';
  const lang = document.documentElement.lang || 'es';
  
  // Show loading state
  const payBtn = document.querySelector('#zapSelectPhase .zap-pay-btn');
  if (payBtn) {
    payBtn.disabled = true;
    payBtn.textContent = lang === 'en' ? 'Generating...' : 'Generando...';
  }
  
  try {
    // Call backend to sign zap request and get invoice
    const res = await fetch(ZAP_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target: currentZapTarget.id,
        amount: amount,
        message: msg
      })
    });
    const data = await res.json();
    
    if (!data.invoice) throw new Error(data.error || 'No invoice received');
    
    const invoice = data.invoice;
    zapLnurl = 'lightning:' + invoice;
    
    // WebLN: if browser has Lightning extension (Alby), pay with 1 click
    if (window.webln) {
      try {
        await window.webln.enable();
        document.getElementById('zapSelectPhase').style.display = 'none';
        document.getElementById('zapPayPhase').style.display = 'block';
        document.getElementById('zapStatusText').textContent = lang === 'en' ? 'Confirming in wallet...' : 'Confirmando en wallet...';
        document.getElementById('zapStatusText').style.color = 'var(--gold)';
        await window.webln.sendPayment(invoice);
        // Payment confirmed instantly via WebLN
        onZapConfirmed(amount);
        return;
      } catch(webLnErr) {
        // User rejected or WebLN failed — fall through to QR
        console.log('WebLN failed, falling back to QR:', webLnErr.message);
      }
    }
    
    // Standard flow: show QR + poll for payment
    document.getElementById('zapSelectPhase').style.display = 'none';
    document.getElementById('zapPayPhase').style.display = 'block';
    
    // Generate QR
    const qrContainer = document.getElementById('zapQR');
    qrContainer.innerHTML = '';
    QRCode.toCanvas(invoice, { width: 200, margin: 2, color: { dark: '#1a1a1a', light: '#fafaf8' } }, function(err, canvas) {
      if (!err) qrContainer.appendChild(canvas);
    });
    
    document.getElementById('zapInvoiceText').textContent = invoice;
    
    // Poll backend for zap receipt
    if (data.zapRequest && data.zapRequest.id) {
      const recipientTag = data.zapRequest.tags.find(t => t[0] === 'p');
      const recipientPubkey = recipientTag ? recipientTag[1] : '';
      const since = data.zapRequest.created_at - 5;
      pollZapReceipt(data.zapRequest.id, recipientPubkey, since, amount);
    } else {
      // Fallback: manual confirm
      const statusEl = document.getElementById('zapStatusText');
      statusEl.innerHTML = '<button onclick="onZapConfirmed(' + amount + ')" style="margin-top:10px;padding:8px 24px;background:var(--gold);color:var(--bg);border:none;cursor:pointer;font-family:Inter,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;">' + 
        (lang === 'en' ? '✓ I already paid' : '✓ Ya pagué') + '</button>';
    }
    
  } catch(e) {
    console.error('Zap error:', e);
    document.getElementById('zapSelectPhase').style.display = 'none';
    document.getElementById('zapPayPhase').style.display = 'block';
    document.getElementById('zapQR').innerHTML = '<p style="color:var(--gold);font-size:14px;">' + 
      (lang === 'en' ? 'Error generating invoice. Try again.' : 'Error generando invoice. Intentá de nuevo.') + '</p>';
  } finally {
    if (payBtn) {
      payBtn.disabled = false;
      payBtn.textContent = lang === 'en' ? '⚡ Generate Invoice' : '⚡ Generar Invoice';
    }
  }
}

function copyZapInvoice() {
  const text = document.getElementById('zapInvoiceText').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const el = document.getElementById('zapInvoiceText');
    const orig = el.textContent;
    el.textContent = document.documentElement.lang === 'en' ? '✅ Copied!' : '✅ Copiado!';
    setTimeout(() => el.textContent = orig, 1500);
  });
}

// Inject zap buttons into collection items
document.addEventListener('DOMContentLoaded', function() {
  const obras = [
    { img: 'obra4.jpg', id: 'the-rabbit', name: 'The Rabbit' },
    { img: 'obra3.jpg', id: 'the-hole', name: 'The Hole' },
    { img: 'obra1.jpg', id: 'libertad', name: 'Libertad' },
    { img: 'obra2.jpg', id: 'horizonte-temporal', name: 'Horizonte Temporal' },
    { img: 'roxy-paspartuz1.jpg', id: 'paspartuz-1', name: 'Paspartuz 1' },
    { img: 'roxy-paspartuz2.jpg', id: 'paspartuz-2', name: 'Paspartuz 2' },
  ];
  
  document.querySelectorAll('.collection-item').forEach(item => {
    const imgEl = item.querySelector('img');
    if (!imgEl) return;
    const src = imgEl.getAttribute('src') || '';
    const obra = obras.find(o => src.includes(o.img));
    const infoP = item.querySelector('.info p');
    const obraName = obra ? obra.name : (infoP ? infoP.textContent : 'obra');
    const obraId = obra ? obra.id : obraName.toLowerCase().replace(/ /g, '-');
    
    const info = item.querySelector('.info');
    if (info && !info.querySelector('.grid-zap')) {
      const gridZap = document.createElement('button');
      gridZap.className = 'grid-zap';
      gridZap.onclick = function(e) { e.stopPropagation(); openZap(obraId, obraName, 'obra'); };
      gridZap.innerHTML = '⚡ Zap';
      info.appendChild(gridZap);
    }
  });
  
  const obraTagData = {
    'roxy-paspartuz1.jpg': {artist:'Roxy', type_es:'Física', type_en:'Physical', status:'consult'},
    'roxy-paspartuz2.jpg': {artist:'Roxy', type_es:'Física', type_en:'Physical', status:'consult'},
    'obra4.jpg': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'consult'},
    'obra3.jpg': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'available'},
    'obra1.jpg': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'consult'},
    'obra2.jpg': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'available'},
  };
  document.querySelectorAll('.collection-item').forEach(item => {
    const imgEl = item.querySelector('img');
    if (!imgEl) return;
    const src = imgEl.getAttribute('src') || '';
    const key = Object.keys(obraTagData).find(k => src.includes(k));
    if (!key) return;
    const td = obraTagData[key];
    const info = item.querySelector('.info');
    if (!info) return;
  });

  const artistSocials = document.querySelector('.artist-card .artist-info div[style*="display:flex"]');
  if (artistSocials) {
    const zapLink = document.createElement('a');
    zapLink.href = 'javascript:void(0)';
    zapLink.onclick = function() { openZap('lai', 'Lai⚡️', 'artist'); };
    zapLink.title = 'Zap Artist';
    zapLink.style.cssText = 'font-size:11px;text-decoration:none;transition:all 0.3s;padding:4px 12px;border:1px solid rgba(176,141,87,0.3);color:var(--gold);letter-spacing:1px;display:inline-flex;align-items:center;gap:4px;margin-left:5px;';
    zapLink.innerHTML = '⚡ ZAP';
    zapLink.onmouseover = function() { this.style.background='var(--gold)'; this.style.color='var(--bg)'; };
    zapLink.onmouseout = function() { this.style.background='transparent'; this.style.color='var(--gold)'; };
    artistSocials.appendChild(zapLink);
  }
  
  updateZapDisplays();
});

// Confetti animation on zap confirmation
function zapConfetti() {
  const colors = ['#b08d57', '#d4af37', '#f0d78c', '#fff8e7', '#c9a84c'];
  const container = document.querySelector('.zap-modal') || document.body;
  const rect = container.getBoundingClientRect();
  
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position:fixed;
      width:${Math.random()*8+4}px;
      height:${Math.random()*8+4}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      left:${rect.left + rect.width/2 + (Math.random()-0.5)*200}px;
      top:${rect.top + rect.height/2}px;
      border-radius:${Math.random()>0.5?'50%':'0'};
      pointer-events:none;
      z-index:10000;
      opacity:1;
      transition:all ${1+Math.random()}s ease-out;
    `;
    document.body.appendChild(confetti);
    
    requestAnimationFrame(() => {
      confetti.style.transform = `translate(${(Math.random()-0.5)*300}px, ${-200-Math.random()*200}px) rotate(${Math.random()*720}deg)`;
      confetti.style.opacity = '0';
    });
    
    setTimeout(() => confetti.remove(), 2000);
  }
}
