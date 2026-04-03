// ===== NAVEGACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-button')
  const closeMenuBtn = document.querySelector('.close-menu')
  const mobileMenu = document.querySelector('.mobile-menu')
  const backToTop = document.querySelector('.back-to-top')
  const adminButtons = [document.getElementById('adminLockBtn'), document.getElementById('adminLockBtnMobile')].filter(Boolean)

  mobileMenuBtn?.addEventListener('click', () => mobileMenu.classList.add('active'))
  closeMenuBtn?.addEventListener('click', () => mobileMenu.classList.remove('active'))
  document.querySelectorAll('.mobile-nav .nav-link').forEach(l =>
    l.addEventListener('click', () => mobileMenu.classList.remove('active'))
  )

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const id = this.getAttribute('href')
      if (id === '#') return
      const target = document.querySelector(id)
      if (target) {
        e.preventDefault()
        window.scrollTo({ top: target.offsetTop, behavior: 'smooth' })
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'))
        this.classList.add('active')
      }
    })
  })

  // Scroll effects
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset > 300
    backToTop?.classList.toggle('show', scrolled)
    document.querySelector('.header')?.classList.toggle('scrolled', scrolled)
  })

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))

  // Candado -> abre modal de login (desktop y mobile)
  adminButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      mobileMenu?.classList.remove('active')
      document.getElementById('adminLoginModal')?.removeAttribute('hidden')
      document.getElementById('modalEmail')?.focus()
    })
  })
})
