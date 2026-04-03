// ===== PÁGINA AUDIOVISUALES =====
let allVideos = []
let activeFilter = 'all'
let searchQuery = ''
const db = window._supabaseClient

async function loadVideos() {
  try {
    const { data, error } = await db.from('videos').select('*').order('order_index', { ascending: true })
    if (error) throw error
    allVideos = data || []
  } catch {
    allVideos = []
  }
  renderFiltered()
}

function renderFiltered() {
  let filtered = allVideos

  if (activeFilter !== 'all') {
    filtered = filtered.filter(v =>
      (v.tags || v.title || '').toLowerCase().includes(activeFilter.toLowerCase())
    )
  }

  if (searchQuery) {
    filtered = filtered.filter(v =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const grid = document.getElementById('videoGrid')
  const noResults = document.getElementById('noResults')
  const count = document.getElementById('resultsCount')

  count.textContent = `${filtered.length} video${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`

  if (!filtered.length) {
    grid.innerHTML = ''
    noResults.hidden = false
    return
  }

  noResults.hidden = true
  grid.innerHTML = filtered.map(v => `
    <div class="video-card" onclick="abrirVideoModal('${v.id}','${v.title.replace(/'/g,"\\'")}')">
      <div class="video-thumbnail">
        <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" loading="lazy">
        <div class="video-overlay">
          <button class="play-button" aria-label="Reproducir">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
        </div>
        <span class="video-duration">${v.duration}</span>
      </div>
      <div class="video-info">
        <h3 class="video-title">${v.title}</h3>
        <p class="video-views">${v.views}</p>
      </div>
    </div>`).join('')
}

// Búsqueda
const searchInput = document.getElementById('videoSearch')
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

document.getElementById('resetFilters')?.addEventListener('click', () => {
  activeFilter = 'all'
  searchQuery = ''
  searchInput.value = ''
  clearBtn.hidden = true
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

// Modal stub (usa modal.js pero Slider no existe en esta página)
if (typeof Slider === 'undefined') {
  window.Slider = { pause: () => {}, resume: () => {} }
}

document.addEventListener('DOMContentLoaded', loadVideos)
