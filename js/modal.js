// ===== MODAL DE VIDEO =====
function extractYouTubeId(value) {
  const raw = (value || '').trim()
  if (!raw) return ''
  if (/^[a-zA-Z0-9_-]{6,15}$/.test(raw)) return raw
  try {
    const u = new URL(raw)
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '').trim()
    if (u.searchParams.get('v')) return u.searchParams.get('v').trim()
    const parts = u.pathname.split('/').filter(Boolean)
    const idx = parts.findIndex(p => p === 'embed' || p === 'shorts')
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1].trim()
  } catch {}
  return ''
}

function abrirVideoModal(videoRef, titulo, platform = '') {
  const input = (videoRef || '').trim()
  const inferredPlatform = (platform || '').toLowerCase()
  const youtubeId = inferredPlatform === 'youtube' ? extractYouTubeId(input) : extractYouTubeId(input)

  if (!youtubeId && /^https?:\/\//i.test(input)) {
    window.open(input, '_blank', 'noopener')
    return
  }

  const modal = document.getElementById('videoModal')
  const title = document.getElementById('videoModalTitle')
  const frame = document.getElementById('videoFrame')
  if (!modal) return
  title.textContent = titulo
  frame.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`
  modal.classList.add('show')
  document.body.style.overflow = 'hidden'
  Slider.pause()
}

function cerrarVideoModal() {
  const modal = document.getElementById('videoModal')
  const frame = document.getElementById('videoFrame')
  if (!modal) return
  modal.classList.remove('show')
  document.body.style.overflow = ''
  frame.src = ''
  Slider.resume()
}

document.addEventListener('click', e => {
  if (e.target === document.getElementById('videoModal')) cerrarVideoModal()
})
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') cerrarVideoModal()
})
