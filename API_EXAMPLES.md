# 🔌 API Examples - Favela Films Payment System

Ejemplos prácticos de cómo usar la API de pagos de Favela Films.

## 📡 Endpoints Disponibles

### `POST /api/checkout`
Crear una nueva sesión de pago.

#### Request Example:
```bash
curl -X POST http://localhost:3001/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "title": "Camiseta Oficial Seleccion Colombia",
        "quantity": 2,
        "price": 120000
      },
      {
        "title": "Balón de Fútbol Profesional",
        "quantity": 1,
        "price": 90000
      }
    ],
    "cupon": "FAVELA10"
  }'
```

#### Response Example:
```json
{
  "success": true,
  "preferenceId": "123456789-abcdef12-3456-7890-abcd12345678",
  "init_point": "https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=123456789"
}
```

### `GET /api/pedido/:id`
Obtener detalles de un pedido específico.

#### Request Example:
```bash
curl http://localhost:3001/api/pedido/123456789-abcdef12-3456-7890-abcd12345678
```

#### Response Example:
```json
{
  "id": "123456789-abcdef12-3456-7890-abcd12345678",
  "items": [
    {
      "title": "Camiseta Oficial Seleccion Colombia",
      "quantity": 2,
      "price": 120000
    }
  ],
  "total": 216000,
  "cupon": "FAVELA10",
  "status": "completed",
  "fecha": "2025-01-15T10:30:00.000Z"
}
```

## 💻 JavaScript Examples

### Crear Pago desde Frontend
```javascript
async function crearPago() {
  const carrito = [
    { title: "Producto 1", quantity: 1, price: 50000 },
    { title: "Producto 2", quantity: 2, price: 25000 }
  ];

  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: carrito,
        cupon: 'FAVELA10' // opcional
      })
    });

    const data = await response.json();

    if (data.success) {
      // Redirigir a MercadoPago
      window.location.href = data.init_point;
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
}
```

### Verificar Estado del Pago
```javascript
async function verificarPago(preferenceId) {
  try {
    const response = await fetch(`/api/pedido/${preferenceId}`);
    const pedido = await response.json();

    console.log('Estado del pedido:', pedido.status);
    console.log('Total pagado:', pedido.total);

    return pedido;
  } catch (error) {
    console.error('Error al verificar pago:', error);
  }
}
```

## 🧪 Testing Examples

### Pago Exitoso
```javascript
// Simular pago exitoso
const testData = {
  items: [
    { title: "Test Product", quantity: 1, price: 1000 }
  ]
};

// El sistema automáticamente aplicará descuentos y calculará totales
```

### Pago con Descuento
```javascript
const testDataConDescuento = {
  items: [
    { title: "Producto", quantity: 1, price: 100000 }
  ],
  cupon: "FAVELA10" // 10% descuento
};

// Resultado esperado: total = 90.000 COP
```

### Pago con Envío Gratis
```javascript
const testDataEnvioGratis = {
  items: [
    { title: "Producto Caro", quantity: 1, price: 160000 }
  ]
};

// Resultado esperado: envío = 0 COP (gratis por compra > 150.000)
```

## 📊 Webhook Handling

### Recibir Confirmaciones de Pago
```javascript
// En server.js - Webhook endpoint
app.post('/api/webhook', (req, res) => {
  const payment = req.body;

  console.log('Pago recibido:', payment);

  // Actualizar base de datos
  if (payment.type === 'payment') {
    const paymentId = payment.data.id;
    // Marcar pedido como pagado
    actualizarEstadoPedido(paymentId, 'completed');
  }

  res.sendStatus(200);
});
```

### Estados de Pago
```javascript
const estadosPago = {
  'pending': 'Pendiente',
  'approved': 'Aprobado',
  'authorized': 'Autorizado',
  'in_process': 'En proceso',
  'in_mediation': 'En mediación',
  'rejected': 'Rechazado',
  'cancelled': 'Cancelado',
  'refunded': 'Reembolsado',
  'charged_back': 'Contracargo'
};
```

## 🔧 Error Handling

### Códigos de Error Comunes
```javascript
const errores = {
  'invalid_token': 'Token de MercadoPago inválido',
  'invalid_card': 'Tarjeta inválida',
  'insufficient_funds': 'Fondos insuficientes',
  'card_declined': 'Tarjeta rechazada',
  'expired_card': 'Tarjeta expirada',
  'invalid_cvv': 'CVV inválido'
};
```

### Manejo de Errores en Frontend
```javascript
function manejarErrorPago(error) {
  switch(error.code) {
    case 'invalid_token':
      mostrarMensaje('Error de configuración. Contacta al administrador.');
      break;
    case 'card_declined':
      mostrarMensaje('Pago rechazado. Verifica tus datos.');
      break;
    default:
      mostrarMensaje('Error inesperado. Intenta nuevamente.');
  }
}
```

## 🎯 Casos de Uso Avanzados

### 1. Pago Recurrente
```javascript
// Para suscripciones o pagos recurrentes
const preferenceRecurrente = {
  items: [{ title: "Suscripción Mensual", quantity: 1, price: 50000 }],
  payer: {
    email: "cliente@email.com"
  },
  back_urls: {
    success: "/suscripcion-exitosa"
  },
  auto_recurring: {
    frequency: 1,
    frequency_type: "months",
    transaction_amount: 50000
  }
};
```

### 2. Pago con Información Adicional
```javascript
const preferenceConInfo = {
  items: [...],
  payer: {
    name: "Juan Pérez",
    email: "juan@email.com",
    phone: { number: "3111234567" },
    address: {
      street_name: "Calle 123",
      zip_code: "110111"
    }
  },
  shipments: {
    receiver_address: {
      street_name: "Calle Entrega 456",
      city_name: "Bogotá",
      zip_code: "110111"
    }
  }
};
```

### 3. Integración con Inventario
```javascript
// Antes de crear pago, verificar stock
async function verificarStockAntesPago(items) {
  for (const item of items) {
    const stock = await verificarStockProducto(item.id);
    if (item.quantity > stock) {
      throw new Error(`Stock insuficiente para ${item.title}`);
    }
  }
  return true;
}
```

## 🚀 Deployment Examples

### Vercel (Recomendado)
```javascript
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "MERCADO_PAGO_ACCESS_TOKEN": "@mercadopago_token"
  }
}
```

### Render
```yaml
# render.yaml
services:
  - type: web
    name: favela-films-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MERCADO_PAGO_ACCESS_TOKEN
        value: YOUR_TOKEN_HERE
      - key: NODE_ENV
        value: production
```

---

## 📝 Notas Importantes

1. **Nunca expongas tu Access Token** en el frontend
2. **Usa HTTPS en producción** para seguridad
3. **Implementa validación** de datos en ambos lados
4. **Monitorea los logs** para detectar problemas
5. **Configura webhooks** para confirmaciones automáticas
6. **Prueba exhaustivamente** con tarjetas sandbox

¡Tu sistema de pagos está listo para recibir transacciones seguras! 🎉
