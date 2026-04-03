// ===== APP: inicialización principal =====
document.addEventListener('DOMContentLoaded', () => {
  Renderer.loadAll()
})

// ── Preview galería en index ──
function renderGalleryPreview(images) {
  const grid = document.getElementById('galleryPreview')
  if (!grid) return
  // Mostrar máximo 8 imágenes en el preview
  const preview = images.slice(0, 8)
  grid.innerHTML = preview.map((src, i) => `
    <a href="galeria.html" class="gallery-preview-item" aria-label="Ver galería">
      <img src="${src.replace('/upload/', '/upload/w_400,q_auto,f_auto/')}" alt="Fútea galería ${i+1}" loading="lazy">
      <div class="gallery-preview-item-overlay"><i class="fas fa-images"></i></div>
    </a>`).join('')
}

// Sobrescribir loadAll para incluir preview
const _origLoadAll = Renderer.loadAll.bind(Renderer)
Renderer.loadAll = async function() {
  await _origLoadAll()
  // Usar las imágenes del slider como preview
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
      const { data } = await db.from('slider_images').select('url').order('order_index', { ascending: true }).limit(8)
      if (data?.length) { renderGalleryPreview(data.map(r => r.url)); return }
    }
  } catch {}
  renderGalleryPreview(FALLBACK_SLIDER)
}
