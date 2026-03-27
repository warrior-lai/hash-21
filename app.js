// Gold dust particles — enhanced
const c = document.getElementById('dust');
const ctx = c.getContext('2d');
let particles = [];
function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);
// More particles, varied sizes, glow effect
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + 0.5,
    dx: (Math.random() - 0.5) * 0.4,
    dy: -Math.random() * 0.3 - 0.05,
    o: Math.random() * 0.6 + 0.15,
    pulse: Math.random() * Math.PI * 2, // phase offset
    pulseSpeed: 0.02 + Math.random() * 0.02
  });
}
function drawDust() {
  ctx.clearRect(0, 0, c.width, c.height);
  particles.forEach(p => {
    // Pulsing opacity
    p.pulse += p.pulseSpeed;
    const opacity = p.o * (0.7 + 0.3 * Math.sin(p.pulse));
    
    // Glow effect
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
    gradient.addColorStop(0, `rgba(212,175,55,${opacity})`);
    gradient.addColorStop(0.4, `rgba(176,141,87,${opacity * 0.5})`);
    gradient.addColorStop(1, `rgba(176,141,87,0)`);
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Core bright particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,223,128,${opacity})`;
    ctx.fill();
    
    p.x += p.dx;
    p.y += p.dy;
    if (p.y < -10) { p.y = c.height + 10; p.x = Math.random() * c.width; }
    if (p.x < -10 || p.x > c.width + 10) { p.x = Math.random() * c.width; }
  });
  requestAnimationFrame(drawDust);
}
drawDust();

// Lightbox Pro — gallery data for navigation
let lbWorks = [];
let lbIndex = 0;

function buildLightboxGallery() {
  lbWorks = [];
  document.querySelectorAll('.collection-item').forEach(item => {
    const onclick = item.getAttribute('onclick') || '';
    const match = onclick.match(/openLightbox\('([^']+)','([^']*)','([^']*)','([^']*)','([^']*)'(?:,(\d+|null))?\)/);
    if (match) {
      lbWorks.push({
        src: match[1],
        code: match[2],
        name: match[3],
        tech: match[4],
        status: match[5],
        block: match[6] === 'null' ? null : parseInt(match[6]) || null
      });
    }
  });
  // Remove duplicates by src
  const seen = new Set();
  lbWorks = lbWorks.filter(w => {
    if (seen.has(w.src)) return false;
    seen.add(w.src);
    return true;
  });
}

function navigateLightbox(dir) {
  if (!lbWorks.length) return;
  lbIndex = (lbIndex + dir + lbWorks.length) % lbWorks.length;
  const w = lbWorks[lbIndex];
  showLightboxWork(w);
}

function showLightboxWork(w) {
  const img = document.getElementById('lb-img');
  img.style.opacity = '0';
  img.style.transform = 'scale(0.95)';
  setTimeout(() => {
    img.src = w.src;
    populateLightbox(w.code, w.name, w.tech, w.status, w.block);
    img.style.opacity = '1';
    img.style.transform = 'scale(1)';
  }, 150);
}

function populateLightbox(code, name, tech, status, block) {
  document.getElementById('lb-code').textContent = code;
  document.getElementById('lb-name').textContent = name;
  document.getElementById('lb-tech').textContent = tech;
  var badge = document.getElementById('lb-badge');
  var lang = currentLang || 'es';
  if (status === 'available') {
    badge.textContent = lang === 'es' ? 'Disponible' : 'Available';
    badge.className = 'availability-badge badge-available';
  } else if (status === 'consult') {
    badge.textContent = lang === 'es' ? 'Consultar' : 'Inquire';
    badge.className = 'availability-badge badge-consult';
  } else {
    badge.textContent = '';
    badge.className = 'availability-badge';
  }
  // Tags
  var tagData = {
    'Paspartuz 1': {artist:'Roxy', type_es:'Física', type_en:'Physical', status:'consult'},
    'Paspartuz 2': {artist:'Roxy', type_es:'Física', type_en:'Physical', status:'consult'},
    'The Rabbit': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'consult'},
    'The Hole': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'available'},
    'Libertad': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'consult'},
    'Horizonte Temporal': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'available'}
  };
  var td = tagData[name] || {artist:'Lai⚡️', type_es:'Física', type_en:'Physical'};
  document.getElementById('lb-tags').innerHTML = '';
  // Zap button
  var obraMap = {'The Rabbit':'the-rabbit','The Hole':'the-hole','Libertad':'libertad','Horizonte Temporal':'horizonte-temporal','Paspartuz 1':'paspartuz-1','Paspartuz 2':'paspartuz-2'};
  var slug = obraMap[name] || name.toLowerCase().replace(/ /g,'-');
  var zapBtn = document.getElementById('lb-zap-btn');
  zapBtn.onclick = function(e) { e.stopPropagation(); openZap(slug, name, 'obra'); };
  var countEl = document.getElementById('lb-zap-count');
  var counts = getZapCounts();
  if (counts[slug] && counts[slug].count > 0) {
    countEl.textContent = formatSatsShort(counts[slug].total);
  } else {
    countEl.textContent = '';
  }
  // Block number
  var blockEl = document.getElementById('lb-block');
  if (block && blockEl) {
    blockEl.innerHTML = '<a href="https://mempool.space/block/' + block + '" target="_blank" style="color:var(--gold);text-decoration:none;font-size:13px;letter-spacing:1px;" onclick="event.stopPropagation();">⛓ Bloque #' + block + '</a>';
    blockEl.style.display = 'block';
  } else if (blockEl) {
    blockEl.style.display = 'none';
  }
  // Counter
  document.getElementById('lb-counter').textContent = (lbIndex + 1) + ' / ' + lbWorks.length;
}

function openLightbox(src, code, name, tech, status, block) {
  buildLightboxGallery();
  lbIndex = lbWorks.findIndex(w => w.src === src);
  if (lbIndex < 0) lbIndex = 0;
  document.getElementById('lb-img').src = src;
  populateLightbox(code, name, tech, status, block);
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
// Keyboard navigation
document.addEventListener('keydown', e => { 
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') navigateLightbox(-1);
  if(e.key === 'ArrowRight') navigateLightbox(1);
});
// Touch swipe for lightbox
(function() {
  const lb = document.getElementById('lightbox');
  let touchStartX = 0, touchStartY = 0;
  lb.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, {passive: true});
  lb.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) navigateLightbox(-1); // swipe right = prev
      else navigateLightbox(1); // swipe left = next
    } else if (dy > 100) {
      closeLightbox(); // swipe down = close
    }
  }, {passive: true});
})();

/* Collection carousel */

/* Collection carousel — native scroll + drag + arrows */
const collCarousel = document.getElementById('collCarousel');
function moveCollCarousel(dir) {
  const item = collCarousel.querySelector('.collection-item');
  const w = item.offsetWidth + 25;
  collCarousel.scrollBy({ left: dir * w, behavior: 'smooth' });
}
(function() {
  let isDown = false, startX, scrollLeft;
  collCarousel.addEventListener('mousedown', function(e) {
    isDown = true; startX = e.pageX - collCarousel.offsetLeft; scrollLeft = collCarousel.scrollLeft;
  });
  collCarousel.addEventListener('mouseleave', function() { isDown = false; });
  collCarousel.addEventListener('mouseup', function() { isDown = false; });
  collCarousel.addEventListener('mousemove', function(e) {
    if (!isDown) return; e.preventDefault();
    collCarousel.scrollLeft = scrollLeft - (e.pageX - collCarousel.offsetLeft - startX);
  });
})();

/* Toggle collection view */
function toggleCollection() {
  const carouselEl = document.getElementById('collectionCarousel');
  const gridEl = document.getElementById('collectionGrid');
  const title = document.querySelector('#collection .toggle-title');
  const isExpanded = !gridEl.classList.contains('hidden');
  if (isExpanded) {
    gridEl.classList.add('hidden');
    carouselEl.classList.remove('hidden');
    title.classList.remove('expanded');
  } else {
    carouselEl.classList.add('hidden');
    gridEl.classList.remove('hidden');
    title.classList.add('expanded');
  }
}

/* Hamburger menu toggle */
function toggleMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navOverlay = document.getElementById('navOverlay');
  hamburger.classList.toggle('active');
  navOverlay.classList.toggle('active');
  document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
}

function closeMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navOverlay = document.getElementById('navOverlay');
  hamburger.classList.remove('active');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* Toggle lightning address */
function toggleLightning() {
  var el = document.getElementById('lightning-address');
  el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

/* Toggle creators panel (on title click) */
function toggleCreatorsPanel() {
  var panel = document.getElementById('creators-panel');
  if (panel.style.display === 'none') {
    panel.style.display = 'block';
    setTimeout(function() { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  } else {
    panel.style.display = 'none';
    // Also close any open creator
    document.querySelectorAll('.creator-expanded').forEach(function(p) { p.style.display = 'none'; });
    document.querySelectorAll('.creator-portrait').forEach(function(p) { p.classList.remove('active'); });
  }
}

/* Toggle creator expanded panel */
function toggleCreator(id) {
  var panel = document.getElementById('creator-' + id);
  var allPanels = document.querySelectorAll('.creator-expanded');
  var allPortraits = document.querySelectorAll('.creator-portrait');
  var isOpen = panel.style.display !== 'none';
  
  // Close all
  allPanels.forEach(function(p) { p.style.display = 'none'; });
  allPortraits.forEach(function(p) { p.classList.remove('active'); });
  
  // If it was closed, open it
  if (!isOpen) {
    panel.style.display = 'block';
    // Mark active portrait
    var portraits = document.querySelectorAll('.creator-portrait');
    portraits.forEach(function(p) {
      if (p.getAttribute('onclick').indexOf(id) !== -1) p.classList.add('active');
    });
    // Scroll to panel
    setTimeout(function() { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
  }
}

/* Toggle artist projects */
function toggleProjects() {
  var el = document.getElementById('artist-projects');
  var toggle = document.getElementById('projects-toggle');
  if (el.style.display === 'none') {
    el.style.display = 'block';
    toggle.textContent = (currentLang === 'es' ? 'Proyectos & Experiencia ↑' : 'Projects & Experience ↑');
  } else {
    el.style.display = 'none';
    toggle.textContent = (currentLang === 'es' ? 'Proyectos & Experiencia →' : 'Projects & Experience →');
  }
}

/* Newsletter subscription */
function handleSubscribe(e) {
  e.preventDefault();
  var email = document.getElementById('sub-email').value;
  var btn = document.getElementById('sub-btn');
  var msg = document.getElementById('sub-msg');
  if (!email) return;
  
  btn.disabled = true;
  btn.textContent = '...';
  
  /* Save to localStorage as backup */
  var subs = JSON.parse(localStorage.getItem('hash21-subs') || '[]');
  subs.push({email: email, date: new Date().toISOString()});
  localStorage.setItem('hash21-subs', JSON.stringify(subs));
  
  /* Send via Formspree */
  fetch('https://formspree.io/f/xpwzgqvl', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    body: JSON.stringify({email: email, _subject: 'Nueva suscripción Hash21', source: 'hash21.studio'})
  }).then(function(r) {
    if (r.ok) {
      msg.style.display = 'block';
      msg.style.color = '#2dd4a8';
      msg.textContent = currentLang === 'es' ? '✓ ¡Suscripción exitosa! Te mantendremos al tanto.' : '✓ Successfully subscribed! We\'ll keep you posted.';
      document.getElementById('sub-email').value = '';
    } else {
      throw new Error('fail');
    }
  }).catch(function() {
    /* Fallback: mailto */
    msg.style.display = 'block';
    msg.style.color = 'var(--gold)';
    msg.textContent = currentLang === 'es' ? '✓ ¡Gracias! Te contactaremos pronto.' : '✓ Thanks! We\'ll be in touch soon.';
    document.getElementById('sub-email').value = '';
  }).finally(function() {
    btn.disabled = false;
    btn.textContent = currentLang === 'es' ? 'Suscribirse' : 'Subscribe';
  });
}
