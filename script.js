// Configuración del slider con efecto rebote
let slideActual = 0
const totalSlides = 4
let intervaloSlider
let sliderPausado = false
let direccionActual = 1 // 1 = hacia adelante, -1 = hacia atrás

// Función para cambiar slide con efecto rebote
function cambiarSlide(direccion) {
  const slider = document.querySelector(".hero-slider")
  const indicadores = document.querySelectorAll(".indicator")

  if (!slider || !indicadores.length) return

  // Remover clase active del slide actual
  indicadores[slideActual].classList.remove("active")

  // Calcular nuevo slide según la dirección
  if (direccion === "next" || direccion === "auto") {
    slideActual += direccionActual

    // Verificar límites y cambiar dirección si es necesario
    if (slideActual >= totalSlides - 1) {
      slideActual = totalSlides - 1
      direccionActual = -1 // Cambiar dirección hacia atrás
    } else if (slideActual <= 0) {
      slideActual = 0
      direccionActual = 1 // Cambiar dirección hacia adelante
    }
  } else if (direccion === "prev") {
    slideActual -= direccionActual

    // Verificar límites y cambiar dirección si es necesario
    if (slideActual <= 0) {
      slideActual = 0
      direccionActual = 1
    } else if (slideActual >= totalSlides - 1) {
      slideActual = totalSlides - 1
      direccionActual = -1
    }
  } else if (typeof direccion === "number") {
    slideActual = direccion
    // Determinar nueva dirección basada en la posición
    if (slideActual === 0) {
      direccionActual = 1
    } else if (slideActual === totalSlides - 1) {
      direccionActual = -1
    }
  }

  // Aplicar transformación
  const desplazamiento = -slideActual * 100
  slider.style.transform = `translateX(${desplazamiento}%)`

  // Actualizar indicador activo
  indicadores[slideActual].classList.add("active")

  // Reiniciar animación del contenido
  const slides = document.querySelectorAll(".slide")
  slides.forEach((slide) => slide.classList.remove("active"))
  if (slides[slideActual]) {
    slides[slideActual].classList.add("active")
  }
}

// Función para iniciar el slider automático con rebote
function iniciarSliderAutomatico() {
  if (!sliderPausado) {
    intervaloSlider = setInterval(() => {
      cambiarSlide("auto")
    }, 7000) // Cambiar cada 5 segundos
  }
}

// Función para pausar el slider
function pausarSlider() {
  if (intervaloSlider) {
    clearInterval(intervaloSlider)
  }
  sliderPausado = true
}

// Función para reanudar el slider
function reanudarSlider() {
  sliderPausado = false
  iniciarSliderAutomatico()
}

// Función para ir a slide específico (para indicadores)
function irASlide(indice) {
  pausarSlider()
  cambiarSlide(indice)
  setTimeout(reanudarSlider, 3000)
}

// Controles manuales mejorados
function cambiarSlideManual(direccion) {
  pausarSlider()

  if (direccion === "next") {
    // Forzar movimiento hacia adelante
    if (slideActual < totalSlides - 1) {
      slideActual++
    } else {
      slideActual = totalSlides - 1
      direccionActual = -1
    }
  } else if (direccion === "prev") {
    // Forzar movimiento hacia atrás
    if (slideActual > 0) {
      slideActual--
    } else {
      slideActual = 0
      direccionActual = 1
    }
  }

  // Aplicar cambio
  const slider = document.querySelector(".hero-slider")
  const indicadores = document.querySelectorAll(".indicator")

  if (slider && indicadores.length) {
    // Actualizar indicadores
    indicadores.forEach((ind) => ind.classList.remove("active"))
    indicadores[slideActual].classList.add("active")

    // Aplicar transformación
    const desplazamiento = -slideActual * 100
    slider.style.transform = `translateX(${desplazamiento}%)`

    // Actualizar slides activos
    const slides = document.querySelectorAll(".slide")
    slides.forEach((slide) => slide.classList.remove("active"))
    if (slides[slideActual]) {
      slides[slideActual].classList.add("active")
    }
  }

  setTimeout(reanudarSlider, 3000)
}

// Funciones para el modal de video
function abrirVideoModal(videoId, titulo) {
  const modal = document.getElementById("videoModal")
  const modalTitle = document.getElementById("videoModalTitle")
  const videoFrame = document.getElementById("videoFrame")

  if (!modal || !modalTitle || !videoFrame) return

  // Configurar título
  modalTitle.textContent = titulo

  // Configurar iframe de YouTube
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
  videoFrame.src = embedUrl

  // Mostrar modal
  modal.classList.add("show")
  document.body.style.overflow = "hidden" // Prevenir scroll del body

  // Pausar slider si está activo
  pausarSlider()
}

function cerrarVideoModal() {
  const modal = document.getElementById("videoModal")
  const videoFrame = document.getElementById("videoFrame")

  if (!modal || !videoFrame) return

  // Ocultar modal
  modal.classList.remove("show")
  document.body.style.overflow = "auto" // Restaurar scroll del body

  // Detener video
  videoFrame.src = ""

  // Reanudar slider
  reanudarSlider()
}

// Mobile menu toggle
const mobileMenuBtn = document.querySelector(".mobile-menu-button")
const closeMenuBtn = document.querySelector(".close-menu")
const mobileMenu = document.querySelector(".mobile-menu")

if (mobileMenuBtn && closeMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("active")
  })

  closeMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("active")
  })
}

// Close mobile menu when clicking on links
const mobileLinks = document.querySelectorAll(".mobile-nav .nav-link")
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobileMenu) {
      mobileMenu.classList.remove("active")
    }
  })
})

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    const targetId = this.getAttribute("href")
    if (targetId === "#") return

    const targetElement = document.querySelector(targetId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: "smooth",
      })

      // Update active link
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active")
      })
      this.classList.add("active")
    }
  })
})

// Back to top button
const backToTopBtn = document.querySelector(".back-to-top")

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("show")
      const header = document.querySelector(".header")
      if (header) {
        header.classList.add("scrolled")
      }
    } else {
      backToTopBtn.classList.remove("show")
      const header = document.querySelector(".header")
      if (header) {
        header.classList.remove("scrolled")
      }
    }
  })

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Highlight active section in navigation
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll(".section")
  const navLinks = document.querySelectorAll(".nav-link")

  let current = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight

    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

// Cerrar modal al hacer clic fuera del contenido
document.addEventListener("click", (e) => {
  const modal = document.getElementById("videoModal")
  if (e.target === modal) {
    cerrarVideoModal()
  }
})

// Cerrar modal con tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarVideoModal()
  }
})

// Función para extraer ID de video de URL de YouTube
function extraerVideoId(url) {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Inicializar slider cuando cargue la página
document.addEventListener("DOMContentLoaded", () => {
  // Verificar que existan los elementos necesarios
  const slider = document.querySelector(".hero-slider")
  const indicadores = document.querySelectorAll(".indicator")

  if (!slider || !indicadores.length) {
    console.warn("Elementos del slider no encontrados")
    return
  }

  // Configurar eventos de los indicadores
  indicadores.forEach((indicador, index) => {
    indicador.addEventListener("click", () => {
      irASlide(index)
    })
  })

  // Pausar slider al pasar el mouse sobre el hero
  const hero = document.querySelector(".hero")
  if (hero) {
    hero.addEventListener("mouseenter", pausarSlider)
    hero.addEventListener("mouseleave", reanudarSlider)
  }

  // Configurar primer slide como activo
  const primerSlide = document.querySelector(".slide")
  if (primerSlide) {
    primerSlide.classList.add("active")
  }

  // Iniciar slider automático
  iniciarSliderAutomatico()
})

// Función para controles de teclado
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    cambiarSlideManual("prev")
  } else if (e.key === "ArrowRight") {
    cambiarSlideManual("next")
  }
})

// Pausar slider cuando la pestaña no esté visible
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pausarSlider()
  } else {
    reanudarSlider()
  }
})
