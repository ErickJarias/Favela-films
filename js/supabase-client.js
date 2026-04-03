// ===== SUPABASE CLIENT =====
const SUPABASE_URL = 'https://dcapdkjffuwofeezvfmp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjYXBka2pmZnV3b2ZlZXp2Zm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNzYxNDYsImV4cCI6MjA5MDc1MjE0Nn0.xlP5YHnb9Ve5EcimPivWKe7iqKDN1fhiuKJ3zMFe9WM'
window.SUPABASE_URL = SUPABASE_URL
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY

// Guard: evita "already declared" si el script se carga más de una vez
if (typeof window._supabaseClient === 'undefined') {
  if (window.supabase?.createClient) {
    window._supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  } else {
    console.error('Supabase SDK no cargó correctamente (window.supabase.createClient no disponible).')
  }
}

// Alias global usado por renderer.js, editor.js, etc.
const supabaseClient = window._supabaseClient
window.supabaseClient = window._supabaseClient
