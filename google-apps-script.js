// ============================================
// Google Apps Script para Actualizar Invitados
// Pega este código en tu Google Sheet
// ============================================

// 1. En tu Google Sheet, ve a: Extensiones → Apps Script
// 2. Borra todo el código que aparece
// 3. Pega este código completo
// 4. Click en "Implementar" → "Nueva implementación"
// 5. Tipo: "Aplicación web"
// 6. Ejecutar como: "Yo"
// 7. Acceso: "Cualquier persona"
// 8. Click "Implementar"
// 9. Copia la URL que te da (Web App URL)

function doPost(e) {
  try {
    // Parsear datos del request
    const data = JSON.parse(e.postData.contents);
    const { guestId, attendance, notes } = data;
    
    // Obtener la hoja "Invitados"
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Invitados');
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Hoja "Invitados" no encontrada'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Buscar el invitado por ID (Columna A)
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let rowFound = -1;
    for (let i = 1; i < values.length; i++) { // Empezar en 1 para saltar header
      if (values[i][0].toString() === guestId.toString()) {
        rowFound = i + 1; // +1 porque las filas empiezan en 1
        break;
      }
    }
    
    if (rowFound === -1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Invitado no encontrado con ID: ' + guestId
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Actualizar la asistencia (Columna C) y notas (Columna D)
    sheet.getRange(rowFound, 3).setValue(attendance); // Columna C = Asistencia
    sheet.getRange(rowFound, 4).setValue(notes || ''); // Columna D = Notas
    
    // Log de la actualización
    Logger.log(`✅ Actualizado: ${values[rowFound-1][1]} → ${attendance}`);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Invitado actualizado correctamente',
      guestName: values[rowFound-1][1]
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Endpoint GET para verificar que funciona
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Google Apps Script funcionando correctamente',
    sheet: SpreadsheetApp.getActiveSpreadsheet().getName()
  })).setMimeType(ContentService.MimeType.JSON);
}
