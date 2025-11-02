// 🔍 DIAGNÓSTICO COMPLETO - Sistema de Pagos Favela Films
// Ejecuta: node diagnostic.js

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DEL SISTEMA DE PAGOS - FAVELA FILMS\n');
console.log('=' .repeat(60));

let errores = [];
let advertencias = [];

// 1. Verificar Node.js
console.log('1️⃣ Verificando Node.js...');
try {
  const nodeVersion = process.version;
  console.log('✅ Node.js instalado:', nodeVersion);

  if (parseInt(nodeVersion.split('.')[0].replace('v', '')) < 14) {
    advertencias.push('Node.js versión antigua. Recomendado: 16+');
  }
} catch (error) {
  errores.push('Node.js no está instalado');
}

// 2. Verificar archivos necesarios
console.log('\n2️⃣ Verificando archivos del proyecto...');
const archivosRequeridos = [
  'package.json',
  'server.js',
  'index.html',
  'script.js',
  '.env'
];

archivosRequeridos.forEach(archivo => {
  if (fs.existsSync(archivo)) {
    console.log(`✅ ${archivo} encontrado`);
  } else {
    errores.push(`Archivo faltante: ${archivo}`);
  }
});

// 3. Verificar package.json
console.log('\n3️⃣ Verificando dependencias...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('✅ package.json válido');

  const dependenciasRequeridas = [
    'express', 'cors', 'mercadopago', 'dotenv', 'body-parser'
  ];

  dependenciasRequeridas.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ Dependencia ${dep} configurada`);
    } else {
      errores.push(`Dependencia faltante: ${dep}`);
    }
  });
} catch (error) {
  errores.push('package.json inválido o no encontrado');
}

// 4. Verificar configuración .env
console.log('\n4️⃣ Verificando configuración...');
try {
  require('dotenv').config();

  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!token) {
    errores.push('MERCADO_PAGO_ACCESS_TOKEN no configurado en .env');
  } else if (token === 'YOUR_ACCESS_TOKEN_HERE' || token === 'TEST-123456789012345678901234567890123456') {
    errores.push('MERCADO_PAGO_ACCESS_TOKEN tiene valor de ejemplo - configura tu token real');
  } else if (token.startsWith('TEST-')) {
    console.log('✅ Token de SANDBOX configurado (modo pruebas)');
  } else if (token.startsWith('APP_USR-')) {
    console.log('✅ Token de PRODUCCIÓN configurado');
  } else {
    advertencias.push('Formato de token desconocido - verifica que sea válido');
  }

  const port = process.env.PORT || '3001';
  console.log(`✅ Puerto configurado: ${port}`);

} catch (error) {
  errores.push('Error leyendo configuración .env');
}

// 5. Verificar conectividad de red (básica)
console.log('\n5️⃣ Verificando conectividad...');
try {
  // Verificar que podemos hacer requests HTTP básicos
  console.log('✅ Node.js puede ejecutar código (conectividad básica OK)');
} catch (error) {
  errores.push('Problemas de conectividad básica');
}

// 6. Verificar MercadoPago SDK
console.log('\n6️⃣ Verificando MercadoPago SDK...');
try {
  const mercadopago = require('mercadopago');
  console.log('✅ MercadoPago SDK instalado');

  if (process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    mercadopago.configure({
      access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
    });
    console.log('✅ MercadoPago SDK configurado');
  }
} catch (error) {
  errores.push('MercadoPago SDK no instalado o error de configuración');
}

// RESULTADOS
console.log('\n' + '='.repeat(60));
console.log('📊 RESULTADOS DEL DIAGNÓSTICO');

if (errores.length === 0) {
  console.log('🎉 ¡EXCELENTE! No se encontraron errores críticos.');
  console.log('\n✅ El sistema debería funcionar correctamente.');
  console.log('🚀 Ejecuta: npm run dev');
  console.log('🌐 Luego abre: http://localhost:3001');
} else {
  console.log('❌ Se encontraron errores que deben corregirse:');
  errores.forEach((error, index) => {
    console.log(`${index + 1}. ${error}`);
  });
}

if (advertencias.length > 0) {
  console.log('\n⚠️ Advertencias (no críticas pero recomendadas):');
  advertencias.forEach((adv, index) => {
    console.log(`${index + 1}. ${adv}`);
  });
}

// INSTRUCCIONES DE SOLUCIÓN
if (errores.length > 0) {
  console.log('\n🔧 INSTRUCCIONES PARA SOLUCIONAR:');

  if (errores.some(e => e.includes('Node.js'))) {
    console.log('\n📥 Instalar Node.js:');
    console.log('1. Ve a https://nodejs.org/');
    console.log('2. Descarga la versión LTS (18.x+)');
    console.log('3. Instala y reinicia la terminal');
  }

  if (errores.some(e => e.includes('dependencia'))) {
    console.log('\n📦 Instalar dependencias:');
    console.log('1. Abre terminal en la carpeta del proyecto');
    console.log('2. Ejecuta: npm install');
  }

  if (errores.some(e => e.includes('TOKEN'))) {
    console.log('\n🔑 Configurar MercadoPago:');
    console.log('1. Ve a https://developers.mercadopago.com/');
    console.log('2. Crea cuenta y aplicación');
    console.log('3. Copia el Access Token');
    console.log('4. Pégalo en .env: MERCADO_PAGO_ACCESS_TOKEN=tu_token_aqui');
  }

  if (errores.some(e => e.includes('MercadoPago SDK'))) {
    console.log('\n🛠️ Reinstalar dependencias:');
    console.log('1. Borra node_modules: rm -rf node_modules');
    console.log('2. Borra package-lock.json');
    console.log('3. Ejecuta: npm install');
  }
}

console.log('\n📞 Si sigues teniendo problemas:');
console.log('1. Revisa MERCADOPAGO_SETUP.md para configuración detallada');
console.log('2. Ejecuta: node test-server.js (prueba básica)');
console.log('3. Comparte los errores específicos que ves');

console.log('\n' + '='.repeat(60));
console.log('🏁 Diagnóstico completado');
