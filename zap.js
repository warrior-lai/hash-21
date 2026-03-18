const LNBITS_URL = "https://demo.lnbits.com";

// Artist wallets — each artist receives zaps directly
const ARTIST_WALLETS = {
  'lai': {
    adminKey: 'e5c9ee0d6f52425f8d029e76ad134acd',
    invoiceKey: '50fe5632be8d4ec69e594f2b139f4c5c'
  },
  'roxy': {
    adminKey: '5e47c77f26534d04a9a6b190fc3c0fc8',
    invoiceKey: 'c237418e98bb48cca58eada9e1dedeac'
  },
  'martu': {
    adminKey: '5635b93960134994a60b2d6fbf117fc0',
    invoiceKey: '98a1a2b2ba314ec9886b3f04dbb3e64a'
  },
  'guadis': {
    adminKey: '55a9d43de0204d6ba38f5cb14b5b4c7b',
    invoiceKey: 'a42c502315d245f98baaa93c0ac9c484'
  }
};

// Map obra/target to artist
const TARGET_ARTIST = {
  'the-rabbit': 'lai',
  'the-hole': 'lai',
  'libertad': 'lai',
  'horizonte-temporal': 'lai',
  'paspartuz-1': 'roxy',
  'paspartuz-2': 'roxy',
  'lai': 'lai',
  'roxy': 'roxy',
  'martu': 'martu',
  'guadis': 'guadis'
};

function getArtistKeys(targetId) {
  const artist = TARGET_ARTIST[targetId] || 'lai';
  return ARTIST_WALLETS[artist] || ARTIST_WALLETS['lai'];
}

let currentZapTarget = {};
let selectedZapAmount = 1000;
let zapLnurl = "";
let zapPaymentHash = "";
let zapCheckInterval = null;

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
  const counts = getZapCounts();
  document.querySelectorAll('.zap-count').forEach(el => {
    const id = el.id.replace('zap-count-', '');
    if (counts[id] && counts[id].count > 0) {
      el.textContent = formatSatsShort(counts[id].total);
    }
  });
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
  if (zapCheckInterval) { clearInterval(zapCheckInterval); zapCheckInterval = null; }
}

function selectZapAmount(amount) {
  selectedZapAmount = amount;
  document.querySelectorAll('.zap-amount-btn').forEach(b => b.classList.remove('selected'));
  event.target.classList.add('selected');
  document.getElementById('zapCustomAmount').value = '';
}

// Poll LNbits for payment status
function pollPayment(paymentHash, amount, invoiceKey) {
  const statusEl = document.getElementById('zapStatusText');
  const lang = document.documentElement.lang || 'es';
  statusEl.textContent = lang === 'en' ? 'Waiting for payment...' : 'Esperando pago...';
  statusEl.style.color = 'var(--gold)';
  
  let elapsed = 0;
  zapCheckInterval = setInterval(async () => {
    elapsed += 2;
    try {
      const res = await fetch(LNBITS_URL + '/api/v1/payments/' + paymentHash, {
        headers: { 'X-Api-Key': invoiceKey }
      });
      const data = await res.json();
      if (data.paid === true) {
        clearInterval(zapCheckInterval);
        zapCheckInterval = null;
        onZapConfirmed(amount);
        return;
      }
    } catch(e) {}
    
    // Animate dots
    const dots = '.'.repeat((elapsed % 6) / 2 + 1);
    statusEl.textContent = (lang === 'en' ? 'Waiting for payment' : 'Esperando pago') + dots;
    
    // Timeout after 5 min
    if (elapsed > 300) {
      clearInterval(zapCheckInterval);
      zapCheckInterval = null;
      statusEl.textContent = lang === 'en' ? 'Invoice expired. Try again.' : 'Invoice expirado. Intentá de nuevo.';
      statusEl.style.color = 'var(--text-dim)';
    }
  }, 2000);
}

function onZapConfirmed(amount) {
  if (zapCheckInterval) { clearInterval(zapCheckInterval); zapCheckInterval = null; }
  
  // Update count
  addZapCount(currentZapTarget.id, amount);
  
  // Show success
  document.getElementById('zapSelectPhase').style.display = 'none';
  document.getElementById('zapPayPhase').style.display = 'none';
  document.getElementById('zapSuccess').classList.add('active');
  document.getElementById('zapStatusText').textContent = '';
  
  // Auto-close after 5 seconds
  setTimeout(() => closeZap(), 5000);
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
  const memo = '⚡ Zap: ' + currentZapTarget.name + (msg ? ' — ' + msg : '');
  
  try {
    // Get the correct artist wallet keys
    const keys = getArtistKeys(currentZapTarget.id);
    
    // Create invoice via LNbits (artist's wallet)
    const res = await fetch(LNBITS_URL + '/api/v1/payments', {
      method: 'POST',
      headers: { 'X-Api-Key': keys.adminKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ out: false, amount: amount, memo: memo })
    });
    const data = await res.json();
    
    if (!data.payment_request) throw new Error('No invoice received');
    
    const invoice = data.payment_request;
    zapPaymentHash = data.payment_hash;
    zapLnurl = 'lightning:' + invoice;
    
    document.getElementById('zapSelectPhase').style.display = 'none';
    document.getElementById('zapPayPhase').style.display = 'block';
    
    // Generate QR
    const qrContainer = document.getElementById('zapQR');
    qrContainer.innerHTML = '';
    QRCode.toCanvas(invoice, { width: 200, margin: 2, color: { dark: '#1a1a1a', light: '#fafaf8' } }, function(err, canvas) {
      if (!err) qrContainer.appendChild(canvas);
    });
    
    document.getElementById('zapInvoiceText').textContent = invoice;
    
    // Poll LNbits for payment confirmation (using artist's invoice key)
    pollPayment(zapPaymentHash, amount, keys.invoiceKey);
    
  } catch(e) {
    console.error('Zap error:', e);
    const lang = document.documentElement.lang || 'es';
    document.getElementById('zapSelectPhase').style.display = 'none';
    document.getElementById('zapPayPhase').style.display = 'block';
    document.getElementById('zapQR').innerHTML = '<p style="color:var(--gold);font-size:14px;">' + (lang === 'en' ? 'Error generating invoice. Try again.' : 'Error generando invoice. Intentá de nuevo.') + '</p>';
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
    // Extract name from info p tag as fallback
    const infoP = item.querySelector('.info p');
    const obraName = obra ? obra.name : (infoP ? infoP.textContent : 'obra');
    const obraId = obra ? obra.id : obraName.toLowerCase().replace(/ /g, '-');
    
    // Zap button in info area
    const info = item.querySelector('.info');
    if (info && !info.querySelector('.grid-zap')) {
      const gridZap = document.createElement('button');
      gridZap.className = 'grid-zap';
      gridZap.onclick = function(e) { e.stopPropagation(); openZap(obraId, obraName, 'obra'); };
      gridZap.innerHTML = '⚡ Zap';
      info.appendChild(gridZap);
    }
  });
  
  // Add tags to collection items
  const obraTagData = {
    'roxy-paspartuz1.jpg': {artist:'Roxy', type_es:'Física', type_en:'Physical', status:'consult'},
    'roxy-paspartuz2.jpg': {artist:'Roxy', type_es:'Física', type_en:'Physical', status:'consult'},
    'obra4.jpg': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'consult'},
    'obra3.jpg': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'available'},
    'obra1.jpg': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'consult'},
    'obra2.jpg': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'available'},
  };
  const cLang = document.documentElement.lang || 'es';
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

  // Add zap button to artist card
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
