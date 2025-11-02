const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Servir archivos estáticos del frontend

// Configurar MercadoPago
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

// Conectar a MongoDB (opcional - para desarrollo local usaré un array)
let pedidos = []; // Array simple para desarrollo local

// Esquema de Pedido (si usas MongoDB)
// const pedidoSchema = new mongoose.Schema({
//   items: Array,
//   total: Number,
//   status: String,
//   paymentId: String,
//   fecha: { type: Date, default: Date.now }
// });
// const Pedido = mongoose.model('Pedido', pedidoSchema);

// Rutas
app.post('/api/checkout', async (req, res) => {
  try {
    const { items, cupon } = req.body;

    // Calcular total
    let total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Aplicar descuento si hay cupón
    if (cupon) {
      // Lógica de cupones (simplificada)
      if (cupon === 'FAVELA10') total *= 0.9;
      else if (cupon === 'FUTBOL') total *= 0.85;
    }

    // Crear preferencia de pago
    const preference = {
      items: items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        currency_id: 'COP',
        unit_price: item.price
      })),
      back_urls: {
        success: `${req.protocol}://${req.get('host')}/success.html`,
        failure: `${req.protocol}://${req.get('host')}/failure.html`,
        pending: `${req.protocol}://${req.get('host')}/pending.html`
      },
      auto_return: 'approved',
      external_reference: `pedido_${Date.now()}`
    };

    const response = await mercadopago.preferences.create(preference);

    // Guardar pedido (en desarrollo local)
    const pedido = {
      id: response.body.id,
      items,
      total,
      cupon: cupon || null,
      status: 'pending',
      fecha: new Date()
    };
    pedidos.push(pedido);

    res.json({
      success: true,
      preferenceId: response.body.id,
      init_point: response.body.init_point
    });

  } catch (error) {
    console.error('Error creating payment preference:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear la preferencia de pago'
    });
  }
});

// Webhook para confirmar pagos (opcional para producción)
app.post('/api/webhook', async (req, res) => {
  try {
    const payment = req.body;

    if (payment.type === 'payment') {
      const paymentId = payment.data.id;

      // Buscar y actualizar pedido
      const pedidoIndex = pedidos.findIndex(p => p.id === paymentId);
      if (pedidoIndex !== -1) {
        pedidos[pedidoIndex].status = 'completed';
        pedidos[pedidoIndex].paymentId = paymentId;
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

// Ruta para verificar estado del pedido
app.get('/api/pedido/:id', (req, res) => {
  const pedido = pedidos.find(p => p.id === req.params.id);
  if (pedido) {
    res.json(pedido);
  } else {
    res.status(404).json({ error: 'Pedido no encontrado' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`💳 MercadoPago configurado: ${process.env.MERCADO_PAGO_ACCESS_TOKEN ? '✅' : '❌'}`);
});
