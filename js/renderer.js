// ===== RENDERER: carga datos desde Supabase y renderiza =====
const _db = window._supabaseClient

const Renderer = (() => {
  const DEFAULT_LOGO = 'https://res.cloudinary.com/dbm8zejcu/image/upload/q_auto/f_auto/v1775178865/logo_eg8uop.jpg'

  async function fetchTable(table) {
    try {
      // site_config usa 'key' como PK, no tiene order_index
      const query = table === 'site_config'
        ? _db.from(table).select('*')
        : _db.from(table).select('*').order('order_index', { ascending: true })
      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (err) {
      console.error(`Error cargando ${table} desde Supabase`, err)
      return []
    }
  }

  function renderVideos(videos) {
    const grid = document.getElementById('videoGrid')
    if (!grid) return
    if (!videos.length) {
      grid.innerHTML = `<p class="empty-state">Aún no hay videos cargados.</p>`
      return
    }
    grid.innerHTML = videos.map(v => `
      <div class="video-card">
        <div class="video-thumbnail">
          <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" 
               alt="${v.title}" loading="lazy"
               onerror="this.src='https://img.youtube.com/vi/${v.id}/hqdefault.jpg'"
               style="background:#111">
          <div class="video-overlay">
            <button class="play-button" onclick="abrirVideoModal('${v.id}','${v.title.replace(/'/g,"\\'")}')">
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

  function renderProducts(products) {
    const grid = document.getElementById('productGrid')
    if (!grid) return
    if (!products.length) {
      grid.innerHTML = `<p class="empty-state">Aún no hay productos cargados.</p>`
      return
    }
    grid.innerHTML = products.map(p => {
      const safeTitle = p.name.replace(/'/g, "\\'")
      const safeImg = p.img.replace(/'/g, "\\'")
      return `
      <div class="product-card">
        <div class="product-image">
          <img src="${p.img}" alt="${p.name}" loading="lazy">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <button class="wishlist-button" aria-label="Favorito">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
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

  function renderStories(videos) {
    const grid = document.getElementById('storyGrid')
    if (!grid) return

    const stories = videos.slice(0, 3)
    if (!stories.length) {
      grid.innerHTML = `<p class="empty-state">Aún no hay historias publicadas.</p>`
      return
    }

    grid.innerHTML = stories.map(v => {
      const safeTitle = v.title.replace(/'/g, "\\'")
      return `
      <div class="story-card" onclick="abrirVideoModal('${v.id}','${safeTitle}')">
        <div class="story-image">
          <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" loading="lazy">
          <span class="story-category">${v.duration || 'Historia'}</span>
          <div class="story-play-overlay"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>
        </div>
        <div class="story-content">
          <h3 class="story-title">${v.title}</h3>
          <p class="story-excerpt">${v.views || 'Contenido audiovisual de Futea'}</p>
          <button class="btn btn-outline-black" onclick="event.stopPropagation();abrirVideoModal('${v.id}','${safeTitle}')">Ver Historia <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></button>
        </div>
      </div>`
    }).join('')
  }

  function applyConfig(config) {
    if (!config) return
    Object.entries(config).forEach(([key, val]) => {
      document.querySelectorAll(`[data-key="${key}"]`).forEach(el => {
        if (el.tagName === 'IMG') {
          el.onerror = () => { el.onerror = null; el.src = DEFAULT_LOGO }
          el.src = val || DEFAULT_LOGO
        }
        else if (el.tagName === 'A') el.href = val
        else el.textContent = val
      })
    })
    if (config.color_gold) document.documentElement.style.setProperty('--color-gold', config.color_gold)
    if (config.color_black) document.documentElement.style.setProperty('--color-black', config.color_black)
    document.querySelectorAll('.logo-image').forEach(img => {
      img.onerror = () => { img.onerror = null; img.src = DEFAULT_LOGO }
      img.src = config.logo_url || DEFAULT_LOGO
    })
    if (config.body_bg) document.body.style.backgroundImage = `url('${config.body_bg}')`
  }

  async function loadAll() {
    const [videos, products, sliderRows, configRows] = await Promise.all([
      fetchTable('videos'),
      fetchTable('products'),
      fetchTable('slider_images'),
      fetchTable('site_config')
    ])

    const videosData = videos
    const productsData = products
    const sliderData = sliderRows.map(r => r.url)
    const configData = Object.fromEntries(configRows.map(r => [r.key, r.value]))

    renderVideos(videosData)
    renderStories(videosData)
    renderProducts(productsData)
    applyConfig(configData)
    Slider.init(sliderData)
  }

  return { loadAll, renderVideos, renderProducts, applyConfig }
})()
