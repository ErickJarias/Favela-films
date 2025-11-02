// 🧪 Script de Prueba Básica del Servidor
// Ejecuta: node test-server.js

const fetch = require('node-fetch');

async function testBasicServer() {
  console.log('🎬 Probando Servidor Básico - Favela Films\n');

  const BASE_URL = 'http://localhost:3001';

  try {
    console.log('1️⃣ Verificando conexión básica...');
    const response = await fetch(BASE_URL);

    if (response.ok) {
      console.log('✅ Servidor responde correctamente');
      console.log('📄 Status:', response.status);

      const text = await response.text();
      console.log('📏 Longitud de respuesta:', text.length, 'caracteres');

      if (text.includes('Favela Films')) {
        console.log('✅ Página principal cargada correctamente');
      } else {
        console.log('⚠️ Página cargada pero no contiene "Favela Films"');
      }
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

  } catch (error) {
    console.log('❌ Error conectando al servidor:', error.message);
    console.log('\n🔧 Soluciones posibles:');
    console.log('1. Asegúrate de que el servidor esté corriendo: npm run dev');
    console.log('2. Verifica que no haya otro proceso usando el puerto 3001');
    console.log('3. Revisa que Node.js esté instalado: node --version');
    console.log('4. Verifica que las dependencias estén instaladas: npm install');
    return;
  }

  // Test 2: Verificar API básica
  try {
    console.log('\n2️⃣ Probando endpoint básico...');
    const apiResponse = await fetch(`${BASE_URL}/api/test`);

    if (apiResponse.status === 404) {
      console.log('ℹ️ Endpoint /api/test no existe (normal)');
    } else {
      console.log('✅ API responde:', apiResponse.status);
    }

  } catch (error) {
    console.log('⚠️ Error en API test (puede ser normal):', error.message);
  }

  console.log('\n🎉 Servidor básico funcionando correctamente!');
  console.log('\n📋 Próximos pasos para probar pagos:');
  console.log('1. Configura tu token real de MercadoPago en .env');
  console.log('2. Ejecuta: npm test (para pruebas completas)');
  console.log('3. Abre http://localhost:3001 y prueba un pago');
}

// Ejecutar pruebas
testBasicServer().catch(error => {
  console.error('❌ Error fatal en pruebas:', error);
  process.exit(1);
});
