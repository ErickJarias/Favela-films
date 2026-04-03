// ===== SLIDER PLANO — soporte desktop/mobile =====
const Slider = (() => {
  let current = 0
  let total = 0
  let timer = null
  let paused = false
  let slidesData = [] // array de { url, url_mobile }
  const INTERVAL = 6000
  const MOBILE_BP = 768 // px — breakpoint móvil

  // Devuelve true si estamos en móvil
  function isMobile() { return window.innerWidth < MOBILE_BP }

  // Elige la URL correcta para un slide según el viewport
  // Si no hay url_mobile, usa Cloudinary para hacer crop portrait automático
  function resolveUrl(slide) {
    const isMob = isMobile()
    if (!isMob) return slide.url

    // Tiene URL móvil específica → usarla
    if (slide.url_mobile) return slide.url_mobile

    // Es URL de Cloudinary → aplicar crop portrait automático
    if (slide.url && slide.url.includes('cloudinary.com')) {
      return slide.url.replace('/upload/', '/upload/ar_9:16,c_fill,g_auto,w_600,q_auto,f_auto/')
    }

    // Fallback: misma imagen
    return slide.url
  }

  function build(data) {
    const track = document.getElementById('sliderTrack')
    const dots = document.getElementById('sliderDots')
    const controls = document.querySelector('.slider-controls')
    if (!track) return

    // Normalizar: acepta strings o { url, url_mobile }
    slidesData = data.map(s => typeof s === 'string' ? { url: s, url_mobile: '' } : s)
    total = slidesData.length

    track.innerHTML = ''
    if (dots) dots.innerHTML = ''
    if (controls) controls.style.display = total ? 'flex' : 'none'
    if (dots) dots.style.display = total ? 'flex' : 'none'

    if (!total) {
      track.innerHTML = `<div class="slide active" style="background:#111"></div>`
      current = 0
      return
    }

    slidesData.forEach((slide, i) => {
      const el = document.createElement('div')
      const hasMobile = isMobile() && slide.url_mobile
      el.className = 'slide' + (i === 0 ? ' active' : '') + (hasMobile ? ' mobile-portrait' : '')
      el.style.backgroundImage = `url('${resolveUrl(slide)}')`
      el.dataset.index = i
      track.appendChild(el)

      if (dots) {
        const dot = document.createElement('button')
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '')
        dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`)
        dot.addEventListener('click', () => { pause(); goTo(i); setTimeout(resume, 4000) })
        dots.appendChild(dot)
      }
    })
    current = 0
  }

  // Actualiza las imágenes cuando cambia el tamaño de pantalla
  function refreshImages() {
    const slides = document.querySelectorAll('.slide')
    slidesData.forEach((slide, i) => {
      if (!slides[i]) return
      slides[i].style.backgroundImage = `url('${resolveUrl(slide)}')`
      // Actualizar clase portrait
      if (isMobile() && slide.url_mobile) {
        slides[i].classList.add('mobile-portrait')
      } else {
        slides[i].classList.remove('mobile-portrait')
      }
    })
  }

  function goTo(index) {
    const slides = document.querySelectorAll('.slide')
    const dotEls = document.querySelectorAll('.slider-dot')
    if (!slides.length) return

    slides[current].classList.remove('active')
    dotEls[current]?.classList.remove('active')

    current = (index + total) % total

    slides[current].classList.add('active')
    dotEls[current]?.classList.add('active')
  }

  function next() { goTo(current + 1) }
  function prev() { goTo(current - 1) }

  function startAuto() {
    stopAuto()
    if (!paused) timer = setInterval(next, INTERVAL)
  }
  function stopAuto() { if (timer) { clearInterval(timer); timer = null } }
  function pause() { paused = true; stopAuto() }
  function resume() { paused = false; startAuto() }

  function init(data) {
    build(data)

    const btnNext = document.getElementById('sliderNext')
    const btnPrev = document.getElementById('sliderPrev')
    const hero = document.querySelector('.hero')

    btnNext?.addEventListener('click', () => { pause(); next(); setTimeout(resume, 4000) })
    btnPrev?.addEventListener('click', () => { pause(); prev(); setTimeout(resume, 4000) })

    hero?.addEventListener('mouseenter', pause)
    hero?.addEventListener('mouseleave', resume)

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { pause(); prev(); setTimeout(resume, 4000) }
      if (e.key === 'ArrowRight') { pause(); next(); setTimeout(resume, 4000) }
    })

    document.addEventListener('visibilitychange', () => {
      document.hidden ? pause() : resume()
    })

    // Touch/swipe
    let touchStartX = 0
    hero?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX }, { passive: true })
    hero?.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) { pause(); diff > 0 ? next() : prev(); setTimeout(resume, 4000) }
    }, { passive: true })

    // Actualizar imágenes al rotar/redimensionar
    let resizeTimer
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(refreshImages, 200)
    })

    startAuto()
  }

  function rebuild(data) { stopAuto(); build(data); startAuto() }

  return { init, rebuild, next, prev, goTo, pause, resume }
})()
