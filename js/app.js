// ===== APP: inicialización principal =====
document.addEventListener('DOMContentLoaded', async () => {
  // Cargar datos y renderizar
  await Renderer.loadAll()
  
  // Una vez cargado todo, inicializar el preview de la galería si estamos en index
  initGalleryPreview()
})

/**
 * Inicializa el preview de la galería en la página principal
 */
async function initGalleryPreview() {
  const grid = document.getElementById('galleryPreview')
  if (!grid) return

  const FALLBACK_SLIDER = [
    'https://res.cloudinary.com/dbm8zejcu/image/upload/q_auto/f_auto/v1775178864/0_2_s8io9e.jpg',
    'https://res.cloudinary.com/dbm8zejcu/image/upload/q_auto/f_auto/v1775178864/0_4_a8kvm7.jpg',
    'https://res.cloudinary.com/dbm8zejcu/image/upload/q_auto/f_auto/v1775178865/0_6_nzodkt.jpg',
    'https://res.cloudinary.com/dbm8zejcu/image/upload/q_auto/f_auto/v1775178864/0_3_nt20pa.jpg',
    'https://res.cloudinary.com/dbm8zejcu/image/upload/q_auto/f_auto/v1775178865/0_9_nnr5e0.jpg',
    'https://res.cloudinary.com/dbm8zejcu/image/upload/q_auto/f_auto/v1775178865/0_5_ni8bqz.jpg',
    'https://res.cloudinary.com/dbm8zejcu/image/upload/q_auto/f_auto/v1775178865/0_11_tuuhub.jpg',
    'https://res.cloudinary.com/dbm8zejcu/image/upload/q_auto/f_auto/v1775178865/0_8_hrvagg.jpg',
  ]

  try {
    const db = window._supabaseClient
    if (db) {
      const { data, error } = await db.from('slider_images')
        .select('url')
        .order('order_index', { ascending: true })
        .limit(8)
      
      if (!error && data?.length) {
        renderGalleryPreview(data.map(r => r.url))
        return
      }
    }
  } catch (err) {
    console.error('Error cargando preview de galería:', err)
  }
  
  renderGalleryPreview(FALLBACK_SLIDER)
}

/**
 * Renderiza las imágenes en el grid de preview
 */
function renderGalleryPreview(images) {
  const grid = document.getElementById('galleryPreview')
  if (!grid) return
  
  // Mostrar máximo 8 imágenes
  const preview = images.slice(0, 8)
  grid.innerHTML = preview.map((src, i) => `
    <a href="galeria.html" class="gallery-preview-item" aria-label="Ver galería completa">
      <img src="${src.replace('/upload/', '/upload/w_400,q_auto,f_auto/')}" 
           alt="Fútea galería ${i+1}" 
           loading="lazy"
           onerror="Utils.handleImageError(this)">
      <div class="gallery-preview-item-overlay"><i class="fas fa-images"></i></div>
    </a>`).join('')
}
