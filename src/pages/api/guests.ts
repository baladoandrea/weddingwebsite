import type { NextApiRequest, NextApiResponse } from 'next';
import guestsData from '../../data/guests.json';

interface Guest {
  id: string;
  name: string;
  attendance: string;
  notes: string;
  image: string;
}

const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const USE_GOOGLE_SHEETS = GOOGLE_SHEETS_ID && GOOGLE_SHEETS_API_KEY;

// Debug logs (eliminar después de verificar)
console.log('🔍 Google Sheets Config:');
console.log('  GOOGLE_SHEETS_ID:', GOOGLE_SHEETS_ID ? '✅ Configurado' : '❌ No encontrado');
console.log('  GOOGLE_SHEETS_API_KEY:', GOOGLE_SHEETS_API_KEY ? '✅ Configurado' : '❌ No encontrado');
console.log('  USE_GOOGLE_SHEETS:', USE_GOOGLE_SHEETS ? '✅ Habilitado' : '❌ Deshabilitado');

// Simulamos una base de datos en memoria para este ejemplo
let guestsCache = [...guestsData];

/**
 * Obtiene los invitados desde Google Sheets
 * Formato esperado en la hoja "Invitados":
 * Columna A: ID
 * Columna B: Nombre
 * Columna C: Asistencia
 * Columna D: Notas
 * Columna E: Imagen
 */
async function getGuestsFromSheets(): Promise<Guest[]> {
  if (!USE_GOOGLE_SHEETS) {
    console.log('⚠️  Usando guests.json (Google Sheets no configurado)');
    return guestsCache;
  }

  try {
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/Invitados!A2:E?key=${GOOGLE_SHEETS_API_KEY}`;
    console.log('📡 Intentando conectar con Google Sheets...');
    
    const response = await fetch(sheetsUrl);
    
    if (!response.ok) {
      console.error('❌ Error fetching from Google Sheets:', response.status, response.statusText);
      console.error('   URL:', sheetsUrl.replace(GOOGLE_SHEETS_API_KEY!, 'API_KEY_HIDDEN'));
      return guestsCache; // Fallback a datos locales
    }

    const data = await response.json();
    const rows = data.values || [];
    
    console.log('✅ Google Sheets conectado exitosamente!');
    console.log(`   Invitados encontrados: ${rows.length}`);

    const guests: Guest[] = rows.map((row: string[]) => ({
      id: row[0] || '',
      name: row[1] || '',
      attendance: row[2] || '',
      notes: row[3] || '',
      image: row[4] || '/assets/thank-you-1.png',
    }));

    // Actualizamos el cache
    guestsCache = guests;
    return guests;
  } catch (error) {
    console.error('❌ Error connecting to Google Sheets:', error);
    return guestsCache; // Fallback a datos locales
  }
}

/**
 * Actualiza un invitado en Google Sheets
 */
async function updateGuestInSheets(guestId: string, updates: Partial<Guest>): Promise<boolean> {
  if (!USE_GOOGLE_SHEETS) {
    return false; // No hay Google Sheets configurado
  }

  try {
    // Primero obtenemos el índice del invitado
    const guests = await getGuestsFromSheets();
    const guestIndex = guests.findIndex(g => g.id === guestId);
    
    if (guestIndex === -1) {
      return false;
    }

    const rowNumber = guestIndex + 2; // +2 porque fila 1 es header y index empieza en 0
    const updatedGuest = { ...guests[guestIndex], ...updates };

    // URL para actualizar la fila específica
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/Invitados!A${rowNumber}:E${rowNumber}?valueInputOption=RAW&key=${GOOGLE_SHEETS_API_KEY}`;
    
    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[
          updatedGuest.id,
          updatedGuest.name,
          updatedGuest.attendance,
          updatedGuest.notes,
          updatedGuest.image,
        ]],
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating Google Sheets:', error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Guest[] | Guest | { error: string }>
) {
  try {
    if (req.method === 'GET') {
      const guests = await getGuestsFromSheets();
      return res.status(200).json(guests);
    }

    if (req.method === 'POST') {
      const newGuest: Guest = {
        id: Date.now().toString(),
        ...req.body,
      };
      
      // Si usamos Google Sheets, actualizamos también allí
      // (requiere implementar append en Sheets API)
      guestsCache.push(newGuest);
      return res.status(201).json(newGuest);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid guest ID' });
      }

      const guests = await getGuestsFromSheets();
      const guestIndex = guests.findIndex(g => g.id === id);

      if (guestIndex === -1) {
        return res.status(404).json({ error: 'Guest not found' });
      }

      const updatedGuest = { ...guests[guestIndex], ...req.body };
      
      // Actualizar en Google Sheets si está configurado
      if (USE_GOOGLE_SHEETS) {
        await updateGuestInSheets(id, req.body);
      }
      
      // Actualizar cache local
      guestsCache[guestIndex] = updatedGuest;
      
      return res.status(200).json(updatedGuest);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid guest ID' });
      }
      
      guestsCache = guestsCache.filter(g => g.id !== id);
      return res.status(200).json(guestsCache);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
