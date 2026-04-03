// ===== CARRITO (localStorage) =====
const Cart = (() => {
  const KEY = 'futea_cart'

  function getItems() {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  }

  function saveItems(items) {
    localStorage.setItem(KEY, JSON.stringify(items))
    updateBadge()
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
      const price = parseFloat((i.price || '0').replace(/[^0-9.]/g, ''))
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
      empty && (empty.hidden = false)
      footer && (footer.hidden = true)
      container.innerHTML = ''
      container.appendChild(empty)
      return
    }

    empty && (empty.hidden = true)
    footer && (footer.hidden = false)
    if (totalEl) totalEl.textContent = `$${getTotal().toFixed(2)}`

    container.innerHTML = items.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${item.price}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="Cart.updateQty('${item.name.replace(/'/g,"\\'")}', -1)">−</button>
            <span>${item.qty || 1}</span>
            <button class="qty-btn" onclick="Cart.updateQty('${item.name.replace(/'/g,"\\'")}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="Cart.remove('${item.name.replace(/'/g,"\\'")}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>`).join('')
  }

  function openDrawer() {
    const drawer = document.getElementById('cartDrawer')
    if (drawer) {
      drawer.hidden = false
      renderDrawer()
      document.body.style.overflow = 'hidden'
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById('cartDrawer')
    if (drawer) {
      drawer.hidden = true
      document.body.style.overflow = ''
    }
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

  function init() {
    updateBadge()

    // Botón carrito en header
    document.getElementById('cartBtn')?.addEventListener('click', openDrawer)
    document.querySelector('.cart-icon')?.addEventListener('click', e => {
      e.preventDefault()
      openDrawer()
    })

    // Cerrar drawer
    document.getElementById('cartClose')?.addEventListener('click', closeDrawer)
    document.getElementById('cartBackdrop')?.addEventListener('click', closeDrawer)
    document.getElementById('clearCart')?.addEventListener('click', () => {
      if (confirm('¿Vaciar el carrito?')) clear()
    })

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer()
    })
  }

  return { add, remove, updateQty, clear, openDrawer, closeDrawer, init, getItems }
})()

document.addEventListener('DOMContentLoaded', () => Cart.init())
