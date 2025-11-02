// 🚀 SERVIDOR BÁSICO - Sin MercadoPago (para pruebas)
// Ejecuta: node server-basic.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Array para simular base de datos de pedidos
let pedidos = [];
let contadorPedidos = 1;

// Endpoint de prueba básico
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor básico funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Endpoint de checkout SIMULADO (sin MercadoPago real)
app.post('/api/checkout', (req, res) => {
  try {
    const { items, cupon } = req.body;

    console.log('🛒 Nuevo pedido simulado recibido:', { items, cupon });

    // Calcular total
    let total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Aplicar descuento simulado
    if (cupon) {
      if (cupon === 'FAVELA10') total *= 0.9;
      else if (cupon === 'FUTBOL') total *= 0.85;
      console.log(`🏷️ Cupón aplicado: ${cupon}, descuento calculado`);
    }

    // Crear pedido simulado
    const pedidoId = `TEST_${Date.now()}_${contadorPedidos++}`;
    const pedido = {
      id: pedidoId,
      items,
      total: Math.round(total),
      cupon: cupon || null,
      status: 'completed',
      fecha: new Date(),
      modo: 'simulado'
    };

    pedidos.push(pedido);

    console.log('✅ Pedido simulado creado:', pedidoId);

    // Simular URL de MercadoPago (redirección a página de éxito)
    const mockUrl = `${req.protocol}://${req.get('host')}/success.html?preference_id=${pedidoId}`;

    res.json({
      success: true,
      preferenceId: pedidoId,
      init_point: mockUrl,
      modo: 'simulado'
    });

  } catch (error) {
    console.error('❌ Error en checkout simulado:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Obtener pedido por ID
app.get('/api/pedido/:id', (req, res) => {
  const pedido = pedidos.find(p => p.id === req.params.id);

  if (pedido) {
    res.json(pedido);
  } else {
    res.status(404).json({
      error: 'Pedido no encontrado',
      id: req.params.id
    });
  }
});

// Listar todos los pedidos (solo para desarrollo)
app.get('/api/pedidos', (req, res) => {
  res.json({
    total: pedidos.length,
    pedidos: pedidos.slice(-10) // Últimos 10 pedidos
  });
});

// Limpiar pedidos (solo para desarrollo)
app.delete('/api/pedidos', (req, res) => {
  const cantidad = pedidos.length;
  pedidos = [];
  contadorPedidos = 1;

  res.json({
    message: `✅ ${cantidad} pedidos eliminados`,
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 SERVIDOR BÁSICO FAVELA FILMS');
  console.log('=' .repeat(40));
  console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
  console.log('🎭 Modo: SIMULADO (sin MercadoPago real)');
  console.log('🧪 Para pruebas de pago sin configuración');
  console.log('');
  console.log('📋 Endpoints disponibles:');
  console.log(`   GET  /api/health - Verificar servidor`);
  console.log(`   POST /api/checkout - Crear pago simulado`);
  console.log(`   GET  /api/pedido/:id - Obtener pedido`);
  console.log(`   GET  /api/pedidos - Listar pedidos`);
  console.log(`   DELETE /api/pedidos - Limpiar pedidos`);
  console.log('');
  console.log('💡 Para usar MercadoPago real:');
  console.log('   1. Configura .env con token real');
  console.log('   2. Ejecuta: node server.js');
  console.log('=' .repeat(40));
});

// Manejo de errores global
process.on('uncaughtException', (error) => {
  console.error('❌ Error no manejado:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada:', reason);
});
