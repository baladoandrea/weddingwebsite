import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

interface RSVPSubmission {
  guestId: string;
  guestName: string;
  attendance: string;
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
    const { guestId, guestName, attendance, notes } = req.body as RSVPSubmission;

    if (!guestId || !guestName || !attendance) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    console.log(`📝 RSVP submitted for ${guestName}:`, { attendance, notes });

    // 1. Actualizar Google Sheets usando Apps Script Web App
    const APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL;
    
    if (APPS_SCRIPT_URL) {
      try {
        const updateResponse = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guestId,
            attendance,
            notes,
          }),
        });

        if (updateResponse.ok) {
          const result = await updateResponse.json();
          console.log('✅ Google Sheets actualizado:', result);
        } else {
          console.error('⚠️  Error actualizando Google Sheets:', updateResponse.status);
        }
      } catch (error) {
        console.error('⚠️  Error conectando con Google Apps Script:', error);
      }
    } else {
      console.log('⚠️  GOOGLE_APPS_SCRIPT_URL no configurado. Sheet no actualizado.');
    }

    // 2. Enviar email de notificación
    if (process.env.RESEND_API_KEY) {
      try {
        const attendanceText = attendance === 'yes' ? '✅ Confirmó asistencia' :
                              attendance === 'no' ? '❌ No podrá asistir' :
                              '❓ Pendiente';

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

    return res.status(200).json({
      success: true,
      message: 'RSVP recorded successfully',
      image: randomImage,
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
