# 🎬 Favela Films - E-commerce con Integración de Pagos

Sistema completo de e-commerce para Favela Films con integración segura de MercadoPago.

## 🚨 ERROR DE PAGOS - SOLUCIONES

Si ves "Error al procesar el pago", ejecuta el diagnóstico:

```bash
# Diagnóstico automático de problemas
npm run diagnostic
```

### 🎯 SOLUCIÓN RÁPIDA - PRUEBA SIN MERCADO PAGO

```bash
# Instalar dependencias
npm install

# Ejecutar servidor básico (pagos simulados)
npm run basic

# Abrir navegador: http://localhost:3001
# ¡Ya puedes probar el flujo de pagos!
```

### 🔧 SOLUCIÓN COMPLETA - CON MERCADO PAGO REAL

#### 1. Instalar dependencias
```bash
npm install
```

#### 2. Configurar MercadoPago
1. Ve a [MercadoPago Developers](https://developers.mercadopago.com/)
2. Crea cuenta y obtén Access Token (Sandbox)
3. Actualiza `.env`:

```env
MERCADO_PAGO_ACCESS_TOKEN=TEST-tu_token_de_sandbox
PORT=3001
```

#### 3. Ejecutar servidor completo
```bash
npm run dev
```

#### 4. Probar sistema completo
```bash
npm test
```

#### 5. Abrir en navegador
```
http://localhost:3001
```

## 💳 Configuración de MercadoPago

### Paso 1: Crear cuenta
1. Regístrate en [mercadopago.com.co](https://www.mercadopago.com.co)
2. Completa la verificación de identidad
3. Activa tu cuenta como vendedor

### Paso 2: Obtener credenciales
1. Ve a [Panel de Desarrolladores](https://developers.mercadopago.com/)
2. Crea una aplicación nueva
3. Copia el **Access Token** (Producción o Sandbox)

### Paso 3: Configurar URLs de retorno
En tu panel de MercadoPago, configura:
- URL de éxito: `https://tu-dominio.com/success.html`
- URL de fracaso: `https://tu-dominio.com/failure.html`
- URL pendiente: `https://tu-dominio.com/pending.html`

## 🧪 Pruebas con Tarjetas de Prueba

### MercadoPago Sandbox
Usa estas tarjetas para probar pagos:

| Tarjeta | Número | Código | Vencimiento |
|---------|--------|--------|-------------|
| Visa | 4509 9535 6623 3704 | 123 | 11/25 |
| Mastercard | 5031 4332 1540 6351 | 123 | 11/25 |
| American Express | 3711 803032 57522 | 1234 | 11/25 |

### Escenarios de prueba:
- **Pago aprobado**: Cualquier monto
- **Pago rechazado**: Monto > $10.000
- **Pago pendiente**: Usa tarjeta en cuotas

## 🛠️ Arquitectura del Sistema

```
📁 favela-films/
├── 📄 index.html          # Página principal
├── 📄 producto.html       # Páginas de producto individual
├── 📄 success.html        # Confirmación de pago exitoso
├── 📄 failure.html        # Página de error de pago
├── 📄 pending.html        # Página de pago pendiente
├── 📄 styles.css          # Estilos cinematográficos
├── 📄 script.js           # Lógica del frontend
├── 📄 product-detail.js   # Lógica de páginas de producto
├── 📄 server.js           # Backend Node.js
├── 📄 package.json        # Dependencias
├── 📄 .env               # Variables de entorno
└── 📁 images/            # Imágenes del sitio
```

## 🔧 API Endpoints

### POST `/api/checkout`
Crea una preferencia de pago en MercadoPago.

**Request:**
```json
{
  "items": [
    {
      "title": "Producto",
      "quantity": 1,
      "price": 50000
    }
  ],
  "cupon": "FAVELA10"
}
```

**Response:**
```json
{
  "success": true,
  "preferenceId": "123456789",
  "init_point": "https://www.mercadopago.com.co/checkout/v1/redirect..."
}
```

### GET `/api/pedido/:id`
Obtiene detalles de un pedido por ID.

### POST `/api/webhook`
Webhook para confirmar pagos (requiere configuración en MercadoPago).

## 💰 Sistema de Descuentos

### Cupones disponibles:
- `FAVELA10` - 10% descuento general
- `ENVIOGRATIS` - Envío gratis (mínimo $100.000)
- `BIENVENIDO` - $5.000 descuento primera compra
- `FUTBOL` - 15% en productos de fútbol

### Sistema de envío:
- **Bogotá**: Envío gratis
- **Otras ciudades**: $12.000 - $45.000 según distancia
- **Envío gratis**: Compras > $150.000

## 🚀 Despliegue en Producción

### Opción 1: Render (Recomendado)
1. Conecta tu repositorio de GitHub
2. Configura variables de entorno
3. Deploy automático

### Opción 2: Vercel
1. Importa el proyecto
2. Configura variables de entorno
3. Deploy con un clic

### Opción 3: Heroku
```bash
# Instalar Heroku CLI
npm install -g heroku

# Crear app
heroku create tu-app-favela-films

# Configurar variables
heroku config:set MERCADO_PAGO_ACCESS_TOKEN=tu_token

# Deploy
git push heroku main
```

## 🔒 Seguridad

### Medidas implementadas:
- ✅ API keys en servidor (no expuestas al cliente)
- ✅ Validación de datos en backend
- ✅ HTTPS obligatorio en producción
- ✅ Sanitización de inputs
- ✅ Rate limiting recomendado

### Mejores prácticas adicionales:
- Implementar autenticación de usuarios
- Usar HTTPS siempre
- Monitorear logs de pagos
- Backup regular de base de datos

## 📊 Gestión de Pedidos

### En desarrollo local:
Los pedidos se almacenan en un array en memoria.

### Para producción:
1. Conecta MongoDB Atlas
2. Instala Mongoose
3. Actualiza `server.js` para usar base de datos

```javascript
// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Usar modelo de Pedido
const pedido = new Pedido({
  items: req.body.items,
  total: total,
  status: 'pending'
});
await pedido.save();
```

## 🎨 Personalización

### Cambiar colores:
Edita las variables CSS en `:root`:
```css
--color-gold: #TU_COLOR; /* Cambiar color dorado */
--color-black: #TU_COLOR; /* Cambiar fondo */
```

### Agregar productos:
1. Actualiza `productosData` en `product-detail.js`
2. Actualiza inventario en `script.js`
3. Agrega HTML en `index.html`

## 🐛 Solución de Problemas

### ❌ "Error al procesar el pago"
**Diagnóstico automático:**
```bash
npm run diagnostic
```

**Causas comunes y soluciones:**

1. **Servidor no está corriendo**
   ```bash
   # Solución: iniciar servidor
   npm run dev      # Con MercadoPago
   npm run basic    # Sin MercadoPago (pruebas)
   ```

2. **Token de MercadoPago inválido**
   ```bash
   # Verificar .env
   # Debe empezar con TEST- (sandbox) o APP_USR- (producción)
   ```

3. **Dependencias faltantes**
   ```bash
   # Reinstalar dependencias
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Puerto ocupado**
   ```bash
   # Cambiar puerto en .env
   PORT=3002
   ```

### ⚠️ "INVALID_TOKEN"
- El token de MercadoPago expiró o es incorrecto
- Genera un nuevo token en el panel de desarrolladores

### 🌐 "CORS error"
- El frontend está llamando desde un puerto diferente
- Asegúrate de que ambos usen `http://localhost:3001`

### 🔍 Depuración paso a paso
```bash
# 1. Verificar instalación
npm run diagnostic

# 2. Probar servidor básico
npm run test-server

# 3. Probar con MercadoPago
npm run test

# 4. Verificar logs del servidor
npm run dev  # Y observa la consola
```

### Pagos no se procesan
1. Confirma que usas credenciales de Sandbox
2. Verifica las URLs de retorno en MercadoPago
3. Revisa logs del servidor

### Problemas con CORS
Asegúrate de que el servidor permita requests desde tu dominio.

## 📞 Soporte

Para problemas específicos:
1. Revisa los logs del servidor
2. Verifica la configuración de MercadoPago
3. Consulta la documentación oficial de MercadoPago

---

**Desarrollado con ❤️ para Favela Films**
