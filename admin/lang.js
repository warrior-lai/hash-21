// Admin i18n
const T = {
  es: {
    // General
    'admin.panel': 'Panel de Admin',
    'loading': 'Cargando...',
    'save': 'Guardar',
    'cancel': 'Cancelar',
    'edit': 'Editar',
    'delete': 'Eliminar',
    'new': 'Nuevo',
    'actions': 'Acciones',
    'status': 'Estado',
    'date': 'Fecha',
    'name': 'Nombre',
    'email': 'Email',
    'role': 'Rol',
    
    // Login
    'login.email': 'Email',
    'login.password': 'Contraseña',
    'login.submit': 'Iniciar sesión',
    'login.error': 'Email o contraseña incorrectos',
    'login.no-account': '¿No tenés cuenta?',
    'login.register': 'Registrate',
    
    // Sidebar
    'nav.main': 'Principal',
    'nav.dashboard': 'Dashboard',
    'nav.content': 'Contenido',
    'nav.artists': 'Artistas',
    'nav.works': 'Obras',
    'nav.products': 'Productos',
    'nav.certs': 'Certificados',
    'nav.system': 'Sistema',
    'nav.users': 'Usuarios',
    'nav.logout': 'Cerrar sesión',
    
    // Dashboard
    'dash.artists': 'Artistas',
    'dash.works': 'Obras',
    'dash.products': 'Productos',
    'dash.certs': 'Certificados',
    'dash.zaps': 'Zaps',
    'dash.sats': 'Sats',
    
    // Artists
    'artists.title': 'Artistas',
    'artists.new': '+ Nuevo Artista',
    'artists.empty': 'Sin artistas',
    'artists.empty-desc': 'Agregá tu primer artista',
    'artists.name': 'Nombre',
    'artists.photo': 'Foto',
    'artists.lightning': 'Lightning Address',
    'artists.bio': 'Bio',
    'artists.saved': 'Artista guardado',
    'artists.deleted': 'Artista eliminado',
    'artists.delete-confirm': '¿Eliminar este artista?',
    'artists.edit': 'Editar Artista',
    'artists.new-modal': 'Nuevo Artista',
    'artists.nationality': 'Nacionalidad',
    
    // Works
    'works.title': 'Obras',
    'works.new': '+ Nueva Obra',
    'works.empty': 'Sin obras',
    'works.empty-desc': 'Agregá tu primera obra',
    'works.title-es': 'Título (ES)',
    'works.title-en': 'Título (EN)',
    'works.artist': 'Artista',
    'works.technique': 'Técnica',
    'works.image': 'Imagen URL',
    'works.select-artist': 'Seleccionar...',
    'works.saved': 'Obra guardada',
    'works.deleted': 'Obra eliminada',
    'works.delete-confirm': '¿Eliminar esta obra?',
    'works.edit': 'Editar Obra',
    'works.new-modal': 'Nueva Obra',
    'works.certify': 'Certificar',
    'works.certified': 'Certificada',
    'works.pending': 'Pendiente',
    'works.not-certified': 'Sin certificar',
    
    // Certificates
    'certs.title': 'Certificados',
    'certs.work': 'Obra',
    'certs.hash': 'Hash',
    'certs.block': 'Bloque',
    'certs.confirmed': 'Confirmado',
    'certs.empty': 'No hay certificados aún',
    'certs.view-mempool': 'Ver en Mempool',
    'certs.download-pdf': 'Descargar PDF',
    'certs.confirm-certify': '¿Certificar esta obra en Bitcoin?',
    'certs.sending': 'Enviando a OpenTimestamps...',
    'certs.started': 'Certificación iniciada. Se anclará en 1-12 horas.',
    'certs.error': 'Error al certificar',
    'certs.hash-copied': 'Hash copiado',
    
    // Products
    'products.title': 'Productos',
    'products.new': '+ Nuevo Producto',
    'products.empty': 'Sin productos',
    'products.empty-desc': 'Agregá tu primer producto',
    'products.deleted': 'Producto eliminado',
    'products.delete-confirm': '¿Eliminar este producto?',
    'products.wip': 'Función en desarrollo',
    
    // Users
    'users.title': 'Usuarios',
    'users.new': '+ Nuevo Usuario',
    'users.edit': 'Editar Usuario',
    'users.new-modal': 'Nuevo Usuario',
    'users.saved': 'Usuario guardado',
    'users.deleted': 'Usuario eliminado',
    'users.delete-confirm': '¿Eliminar este usuario?',
    'users.role-pending': 'Pending',
    'users.role-artist': 'Artist',
    'users.role-designer': 'Designer',
    'users.role-collaborator': 'Collaborator',
    'users.role-admin': 'Admin',
    'users.status-pending': 'Pending',
    'users.status-active': 'Active',
    
    // Onboarding
    'ob.welcome': 'Bienvenido',
    'ob.what-create': '¿Qué creás?',
    'ob.help-personalize': 'Esto nos ayuda a personalizar tu experiencia',
    'ob.art': 'Arte',
    'ob.art-desc': 'Pinturas, esculturas, arte digital',
    'ob.design': 'Diseño',
    'ob.design-desc': 'Objetos, joyas, productos',
    'ob.continue': 'Continuar',
    'ob.back': '← Volver',
    'ob.profile': 'Tu perfil',
    'ob.profile-desc': 'Contanos un poco sobre vos',
    'ob.artist-name': 'Nombre artístico',
    'ob.bio': 'Bio breve (opcional)',
    'ob.portfolio': 'Link a portfolio o redes (opcional)',
    'ob.success-title': '¡Bienvenido a Hash21!',
    'ob.success-msg': 'Tu perfil está siendo revisado. Te notificaremos cuando esté activo y puedas subir tus creaciones.',
    'ob.go-panel': 'Ir al panel'
  },
  en: {
    // General
    'admin.panel': 'Admin Panel',
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'new': 'New',
    'actions': 'Actions',
    'status': 'Status',
    'date': 'Date',
    'name': 'Name',
    'email': 'Email',
    'role': 'Role',
    
    // Login
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Sign in',
    'login.error': 'Invalid email or password',
    'login.no-account': "Don't have an account?",
    'login.register': 'Register',
    
    // Sidebar
    'nav.main': 'Main',
    'nav.dashboard': 'Dashboard',
    'nav.content': 'Content',
    'nav.artists': 'Artists',
    'nav.works': 'Artworks',
    'nav.products': 'Products',
    'nav.certs': 'Certificates',
    'nav.system': 'System',
    'nav.users': 'Users',
    'nav.logout': 'Log out',
    
    // Dashboard
    'dash.artists': 'Artists',
    'dash.works': 'Artworks',
    'dash.products': 'Products',
    'dash.certs': 'Certificates',
    'dash.zaps': 'Zaps',
    'dash.sats': 'Sats',
    
    // Artists
    'artists.title': 'Artists',
    'artists.new': '+ New Artist',
    'artists.empty': 'No artists',
    'artists.empty-desc': 'Add your first artist',
    'artists.name': 'Name',
    'artists.photo': 'Photo',
    'artists.lightning': 'Lightning Address',
    'artists.bio': 'Bio',
    'artists.saved': 'Artist saved',
    'artists.deleted': 'Artist deleted',
    'artists.delete-confirm': 'Delete this artist?',
    'artists.edit': 'Edit Artist',
    'artists.new-modal': 'New Artist',
    'artists.nationality': 'Nationality',
    
    // Works
    'works.title': 'Artworks',
    'works.new': '+ New Artwork',
    'works.empty': 'No artworks',
    'works.empty-desc': 'Add your first artwork',
    'works.title-es': 'Title (ES)',
    'works.title-en': 'Title (EN)',
    'works.artist': 'Artist',
    'works.technique': 'Technique',
    'works.image': 'Image URL',
    'works.select-artist': 'Select...',
    'works.saved': 'Artwork saved',
    'works.deleted': 'Artwork deleted',
    'works.delete-confirm': 'Delete this artwork?',
    'works.edit': 'Edit Artwork',
    'works.new-modal': 'New Artwork',
    'works.certify': 'Certify',
    'works.certified': 'Certified',
    'works.pending': 'Pending',
    'works.not-certified': 'Not certified',
    
    // Certificates
    'certs.title': 'Certificates',
    'certs.work': 'Artwork',
    'certs.hash': 'Hash',
    'certs.block': 'Block',
    'certs.confirmed': 'Confirmed',
    'certs.empty': 'No certificates yet',
    'certs.view-mempool': 'View on Mempool',
    'certs.download-pdf': 'Download PDF',
    'certs.confirm-certify': 'Certify this artwork on Bitcoin?',
    'certs.sending': 'Sending to OpenTimestamps...',
    'certs.started': 'Certification started. Will anchor in 1-12 hours.',
    'certs.error': 'Certification error',
    'certs.hash-copied': 'Hash copied',
    
    // Products
    'products.title': 'Products',
    'products.new': '+ New Product',
    'products.empty': 'No products',
    'products.empty-desc': 'Add your first product',
    'products.deleted': 'Product deleted',
    'products.delete-confirm': 'Delete this product?',
    'products.wip': 'Feature in development',
    
    // Users
    'users.title': 'Users',
    'users.new': '+ New User',
    'users.edit': 'Edit User',
    'users.new-modal': 'New User',
    'users.saved': 'User saved',
    'users.deleted': 'User deleted',
    'users.delete-confirm': 'Delete this user?',
    'users.role-pending': 'Pending',
    'users.role-artist': 'Artist',
    'users.role-designer': 'Designer',
    'users.role-collaborator': 'Collaborator',
    'users.role-admin': 'Admin',
    'users.status-pending': 'Pending',
    'users.status-active': 'Active',
    
    // Onboarding
    'ob.welcome': 'Welcome',
    'ob.what-create': 'What do you create?',
    'ob.help-personalize': 'This helps us personalize your experience',
    'ob.art': 'Art',
    'ob.art-desc': 'Paintings, sculptures, digital art',
    'ob.design': 'Design',
    'ob.design-desc': 'Objects, jewelry, products',
    'ob.continue': 'Continue',
    'ob.back': '← Back',
    'ob.profile': 'Your profile',
    'ob.profile-desc': 'Tell us a bit about yourself',
    'ob.artist-name': 'Artist name',
    'ob.bio': 'Short bio (optional)',
    'ob.portfolio': 'Portfolio or social link (optional)',
    'ob.success-title': 'Welcome to Hash21!',
    'ob.success-msg': 'Your profile is being reviewed. We\'ll notify you when it\'s active and you can upload your creations.',
    'ob.go-panel': 'Go to panel'
  }
};

let currentLang = localStorage.getItem('hash21-lang') || 'es';

function t(key) {
  return T[currentLang][key] || T['es'][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('hash21-lang', lang);
  applyTranslations();
  updateLangToggle();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
}

function updateLangToggle() {
  document.querySelectorAll('.lang-btn, #lang-toggle, #sidebar-lang-toggle').forEach(toggle => {
    if (toggle) toggle.textContent = currentLang.toUpperCase();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  updateLangToggle();
});
