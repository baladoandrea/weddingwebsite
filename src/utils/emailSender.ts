interface EmailData {
  guestName: string;
  attendance: string;
  notes: string;
}

export const sendRSVPEmail = async (data: EmailData): Promise<boolean> => {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'dummy@email.com',
        subject: `Confirmación de asistencia - ${data.guestName}`,
        html: `
          <h2>Nueva confirmación de asistencia</h2>
          <p><strong>Nombre:</strong> ${data.guestName}</p>
          <p><strong>Asistencia:</strong> ${data.attendance}</p>
          <p><strong>Nota:</strong> ${data.notes || 'Sin notas'}</p>
        `,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const formatEmailTemplate = (
  guestName: string,
  attendance: string,
  notes: string
): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; color: #333; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
          h2 { color: #006B8E; border-bottom: 2px solid #006B8E; padding-bottom: 10px; }
          .detail { margin: 10px 0; }
          .label { font-weight: bold; color: #006B8E; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Nueva Confirmación de Asistencia</h2>
          <div class="detail">
            <span class="label">Nombre:</span> ${guestName}
          </div>
          <div class="detail">
            <span class="label">Asistencia:</span> ${attendance}
          </div>
          <div class="detail">
            <span class="label">Nota:</span> ${notes || 'Sin notas'}
          </div>
          <hr />
          <p style="font-size: 12px; color: #999;">
            Este mensaje fue enviado automáticamente desde la web de la boda de Marta & Sergio
          </p>
        </div>
      </body>
    </html>
  `;
};
