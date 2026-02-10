const translations = {
  es: {
    nav_collabs: "Colaboraciones",
    nav_collection: "Colección",
    nav_philosophy: "Filosofía",
    nav_artists: "Artistas",
    nav_contact: "Contacto",
    hero_tagline: "Sovereign art for sovereign minds",
    hero_pow: "Proof of Work · Proof of Soul",
    hero_scroll: "↓ Explorar",
    collab_label: "Colaboración",
    collab_title: "Veintiuno LAT × Abstract Lai",
    collab_text: "Diseños exclusivos creados para el proyecto Veintiuno LAT. Arte abstracto aplicado a tarjetas contactless — cada diseño es único e irrepetible.",
    collection_label: "Obras originales",
    collection_title: "Colección",
    collection_text: "Acrílico sobre lienzo. Texturas, capas, decisiones irreversibles. Cada pieza es única — finita por diseño.",
    coming: "Próximamente",
    jewelry_label: "Artesanal",
    jewelry_title: "Hard Art Objects",
    jewelry_text: "Tiempo convertido en materia. Energía fijada en forma. Piezas únicas en plata, hechas a mano.",
    philosophy_label: "Filosofía",
    philosophy_title: "¿Por qué Hash21?",
    philosophy_text: "Donde el arte se encuentra con la soberanía individual.",
    pillar1_title: "Proof of Work",
    pillar1_text: "Cada obra es trabajo real. Acrílico, textura, capas. No hay ctrl+Z. Cada trazo es irreversible — como cada bloque en la cadena.",
    pillar2_title: "Soberanía",
    pillar2_text: "Arte que no pide permiso. Sin intermediarios que dicten qué crear ni cuánto vale. La obra habla por sí misma.",
    pillar3_title: "21 Millones",
    pillar3_text: "En un mundo de infinita reproducción, lo físico es escaso. Cada pieza es única. Finito por diseño — como Bitcoin.",
    artists_label: "Artistas",
    artists_title: "Creadores",
    artists_text: "Hash21 es una plataforma curada. Cada artista comparte la visión de soberanía, verdad y trabajo real.",
    artist1_role: "Fundadora · Artista",
    artist1_bio: "Arte intuitivo que explora emoción y transformación. Acrílicos, texturas y capas que se construyen como las decisiones que nos forman. Buenos Aires, Argentina.",
    contact_label: "Conectemos",
    contact_title: "Conectemos",
    lightning_badge: "₿ Bitcoin only",
    footer: "Hash21 © 2026 — Powered by proof of work ⚡",
    footer_desc: "Sovereign art for sovereign minds",
    footer_nav: "Navegación",
    footer_social: "Redes",
    footer_contact: "Contacto",
    contact_community: "Sumate a la comunidad",
    obra1_code: "Block 0 — #001",
    obra1_name: "The Rabbit",
    obra1_tech: "Acrílico y texturas sobre lienzo",
    obra2_code: "Block 0 — #002",
    obra2_name: "The Hole",
    obra2_tech: "Acrílico y texturas sobre lienzo",
    obra3_code: "Block 0 — #003",
    obra3_name: "Libertad",
    obra3_tech: "Acrílico y texturas sobre lienzo",
    obra4_code: "Block 0 — #004",
    obra4_name: "Horizonte Temporal",
    obra4_tech: "Acrílico y texturas sobre lienzo"
  },
  en: {
    nav_collabs: "Collaborations",
    nav_collection: "Collection",
    nav_philosophy: "Philosophy",
    nav_artists: "Artists",
    nav_contact: "Contact",
    hero_tagline: "Sovereign art for sovereign minds",
    hero_pow: "Proof of Work · Proof of Soul",
    hero_scroll: "↓ Explore",
    collab_label: "Collaboration",
    collab_title: "Veintiuno LAT × Abstract Lai",
    collab_text: "Exclusive designs created for the Veintiuno LAT project. Abstract art applied to contactless cards — each design is unique and unrepeatable.",
    collection_label: "Original works",
    collection_title: "Collection",
    collection_text: "Acrylic on canvas. Textures, layers, irreversible decisions. Each piece is unique — finite by design.",
    coming: "Coming soon",
    jewelry_label: "Handcrafted",
    jewelry_title: "Hard Art Objects",
    jewelry_text: "Time converted into matter. Energy fixed into form. Unique handcrafted silver pieces.",
    philosophy_label: "Philosophy",
    philosophy_title: "Why Hash21?",
    philosophy_text: "Where art meets individual sovereignty.",
    pillar1_title: "Proof of Work",
    pillar1_text: "Each piece is real work. Acrylic, texture, layers. No ctrl+Z. Every stroke is irreversible — like every block in the chain.",
    pillar2_title: "Sovereignty",
    pillar2_text: "Art that doesn't ask permission. No intermediaries dictating what to create or how much it's worth. The work speaks for itself.",
    pillar3_title: "21 Million",
    pillar3_text: "In a world of infinite reproduction, the physical is scarce. Each piece is unique. Finite by design — like Bitcoin.",
    artists_label: "Artists",
    artists_title: "Creators",
    artists_text: "Hash21 is a curated platform. Every artist shares the vision of sovereignty, truth, and real work.",
    artist1_role: "Founder · Artist",
    artist1_bio: "Intuitive art exploring emotion and transformation. Acrylics, textures and layers that build like the decisions that shape us. Buenos Aires, Argentina.",
    contact_label: "Connect",
    contact_title: "Let's Connect",
    lightning_badge: "₿ Bitcoin only",
    footer: "Hash21 © 2026 — Powered by proof of work ⚡",
    footer_desc: "Sovereign art for sovereign minds",
    footer_nav: "Navigation",
    footer_social: "Social",
    footer_contact: "Contact",
    contact_community: "Join the community",
    obra1_code: "Block 0 — #001",
    obra1_name: "The Rabbit",
    obra1_tech: "Acrylic and textures on canvas",
    obra2_code: "Block 0 — #002",
    obra2_name: "The Hole",
    obra2_tech: "Acrylic and textures on canvas",
    obra3_code: "Block 0 — #003",
    obra3_name: "Freedom",
    obra3_tech: "Acrylic and textures on canvas",
    obra4_code: "Block 0 — #004",
    obra4_name: "Time Horizon",
    obra4_tech: "Acrylic and textures on canvas"
  }
};

let currentLang = 'es';

function setLang(lang) {
  currentLang = lang;
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  localStorage.setItem('hash21-lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('hash21-lang');
  if (saved) setLang(saved);
});
