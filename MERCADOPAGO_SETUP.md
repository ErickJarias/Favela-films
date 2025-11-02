# 🔧 Configuración de MercadoPago para Favela Films

## 📋 Paso a Paso para Configurar Pagos

### 1. Crear Cuenta en MercadoPago

1. Ve a [mercadopago.com.co](https://www.mercadopago.com.co)
2. Haz clic en "Crear cuenta"
3. Selecciona "Cuenta personal" o "Cuenta business"
4. Completa tu información personal
5. Verifica tu email y teléfono

### 2. Verificación de Cuenta

1. Sube documentos de identidad
2. Confirma tu dirección
3. Espera aprobación (puede tomar 24-48 horas)

### 3. Obtener Credenciales de Desarrollador

1. Ve a [developers.mercadopago.com](https://developers.mercadopago.com/)
2. Inicia sesión con tu cuenta
3. Ve a "Tus credenciales" en el menú lateral
4. Crea una nueva aplicación:
   - **Nombre**: Favela Films E-commerce
   - **Tipo**: Pagos
   - **Producto**: Checkout Pro

### 4. Configurar Credenciales

#### Para Desarrollo (Sandbox):
```env
MERCADO_PAGO_ACCESS_TOKEN=TEST-123456789012345678901234567890123456
```

#### Para Producción (cuando estés listo):
```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-123456789012345678901234567890123456
```

### 5. Configurar URLs de Retorno

En tu panel de MercadoPago > Aplicaciones > Tu App:

```
URLs de retorno:
✅ https://tu-dominio.com/success.html
❌ https://tu-dominio.com/failure.html
⏳ https://tu-dominio.com/pending.html
```

### 6. Configurar Webhooks (Opcional - Para Producción)

```
URL del webhook: https://tu-api.com/api/webhook
Eventos: payment.created, payment.updated
```

## 🧪 Tarjetas de Prueba (Sandbox)

### ✅ Pagos Aprobados:
| Tipo | Número | Código | Vencimiento | Nombre |
|------|--------|--------|-------------|--------|
| Visa | 4509 9535 6623 3704 | 123 | 11/25 | APRO |
| Mastercard | 5031 4332 1540 6351 | 123 | 11/25 | APRO |
| American Express | 3711 803032 57522 | 1234 | 11/25 | APRO |

### ❌ Pagos Rechazados:
| Tipo | Número | Código | Vencimiento | Nombre |
|------|--------|--------|-------------|--------|
| Visa | 4000 0000 0000 0002 | 123 | 11/25 | OTHE |

### ⏳ Pagos Pendientes:
Usa cualquier tarjeta y selecciona "cuotas" en el checkout.

## 🚀 Probar el Sistema

### 1. Iniciar Servidor
```bash
npm install
npm run dev
```

### 2. Abrir en Navegador
```
http://localhost:3001
```

### 3. Realizar Compra de Prueba
1. Agrega productos al carrito
2. Ve al checkout
3. Aplica cupón si quieres (`FAVELA10`)
4. Haz clic en "Proceder al Pago"
5. Usa tarjeta de prueba: `4509 9535 6623 3704`
6. Deberías ser redirigido a success.html

## 🔍 Verificar Logs

### En Terminal:
```bash
# Los logs mostrarán:
🚀 Servidor corriendo en http://localhost:3001
💳 MercadoPago configurado: ✅
📦 Nuevo pedido creado: [ID]
💰 Pago procesado: [MONTO] COP
```

### En MercadoPago Dashboard:
1. Ve a "Actividad" en tu cuenta
2. Filtra por "Sandbox"
3. Verifica que aparezcan tus pagos de prueba

## 🐛 Solución de Problemas

### ❌ "Error al procesar el pago"
```
Posibles causas:
1. Token incorrecto en .env
2. Servidor no corriendo
3. Llamando desde puerto 3000 en lugar de 3001
4. CORS bloqueado
```

**Solución:**
```bash
# Verificar que el servidor esté corriendo
curl http://localhost:3001/api/checkout

# Verificar token
echo $MERCADO_PAGO_ACCESS_TOKEN
```

### ❌ "INVALID_TOKEN"
```
Causa: Token expirado o incorrecto
Solución: Genera nuevo token en MercadoPago
```

### ❌ "CORS error"
```
Solución: Asegúrate de que el frontend llame a /api/*, no a URLs externas
```

## 💡 Tips para Desarrollo

### 1. Modo Sandbox vs Producción
- **Sandbox**: Para pruebas, usa `TEST-` tokens
- **Producción**: Usa `APP_USR-` tokens, requiere verificación completa

### 2. Límites de MercadoPago
- **Sandbox**: Sin límites
- **Producción**: Verifica límites según tu verificación

### 3. Monedas Soportadas
- 🇨🇴 COP (Peso Colombiano)
- 🇺🇸 USD (Dólar Estadounidense)
- 🇧🇷 BRL (Real Brasileño)

### 4. Métodos de Pago
- 💳 Tarjetas de crédito/débito
- 🏦 Transferencias bancarias
- 📱 PSE (Pagos en línea)
- 💰 Efecty, Baloto, etc.

## 📞 Contacto y Soporte

### MercadoPago Support:
- 📧 developers@mercadopago.com
- 📚 [Documentación](https://www.mercadopago.com.co/developers)
- 💬 [Comunidad](https://community.mercadopago.com/)

### Problemas Específicos:
1. Revisa logs del servidor
2. Verifica configuración en Dashboard
3. Confirma URLs de retorno
4. Testea con tarjetas de prueba

---

**¡Listo! Tu sistema de pagos está configurado y listo para recibir pagos reales o de prueba.** 🎉
