// ===== CLOUDINARY UPLOAD =====
const CLOUDINARY_CLOUD_NAME = 'dbm8zejcu'
// Crea este preset en: cloudinary.com → Settings → Upload → Upload presets → Add preset
// Signing mode: Unsigned | Folder: futea
const CLOUDINARY_UPLOAD_PRESET = 'ml_default'

const Cloudinary = {
  /**
   * Sube un File a Cloudinary y retorna la URL optimizada
   * @param {File} file
   * @param {string} folder  - subcarpeta: 'futea/slider' | 'futea/products' | 'futea/logo'
   * @param {function|null} onProgress - callback(percent 0-100)
   * @returns {Promise<string>} URL segura con f_auto,q_auto
   */
  async upload(file, folder = 'futea', onProgress = null) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', folder)

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`)

      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText)
          // URL con optimización automática de formato y calidad
          const url = res.secure_url.replace('/upload/', '/upload/f_auto,q_auto/')
          resolve(url)
        } else {
          let msg = `Error ${xhr.status}`
          try { msg = JSON.parse(xhr.responseText).error?.message || msg } catch {}
          reject(new Error(msg))
        }
      })

      xhr.addEventListener('error', () => reject(new Error('Error de red al subir imagen')))
      xhr.send(formData)
    })
  },

  /**
   * Configura drag & drop + click en una zona de upload
   * @param {string} zoneId   - ID del div zona
   * @param {string} inputId  - ID del input[type=file]
   * @param {function} onFile - callback(File)
   */
  setupDropZone(zoneId, inputId, onFile) {
    const zone = document.getElementById(zoneId)
    const input = document.getElementById(inputId)
    if (!zone || !input) return

    zone.addEventListener('click', () => input.click())

    zone.addEventListener('dragover', e => {
      e.preventDefault()
      zone.classList.add('drag-over')
    })
    zone.addEventListener('dragleave', e => {
      if (!zone.contains(e.relatedTarget)) zone.classList.remove('drag-over')
    })
    zone.addEventListener('drop', e => {
      e.preventDefault()
      zone.classList.remove('drag-over')
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) onFile(file)
      else if (file) alert('Solo se permiten imágenes (JPG, PNG, WEBP, GIF)')
    })

    input.addEventListener('change', () => {
      if (input.files[0]) onFile(input.files[0])
      input.value = ''
    })
  }
}
