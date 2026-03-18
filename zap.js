// Hash21 Zap System — NIP-57 with backend signing
// Sats go direct to artist's Wallet of Satoshi
// Backend signs zap requests, frontend listens for zap receipts on Nostr relays

const ZAP_API = 'https://hash21-backend.vercel.app/api/zap';

const NOSTR_RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.nostr.band',
  'wss://nos.lol',
  'wss://relay.primal.net'
];

let currentZapTarget = {};
let selectedZapAmount = 0;
let zapLnurl = "";
let zapRelaySockets = [];

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
  closeRelays();
}

function closeRelays() {
  zapRelaySockets.forEach(ws => { try { ws.close(); } catch(e) {} });
  zapRelaySockets = [];
}

function selectZapAmount(amount) {
  selectedZapAmount = amount;
  document.querySelectorAll('.zap-amount-btn').forEach(b => b.classList.remove('selected'));
  event.target.classList.add('selected');
  document.getElementById('zapCustomAmount').value = '';
}

function onZapConfirmed(amount) {
  closeRelays();
  addZapCount(currentZapTarget.id, amount);
  document.getElementById('zapSelectPhase').style.display = 'none';
  document.getElementById('zapPayPhase').style.display = 'none';
  document.getElementById('zapSuccess').classList.add('active');
  document.getElementById('zapStatusText').textContent = '';
  setTimeout(() => closeZap(), 5000);
}

// Listen for zap receipt (kind 9735) on Nostr relays
function listenForZapReceipt(zapRequestId, zapRequestPubkey, recipientPubkey, amount) {
  const statusEl = document.getElementById('zapStatusText');
  const lang = document.documentElement.lang || 'es';
  statusEl.textContent = lang === 'en' ? 'Waiting for payment...' : 'Esperando pago...';
  statusEl.style.color = 'var(--gold)';
  
  let confirmed = false;
  let elapsed = 0;
  
  // Animate dots
  const dotInterval = setInterval(() => {
    if (confirmed) { clearInterval(dotInterval); return; }
    elapsed += 1;
    const dots = '.'.repeat((elapsed % 3) + 1);
    statusEl.textContent = (lang === 'en' ? 'Waiting for payment' : 'Esperando pago') + dots;
    
    // Timeout after 5 min
    if (elapsed > 300) {
      clearInterval(dotInterval);
      closeRelays();
      statusEl.textContent = lang === 'en' ? 'Invoice expired. Try again.' : 'Invoice expirado. Intentá de nuevo.';
      statusEl.style.color = 'var(--text-dim)';
    }
  }, 1000);
  
  // Connect to relays and subscribe for kind 9735
  NOSTR_RELAYS.forEach(relayUrl => {
    try {
      const ws = new WebSocket(relayUrl);
      zapRelaySockets.push(ws);
      
      ws.onopen = () => {
        // Subscribe to zap receipts for the recipient, since our zap request time
        const subId = 'zap_' + Math.random().toString(36).substr(2, 8);
        const sinceTime = Math.floor(Date.now() / 1000) - 10;
        ws.send(JSON.stringify([
          'REQ', subId,
          { kinds: [9735], '#p': [recipientPubkey], since: sinceTime, limit: 5 }
        ]));
      };
      
      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (data[0] === 'EVENT' && data[2] && data[2].kind === 9735 && !confirmed) {
            // Verify this receipt matches our zap request
            const descTag = data[2].tags.find(t => t[0] === 'description');
            if (descTag) {
              try {
                const zapReq = JSON.parse(descTag[1]);
                if (zapReq.id === zapRequestId || zapReq.pubkey === zapRequestPubkey) {
                  confirmed = true;
                  clearInterval(dotInterval);
                  onZapConfirmed(amount);
                }
              } catch(e) {}
            }
          }
        } catch(e) {}
      };
      
      ws.onerror = () => {};
    } catch(e) {}
  });
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
    
    document.getElementById('zapSelectPhase').style.display = 'none';
    document.getElementById('zapPayPhase').style.display = 'block';
    
    // Generate QR
    const qrContainer = document.getElementById('zapQR');
    qrContainer.innerHTML = '';
    QRCode.toCanvas(invoice, { width: 200, margin: 2, color: { dark: '#1a1a1a', light: '#fafaf8' } }, function(err, canvas) {
      if (!err) qrContainer.appendChild(canvas);
    });
    
    document.getElementById('zapInvoiceText').textContent = invoice;
    
    // Listen for zap receipt on Nostr relays
    if (data.zapRequest && data.zapRequest.id) {
      const recipientPubkey = data.zapRequest.tags.find(t => t[0] === 'p');
      listenForZapReceipt(data.zapRequest.id, data.zapRequest.pubkey, recipientPubkey ? recipientPubkey[1] : '', amount);
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
