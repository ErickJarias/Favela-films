// ===== UI: Dark Mode + Traducción ES/EN =====

// ── DARK MODE ──
const DarkMode = (() => {
  const KEY = 'futea_dark'
  const html = document.documentElement

  function isDark() {
    return localStorage.getItem(KEY) === 'true' ||
      (!localStorage.getItem(KEY) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  }

  function apply(dark) {
    html.classList.toggle('dark', dark)
    localStorage.setItem(KEY, dark)
    // Actualizar icono del botón
    document.querySelectorAll('.dark-toggle-btn').forEach(btn => {
      btn.innerHTML = dark
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>'
      btn.setAttribute('aria-label', dark ? 'Modo claro' : 'Modo oscuro')
      btn.title = dark ? 'Modo claro' : 'Modo oscuro'
    })
  }

  function toggle() { apply(!isDark()) }

  function init() {
    apply(isDark())
    document.querySelectorAll('.dark-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggle)
    })
  }

  return { init, toggle, isDark }
})()

// ── TRADUCCIÓN ES/EN ──
const I18n = (() => {
  const KEY = 'futea_lang'

  const translations = {
    // Navegación
    'nav.inicio':        { es: 'Inicio',        en: 'Home' },
    'nav.galeria':       { es: 'Galería',        en: 'Gallery' },
    'nav.audiovisuales': { es: 'Audiovisuales',  en: 'Videos' },
    'nav.historias':     { es: 'Historias',      en: 'Stories' },
    'nav.productos':     { es: 'Productos',      en: 'Products' },
    'nav.contacto':      { es: 'Contacto',       en: 'Contact' },
    // Hero
    'hero.subtitle':     { es: 'Donde las historias cobran vida y los sueños se hacen realidad',
                           en: 'Where stories come to life and dreams become reality' },
    'hero.btn1':         { es: 'Ver Audiovisuales', en: 'Watch Videos' },
    'hero.btn2':         { es: 'Explorar Productos', en: 'Explore Products' },
    // Secciones
    'section.gallery':   { es: 'Galería',        en: 'Gallery' },
    'section.gallery.cta': { es: 'Ver galería completa', en: 'View full gallery' },
    'section.videos':    { es: 'Audiovisuales Destacados', en: 'Featured Videos' },
    'section.videos.all': { es: 'Ver todos',     en: 'View all' },
    'section.historias': { es: 'Historias de Éxito', en: 'Success Stories' },
    'section.productos': { es: 'Nuestra Tienda', en: 'Our Store' },
    'section.productos.all': { es: 'Ver catálogo completo', en: 'View full catalog' },
    'section.newsletter': { es: 'Únete a la Comunidad Fútea', en: 'Join the Fútea Community' },
    'newsletter.text':   { es: 'Suscríbete para recibir las últimas noticias, historias y ofertas exclusivas',
                           en: 'Subscribe to receive the latest news, stories and exclusive offers' },
    'newsletter.btn':    { es: 'Suscribirse',    en: 'Subscribe' },
    'newsletter.placeholder': { es: 'Tu correo electrónico', en: 'Your email address' },
    // Productos
    'product.add':       { es: 'Añadir al carrito', en: 'Add to cart' },
    'product.search':    { es: 'Buscar productos...', en: 'Search products...' },
    'product.sort':      { es: 'Ordenar por', en: 'Sort by' },
    'product.sort.asc':  { es: 'Precio: menor a mayor', en: 'Price: low to high' },
    'product.sort.desc': { es: 'Precio: mayor a menor', en: 'Price: high to low' },
    'product.sort.name': { es: 'Nombre A-Z', en: 'Name A-Z' },
    'product.empty':     { es: 'No se encontraron productos', en: 'No products found' },
    'product.loading':   { es: 'Cargando productos...', en: 'Loading products...' },
    // Galería
    'gallery.title':     { es: 'Galería', en: 'Gallery' },
    'gallery.subtitle':  { es: 'Momentos, historias y cultura visual de Fútea', en: 'Moments, stories and visual culture of Fútea' },
    'gallery.search':    { es: 'Buscar imagen...', en: 'Search image...' },
    'gallery.filter.all': { es: 'Todas', en: 'All' },
    'gallery.filter.slider': { es: 'Carrusel', en: 'Slider' },
    'gallery.filter.gallery': { es: 'Galería', en: 'Gallery' },
    'gallery.loading':   { es: 'Cargando galería...', en: 'Loading gallery...' },
    'gallery.empty':     { es: 'No se encontraron imágenes', en: 'No images found' },
    'gallery.view.all':  { es: 'Ver todas', en: 'View all' },
    // Videos
    'videos.title':      { es: 'Audiovisuales', en: 'Videos' },
    'videos.subtitle':   { es: 'Toda nuestra producción audiovisual en un solo lugar', en: 'All our audiovisual production in one place' },
    'videos.search':     { es: 'Buscar videos...', en: 'Search videos...' },
    'videos.filter.all': { es: 'Todos', en: 'All' },
    'videos.filter.torneo': { es: 'Torneos', en: 'Tournaments' },
    'videos.filter.historia': { es: 'Historias', en: 'Stories' },
    'videos.filter.entrenamiento': { es: 'Entrenamiento', en: 'Training' },
    'videos.loading':    { es: 'Cargando videos...', en: 'Loading videos...' },
    'videos.empty':      { es: 'No se encontraron videos con ese criterio', en: 'No videos found with those criteria' },
    // Footer
    'footer.links':      { es: 'Enlaces Rápidos', en: 'Quick Links' },
    'footer.contact':    { es: 'Contacto',        en: 'Contact' },
    'footer.newsletter': { es: 'Boletín Informativo', en: 'Newsletter' },
    'footer.newsletter.text': { es: 'Suscríbete para recibir las últimas noticias y ofertas exclusivas.',
                                en: 'Subscribe to receive the latest news and exclusive offers.' },
    'footer.copy':       { es: '© 2025 Fútea. Todos los derechos reservados.',
                           en: '© 2025 Fútea. All rights reserved.' },
    'footer.desc':       { es: 'Dedicados a visibilizar el arte, el deporte y la cultura, contando historias de éxito que nacen en las canchas y se expresan en la creatividad de nuestras comunidades.',
                           en: 'Dedicated to highlighting art, sports, and culture, telling success stories that start on the fields and are expressed through our communities\' creativity.' },
    // Carrito
    'cart.title':        { es: 'Tu carrito',     en: 'Your cart' },
    'cart.empty':        { es: 'Tu carrito está vacío', en: 'Your cart is empty' },
    'cart.empty.sub':    { es: 'Agrega productos para continuar', en: 'Add products to continue' },
    'cart.total':        { es: 'Total',           en: 'Total' },
    'cart.checkout':     { es: 'Realizar pedido por WhatsApp', en: 'Place order via WhatsApp' },
    'cart.clear':        { es: 'Vaciar carrito',  en: 'Clear cart' },
    // Admin
    'admin.title':       { es: 'Panel Admin', en: 'Admin Panel' },
    'admin.restricted':  { es: 'Acceso restringido', en: 'Restricted access' },
    'admin.email':       { es: 'Correo', en: 'Email' },
    'admin.password':    { es: 'Contraseña', en: 'Password' },
    'admin.login':       { es: 'Ingresar al panel', en: 'Login to panel' },
  }

  function getLang() {
    return localStorage.getItem(KEY) || 'es'
  }

  function t(key) {
    const lang = getLang()
    return translations[key]?.[lang] || translations[key]?.es || key
  }

  function applyAll() {
    const lang = getLang()
    document.documentElement.lang = lang
    document.documentElement.dataset.lang = lang
    document.documentElement.dataset.currency = lang === 'en' ? 'USD' : 'COP'

    // Traducir todos los elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n
      const val = translations[key]?.[lang]
      if (!val) return
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val
      } else {
        el.textContent = val
      }
    })

    // Actualizar botón de idioma
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      btn.textContent = lang === 'es' ? 'EN' : 'ES'
      btn.title = lang === 'es' ? 'Switch to English' : 'Cambiar a Español'
    })
  }

  function toggle() {
    const newLang = getLang() === 'es' ? 'en' : 'es'
    localStorage.setItem(KEY, newLang)
    applyAll()
    // Re-renderizar productos si están cargados (para actualizar "Añadir al carrito")
    if (typeof Renderer !== 'undefined') Renderer.rerenderProducts?.()
  }

  function init() {
    applyAll()
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggle)
    })
  }

  return { init, toggle, getLang, t, applyAll }
})()

document.addEventListener('DOMContentLoaded', () => {
  DarkMode.init()
  I18n.init()
})
