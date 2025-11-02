// Datos de productos (en producción vendría de una API)
const productosData = {
  'camiseta-oficial-seleccion-colombia': {
    title: 'Camiseta Oficial Seleccion Colombia',
    price: 120000,
    images: [
      'images/colombiashirt.png',
      'images/colombiashirt.png',
      'images/colombiashirt.png'
    ],
    description: 'Camiseta oficial de la Selección Colombia de Fútbol. Fabricada con materiales de alta calidad, transpirables y cómodos para el uso diario.',
    detailedDescription: 'Esta camiseta oficial representa el orgullo colombiano en cada partido. Confeccionada con tela poliéster de alta tecnología que mantiene la frescura durante todo el día. Diseño exclusivo de Favela Films con detalles únicos que te harán destacar.',
    features: ['Material transpirable', 'Diseño exclusivo', 'Cómoda para uso diario', 'Alta calidad']
  },
  'balon-de-futbol-profesional': {
    title: 'Balón de Fútbol Profesional',
    price: 90000,
    images: [
      'images/balon.jpg',
      'images/balon.jpg',
      'images/balon.jpg'
    ],
    description: 'Balón profesional para fútbol con cámara de aire y diseño resistente. Perfecto para entrenamientos y partidos.',
    detailedDescription: 'Balón de fútbol profesional con construcción duradera y excelente rebote. Ideal para jugadores de todos los niveles, desde principiantes hasta profesionales. Su diseño moderno y colores vibrantes lo hacen perfecto para cualquier cancha.',
    features: ['Construcción duradera', 'Excelente rebote', 'Diseño moderno', 'Para todos los niveles']
  },
  'zapatillas-joma-premium': {
    title: 'Zapatillas JOMA Premium',
    price: 245000,
    images: [
      'images/joma.jpg',
      'images/joma.jpg',
      'images/joma.jpg'
    ],
    description: 'Zapatillas deportivas premium marca JOMA. Confort, estilo y rendimiento para atletas profesionales.',
    detailedDescription: 'Las zapatillas JOMA Premium combinan tecnología avanzada con diseño elegante. Su suela antideslizante proporciona excelente tracción en cualquier superficie, mientras que el acolchado interno garantiza comodidad durante horas de uso.',
    features: ['Tecnología avanzada', 'Suela antideslizante', 'Acolchado interno', 'Diseño elegante']
  },
  'medias-antideslizantes': {
    title: 'Medias Antideslizantes',
    price: 20000,
    images: [
      'images/medias.jpg',
      'images/medias.jpg',
      'images/medias.jpg'
    ],
    description: 'Medias deportivas con tecnología antideslizante. Mantienen los pies secos y en su lugar durante el ejercicio.',
    detailedDescription: 'Estas medias antideslizantes están diseñadas específicamente para deportes de alto rendimiento. Su tecnología especial mantiene los pies secos, previene ampollas y garantiza un ajuste perfecto durante todo el entrenamiento.',
    features: ['Tecnología antideslizante', 'Mantienen los pies secos', 'Previenen ampollas', 'Ajuste perfecto']
  }
}

// Función para obtener parámetro de URL
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

// Función para cargar datos del producto
function cargarProducto() {
  const productId = getURLParameter('id')

  if (!productId || !productosData[productId]) {
    // Producto no encontrado, redirigir al catálogo
    window.location.href = '/#productos'
    return
  }

  const producto = productosData[productId]
  const stockInfo = verificarStock(productId)

  // Actualizar título de página
  document.title = `${producto.title} - Favela Films`
  document.getElementById('product-title-meta').content = producto.title

  // Actualizar breadcrumb
  document.getElementById('breadcrumb-current').textContent = producto.title

  // Actualizar información principal
  document.getElementById('product-title').textContent = producto.title
  document.getElementById('product-price').textContent = `COP ${producto.price.toLocaleString()}`

  // Actualizar stock
  const stockElement = document.getElementById('product-stock')
  if (stockInfo.stock === 0) {
    stockElement.textContent = 'Agotado'
    stockElement.className = 'stock-info agotado'
  } else if (stockInfo.stock <= 3) {
    stockElement.textContent = `Solo quedan ${stockInfo.stock} unidades`
    stockElement.className = 'stock-info limitado'
  } else {
    stockElement.textContent = 'En stock'
    stockElement.className = 'stock-info disponible'
  }

  // Actualizar imágenes
  document.getElementById('product-image').src = producto.images[0]
  document.getElementById('product-image').alt = producto.title

  // Thumbnails
  document.getElementById('thumb1').src = producto.images[0]
  document.getElementById('thumb2').src = producto.images[1] || producto.images[0]
  document.getElementById('thumb3').src = producto.images[2] || producto.images[0]

  // Descripciones
  document.getElementById('product-description').textContent = producto.description
  document.getElementById('detailed-description').textContent = producto.detailedDescription

  // Configurar cantidad máxima
  const qtyInput = document.getElementById('product-quantity')
  qtyInput.max = Math.min(stockInfo.stock, stockInfo.maxPorCompra)
  qtyInput.value = 1

  // Configurar botones de cantidad
  configurarControlesCantidad(producto, stockInfo)

  // Configurar botones de acción
  configurarBotonesAccion(producto)
}

// Función para configurar controles de cantidad
function configurarControlesCantidad(producto, stockInfo) {
  const qtyInput = document.getElementById('product-quantity')
  const decreaseBtn = document.getElementById('decrease-qty')
  const increaseBtn = document.getElementById('increase-qty')

  const maxQty = Math.min(stockInfo.stock, stockInfo.maxPorCompra)

  decreaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(qtyInput.value)
    if (currentValue > 1) {
      qtyInput.value = currentValue - 1
    }
  })

  increaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(qtyInput.value)
    if (currentValue < maxQty) {
      qtyInput.value = currentValue + 1
    } else {
      mostrarNotificacion(`Máximo ${maxQty} unidades por compra`)
    }
  })

  qtyInput.addEventListener('change', () => {
    let value = parseInt(qtyInput.value)
    if (value < 1) value = 1
    if (value > maxQty) value = maxQty
    qtyInput.value = value
  })
}

// Función para configurar botones de acción
function configurarBotonesAccion(producto) {
  const addToCartBtn = document.getElementById('add-to-cart-btn')
  const buyNowBtn = document.getElementById('buy-now-btn')

  // Actualizar estado del botón según stock
  const stockInfo = verificarStock(producto.title.toLowerCase().replace(/\s+/g, '-'))
  if (stockInfo.stock === 0) {
    addToCartBtn.textContent = 'Agotado'
    addToCartBtn.disabled = true
    buyNowBtn.disabled = true
    return
  }

  addToCartBtn.addEventListener('click', () => {
    const cantidad = parseInt(document.getElementById('product-quantity').value)

    // Crear objeto producto
    const productoCarrito = {
      id: producto.title.toLowerCase().replace(/\s+/g, '-'),
      title: producto.title,
      price: producto.price,
      image: producto.images[0]
    }

    // Agregar múltiples unidades si es necesario
    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito(productoCarrito)
    }
  })

  buyNowBtn.addEventListener('click', () => {
    const cantidad = parseInt(document.getElementById('product-quantity').value)

    // Crear objeto producto
    const productoCarrito = {
      id: producto.title.toLowerCase().replace(/\s+/g, '-'),
      title: producto.title,
      price: producto.price,
      image: producto.images[0]
    }

    // Limpiar carrito y agregar solo este producto
    carrito = []
    for (let i = 0; i < cantidad; i++) {
      carrito.push({...productoCarrito, quantity: 1})
    }

    localStorage.setItem('carrito', JSON.stringify(carrito))
    actualizarContadorCarrito()

    // Ir al checkout
    mostrarCarrito()
  })
}

// Función para cambiar imagen principal
function cambiarImagen(imagenSrc) {
  document.getElementById('product-image').src = imagenSrc
}

// Configurar tabs
function configurarTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn')
  const tabPanels = document.querySelectorAll('.tab-panel')

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover clase active de todos los botones y panels
      tabButtons.forEach(btn => btn.classList.remove('active'))
      tabPanels.forEach(panel => panel.classList.remove('active'))

      // Agregar clase active al botón clickeado
      button.classList.add('active')

      // Mostrar panel correspondiente
      const tabId = button.dataset.tab + '-tab'
      document.getElementById(tabId).classList.add('active')
    })
  })
}

// Configurar thumbnails
function configurarThumbnails() {
  const thumbnails = document.querySelectorAll('.thumbnail')

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Remover clase active de todos
      thumbnails.forEach(t => t.classList.remove('active'))
      // Agregar clase active al thumbnail clickeado
      thumb.classList.add('active')

      // Cambiar imagen principal
      cambiarImagen(thumb.src)
    })
  })
}

// Sistema de envío
const costosEnvio = {
  'bogota': { estandar: 0, express: 0, nombre: 'Bogotá D.C.' },
  'medellin': { estandar: 15000, express: 25000, nombre: 'Medellín' },
  'cali': { estandar: 15000, express: 25000, nombre: 'Cali' },
  'barranquilla': { estandar: 18000, express: 28000, nombre: 'Barranquilla' },
  'cartagena': { estandar: 20000, express: 30000, nombre: 'Cartagena' },
  'cucuta': { estandar: 12000, express: 22000, nombre: 'Cúcuta' },
  'bucaramanga': { estandar: 14000, express: 24000, nombre: 'Bucaramanga' },
  'pereira': { estandar: 16000, express: 26000, nombre: 'Pereira' },
  'manizales': { estandar: 16000, express: 26000, nombre: 'Manizales' },
  'armenia': { estandar: 17000, express: 27000, nombre: 'Armenia' },
  'neiva': { estandar: 19000, express: 29000, nombre: 'Neiva' },
  'popayan': { estandar: 20000, express: 30000, nombre: 'Popayán' },
  'pasto': { estandar: 22000, express: 32000, nombre: 'Pasto' },
  'santa-marta': { estandar: 21000, express: 31000, nombre: 'Santa Marta' },
  'valledupar': { estandar: 20000, express: 30000, nombre: 'Valledupar' },
  'monteria': { estandar: 23000, express: 33000, nombre: 'Montería' },
  'sincelejo': { estandar: 24000, express: 34000, nombre: 'Sincelejo' },
  'rioacha': { estandar: 25000, express: 35000, nombre: 'Rioacha' },
  'arauca': { estandar: 26000, express: 36000, nombre: 'Arauca' },
  'yopal': { estandar: 24000, express: 34000, nombre: 'Yopal' },
  'mocoa': { estandar: 28000, express: 38000, nombre: 'Mocoa' },
  'florencia': { estandar: 27000, express: 37000, nombre: 'Florencia' },
  'mitu': { estandar: 35000, express: 45000, nombre: 'Mitú' },
  'puerto-carreno': { estandar: 40000, express: 50000, nombre: 'Puerto Carreño' },
  'san-andres': { estandar: 45000, express: 55000, nombre: 'San Andrés' },
  'letonia': { estandar: 30000, express: 40000, nombre: 'Leticia' }
}

function configurarCalculadoraEnvio() {
  // Crear elementos de la calculadora
  const shippingInfo = document.querySelector('.shipping-info')
  if (!shippingInfo) return

  const calculator = document.createElement('div')
  calculator.className = 'shipping-calculator'
  calculator.innerHTML = `
    <h4>Calcular Envío</h4>
    <form class="shipping-form">
      <select id="shipping-city" required>
        <option value="">Seleccionar ciudad...</option>
        ${Object.entries(costosEnvio).map(([key, data]) =>
          `<option value="${key}">${data.nombre}</option>`
        ).join('')}
      </select>
      <select id="shipping-type" required>
        <option value="estandar">Envío Estándar (3-5 días)</option>
        <option value="express">Envío Express (1-2 días)</option>
      </select>
      <button type="button" id="calculate-shipping" class="btn btn-outline-black">Calcular</button>
    </form>
    <div id="shipping-result" class="shipping-result" style="display: none;">
      <p>Costo de envío: <span id="shipping-cost" class="shipping-cost">COP 0</span></p>
      <p id="shipping-time"></p>
    </div>
  `

  shippingInfo.appendChild(calculator)

  // Configurar evento de cálculo
  document.getElementById('calculate-shipping').addEventListener('click', calcularEnvio)
}

function calcularEnvio() {
  const citySelect = document.getElementById('shipping-city')
  const typeSelect = document.getElementById('shipping-type')
  const resultDiv = document.getElementById('shipping-result')
  const costSpan = document.getElementById('shipping-cost')
  const timeP = document.getElementById('shipping-time')

  const ciudad = citySelect.value
  const tipo = typeSelect.value

  if (!ciudad || !tipo) {
    mostrarNotificacion('Por favor selecciona una ciudad y tipo de envío')
    return
  }

  const costo = costosEnvio[ciudad][tipo]
  const tiempo = tipo === 'estandar' ? '3-5 días hábiles' : '1-2 días hábiles'

  costSpan.textContent = `COP ${costo.toLocaleString()}`
  timeP.textContent = `Tiempo de entrega: ${tiempo}`

  resultDiv.style.display = 'block'

  // Aplicar descuento por compras grandes
  const precioProducto = parseInt(document.querySelector('.price').textContent.replace(/[^\d]/g, ''))
  if (precioProducto >= 150000) {
    costSpan.textContent = 'GRATIS'
    timeP.textContent = 'Envío gratuito en compras mayores a COP 150.000'
  }
}

// Función para actualizar costo de envío en el resumen
function actualizarCostoEnvioEnCarrito() {
  const totalCarrito = carrito.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const costoEnvio = totalCarrito >= 150000 ? 0 : 15000 // Costo base por defecto

  // Aquí podrías actualizar el total del carrito con envío
  // Por ahora solo es informativo
}

// Inicializar página cuando cargue
document.addEventListener('DOMContentLoaded', () => {
  cargarProducto()
  configurarTabs()
  configurarThumbnails()
  configurarCalculadoraEnvio()
  actualizarContadorCarrito()
})
