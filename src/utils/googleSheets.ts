/**
 * Utilidades para integración con Google Sheets
 * Sirve como alternativa a una base de datos real
 * En producción, conectar con Google Sheets API
 */

interface GuestRecord {
  id: string;
  nombre: string;
  asistencia: string;
  notas: string;
  imagenAsociada: string;
}

interface SearchResult {
  found: boolean;
  guest?: GuestRecord;
  error?: string;
}

interface UpdateResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Normaliza un string para búsqueda (sin acentos, minúsculas)
 */
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Obtiene todos los invitados de Google Sheets (API simulada)
 * En producción, esto haría una llamada real a la API de Google Sheets
 */
export const getAllGuests = async (): Promise<GuestRecord[]> => {
  try {
    // Opción 1: Cargar desde API local
    const response = await fetch('/api/guests');
    if (!response.ok) throw new Error('Error fetching guests');
    return await response.json();
  } catch (error) {
    console.error('Error getting guests from Google Sheets:', error);
    return [];
  }
};

/**
 * Busca un invitado por nombre
 * Soporta búsqueda parcial, sin acentos y case-insensitive
 */
export const searchGuest = async (searchQuery: string): Promise<SearchResult> => {
  try {
    const guests = await getAllGuests();

    if (!searchQuery.trim()) {
      return { found: false, error: 'Search query is empty' };
    }

    const normalized = normalizeString(searchQuery);

    const matches = guests.filter(guest => {
      const guestNormalized = normalizeString(guest.nombre);
      return guestNormalized.includes(normalized);
    });

    if (matches.length === 0) {
      return {
        found: false,
        error: `No se encontró "${searchQuery}" en la lista de invitados`,
      };
    }

    // Si hay un match exacto, devolvemos ese
    const exactMatch = matches.find(
      g => normalizeString(g.nombre) === normalized
    );

    if (exactMatch) {
      return { found: true, guest: exactMatch };
    }

    // Si no hay match exacto pero hay matches parciales, devolvemos el primero
    return { found: true, guest: matches[0] };
  } catch (error) {
    console.error('Error searching guest:', error);
    return { found: false, error: 'Error al buscar en la lista de invitados' };
  }
};

/**
 * Busca múltiples invitados por nombre
 * Útil para campos de búsqueda con sugerencias
 */
export const searchGuestsByName = async (
  searchQuery: string,
  limit: number = 5
): Promise<GuestRecord[]> => {
  try {
    const guests = await getAllGuests();

    if (!searchQuery.trim()) {
      return [];
    }

    const normalized = normalizeString(searchQuery);

    return guests
      .filter(guest => {
        const guestNormalized = normalizeString(guest.nombre);
        return guestNormalized.includes(normalized);
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error searching guests:', error);
    return [];
  }
};

/**
 * Actualiza la asistencia de un invitado
 */
export const updateGuestAttendance = async (
  guestId: string,
  attendance: string
): Promise<UpdateResult> => {
  try {
    const response = await fetch(`/api/guests/${guestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asistencia: attendance }),
    });

    if (!response.ok) {
      throw new Error('Failed to update attendance');
    }

    return {
      success: true,
      message: 'Asistencia actualizada correctamente',
    };
  } catch (error) {
    console.error('Error updating attendance:', error);
    return {
      success: false,
      message: 'Error al actualizar la asistencia',
      error: (error as Error).message,
    };
  }
};

/**
 * Actualiza las notas de un invitado
 */
export const updateGuestNotes = async (
  guestId: string,
  notes: string
): Promise<UpdateResult> => {
  try {
    if (notes.length > 240) {
      return {
        success: false,
        message: 'Las notas no pueden exceder 240 caracteres',
      };
    }

    const response = await fetch(`/api/guests/${guestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notas: notes }),
    });

    if (!response.ok) {
      throw new Error('Failed to update notes');
    }

    return {
      success: true,
      message: 'Notas actualizadas correctamente',
    };
  } catch (error) {
    console.error('Error updating notes:', error);
    return {
      success: false,
      message: 'Error al actualizar las notas',
      error: (error as Error).message,
    };
  }
};

/**
 * Actualiza tanto asistencia como notas
 */
export const updateGuestRSVP = async (
  guestId: string,
  attendance: string,
  notes: string
): Promise<UpdateResult> => {
  try {
    if (notes.length > 240) {
      return {
        success: false,
        message: 'Las notas no pueden exceder 240 caracteres',
      };
    }

    const response = await fetch(`/api/guests/${guestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asistencia: attendance,
        notas: notes,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update RSVP');
    }

    return {
      success: true,
      message: 'RSVP actualizado correctamente',
    };
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return {
      success: false,
      message: 'Error al registrar tu asistencia',
      error: (error as Error).message,
    };
  }
};

/**
 * Obtiene la imagen asociada de un invitado
 */
export const getGuestImage = async (guestId: string): Promise<string> => {
  try {
    const guests = await getAllGuests();
    const guest = guests.find(g => g.id === guestId);
    return guest?.imagenAsociada || '';
  } catch (error) {
    console.error('Error getting guest image:', error);
    return '';
  }
};

/**
 * Obtiene estadísticas de asistencia
 */
export const getAttendanceStats = async () => {
  try {
    const guests = await getAllGuests();

    const stats = {
      total: guests.length,
      confirmed: guests.filter(g => g.asistencia === 'Sí, allí estaré').length,
      withKids: guests.filter(g => g.asistencia === 'Con niños').length,
      declined: guests.filter(g => g.asistencia === 'No puedo').length,
      pending: guests.filter(g => !g.asistencia).length,
    };

    return stats;
  } catch (error) {
    console.error('Error getting attendance stats:', error);
    return {
      total: 0,
      confirmed: 0,
      withKids: 0,
      declined: 0,
      pending: 0,
    };
  }
};

/**
 * Valida si un email es válido (para futuras funcionalidades)
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Exporta datos de asistencia para el admin
 */
export const exportAttendanceData = async (): Promise<string> => {
  try {
    const guests = await getAllGuests();

    const csv = [
      ['Nombre', 'Asistencia', 'Notas'],
      ...guests.map(g => [g.nombre, g.asistencia || 'Pendiente', g.notas || '']),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csv;
  } catch (error) {
    console.error('Error exporting data:', error);
    return '';
  }
};

/**
 * Descarga el archivo CSV de asistencia
 */
export const downloadAttendanceCSV = async (): Promise<void> => {
  try {
    const csv = await exportAttendanceData();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `asistencia-boda-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading CSV:', error);
  }
};

/**
 * NOTA: Para usar Google Sheets API en producción, necesitarás:
 * 1. Crear un proyecto en Google Cloud Console
 * 2. Habilitar Google Sheets API
 * 3. Crear una clave de servicio
 * 4. Establecer variables de entorno (GOOGLE_SHEETS_ID, GOOGLE_SHEETS_API_KEY)
 *
 * Ejemplo de implementación con API:
 *
 * const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID;
 * const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
 *
 * const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/Invitados!A:D?key=${GOOGLE_SHEETS_API_KEY}`;
 *
 * async function getGuestsFromSheets() {
 *   const response = await fetch(sheetsUrl);
 *   const data = await response.json();
 *   return data.values;
 * }
 */
