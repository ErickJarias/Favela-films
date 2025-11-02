// 🧪 Script de Prueba para Sistema de Pagos Favela Films
// Ejecuta: node test-payment.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testPaymentSystem() {
  console.log('🎬 Probando Sistema de Pagos - Favela Films\n');

  // Test 1: Verificar que el servidor esté corriendo
  console.log('1️⃣ Verificando servidor...');
  try {
    const response = await fetch(BASE_URL);
    if (response.ok) {
      console.log('✅ Servidor corriendo en', BASE_URL);
    } else {
      throw new Error('Servidor no responde');
    }
  } catch (error) {
    console.log('❌ Error conectando al servidor:', error.message);
    console.log('💡 Asegúrate de ejecutar: npm run dev');
    return;
  }

  // Test 2: Crear una preferencia de pago
  console.log('\n2️⃣ Creando preferencia de pago...');
  try {
    const testOrder = {
      items: [
        {
          title: 'Camiseta Oficial Seleccion Colombia',
          quantity: 1,
          price: 120000
        }
      ],
      cupon: 'FAVELA10'
    };

    const response = await fetch(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrder)
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Preferencia creada exitosamente');
      console.log('🆔 ID de preferencia:', data.preferenceId);
      console.log('🔗 URL de pago:', data.init_point);

      // Test 3: Verificar que se puede acceder al pedido
      console.log('\n3️⃣ Verificando acceso al pedido...');
      const pedidoResponse = await fetch(`${BASE_URL}/api/pedido/${data.preferenceId}`);
      const pedido = await pedidoResponse.json();

      if (pedido.id) {
        console.log('✅ Pedido guardado correctamente');
        console.log('📦 Items:', pedido.items.length);
        console.log('💰 Total:', pedido.total, 'COP');
        console.log('🏷️ Cupón aplicado:', pedido.cupon || 'Ninguno');
      } else {
        console.log('❌ Error accediendo al pedido');
      }

    } else {
      console.log('❌ Error creando preferencia:', data.error);
      console.log('💡 Verifica tu MERCADO_PAGO_ACCESS_TOKEN en .env');
    }

  } catch (error) {
    console.log('❌ Error en la prueba:', error.message);
  }

  // Test 4: Verificar páginas estáticas
  console.log('\n4️⃣ Verificando páginas...');
  const pages = ['/', '/success.html', '/failure.html', '/pending.html'];

  for (const page of pages) {
    try {
      const response = await fetch(`${BASE_URL}${page}`);
      if (response.ok) {
        console.log(`✅ ${page} - OK`);
      } else {
        console.log(`❌ ${page} - Error ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${page} - Error de conexión`);
    }
  }

  console.log('\n🎉 Pruebas completadas!');
  console.log('\n💡 Próximos pasos:');
  console.log('1. Abre http://localhost:3001 en tu navegador');
  console.log('2. Agrega productos al carrito');
  console.log('3. Prueba el proceso de pago con tarjetas de prueba');
  console.log('4. Verifica las páginas de éxito/error');

  console.log('\n📚 Recursos útiles:');
  console.log('- README.md: Instrucciones completas');
  console.log('- MERCADOPAGO_SETUP.md: Configuración de pagos');
  console.log('- API_EXAMPLES.md: Ejemplos de uso de la API');
}

// Ejecutar pruebas
testPaymentSystem().catch(console.error);
