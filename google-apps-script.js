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
    const { guestId, attendance, notes, bus, intolerances, intolerancias } = data;

    const normalize = (value) => (value || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

    const isBusAnswer = (value) => {
      const normalized = normalize(value);
      return normalized === 'si' || normalized === 'sí' || normalized === 'no';
    };

    let resolvedBus = (bus || '').toString().trim();
    let resolvedIntolerances = (intolerances || intolerancias || '').toString().trim();

    if (resolvedBus && !isBusAnswer(resolvedBus) && !resolvedIntolerances) {
      resolvedIntolerances = resolvedBus;
      resolvedBus = '';
    }

    if (!resolvedBus && isBusAnswer(resolvedIntolerances)) {
      resolvedBus = resolvedIntolerances;
      resolvedIntolerances = '';
    }
    
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

    const headers = (values[0] || []).map(value => normalize(value));
    const findColumn = (...candidates) => {
      for (let i = 0; i < headers.length; i++) {
        if (candidates.includes(headers[i])) {
          return i + 1; // Google Sheets columns are 1-based
        }
      }
      return -1;
    };

    const attendanceCol = findColumn('asistencia');
    const notesCol = findColumn('notas');
    const busCol = findColumn('bus', 'autobus', 'transporte');
    const intolerancesCol = findColumn('intolerancias', 'intelerancias', 'alergias', 'intolerancias o alergias alimentarias');
    
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
    
    // Actualizar columnas por nombre de cabecera (con fallback si no existe)
    if (attendanceCol > 0) {
      sheet.getRange(rowFound, attendanceCol).setValue(attendance || '');
    } else {
      sheet.getRange(rowFound, 3).setValue(attendance || '');
    }

    if (notesCol > 0) {
      sheet.getRange(rowFound, notesCol).setValue(notes || '');
    } else {
      sheet.getRange(rowFound, 4).setValue(notes || '');
    }

    const intolerancesTargetCol = intolerancesCol > 0 ? intolerancesCol : 6; // F = Intelerancias
    const busTargetCol = busCol > 0 ? busCol : 7; // G = Bus

    sheet.getRange(rowFound, busTargetCol).setValue(resolvedBus);
    sheet.getRange(rowFound, intolerancesTargetCol).setValue(resolvedIntolerances);
    
    // Log de la actualización
    Logger.log(`✅ Actualizado: ${values[rowFound-1][1]} → ${attendance} | Bus: ${resolvedBus || '-'} | Intolerancias: ${resolvedIntolerances || '-'}`);
    
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
