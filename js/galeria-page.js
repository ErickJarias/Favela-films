// ===== PÁGINA GALERÍA =====
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dbm8zejcu/image/upload'

// Todas las imágenes del proyecto
const ALL_IMAGES = [
  // Carrusel principal
  { url: `${CLOUDINARY_BASE}/q_auto/f_auto/v1775178864/0_2_s8io9e.jpg`, category: 'slider', alt: 'Fútea - Imagen 1' },
  { url: `${CLOUDINARY_BASE}/q_auto/f_auto/v1775178864/0_4_a8kvm7.jpg`, category: 'slider', alt: 'Fútea - Imagen 2' },
  { url: `${CLOUDINARY_BASE}/q_auto/f_auto/v1775178865/0_6_nzodkt.jpg`, category: 'slider', alt: 'Fútea - Imagen 3' },
  { url: `${CLOUDINARY_BASE}/q_auto/f_auto/v1775178864/0_3_nt20pa.jpg`, category: 'slider', alt: 'Fútea - Imagen 4' },
  { url: `${CLOUDINARY_BASE}/q_auto/f_auto/v1775178865/0_9_nnr5e0.jpg`, category: 'slider', alt: 'Fútea - Imagen 5' },
  { url: `${CLOUDINARY_BASE}/q_auto/f_auto/v1775178865/0_5_ni8bqz.jpg`, category: 'slider', alt: 'Fútea - Imagen 6' },
  { url: `${CLOUDINARY_BASE}/q_auto/f_auto/v1775178865/0_11_tuuhub.jpg`, category: 'slider', alt: 'Fútea - Imagen 7' },
  { url: `${CLOUDINARY_BASE}/q_auto/f_auto/v1775178865/0_8_hrvagg.jpg`, category: 'slider', alt: 'Fútea - Imagen 8' },
  { url: `${CLOUDINARY_BASE}/q_auto/f_auto/v1775178865/0_10_hngyde.jpg`, category: 'slider', alt: 'Fútea - Imagen 9' },
  { url: `${CLOUDINARY_BASE}/q_auto/f_auto/v1775178865/0_7_xuitpd.jpg`, category: 'slider', alt: 'Fútea - Imagen 10' },
]

let allImages = [...ALL_IMAGES]
let filtered = [...allImages]
let activeFilter = 'all'
let searchQuery = ''
let currentIndex = 0
let isMasonry = false

// ── Cargar TODAS las imágenes desde Supabase ──
async function loadExtraImages() {
  try {
    const db = window._supabaseClient
    if (!db) { applyFilters(); return }

    // Traer TODAS las imágenes sin filtro de destino
    const { data, error } = await db
      .from('slider_images')
      .select('*')
      .order('order_index', { ascending: true })

    if (!error && data?.length) {
      // Mapear con categoría según sus flags
      allImages = data.map(r => ({
        url: r.url,
        alt: r.alt || 'Fútea',
        // categoría para el filtro
        category: r.in_gallery && r.in_slider !== false ? 'both'
                : r.in_gallery ? 'gallery'
                : 'slider',
        in_slider: r.in_slider !== false,
        in_gallery: !!r.in_gallery
      }))
    }
  } catch (e) {
    console.warn('Supabase no disponible, usando fallback', e)
  }
  applyFilters()
}

// ── Filtrar y renderizar ──
function applyFilters() {
  filtered = allImages.filter(img => {
    const matchFilter =
      activeFilter === 'all'     ? true :
      activeFilter === 'slider'  ? img.in_slider :
      activeFilter === 'gallery' ? img.in_gallery :
      true

    const matchSearch = !searchQuery ||
      img.alt.toLowerCase().includes(searchQuery.toLowerCase())

    return matchFilter && matchSearch
  })

  const count = document.getElementById('resultsCount')
  const noResults = document.getElementById('noResults')
  const grid = document.getElementById('galleryGrid')

  count.textContent = `${filtered.length} imagen${filtered.length !== 1 ? 'es' : ''}`

  if (!filtered.length) {
    grid.innerHTML = ''
    noResults.hidden = false
    return
  }
  noResults.hidden = true
  renderGrid()
}

function renderGrid() {
  const grid = document.getElementById('galleryGrid')
  grid.className = `gallery-grid ${isMasonry ? 'masonry' : 'uniform'}`
  grid.innerHTML = filtered.map((img, i) => `
    <div class="gallery-item" data-index="${i}" onclick="openLightbox(${i})">
      <img src="${img.url.replace('/upload/', '/upload/w_600,q_auto,f_auto/')}"
           alt="${img.alt}" loading="lazy">
      <div class="gallery-item-overlay">
        <i class="fas fa-expand-alt"></i>
      </div>
      <span class="gallery-item-cat">${
        img.in_slider && img.in_gallery ? 'Carrusel · Galería' :
        img.in_gallery ? 'Galería' : 'Carrusel'
      }</span>
    </div>`).join('')
}

// ── Lightbox ──
function openLightbox(index) {
  currentIndex = index
  const lb = document.getElementById('lightbox')
  lb.hidden = false
  document.body.style.overflow = 'hidden'
  showLightboxImage()
}

function showLightboxImage() {
  const img = document.getElementById('lightboxImg')
  const loader = document.querySelector('.lightbox-loader')
  const counter = document.getElementById('lightboxCounter')
  const download = document.getElementById('lightboxDownload')
  const current = filtered[currentIndex]

  loader.style.display = 'flex'
  img.style.opacity = '0'
  img.src = current.url
  img.alt = current.alt
  download.href = current.url

  img.onload = () => {
    loader.style.display = 'none'
    img.style.opacity = '1'
  }
  counter.textContent = `${currentIndex + 1} / ${filtered.length}`
}

function closeLightbox() {
  document.getElementById('lightbox').hidden = true
  document.body.style.overflow = ''
}

function lightboxNext() {
  currentIndex = (currentIndex + 1) % filtered.length
  showLightboxImage()
}

function lightboxPrev() {
  currentIndex = (currentIndex - 1 + filtered.length) % filtered.length
  showLightboxImage()
}

// Exponer globalmente
window.openLightbox = openLightbox

// ── Inicialización ──
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Renderer !== 'undefined') {
    Renderer.loadAll()
  }
  loadExtraImages()
})

// ── Eventos ──
document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox)
document.getElementById('lightboxBackdrop')?.addEventListener('click', closeLightbox)
document.getElementById('lightboxNext')?.addEventListener('click', lightboxNext)
document.getElementById('lightboxPrev')?.addEventListener('click', lightboxPrev)

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox')
  if (lb?.hidden) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') lightboxNext()
  if (e.key === 'ArrowLeft') lightboxPrev()
})

// Touch swipe en lightbox
let lbTouchX = 0
document.getElementById('lightbox')?.addEventListener('touchstart', e => {
  lbTouchX = e.touches[0].clientX
}, { passive: true })
document.getElementById('lightbox')?.addEventListener('touchend', e => {
  const diff = lbTouchX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) diff > 0 ? lightboxNext() : lightboxPrev()
}, { passive: true })

// Búsqueda
const searchInput = document.getElementById('gallerySearch')
const clearBtn = document.getElementById('clearSearch')
searchInput?.addEventListener('input', () => {
  searchQuery = searchInput.value.trim()
  clearBtn.hidden = !searchQuery
  applyFilters()
})
clearBtn?.addEventListener('click', () => {
  searchInput.value = ''
  searchQuery = ''
  clearBtn.hidden = true
  applyFilters()
})

// Filtros
document.getElementById('filterChips')?.addEventListener('click', e => {
  const chip = e.target.closest('.chip')
  if (!chip) return
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'))
  chip.classList.add('active')
  activeFilter = chip.dataset.filter
  applyFilters()
})

document.getElementById('resetFilters')?.addEventListener('click', () => {
  activeFilter = 'all'
  searchQuery = ''
  searchInput.value = ''
  clearBtn.hidden = true
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'))
  document.querySelector('.chip[data-filter="all"]')?.classList.add('active')
  applyFilters()
})

// Vista grid / masonry
document.getElementById('viewGrid')?.addEventListener('click', () => {
  isMasonry = false
  document.getElementById('viewGrid').classList.add('active')
  document.getElementById('viewMasonry').classList.remove('active')
  renderGrid()
})
document.getElementById('viewMasonry')?.addEventListener('click', () => {
  isMasonry = true
  document.getElementById('viewMasonry').classList.add('active')
  document.getElementById('viewGrid').classList.remove('active')
  renderGrid()
})

// Back to top
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset > 300
  document.querySelector('.back-to-top')?.classList.toggle('show', scrolled)
  document.querySelector('.header')?.classList.toggle('scrolled', scrolled)
})
document.querySelector('.back-to-top')?.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
)

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  applyFilters()
  loadExtraImages()
})
