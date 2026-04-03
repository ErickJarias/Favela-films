// ===== EDITOR: lógica del panel admin =====
// Usa el cliente Supabase inicializado en supabase-client.js
const _db = window._supabaseClient
  || window.supabaseClient
  || (window.supabase?.createClient && window.SUPABASE_URL && window.SUPABASE_ANON_KEY
    ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)
    : null)

if (_db && !window._supabaseClient) window._supabaseClient = _db

const Editor = (() => {
  function db() { return _db }
  const VIDEO_META_KEY = 'video_meta'
  let cachedVideoMeta = null

  // --- Utilidades ---
  function toast(msg, type = 'success') {
    const el = document.getElementById('adminToast')
    el.textContent = msg
    el.className = `admin-toast show ${type}`
    setTimeout(() => el.classList.remove('show'), 3000)
  }

  function showProgress(percent) {
    const wrap = document.getElementById('uploadProgress')
    const fill = document.getElementById('progressFill')
    const text = document.getElementById('progressText')
    wrap.hidden = false
    fill.style.width = percent + '%'
    text.textContent = percent < 100 ? `Subiendo... ${percent}%` : 'Procesando...'
    if (percent >= 100) setTimeout(() => { wrap.hidden = true }, 1500)
  }

  function normalizeImageUrl(url) {
    if (!url) return ''
    if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('/upload/f_auto,q_auto/')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto/')
    }
    return url
  }

  function isValidHttpUrl(value) {
    try {
      const u = new URL(value)
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
      return false
    }
  }

  function safeJsonParse(value, fallback = {}) {
    try { return JSON.parse(value) } catch { return fallback }
  }

  async function loadVideoMeta() {
    if (cachedVideoMeta) return cachedVideoMeta
    const { data } = await _db.from('site_config').select('value').eq('key', VIDEO_META_KEY).maybeSingle()
    cachedVideoMeta = safeJsonParse(data?.value || '{}', {})
    return cachedVideoMeta
  }

  async function saveVideoMeta(meta) {
    cachedVideoMeta = meta || {}
    await _db.from('site_config').upsert(
      { key: VIDEO_META_KEY, value: JSON.stringify(cachedVideoMeta) },
      { onConflict: 'key' }
    )
  }

  function pickVideoPlatform(hostname = '') {
    const host = hostname.toLowerCase()
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube'
    if (host.includes('tiktok.com')) return 'tiktok'
    if (host.includes('facebook.com') || host.includes('fb.watch')) return 'facebook'
    if (host.includes('instagram.com')) return 'instagram'
    if (host.includes('vimeo.com')) return 'vimeo'
    return 'web'
  }

  function extractYoutubeId(input) {
    const raw = (input || '').trim()
    if (!raw) return ''
    if (/^[a-zA-Z0-9_-]{6,15}$/.test(raw)) return raw

    try {
      const u = new URL(raw)
      if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '').trim()
      if (u.searchParams.get('v')) return u.searchParams.get('v').trim()
      const parts = u.pathname.split('/').filter(Boolean)
      const embedIdx = parts.findIndex(p => p === 'embed' || p === 'shorts')
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1].trim()
    } catch {
      return ''
    }
    return ''
  }

  function normalizeVideoInput(input) {
    const raw = (input || '').trim()
    if (!raw) return null

    const yt = extractYoutubeId(raw)
    if (yt) {
      return {
        rowId: yt,
        url: `https://www.youtube.com/watch?v=${yt}`,
        platform: 'youtube',
        thumbnail: `https://img.youtube.com/vi/${yt}/hqdefault.jpg`
      }
    }

    if (!isValidHttpUrl(raw)) return null
    const u = new URL(raw)
    const platform = pickVideoPlatform(u.hostname)
    return {
      rowId: `vid_${Date.now()}`,
      url: raw,
      platform,
      thumbnail: ''
    }
  }

  // --- Navegación sidebar ---
  function initNav() {
    const items = document.querySelectorAll('.sidebar-item')
    const sections = document.querySelectorAll('.admin-section')
    const topbarTitle = document.getElementById('topbarTitle')
    const sidebar = document.getElementById('adminSidebar')
    const menuBtn = document.getElementById('topbarMenuBtn')
    const sidebarClose = document.getElementById('sidebarClose')

    items.forEach(item => {
      item.addEventListener('click', () => {
        items.forEach(i => i.classList.remove('active'))
        sections.forEach(s => s.classList.remove('active'))
        item.classList.add('active')
        document.getElementById('section-' + item.dataset.section).classList.add('active')
        topbarTitle.textContent = item.textContent.trim()
        sidebar.classList.remove('open')
        // Cargar datos de la sección
        loadSection(item.dataset.section)
      })
    })

    menuBtn?.addEventListener('click', () => sidebar.classList.toggle('open'))
    sidebarClose?.addEventListener('click', () => sidebar.classList.remove('open'))
  }

  // --- Cargar datos por sección ---
  async function loadSection(section) {
    if (section === 'slider') await loadSlider()
    if (section === 'videos') await loadVideos()
    if (section === 'productos') await loadProductos()
    if (section === 'textos' || section === 'contacto' || section === 'tema') await loadConfig()
  }

  // --- SLIDER ---
  async function loadSlider() {
    const grid = document.getElementById('sliderImgGrid')
    const count = document.getElementById('sliderCount')
    grid.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Cargando...</div>'

    try {
      const client = db()
      if (!client) { grid.innerHTML = '<p class="error-state">Sin conexión a Supabase</p>'; return }
      const { data, error } = await client.from('slider_images').select('*').order('order_index')
      if (error) { grid.innerHTML = '<p class="error-state">Error al cargar imágenes</p>'; return }

      count.textContent = data.length
      if (!data.length) { grid.innerHTML = '<p class="empty-state">No hay imágenes. Añade la primera.</p>'; return }

      grid.innerHTML = data.map((img, i) => `
      <div class="img-card" data-id="${img.id}">
        <img src="${img.url}" alt="Slide ${i+1}" loading="lazy">
        <div class="img-card-overlay">
          <div class="img-card-actions">
            ${i > 0 ? `<button class="btn-icon" onclick="Editor.moveSlider('${img.id}', -1)" title="Subir"><i class="fas fa-arrow-up"></i></button>` : ''}
            ${i < data.length-1 ? `<button class="btn-icon" onclick="Editor.moveSlider('${img.id}', 1)" title="Bajar"><i class="fas fa-arrow-down"></i></button>` : ''}
            <button class="btn-icon btn-icon-danger" onclick="Editor.deleteSlider('${img.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <span class="img-card-num">${i+1}</span>
      </div>`).join('')
    } catch (e) {
      console.error('Error loadSlider()', e)
      grid.innerHTML = '<p class="error-state">Error inesperado al cargar imágenes</p>'
    }
  }

  async function addSliderImage(url) {
    const normalizedUrl = normalizeImageUrl(url)
    if (!isValidHttpUrl(normalizedUrl)) {
      toast('La URL de imagen no es válida', 'error')
      return
    }
    const { data: existing } = await _db.from('slider_images').select('order_index').order('order_index', { ascending: false }).limit(1)
    const nextOrder = existing?.length ? existing[0].order_index + 1 : 0
    const { error } = await _db.from('slider_images').insert({ url: normalizedUrl, order_index: nextOrder })
    if (error) { toast('Error al guardar imagen', 'error'); return }
    toast('Imagen añadida al carrusel')
    loadSlider()
  }

  async function deleteSlider(id) {
    if (!confirm('¿Eliminar esta imagen del carrusel?')) return
    const { error } = await _db.from('slider_images').delete().eq('id', id)
    if (error) { toast('Error al eliminar', 'error'); return }
    toast('Imagen eliminada')
    loadSlider()
  }

  async function moveSlider(id, dir) {
    const { data } = await _db.from('slider_images').select('*').order('order_index')
    const idx = data.findIndex(r => r.id === id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= data.length) return

    const a = data[idx], b = data[swapIdx]
    await _db.from('slider_images').update({ order_index: b.order_index }).eq('id', a.id)
    await _db.from('slider_images').update({ order_index: a.order_index }).eq('id', b.id)
    loadSlider()
  }

  // --- VIDEOS ---
  async function loadVideos() {
    const list = document.getElementById('videosList')
    const count = document.getElementById('videosCount')
    list.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i></div>'

    const { data, error } = await _db.from('videos').select('*').order('order_index')
    if (error) { list.innerHTML = '<p class="error-state">Error al cargar</p>'; return }
    const meta = await loadVideoMeta()

    count.textContent = data.length
    if (!data.length) { list.innerHTML = '<p class="empty-state">No hay videos.</p>'; return }

    list.innerHTML = data.map(v => {
      const videoMeta = meta[v.id] || {}
      const thumb = videoMeta.thumbnail || `https://img.youtube.com/vi/${v.id}/default.jpg`
      const category = videoMeta.category || 'general'
      const platform = (videoMeta.platform || 'youtube').toUpperCase()
      return `
      <div class="data-item">
        <img src="${thumb}" alt="${v.title}">
        <div class="data-item-info">
          <strong>${v.title}</strong>
          <span>${platform} · ${category} · ${v.duration} · ${v.views}</span>
        </div>
        <button class="btn-icon" onclick="Editor.editVideo('${v.id}')" title="Editar"><i class="fas fa-pen"></i></button>
        <button class="btn-icon btn-icon-danger" onclick="Editor.deleteVideo('${v.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
      </div>`
    }).join('')
  }

  async function addVideo() {
    const input = document.getElementById('newVideoUrl').value.trim()
    const title = document.getElementById('newVideoTitle').value.trim()
    const duration = document.getElementById('newVideoDuration').value.trim() || '0:00'
    const views = document.getElementById('newVideoViews').value.trim() || '0 visualizaciones'
    const category = (document.getElementById('newVideoCategory').value || 'general').trim().toLowerCase()

    if (!input || !title) { toast('URL y título son obligatorios', 'error'); return }

    const normalized = normalizeVideoInput(input)
    if (!normalized) { toast('La URL del video no es válida', 'error'); return }

    const { data: existing } = await _db.from('videos').select('order_index').order('order_index', { ascending: false }).limit(1)
    const nextOrder = existing?.length ? existing[0].order_index + 1 : 0

    const { error } = await _db.from('videos').insert({
      id: normalized.rowId,
      title,
      duration,
      views,
      order_index: nextOrder
    })
    if (error) {
      if (error.message?.toLowerCase().includes('duplicate')) {
        toast('Ese video ya existe. Usa otro URL.', 'error')
      } else {
        toast('Error al guardar video', 'error')
      }
      return
    }

    const meta = await loadVideoMeta()
    meta[normalized.rowId] = {
      url: normalized.url,
      platform: normalized.platform,
      category,
      thumbnail: normalized.thumbnail
    }
    await saveVideoMeta(meta)

    toast('Video añadido')
    document.getElementById('newVideoUrl').value = ''
    document.getElementById('newVideoTitle').value = ''
    document.getElementById('newVideoDuration').value = ''
    document.getElementById('newVideoViews').value = ''
    document.getElementById('newVideoCategory').value = 'general'
    loadVideos()
  }

  async function editVideo(id) {
    const { data, error } = await _db.from('videos').select('*').eq('id', id).maybeSingle()
    if (error || !data) { toast('No se pudo cargar el video', 'error'); return }

    const meta = await loadVideoMeta()
    const currentMeta = meta[id] || {}

    const currentUrl = currentMeta.url || `https://www.youtube.com/watch?v=${id}`
    const newUrl = prompt('URL del video:', currentUrl)
    if (newUrl === null) return
    const normalized = normalizeVideoInput(newUrl.trim())
    if (!normalized) { toast('URL inválida', 'error'); return }

    const newTitle = prompt('Título:', data.title)
    if (newTitle === null || !newTitle.trim()) return

    const newDuration = prompt('Duración (ej: 10:25):', data.duration || '0:00')
    if (newDuration === null) return

    const newViews = prompt('Visualizaciones:', data.views || '0 visualizaciones')
    if (newViews === null) return

    const newCategory = prompt('Categoría (torneo, historia, entrenamiento, entrevista, general):', currentMeta.category || 'general')
    if (newCategory === null) return

    const { error: updateError } = await _db.from('videos').update({
      title: newTitle.trim(),
      duration: newDuration.trim() || '0:00',
      views: newViews.trim() || '0 visualizaciones'
    }).eq('id', id)

    if (updateError) { toast('Error al actualizar video', 'error'); return }

    meta[id] = {
      url: normalized.url,
      platform: normalized.platform,
      category: (newCategory || 'general').trim().toLowerCase(),
      thumbnail: normalized.thumbnail
    }
    await saveVideoMeta(meta)

    toast('Video actualizado')
    loadVideos()
  }

  async function deleteVideo(id) {
    if (!confirm('¿Eliminar este video?')) return
    const { error } = await _db.from('videos').delete().eq('id', id)
    if (error) { toast('Error al eliminar video', 'error'); return }

    const meta = await loadVideoMeta()
    if (meta[id]) {
      delete meta[id]
      await saveVideoMeta(meta)
    }

    toast('Video eliminado')
    loadVideos()
  }

  // --- PRODUCTOS ---
  let pendingProductImg = ''

  async function loadProductos() {
    const list = document.getElementById('productosList')
    const count = document.getElementById('productosCount')
    list.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i></div>'

    const { data, error } = await _db.from('products').select('*').order('order_index')
    if (error) { list.innerHTML = '<p class="error-state">Error al cargar</p>'; return }

    count.textContent = data.length
    if (!data.length) { list.innerHTML = '<p class="empty-state">No hay productos.</p>'; return }

    list.innerHTML = data.map(p => `
      <div class="data-item">
        <img src="${p.img}" alt="${p.name}">
        <div class="data-item-info">
          <strong>${p.name}</strong>
          <span>${p.price}${p.badge ? ' · ' + p.badge : ''}</span>
        </div>
        <button class="btn-icon" onclick="Editor.editProduct(${p.id})" title="Editar"><i class="fas fa-pen"></i></button>
        <button class="btn-icon btn-icon-danger" onclick="Editor.deleteProduct(${p.id})" title="Eliminar"><i class="fas fa-trash"></i></button>
      </div>`).join('')
  }

  async function addProduct() {
    const name = document.getElementById('newProductName').value.trim()
    const price = document.getElementById('newProductPrice').value.trim()
    const badge = document.getElementById('newProductBadge').value.trim()
    if (!name || !price || !pendingProductImg) { toast('Imagen, nombre y precio son obligatorios', 'error'); return }

    const { data: existing } = await _db.from('products').select('order_index').order('order_index', { ascending: false }).limit(1)
    const nextOrder = existing?.length ? existing[0].order_index + 1 : 0

    const { error } = await _db.from('products').insert({ img: pendingProductImg, name, price, badge, order_index: nextOrder })
    if (error) { toast('Error al guardar producto', 'error'); return }

    toast('Producto añadido')
    pendingProductImg = ''
    document.getElementById('productImgPreview').hidden = true
    document.getElementById('newProductName').value = ''
    document.getElementById('newProductPrice').value = ''
    document.getElementById('newProductBadge').value = ''
    loadProductos()
  }

  async function editProduct(id) {
    const { data, error } = await _db.from('products').select('*').eq('id', id).maybeSingle()
    if (error || !data) { toast('No se pudo cargar el producto', 'error'); return }

    const newName = prompt('Nombre del producto:', data.name || '')
    if (newName === null || !newName.trim()) return

    const newPrice = prompt('Precio:', data.price || '')
    if (newPrice === null || !newPrice.trim()) return

    const newBadge = prompt('Badge (opcional):', data.badge || '')
    if (newBadge === null) return

    const newImg = prompt('URL de la imagen del producto:', data.img || '')
    if (newImg === null || !newImg.trim()) return
    if (!isValidHttpUrl(newImg.trim())) { toast('URL de imagen inválida', 'error'); return }

    const { error: updateError } = await _db.from('products').update({
      name: newName.trim(),
      price: newPrice.trim(),
      badge: newBadge.trim(),
      img: newImg.trim()
    }).eq('id', id)

    if (updateError) { toast('Error al actualizar producto', 'error'); return }

    toast('Producto actualizado')
    loadProductos()
  }

  async function deleteProduct(id) {
    if (!confirm('¿Eliminar este producto?')) return
    const { error } = await _db.from('products').delete().eq('id', id)
    if (error) { toast('Error al eliminar producto', 'error'); return }
    toast('Producto eliminado')
    loadProductos()
  }

  // --- CONFIG (textos, contacto, tema) ---
  async function loadConfig() {
    const { data } = await _db.from('site_config').select('*')
    if (!data) return
    const config = Object.fromEntries(data.map(r => [r.key, r.value]))

    // Rellenar todos los inputs con data-config
    document.querySelectorAll('[data-config]').forEach(el => {
      const val = config[el.dataset.config] || ''
      if (el.type === 'color') {
        el.value = val || el.value
        const hexInput = document.getElementById(el.id + 'Hex')
        if (hexInput) hexInput.value = val || el.value
      } else {
        el.value = val
      }
    })

    // Logo preview
    if (config.logo_url) document.getElementById('logoPreview').src = config.logo_url
  }

  async function saveConfig(keys) {
    const updates = []
    document.querySelectorAll('[data-config]').forEach(el => {
      if (!keys || keys.includes(el.dataset.config)) {
        updates.push({ key: el.dataset.config, value: el.value })
      }
    })

    for (const item of updates) {
      await _db.from('site_config').upsert({ key: item.key, value: item.value }, { onConflict: 'key' })
    }
    toast('Guardado correctamente')
  }

  // --- INIT ---
  function init() {
    initNav()
    if (!db()) {
      toast('No se pudo inicializar Supabase en admin', 'error')
      const grid = document.getElementById('sliderImgGrid')
      if (grid) grid.innerHTML = '<p class="error-state">Sin conexión a Supabase</p>'
    } else {
      loadSlider() // carga inicial
    }

    // Slider: upload Cloudinary
    Cloudinary.setupDropZone('uploadZone', 'fileInput', async (file) => {
      try {
        const url = await Cloudinary.upload(file, 'favelafilms/slider', showProgress)
        await addSliderImage(url)
      } catch (e) {
        console.error('Cloudinary slider upload error', e)
        toast('Error al subir imagen: ' + e.message, 'error')
      }
    })

    document.getElementById('btnAddSliderUrl')?.addEventListener('click', () => {
      const url = document.getElementById('sliderUrlInput').value.trim()
      if (!url) return
      addSliderImage(url)
      document.getElementById('sliderUrlInput').value = ''
    })

    // Videos
    document.getElementById('btnAddVideo')?.addEventListener('click', addVideo)

    // Productos: upload Cloudinary
    Cloudinary.setupDropZone('productUploadZone', 'productFileInput', async (file) => {
      try {
        const url = await Cloudinary.upload(file, 'favelafilms/products', null)
        pendingProductImg = url
        const preview = document.getElementById('productImgPreview')
        document.getElementById('productImgPreviewImg').src = url
        preview.hidden = false
      } catch (e) {
        console.error('Cloudinary product upload error', e)
        toast('Error al subir imagen: ' + e.message, 'error')
      }
    })

    document.getElementById('clearProductImg')?.addEventListener('click', () => {
      pendingProductImg = ''
      document.getElementById('productImgPreview').hidden = true
    })

    document.getElementById('btnAddProduct')?.addEventListener('click', addProduct)

    // Textos
    document.getElementById('btnSaveTextos')?.addEventListener('click', () => {
      saveConfig(['hero_subtitle','section_videos_title','section_historias_title','section_productos_title','footer_desc','footer_copy'])
    })

    // Contacto
    document.getElementById('btnSaveContacto')?.addEventListener('click', () => {
      saveConfig([
        'contact_address',
        'contact_phone',
        'contact_email',
        'social_facebook',
        'social_instagram',
        'social_youtube',
        'whatsapp_order_number',
        'whatsapp_seller_numbers'
      ])
    })

    // Tema
    document.getElementById('btnSaveTema')?.addEventListener('click', async () => {
      await saveConfig(['color_gold','color_black','body_bg'])
      // Logo si hay URL
      const logoUrl = normalizeImageUrl(document.getElementById('logoUrlInput').value.trim())
      if (logoUrl) {
        if (!isValidHttpUrl(logoUrl)) {
          toast('La URL del logo no es válida', 'error')
          return
        }
        await _db.from('site_config').upsert({ key: 'logo_url', value: logoUrl }, { onConflict: 'key' })
        document.getElementById('logoPreview').src = logoUrl
      }
      toast('Tema guardado')
    })

    document.getElementById('btnResetTema')?.addEventListener('click', async () => {
      if (!confirm('¿Resetear el tema a los valores por defecto?')) return
      const defaults = [
        { key: 'color_gold', value: '#d4af37' },
        { key: 'color_black', value: '#000000' },
        { key: 'body_bg', value: '' },
        { key: 'logo_url', value: 'https://res.cloudinary.com/dbm8zejcu/image/upload/q_auto/f_auto/v1775178865/logo_eg8uop.jpg' }
      ]
      for (const d of defaults) await _db.from('site_config').upsert(d, { onConflict: 'key' })
      loadConfig()
      toast('Tema reseteado')
    })

    // Logo upload Cloudinary
    Cloudinary.setupDropZone('logoUploadZone', 'logoFileInput', async (file) => {
      try {
        const url = await Cloudinary.upload(file, 'favelafilms/logo', null)
        document.getElementById('logoUrlInput').value = url
        document.getElementById('logoPreview').src = url
        toast('Logo subido. Guarda el tema para aplicarlo.')
      } catch (e) {
        console.error('Cloudinary logo upload error', e)
        toast('Error al subir logo: ' + e.message, 'error')
      }
    })

    // Sync color picker ↔ hex input
    document.getElementById('colorGold')?.addEventListener('input', e => {
      document.getElementById('colorGoldHex').value = e.target.value
    })
    document.getElementById('colorGoldHex')?.addEventListener('input', e => {
      if (/^#[0-9a-f]{6}$/i.test(e.target.value)) document.getElementById('colorGold').value = e.target.value
    })
    document.getElementById('colorBlack')?.addEventListener('input', e => {
      document.getElementById('colorBlackHex').value = e.target.value
    })
    document.getElementById('colorBlackHex')?.addEventListener('input', e => {
      if (/^#[0-9a-f]{6}$/i.test(e.target.value)) document.getElementById('colorBlack').value = e.target.value
    })
  }

  return { init, deleteSlider, moveSlider, deleteVideo, editVideo, deleteProduct, editProduct }
})()
