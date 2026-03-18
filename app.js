// Gold dust particles
const c = document.getElementById('dust');
const ctx = c.getContext('2d');
let particles = [];
function resize() { c.width = window.innerWidth; c.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);
for (let i = 0; i < 30; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.3,
    dy: -Math.random() * 0.2 - 0.05,
    o: Math.random() * 0.5 + 0.1
  });
}
function drawDust() {
  ctx.clearRect(0, 0, c.width, c.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(176,141,87,${p.o})`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.y < -10) { p.y = c.height + 10; p.x = Math.random() * c.width; }
    if (p.x < -10 || p.x > c.width + 10) { p.x = Math.random() * c.width; }
  });
  requestAnimationFrame(drawDust);
}
drawDust();

function openLightbox(src, code, name, tech, status) {
  document.getElementById('lb-img').src = src;
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
  // Populate tags
  var tagData = {
    'Paspartuz 1': {artist:'Roxy', type_es:'Física', type_en:'Physical', status:'consult'},
    'Paspartuz 2': {artist:'Roxy', type_es:'Física', type_en:'Physical', status:'consult'},
    'The Rabbit': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'consult'},
    'The Hole': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'available'},
    'Libertad': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'consult'},
    'Horizonte Temporal': {artist:'Lai⚡️', type_es:'Física', type_en:'Physical', status:'available'}
  };
  var td = tagData[name] || {artist:'Lai⚡️', type_es:'Física', type_en:'Physical'};
  var typeName = lang === 'en' ? td.type_en : td.type_es;
  var statusLabel = '';
  if (td.status === 'available') statusLabel = lang === 'en' ? 'Available' : 'Disponible';
  else if (td.status === 'consult') statusLabel = lang === 'en' ? 'Inquire' : 'Consultar';
  var statusClass = td.status === 'available' ? 'badge-available' : 'badge-consult';
  document.getElementById('lb-tags').innerHTML = '';

  // Wire zap button
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
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });

/* 21 LAT carousel (legacy — element may not exist) */
let pos = 0;
const carousel = document.getElementById('carousel');
function moveCarousel(dir) {
  if (!carousel) return;
  const item = carousel.querySelector('.carousel-item');
  if (!item) return;
  const w = item.offsetWidth + 20;
  const max = carousel.scrollWidth - carousel.parentElement.offsetWidth;
  pos = Math.max(0, Math.min(pos + dir * w, max));
  carousel.style.transform = 'translateX(-' + pos + 'px)';
}

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
