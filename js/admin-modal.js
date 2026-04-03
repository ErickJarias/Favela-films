// ===== MODAL LOGIN ADMIN (Supabase Auth) =====
const auth = window._supabaseClient?.auth
if (!auth) {
  console.error('No se pudo inicializar Supabase Auth en admin-modal.js')
}

const modal = document.getElementById('adminLoginModal')
const backdrop = modal?.querySelector('.admin-login-backdrop')
const form = document.getElementById('adminLoginForm')
const errorEl = document.getElementById('modalLoginError')
const btnText = document.getElementById('modalLoginBtnText')
const spinner = document.getElementById('modalLoginSpinner')
const btn = document.getElementById('modalLoginBtn')
const closeBtn = document.getElementById('adminLoginClose')
const togglePass = document.getElementById('modalTogglePass')
const passInput = document.getElementById('modalPassword')

function closeModal() {
  modal?.setAttribute('hidden', '')
  form?.reset()
  if (errorEl) errorEl.hidden = true
}

function setLoading(loading) {
  if (!btn || !btnText || !spinner) return
  btn.disabled = loading
  btnText.textContent = loading ? 'Verificando...' : 'Ingresar al panel'
  spinner.hidden = !loading
}

function showError(msg) {
  if (!errorEl) return
  errorEl.textContent = msg
  errorEl.hidden = false
}

// Cerrar con backdrop o boton X
backdrop?.addEventListener('click', closeModal)
closeBtn?.addEventListener('click', closeModal)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal()
})

// Toggle contrasena
togglePass?.addEventListener('click', () => {
  const isText = passInput.type === 'text'
  passInput.type = isText ? 'password' : 'text'
  togglePass.querySelector('i').className = isText ? 'fas fa-eye' : 'fas fa-eye-slash'
})

// Submit login
form?.addEventListener('submit', async e => {
  e.preventDefault()
  const email = document.getElementById('modalEmail').value.trim()
  const password = passInput.value

  if (errorEl) errorEl.hidden = true
  setLoading(true)

  try {
    const { error } = await auth.signInWithPassword({ email, password })
    if (error) throw error
    window.location.href = 'admin.html'
  } catch (err) {
    setLoading(false)
    showError(traducirError(err))
  }
})

function traducirError(err) {
  const msg = (err?.message || '').toLowerCase()

  if (msg.includes('invalid login credentials')) {
    return 'Correo o contrasena incorrectos.'
  }
  if (msg.includes('email not confirmed')) {
    return 'Confirma tu correo antes de iniciar sesion.'
  }
  if (msg.includes('too many requests')) {
    return 'Demasiados intentos. Espera un momento.'
  }
  if (msg.includes('network')) {
    return 'Error de red. Verifica tu conexion.'
  }

  return err?.message || 'Error al iniciar sesion. Intenta de nuevo.'
}

