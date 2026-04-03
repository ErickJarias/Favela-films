// ===== PÁGINA PRODUCTOS =====
let allProducts = []
let activeFilter = 'all'
let searchQuery = ''
let sortMode = 'default'
const db = window._supabaseClient
// Wishlist en localStorage
const WISH_KEY = 'futea_wishlist'
function getWishlist() { try { return JSON.parse(localStorage.getItem(WISH_KEY)) || [] } catch { return [] } }
function toggleWish(name) {
  let list = getWishlist()
  list = list.includes(name) ? list.filter(n => n !== name) : [...list, name]
  localStorage.setItem(WISH_KEY, JSON.stringify(list))
  renderFiltered()
}

async function loadProducts() {
  try {
    const { data, error } = await db.from('products').select('*').order('order_index', { ascending: true })
    if (error) throw error
    allProducts = data || []
  } catch {
    allProducts = []
  }
  renderFiltered()
}

function getSortedFiltered() {
  let list = [...allProducts]

  // Filtro por chip
  if (activeFilter !== 'all') {
    list = list.filter(p =>
      (p.badge || '').toLowerCase() === activeFilter.toLowerCase() ||
      (p.tags || '').toLowerCase().includes(activeFilter.toLowerCase()) ||
      (p.name || '').toLowerCase().includes(activeFilter.toLowerCase())
    )
  }

  // Búsqueda
  if (searchQuery) {
    list = list.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  // Ordenar
  if (sortMode === 'price-asc') {
    list.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g,'')) - parseFloat(b.price.replace(/[^0-9.]/g,'')))
  } else if (sortMode === 'price-desc') {
    list.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g,'')) - parseFloat(a.price.replace(/[^0-9.]/g,'')))
  } else if (sortMode === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name))
  }

  return list
}

function renderFiltered() {
  const filtered = getSortedFiltered()
  const grid = document.getElementById('productGrid')
  const noResults = document.getElementById('noResults')
  const count = document.getElementById('resultsCount')
  const wishlist = getWishlist()

  count.textContent = `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`

  if (!filtered.length) {
    grid.innerHTML = ''
    noResults.hidden = false
    return
  }

  noResults.hidden = true
  grid.innerHTML = filtered.map(p => {
    const wished = wishlist.includes(p.name)
    const safeTitle = p.name.replace(/'/g, "\\'")
    const safeImg = p.img.replace(/'/g, "\\'")
    return `
    <div class="product-card">
      <div class="product-image">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="wishlist-button ${wished ? 'wished' : ''}"
          onclick="toggleWish('${safeTitle}')"
          aria-label="${wished ? 'Quitar de favoritos' : 'Añadir a favoritos'}"
          title="${wished ? 'Quitar de favoritos' : 'Añadir a favoritos'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="${wished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
        </button>
      </div>
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-price">${p.price}</p>
        <button class="btn btn-black" onclick="Cart.add({img:'${safeImg}',name:'${safeTitle}',price:'${p.price}'})">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
          Añadir al carrito
        </button>
      </div>
    </div>`
  }).join('')
}

// Búsqueda
const searchInput = document.getElementById('productSearch')
const clearBtn = document.getElementById('clearSearch')

searchInput?.addEventListener('input', () => {
  searchQuery = searchInput.value.trim()
  clearBtn.hidden = !searchQuery
  renderFiltered()
})

clearBtn?.addEventListener('click', () => {
  searchInput.value = ''
  searchQuery = ''
  clearBtn.hidden = true
  renderFiltered()
})

// Filtros
document.getElementById('filterChips')?.addEventListener('click', e => {
  const chip = e.target.closest('.chip')
  if (!chip) return
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'))
  chip.classList.add('active')
  activeFilter = chip.dataset.filter
  renderFiltered()
})

// Ordenar
document.getElementById('sortSelect')?.addEventListener('change', e => {
  sortMode = e.target.value
  renderFiltered()
})

document.getElementById('resetFilters')?.addEventListener('click', () => {
  activeFilter = 'all'
  searchQuery = ''
  sortMode = 'default'
  searchInput.value = ''
  clearBtn.hidden = true
  document.getElementById('sortSelect').value = 'default'
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'))
  document.querySelector('.chip[data-filter="all"]')?.classList.add('active')
  renderFiltered()
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

document.addEventListener('DOMContentLoaded', loadProducts)
