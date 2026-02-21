// Script de verificación - Ejecuta con: node verify-sheets.js
// O copia esto en la consola del navegador en /api/guests

const GOOGLE_SHEETS_ID = '13mDj9xObG1RIhRe_eDeKrt6jsMMO9J63kVaLlETo8dU';
const GOOGLE_SHEETS_API_KEY = 'AIzaSyCkKba49X16ShuZ63GFkguJ_WIzCFi94Cg';

const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/Invitados!A2:E?key=${GOOGLE_SHEETS_API_KEY}`;

console.log('🔍 Verificando conexión con Google Sheets...');
console.log('URL:', sheetsUrl);

fetch(sheetsUrl)
  .then(response => {
    console.log('Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Respuesta exitosa:');
    console.log('Filas encontradas:', data.values?.length || 0);
    console.log('Primeros 3 invitados:', data.values?.slice(0, 3));
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });
