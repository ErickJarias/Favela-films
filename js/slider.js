// ===== SLIDER PLANO (Ken Burns effect) =====
const Slider = (() => {
  let current = 0
  let total = 0
  let timer = null
  let paused = false
  const INTERVAL = 6000
  const TRANSITION = 900

  function build(slides) {
    const track = document.getElementById('sliderTrack')
    const dots = document.getElementById('sliderDots')
    const controls = document.querySelector('.slider-controls')
    if (!track) return

    total = slides.length
    track.innerHTML = ''
    if (dots) dots.innerHTML = ''
    if (controls) controls.style.display = total ? 'flex' : 'none'
    if (dots) dots.style.display = total ? 'flex' : 'none'

    if (!total) {
      track.innerHTML = `<div class="slide active" style="background: linear-gradient(180deg, #111 0%, #000 100%);"></div>`
      current = 0
      return
    }

    slides.forEach((src, i) => {
      const slide = document.createElement('div')
      slide.className = 'slide' + (i === 0 ? ' active' : '')
      slide.style.backgroundImage = `url('${src}')`
      track.appendChild(slide)

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

  function init(slides) {
    build(slides)

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

    startAuto()
  }

  function rebuild(slides) { stopAuto(); build(slides); startAuto() }

  return { init, rebuild, next, prev, goTo, pause, resume }
})()
