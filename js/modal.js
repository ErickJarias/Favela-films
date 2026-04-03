// ===== MODAL DE VIDEO =====
function abrirVideoModal(videoId, titulo) {
  const modal = document.getElementById('videoModal')
  const title = document.getElementById('videoModalTitle')
  const frame = document.getElementById('videoFrame')
  if (!modal) return
  title.textContent = titulo
  frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
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
