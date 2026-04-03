// ===== CARRITO (localStorage) =====
const Cart = (() => {
  const KEY = 'futea_cart'
  const DEFAULT_WHATSAPP_NUMBER = '573115998002'

  function getItems() {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  }

  function saveItems(items) {
    localStorage.setItem(KEY, JSON.stringify(items))
    updateBadge()
  }

  function parsePrice(value) {
    if (typeof value === 'number') return value

    let raw = String(value || '').replace(/[^\d.,-]/g, '')
    if (!raw) return 0

    const hasDot = raw.includes('.')
    const hasComma = raw.includes(',')

    if (hasDot && hasComma) {
      if (raw.lastIndexOf(',') > raw.lastIndexOf('.')) {
        raw = raw.replace(/\./g, '').replace(',', '.')
      } else {
        raw = raw.replace(/,/g, '')
      }
    } else if (hasComma) {
      raw = /,\d{1,2}$/.test(raw) ? raw.replace(',', '.') : raw.replace(/,/g, '')
    } else if (hasDot && !/\.\d{1,2}$/.test(raw)) {
      raw = raw.replace(/\./g, '')
    }

    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : 0
  }

  function formatCOP(value) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value || 0)
  }

  function add(product) {
    const items = getItems()
    const existing = items.find(i => i.name === product.name)

    if (existing) {
      existing.qty = (existing.qty || 1) + 1
    } else {
      items.push({ ...product, qty: 1 })
    }

    saveItems(items)
    showToast(`"${product.name}" añadido al carrito`)
    renderDrawer()
  }

  function remove(name) {
    saveItems(getItems().filter(i => i.name !== name))
    renderDrawer()
  }

  function updateQty(name, delta) {
    const items = getItems()
    const item = items.find(i => i.name === name)
    if (!item) return

    item.qty = Math.max(1, (item.qty || 1) + delta)
    saveItems(items)
    renderDrawer()
  }

  function clear() {
    saveItems([])
    renderDrawer()
  }

  function getTotal() {
    return getItems().reduce((sum, i) => {
      const price = parsePrice(i.price)
      return sum + price * (i.qty || 1)
    }, 0)
  }

  function updateBadge() {
    const count = getItems().reduce((s, i) => s + (i.qty || 1), 0)
    document.querySelectorAll('.cart-count, #cartCount').forEach(el => {
      el.textContent = count
      el.style.display = count > 0 ? 'flex' : 'none'
    })
  }

  function renderDrawer() {
    const container = document.getElementById('cartItems')
    const footer = document.getElementById('cartFooter')
    const empty = document.getElementById('cartEmpty')
    const totalEl = document.getElementById('cartTotal')
    if (!container) return

    const items = getItems()

    if (!items.length) {
      if (empty) empty.hidden = false
      if (footer) footer.hidden = true
      container.innerHTML = ''
      if (empty) container.appendChild(empty)
      return
    }

    if (empty) empty.hidden = true
    if (footer) footer.hidden = false
    if (totalEl) totalEl.textContent = formatCOP(getTotal())

    container.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${item.price}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="Cart.updateQty('${item.name.replace(/'/g, "\\'")}', -1)">-</button>
            <span>${item.qty || 1}</span>
            <button class="qty-btn" onclick="Cart.updateQty('${item.name.replace(/'/g, "\\'")}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="Cart.remove('${item.name.replace(/'/g, "\\'")}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>`).join('')
  }

  function openDrawer() {
    const drawer = document.getElementById('cartDrawer')
    if (!drawer) return

    drawer.hidden = false
    renderDrawer()
    document.body.style.overflow = 'hidden'
  }

  function closeDrawer() {
    const drawer = document.getElementById('cartDrawer')
    if (!drawer) return

    drawer.hidden = true
    document.body.style.overflow = ''
  }

  function showToast(msg) {
    let toast = document.getElementById('cartToast')
    if (!toast) {
      toast = document.createElement('div')
      toast.id = 'cartToast'
      toast.className = 'cart-toast'
      document.body.appendChild(toast)
    }

    toast.textContent = msg
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), 2500)
  }

  function getWhatsAppNumber() {
    const fromSellers = document.body?.dataset?.whatsappSellers || window.WHATSAPP_SELLER_NUMBERS || ''
    const fromBody = document.body?.dataset?.whatsappNumber || ''
    const fromWindow = window.WHATSAPP_ORDER_NUMBER || ''
    const sellerList = String(fromSellers)
      .split(/[\n,;|]+/g)
      .map(n => n.replace(/\D/g, ''))
      .filter(Boolean)
    const chosenSeller = sellerList[0] || ''
    const sanitized = String(chosenSeller || fromBody || fromWindow || DEFAULT_WHATSAPP_NUMBER).replace(/\D/g, '')
    return sanitized || DEFAULT_WHATSAPP_NUMBER
  }

  function buildOrderMessage() {
    const items = getItems()
    const total = getTotal()

    const productLines = items.map((item, index) => {
      const unitPrice = parsePrice(item.price)
      const lineTotal = unitPrice * (item.qty || 1)
      return `${index + 1}. ${item.name} x${item.qty || 1} - ${formatCOP(lineTotal)}`
    })

    return [
      'Hola, quiero realizar este pedido:',
      '',
      ...productLines,
      '',
      `Total del pedido: ${formatCOP(total)}`,
      '',
      'Cliente, por favor rellena los datos a continuación:',
      '- Nombre completo:',
      '- Cédula:',
      '- Teléfono:',
      '- Dirección / Barrio / Ciudad:',
      '- Referencia de ubicación:',
      '- Método de pago: ya te estaremos indicando.'
    ].join('\n')
  }

  function checkout() {
    const items = getItems()
    if (!items.length) {
      showToast('Tu carrito está vacío')
      return
    }

    const proceed = confirm(
      'Serás redirigido a WhatsApp para finalizar el pedido.\n\n' +
      'Pulsa "Aceptar" para continuar.\n' +
      'Pulsa "Cancelar" para vaciar el carrito.'
    )
    if (!proceed) {
      clear()
      showToast('Pedido cancelado. Carrito vaciado.')
      return
    }

    const phone = getWhatsAppNumber()
    const message = buildOrderMessage()
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    const popup = window.open(url, '_blank', 'noopener')
    if (!popup) window.location.href = url
  }

  function init() {
    updateBadge()
    renderDrawer()

    // Botón carrito en header (desktop/mobile, link o botón)
    const openTriggers = new Set([
      ...document.querySelectorAll('.cart-icon'),
      ...document.querySelectorAll('#cartBtn'),
      ...document.querySelectorAll('[data-open-cart]')
    ])

    openTriggers.forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault()
        openDrawer()
      })
    })

    // Cerrar drawer
    document.getElementById('cartClose')?.addEventListener('click', closeDrawer)
    document.getElementById('cartBackdrop')?.addEventListener('click', closeDrawer)

    document.querySelectorAll('.cart-checkout').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault()
        checkout()
      })
    })

    document.getElementById('clearCart')?.addEventListener('click', () => {
      if (confirm('¿Vaciar el carrito?')) clear()
    })

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer()
    })
  }

  return { add, remove, updateQty, clear, openDrawer, closeDrawer, checkout, init, getItems }
})()

document.addEventListener('DOMContentLoaded', () => Cart.init())
