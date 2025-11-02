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

// Validación de formularios
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

function mostrarMensajeValidacion(elemento, mensaje, tipo = 'error') {
  // Remover mensaje anterior
  const mensajeAnterior = elemento.parentNode.querySelector('.validation-message')
  if (mensajeAnterior) {
    mensajeAnterior.remove()
  }

  // Crear nuevo mensaje
  const mensajeElemento = document.createElement('div')
  mensajeElemento.className = `validation-message ${tipo}`
  mensajeElemento.textContent = mensaje
  mensajeElemento.style.cssText = `
    font-size: 12px;
    margin-top: 5px;
    padding: 5px 10px;
    border-radius: 4px;
    ${tipo === 'error' ?
      'color: #dc3545; background: #f8d7da; border: 1px solid #f5c6cb;' :
      'color: #155724; background: #d4edda; border: 1px solid #c3e6cb;'
    }
  `

  elemento.parentNode.appendChild(mensajeElemento)

  // Auto-remover mensaje de éxito después de 3 segundos
  if (tipo === 'success') {
    setTimeout(() => {
      if (mensajeElemento.parentNode) {
        mensajeElemento.remove()
      }
    }, 3000)
  }
}

// Validación del formulario de newsletter
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...

  // Validación formulario newsletter
  const newsletterForm = document.querySelector('.newsletter-form')
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault()

      const emailInput = newsletterForm.querySelector('input[type="email"]')
      const email = emailInput.value.trim()

      // Remover mensajes anteriores
      const mensajeAnterior = newsletterForm.querySelector('.validation-message')
      if (mensajeAnterior) {
        mensajeAnterior.remove()
      }

      if (!email) {
        mostrarMensajeValidacion(emailInput, 'Por favor ingresa tu correo electrónico')
        return
      }

      if (!validarEmail(email)) {
        mostrarMensajeValidacion(emailInput, 'Por favor ingresa un correo electrónico válido')
        return
      }

      // Simular envío (en producción esto iría a un servidor)
      mostrarMensajeValidacion(emailInput, '¡Gracias por suscribirte! Recibirás nuestras novedades pronto.', 'success')
      emailInput.value = ''
    })
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

// Búsqueda y filtros de productos
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...

  // Funcionalidad de búsqueda y filtros
  const searchInput = document.getElementById('product-search')
  const searchBtn = document.getElementById('search-btn')
  const categoryFilter = document.getElementById('category-filter')
  const priceFilter = document.getElementById('price-filter')
  const sortFilter = document.getElementById('sort-filter')

  let productosOriginales = []

  // Guardar productos originales al cargar la página
  function guardarProductosOriginales() {
    const productCards = document.querySelectorAll('.product-card')
    productosOriginales = Array.from(productCards).map(card => ({
      element: card,
      title: card.querySelector('.product-title').textContent.toLowerCase(),
      price: parseInt(card.querySelector('.product-price').textContent.replace(/[^\d]/g, '')),
      category: obtenerCategoria(card),
      visible: true
    }))
  }

  function obtenerCategoria(card) {
    const title = card.querySelector('.product-title').textContent.toLowerCase()
    if (title.includes('camiseta')) return 'camiseta'
    if (title.includes('balón') || title.includes('balon')) return 'balon'
    if (title.includes('zapatillas') || title.includes('joma')) return 'zapatillas'
    if (title.includes('medias')) return 'medias'
    return ''
  }

  function aplicarFiltros() {
    const searchTerm = searchInput.value.toLowerCase().trim()
    const selectedCategory = categoryFilter.value
    const selectedPriceRange = priceFilter.value
    const selectedSort = sortFilter.value

    productosOriginales.forEach(producto => {
      let visible = true

      // Filtro de búsqueda
      if (searchTerm && !producto.title.includes(searchTerm)) {
        visible = false
      }

      // Filtro de categoría
      if (selectedCategory && producto.category !== selectedCategory) {
        visible = false
      }

      // Filtro de precio
      if (selectedPriceRange) {
        const [min, max] = selectedPriceRange.split('-')
        if (max) {
          if (max.includes('+')) {
            if (producto.price < parseInt(min)) visible = false
          } else {
            if (producto.price < parseInt(min) || producto.price > parseInt(max)) visible = false
          }
        }
      }

      producto.visible = visible
      producto.element.style.display = visible ? 'block' : 'none'
    })

    // Aplicar ordenamiento
    ordenarProductos(selectedSort)
  }

  function ordenarProductos(criterio) {
    const container = document.querySelector('.product-grid')
    const productosVisibles = productosOriginales.filter(p => p.visible)

    switch (criterio) {
      case 'price-low':
        productosVisibles.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        productosVisibles.sort((a, b) => b.price - a.price)
        break
      case 'name':
        productosVisibles.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'newest':
        // Mantener orden original (por defecto son los más nuevos)
        break
    }

    // Reordenar elementos en el DOM
    productosVisibles.forEach(producto => {
      container.appendChild(producto.element)
    })
  }

  // Event listeners
  if (searchBtn) {
    searchBtn.addEventListener('click', aplicarFiltros)
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        aplicarFiltros()
      }
    })
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', aplicarFiltros)
  }

  if (priceFilter) {
    priceFilter.addEventListener('change', aplicarFiltros)
  }

  if (sortFilter) {
    sortFilter.addEventListener('change', aplicarFiltros)
  }

  // Inicializar productos originales
  setTimeout(guardarProductosOriginales, 100) // Pequeño delay para asegurar que el DOM esté listo
})

// Carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || []
let cuponAplicado = localStorage.getItem('cuponAplicado') || null

// Cupones disponibles (en producción vendrían de una base de datos)
const cuponesValidos = {
  'FAVELA10': { descuento: 0.1, tipo: 'porcentaje', descripcion: '10% de descuento' },
  'ENVIOGRATIS': { descuento: 15000, tipo: 'fijo', descripcion: 'Envío gratis', minimoCompra: 100000 },
  'BIENVENIDO': { descuento: 5000, tipo: 'fijo', descripcion: '$5.000 de descuento en tu primera compra' },
  'FUTBOL': { descuento: 0.15, tipo: 'porcentaje', descripcion: '15% en productos de fútbol', categorias: ['camiseta', 'balon', 'medias'] }
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  const cartCount = document.querySelector('.cart-count')
  if (cartCount) {
    const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }
}

// Función para añadir producto al carrito
function agregarAlCarrito(producto) {
  // Verificar stock disponible
  const stockDisponible = verificarStock(producto.id).stock
  const maxPorCompra = verificarStock(producto.id).maxPorCompra

  const productoExistente = carrito.find(item => item.id === producto.id)
  const cantidadActualEnCarrito = productoExistente ? productoExistente.quantity : 0

  if (cantidadActualEnCarrito >= maxPorCompra) {
    mostrarNotificacion(`Solo puedes comprar máximo ${maxPorCompra} unidades de este producto`)
    return
  }

  if (cantidadActualEnCarrito >= stockDisponible) {
    mostrarNotificacion(`Solo quedan ${stockDisponible} unidades disponibles`)
    return
  }

  if (productoExistente) {
    productoExistente.quantity += 1
  } else {
    carrito.push({
      ...producto,
      quantity: 1
    })
  }

  localStorage.setItem('carrito', JSON.stringify(carrito))
  actualizarContadorCarrito()
  actualizarVisualizacionStock()

  // Mostrar notificación
  mostrarNotificacion(`${producto.title} añadido al carrito`)
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
  // Crear elemento de notificación si no existe
  let notificacion = document.querySelector('.cart-notification')
  if (!notificacion) {
    notificacion = document.createElement('div')
    notificacion.className = 'cart-notification'
    notificacion.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #000;
      color: #fff;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 1000;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s;
    `
    document.body.appendChild(notificacion)
  }

  notificacion.textContent = mensaje
  notificacion.style.opacity = '1'

  setTimeout(() => {
    notificacion.style.opacity = '0'
  }, 3000)
}

// Inventario de productos (en producción esto vendría de una base de datos)
const inventario = {
  'camiseta-oficial-seleccion-colombia': { stock: 15, maxPorCompra: 3 },
  'balon-de-futbol-profesional': { stock: 8, maxPorCompra: 2 },
  'zapatillas-joma-premium': { stock: 5, maxPorCompra: 1 },
  'medias-antideslizantes': { stock: 25, maxPorCompra: 5 }
}

// Función para verificar stock disponible
function verificarStock(productId) {
  return inventario[productId] || { stock: 0, maxPorCompra: 1 }
}

// Función para actualizar stock después de compra
function actualizarStock(productId, cantidad) {
  if (inventario[productId]) {
    inventario[productId].stock -= cantidad
    // Guardar cambios en localStorage (en producción iría a servidor)
    localStorage.setItem('inventario', JSON.stringify(inventario))
  }
}

// Función para obtener datos del producto desde el DOM
function obtenerDatosProducto(button) {
  const productCard = button.closest('.product-card')
  const title = productCard.querySelector('.product-title').textContent
  const priceText = productCard.querySelector('.product-price').textContent
  const price = parseInt(priceText.replace(/[^\d]/g, ''))
  const image = productCard.querySelector('.product-image img').src
  const productId = title.toLowerCase().replace(/\s+/g, '-')

  return {
    id: productId,
    title: title,
    price: price,
    image: image,
    stock: verificarStock(productId).stock,
    maxPorCompra: verificarStock(productId).maxPorCompra
  }
}

// Función para actualizar visualización de stock
function actualizarVisualizacionStock() {
  document.querySelectorAll('.product-card').forEach(card => {
    const title = card.querySelector('.product-title').textContent
    const productId = title.toLowerCase().replace(/\s+/g, '-')
    const stock = verificarStock(productId).stock
    const button = card.querySelector('.btn-black')
    const badge = card.querySelector('.product-badge')

    // Remover badge anterior de stock
    if (badge && badge.textContent.includes('STOCK')) {
      badge.remove()
    }

    if (button) {
      if (stock === 0) {
        button.textContent = 'Agotado'
        button.disabled = true
        button.style.opacity = '0.6'

        // Agregar badge de agotado
        const agotadoBadge = document.createElement('span')
        agotadoBadge.className = 'product-badge agotado'
        agotadoBadge.textContent = 'AGOTADO'
        agotadoBadge.style.cssText = 'background: #dc3545; color: white;'
        card.querySelector('.product-image').appendChild(agotadoBadge)
      } else if (stock <= 3) {
        button.textContent = `Añadir al carrito (${stock} disponibles)`
        button.disabled = false
        button.style.opacity = '1'

        // Agregar badge de stock limitado
        const stockBadge = document.createElement('span')
        stockBadge.className = 'product-badge stock-limitado'
        stockBadge.textContent = `ÚLTIMAS ${stock}`
        stockBadge.style.cssText = 'background: #ffc107; color: #212529;'
        card.querySelector('.product-image').appendChild(stockBadge)
      } else {
        button.textContent = 'Añadir al carrito'
        button.disabled = false
        button.style.opacity = '1'
      }
    }
  })
}

// Configurar botones del carrito y carrito
document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...

  // Configurar botones del carrito
  document.querySelectorAll('.btn-black').forEach(button => {
    if (button.textContent.includes('Añadir al carrito')) {
      button.addEventListener('click', (e) => {
        e.preventDefault()
        const producto = obtenerDatosProducto(button)
        agregarAlCarrito(producto)
      })
    }
  })

  // Actualizar contador al cargar la página
  actualizarContadorCarrito()

  // Actualizar visualización de stock
  actualizarVisualizacionStock()

  // Configurar enlace del carrito
  const cartLink = document.querySelector('.cart-icon')
  if (cartLink) {
    cartLink.addEventListener('click', (e) => {
      e.preventDefault()
      mostrarCarrito()
    })
  }
})

// Función para mostrar el carrito (modal simple)
function mostrarCarrito() {
  // Crear modal del carrito si no existe
  let cartModal = document.querySelector('.cart-modal')
  if (!cartModal) {
    cartModal = document.createElement('div')
    cartModal.className = 'cart-modal'
    cartModal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s;
    `
    cartModal.innerHTML = `
      <div class="cart-content" style="
        background: white;
        padding: 30px;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
      ">
        <div class="cart-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 style="margin: 0;">Carrito de Compras</h3>
          <button class="close-cart" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div class="cart-items"></div>
        <div class="cart-footer" style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
          <div class="cart-total" style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-bottom: 20px;"></div>
          <button class="btn btn-black checkout-btn" style="width: 100%;">Proceder al Pago</button>
        </div>
      </div>
    `
    document.body.appendChild(cartModal)

    // Event listener para cerrar modal
    cartModal.querySelector('.close-cart').addEventListener('click', () => {
      cartModal.style.opacity = '0'
      cartModal.style.visibility = 'hidden'
    })

    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        cartModal.style.opacity = '0'
        cartModal.style.visibility = 'hidden'
      }
    })
  }

  // Actualizar contenido del carrito
  const cartItems = cartModal.querySelector('.cart-items')
  const cartFooter = cartModal.querySelector('.cart-footer')

  if (carrito.length === 0) {
    cartItems.innerHTML = '<p>Tu carrito está vacío</p>'
    cartFooter.innerHTML = '<button class="btn btn-black checkout-btn" style="width: 100%;">Proceder al Pago</button>'
  } else {
    cartItems.innerHTML = carrito.map(item => `
      <div class="cart-item" style="display: flex; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 15px;">
        <div style="flex: 1;">
          <h4 style="margin: 0 0 5px 0; font-size: 16px;">${item.title}</h4>
          <p style="margin: 0; color: #666;">COP ${item.price.toLocaleString()}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="quantity-btn" onclick="cambiarCantidad('${item.id}', -1)" style="width: 30px; height: 30px; border: 1px solid #ddd; background: white; cursor: pointer;">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" onclick="cambiarCantidad('${item.id}', 1)" style="width: 30px; height: 30px; border: 1px solid #ddd; background: white; cursor: pointer;">+</button>
        </div>
      </div>
    `).join('')

    // Calcular totales
    const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const descuento = calcularDescuento(subtotal)
    const costoEnvio = calcularCostoEnvio(subtotal)
    const total = subtotal - descuento + costoEnvio

    // Sección de cupones
    const couponSection = cuponAplicado ? `
      <div class="coupon-applied" style="margin-bottom: 1rem; padding: 0.75rem; background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <p style="margin: 0; font-weight: 500; color: var(--color-success);">✓ Cupón aplicado: ${cuponAplicado}</p>
            <p style="margin: 0; font-size: 12px; color: #666;">${cuponesValidos[cuponAplicado].descripcion}</p>
          </div>
          <button onclick="removerCupon()" class="btn btn-outline-black" style="font-size: 12px; padding: 4px 8px;">Remover</button>
        </div>
      </div>
    ` : `
      <div class="coupon-section" style="margin-bottom: 1rem;">
        <div class="coupon-input" style="display: flex; gap: 0.5rem;">
          <input type="text" id="coupon-code" placeholder="Código de cupón" style="flex: 1; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
          <button onclick="aplicarCupon()" class="coupon-btn" style="padding: 0.5rem 1rem;">Aplicar</button>
        </div>
      </div>
    `

    cartFooter.innerHTML = `
      ${couponSection}
      <div class="cart-summary" style="margin-bottom: 1rem; font-size: 14px; color: #666;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>Subtotal:</span>
          <span>COP ${subtotal.toLocaleString()}</span>
        </div>
        ${descuento > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--color-success);">
            <span>Descuento:</span>
            <span>-COP ${descuento.toLocaleString()}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>Envío:</span>
          <span>${costoEnvio === 0 ? 'GRATIS' : 'COP ' + costoEnvio.toLocaleString()}</span>
        </div>
      </div>
      <div class="cart-total" style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-bottom: 20px; border-top: 1px solid #eee; padding-top: 15px;">
        <span>Total:</span>
        <span>COP ${total.toLocaleString()}</span>
      </div>
      <button class="btn btn-black checkout-btn" style="width: 100%;">Proceder al Pago</button>
    `

    // Re-conectar evento del botón checkout
    const checkoutBtn = cartModal.querySelector('.checkout-btn')
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', procederAlPago)
    }
  }

  // Configurar botón de checkout
  const checkoutBtn = cartModal.querySelector('.checkout-btn')
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', procederAlPago)
  }

  // Mostrar modal
  cartModal.style.opacity = '1'
  cartModal.style.visibility = 'visible'
}

// Función para calcular descuento aplicado
function calcularDescuento(subtotal) {
  if (!cuponAplicado) return 0

  const cupon = cuponesValidos[cuponAplicado]

  if (cupon.tipo === 'porcentaje') {
    // Verificar si el cupón aplica a categorías específicas
    if (cupon.categorias) {
      const productosAplicables = carrito.filter(item => {
        const categoria = obtenerCategoriaDesdeId(item.id)
        return cupon.categorias.includes(categoria)
      })
      const subtotalAplicables = productosAplicables.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      return Math.round(subtotalAplicables * cupon.descuento)
    } else {
      return Math.round(subtotal * cupon.descuento)
    }
  } else if (cupon.tipo === 'fijo') {
    // Verificar mínimo de compra si aplica
    if (cupon.minimoCompra && subtotal < cupon.minimoCompra) {
      return 0
    }
    return cupon.descuento
  }

  return 0
}

// Función para obtener categoría desde ID
function obtenerCategoriaDesdeId(productId) {
  if (productId.includes('camiseta')) return 'camiseta'
  if (productId.includes('balon')) return 'balon'
  if (productId.includes('zapatillas') || productId.includes('joma')) return 'zapatillas'
  if (productId.includes('medias')) return 'medias'
  return ''
}

// Función para calcular costo de envío
function calcularCostoEnvio(subtotal) {
  // Envío gratis en compras mayores a $150.000
  if (subtotal >= 150000) {
    return 0
  }
  // Costo base de envío
  return 15000
}

// Función para aplicar cupón
function aplicarCupon() {
  const couponInput = document.getElementById('coupon-code')
  const couponCode = couponInput.value.trim().toUpperCase()

  if (!couponCode) {
    mostrarNotificacion('Por favor ingresa un código de cupón')
    return
  }

  if (!cuponesValidos[couponCode]) {
    mostrarNotificacion('Código de cupón inválido')
    return
  }

  const subtotal = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cupon = cuponesValidos[couponCode]

  // Verificar mínimo de compra
  if (cupon.minimoCompra && subtotal < cupon.minimoCompra) {
    mostrarNotificacion(`Este cupón requiere una compra mínima de COP ${cupon.minimoCompra.toLocaleString()}`)
    return
  }

  cuponAplicado = couponCode
  localStorage.setItem('cuponAplicado', cuponAplicado)
  couponInput.value = ''
  mostrarCarrito()
  mostrarNotificacion(`Cupón aplicado: ${cupon.descripcion}`)
}

// Función para remover cupón
function removerCupon() {
  cuponAplicado = null
  localStorage.removeItem('cuponAplicado')
  mostrarCarrito()
  mostrarNotificacion('Cupón removido')
}

// Función para cambiar cantidad de producto
function cambiarCantidad(productId, delta) {
  const item = carrito.find(item => item.id === productId)
  if (item) {
    const nuevaCantidad = item.quantity + delta
    const stockDisponible = verificarStock(productId).stock
    const maxPorCompra = verificarStock(productId).maxPorCompra

    if (nuevaCantidad > maxPorCompra) {
      mostrarNotificacion(`Solo puedes comprar máximo ${maxPorCompra} unidades de este producto`)
      return
    }

    if (nuevaCantidad > stockDisponible) {
      mostrarNotificacion(`Solo quedan ${stockDisponible} unidades disponibles`)
      return
    }

    item.quantity = nuevaCantidad
    if (item.quantity <= 0) {
      carrito = carrito.filter(item => item.id !== productId)
    }
    localStorage.setItem('carrito', JSON.stringify(carrito))
    actualizarContadorCarrito()
    actualizarVisualizacionStock()
    mostrarCarrito() // Actualizar modal
  }
}

// Función para proceder al pago (ahora usa el backend)
async function procederAlPago() {
  if (carrito.length === 0) {
    mostrarNotificacion('Tu carrito está vacío')
    return
  }

  // Cambiar estado del botón a "procesando"
  const checkoutBtn = document.querySelector('.checkout-btn')
  if (checkoutBtn) {
    checkoutBtn.disabled = true
    checkoutBtn.textContent = 'Procesando...'
    checkoutBtn.style.opacity = '0.7'
  }

  try {
    // Preparar datos del pedido
    const pedidoData = {
      items: carrito.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price
      })),
      cupon: cuponAplicado
    }

    // Llamar al backend
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(pedidoData)
    })

    const data = await response.json()

    if (data.success && data.init_point) {
      // Limpiar carrito local
      carrito = []
      localStorage.removeItem('carrito')
      localStorage.removeItem('cuponAplicado')
      actualizarContadorCarrito()

      // Mostrar éxito y redirigir
      mostrarNotificacion('Redirigiendo a MercadoPago...', 'success')
      setTimeout(() => {
        window.location.href = data.init_point
      }, 1000)
    } else {
      throw new Error(data.error || 'Error al crear el pago')
    }

  } catch (error) {
    console.error('Error en el pago:', error)

    // Restaurar botón
    if (checkoutBtn) {
      checkoutBtn.disabled = false
      checkoutBtn.textContent = 'Proceder al Pago'
      checkoutBtn.style.opacity = '1'
    }

    mostrarNotificacion('Error al procesar el pago. Por favor, intenta de nuevo.')
  }
}

// Función alternativa usando el SDK de MercadoPago (más segura para client-side)
async function procederAlPagoConSDK() {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío')
    return
  }

  try {
    const preference = {
      items: carrito.map(item => ({
        title: item.title,
        quantity: item.quantity,
        currency_id: 'COP',
        unit_price: item.price
      })),
      back_urls: {
        success: window.location.origin + '/success.html',
        failure: window.location.origin + '/failure.html',
        pending: window.location.origin + '/pending.html'
      },
      auto_return: 'approved'
    }

    const result = await mp.checkout({
      preference: preference,
      render: {
        container: '', // No renderizar, solo obtener URL
        label: 'Pagar con MercadoPago'
      }
    })

    // Redirigir manualmente
    if (result.id) {
      window.location.href = `https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=${result.id}`
    }

  } catch (error) {
    console.error('Error en el pago:', error)
    alert('Error al procesar el pago. Por favor, intenta de nuevo.')
  }
}
