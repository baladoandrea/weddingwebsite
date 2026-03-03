import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

interface RSVPSubmission {
  guestId: string;
  guestName: string;
  guestImage?: string;
  attendance: string;
  bus: 'sí' | 'no';
  intolerances: string;
  notes: string;
}

interface SubmitResponse {
  success: boolean;
  message: string;
  image?: string;
  error?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'baladoandrea@gmail.com';

const normalizeAttendance = (value: string): string => {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

const getAttendanceEmailText = (attendance: string): string => {
  const normalized = normalizeAttendance(attendance);

  if (normalized.includes('no puedo') || normalized.startsWith('no')) {
    return `❌ ${attendance}`;
  }

  if (normalized.includes('acompanante')) {
    return `✅ ${attendance}`;
  }

  if (normalized.includes('nino') || normalized.includes('ninos')) {
    return `✅ ${attendance}`;
  }

  if (normalized.includes('si') || normalized.includes('asistire') || normalized.includes('estare')) {
    return `✅ ${attendance}`;
  }

  return attendance ? `ℹ️ ${attendance}` : '⚠️ Sin respuesta';
};

const normalizeImagePath = (imagePath?: string): string => {
  if (!imagePath) {
    return '';
  }

  const trimmed = imagePath.trim();
  if (!trimmed) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('public/')) {
    return `/${trimmed.replace(/^public\//, '')}`;
  }

  if (trimmed.startsWith('assets/')) {
    return `/${trimmed}`;
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmitResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { guestId, guestName, guestImage, attendance, bus, intolerances, notes } = req.body as RSVPSubmission;

    if (!guestId || !guestName || !attendance || !bus) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    console.log(`📝 RSVP submitted for ${guestName}:`, { attendance, bus, intolerances, notes });

    // 1. Actualizar Google Sheets usando Apps Script Web App
    const APPS_SCRIPT_URL =
      process.env.GOOGLE_APPS_SCRIPT_URL ||
      process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL ||
      process.env.APPS_SCRIPT_URL;
    
    if (!APPS_SCRIPT_URL) {
      console.error('⚠️  Apps Script URL no configurada. Define GOOGLE_APPS_SCRIPT_URL (o NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL / APPS_SCRIPT_URL).');
    } else if (!APPS_SCRIPT_URL.includes('/exec')) {
      console.error('⚠️  Apps Script URL inválida (debe ser la URL Web App que termina en /exec):', APPS_SCRIPT_URL);
    } else {
      try {
        const updatePayload = {
          guestId,
          attendance,
          bus,
          intolerances,
          intolerancias: intolerances,
          notes,
        };

        const updateResponse = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload),
        });

        let result: { success?: boolean; error?: string; message?: string } | null = null;
        try {
          result = await updateResponse.json();
        } catch {
          result = null;
        }

        if (!updateResponse.ok || result?.success === false) {
          console.error('❌ Error actualizando Google Sheets:', {
            status: updateResponse.status,
            result,
            payload: updatePayload,
          });
        } else {
          console.log('✅ Google Sheets actualizado:', result || { success: true });
        }
      } catch (error) {
        console.error('❌ Error conectando con Google Apps Script:', error);
      }
    }

    // 2. Enviar email de notificación
    if (process.env.RESEND_API_KEY) {
      try {
        const attendanceText = getAttendanceEmailText(attendance);
        const busText = bus === 'sí' ? '✅ Sí' : '❌ No';

        await resend.emails.send({
          from: 'Boda Marta & Sergio <onboarding@resend.dev>',
          to: NOTIFICATION_EMAIL,
          subject: `Nueva confirmación RSVP: ${guestName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #006B8E;">Nueva Confirmación de Asistencia</h2>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Invitado:</strong> ${guestName}</p>
                <p><strong>Asistencia:</strong> ${attendanceText}</p>
                <p><strong>Bus:</strong> ${busText}</p>
                ${intolerances ? `<p><strong>Intolerancias:</strong> ${intolerances}</p>` : ''}
                ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
              </div>

              <p style="color: #666; font-size: 14px;">
                Recibido el ${new Date().toLocaleString('es-ES')}
              </p>
            </div>
          `,
        });
        console.log('✅ Email enviado a:', NOTIFICATION_EMAIL);
      } catch (emailError) {
        console.error('⚠️  Error enviando email:', emailError);
      }
    } else {
      console.log('⚠️  RESEND_API_KEY no configurado, email no enviado');
    }

    // 3. Seleccionar imagen de agradecimiento
    const mockImages = [
      '/assets/thank-you-1.png',
      '/assets/thank-you-2.png',
      '/assets/thank-you-3.png',
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
    const resolvedImage = normalizeImagePath(guestImage) || randomImage;

    return res.status(200).json({
      success: true,
      message: 'RSVP recorded successfully',
      image: resolvedImage,
    });
  } catch (error) {
    console.error('❌ Error submitting RSVP:', error);
    return res.status(500).json({
      success: false,
      message: 'Error recording RSVP',
      error: (error as Error).message,
    });
  }
}
