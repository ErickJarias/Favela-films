// ===== FORMATO DE PRECIOS =====
// Moneda por defecto: COP (Colombia)
// Se puede cambiar desde site_config → currency = 'COP' | 'USD'

const Price = (() => {
  let currency = 'COP'

  function setCurrency(c) {
    currency = (c || 'COP').toUpperCase()
  }

  function format(value) {
    // Extraer número del string (ej: "120000", "$120.000", "120,000")
    const num = typeof value === 'number'
      ? value
      : parseFloat(String(value).replace(/[^\d.]/g, '')) || 0

    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      }).format(num)
    }

    // COP por defecto
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(num)
  }

  function getCurrency() { return currency }

  return { format, setCurrency, getCurrency }
})()
