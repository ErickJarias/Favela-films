// ===== SUPABASE AUTH =====
const auth = window._supabaseClient?.auth
if (!auth) {
  console.error('No se pudo inicializar Supabase Auth en admin/auth.js')
}

// Elementos DOM
const loginScreen = document.getElementById('loginScreen')
const adminDashboard = document.getElementById('adminDashboard')
const loginForm = document.getElementById('loginForm')
const loginError = document.getElementById('loginError')
const btnLogin = document.getElementById('btnLogin')
const btnLoginText = document.getElementById('btnLoginText')
const loginSpinner = document.getElementById('loginSpinner')
const btnLogout = document.getElementById('btnLogout')
const adminUserEmail = document.getElementById('adminUserEmail')
const togglePass = document.getElementById('togglePass')
const loginPassword = document.getElementById('loginPassword')
const authLoader = document.getElementById('authLoader')

let editorInitialized = false

function showDashboard(email) {
  if (authLoader) authLoader.hidden = true
  loginScreen.hidden = true
  adminDashboard.hidden = false
  if (adminUserEmail) adminUserEmail.textContent = email

  if (!editorInitialized && typeof Editor !== 'undefined') {
    Editor.init()
    editorInitialized = true
  }
}

function showLogin() {
  if (authLoader) authLoader.hidden = true
  adminDashboard.hidden = true
  loginScreen.hidden = false
  btnLoginText.textContent = 'Iniciar sesion'
  loginSpinner.hidden = true
  btnLogin.disabled = false
}

// Toggle contrasena
togglePass?.addEventListener('click', () => {
  const isText = loginPassword.type === 'text'
  loginPassword.type = isText ? 'password' : 'text'
  togglePass.querySelector('i').className = isText ? 'fas fa-eye' : 'fas fa-eye-slash'
})

// Login
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const email = document.getElementById('loginEmail').value.trim()
  const password = loginPassword.value

  loginError.hidden = true
  btnLoginText.textContent = 'Verificando...'
  loginSpinner.hidden = false
  btnLogin.disabled = true

  try {
    const { data, error } = await auth.signInWithPassword({ email, password })
    if (error) throw error
    showDashboard(data.user?.email || email)
  } catch (err) {
    loginError.textContent = traducirError(err)
    loginError.hidden = false
    btnLoginText.textContent = 'Iniciar sesion'
    loginSpinner.hidden = true
    btnLogin.disabled = false
  }
})

// Logout
btnLogout?.addEventListener('click', async () => {
  await auth.signOut()
  showLogin()
})

// Estado de sesion
auth.onAuthStateChange((_event, session) => {
  const user = session?.user || null
  if (user) {
    showDashboard(user.email || '')
    return
  }
  showLogin()
})

auth.getSession()
  .then(({ data }) => {
    const user = data.session?.user || null
    if (user) {
      showDashboard(user.email || '')
      return
    }
    showLogin()
  })
  .catch(() => {
    showLogin()
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

  return err?.message || 'No se pudo iniciar sesion.'
}

