import type { NextApiRequest, NextApiResponse } from 'next';

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

export default function handler(
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

    // Aquí iría:
    // 1. Actualizar Google Sheets con la respuesta
    // 2. Enviar email de confirmación
    // 3. Guardar en base de datos

    // Simulamos una respuesta exitosa
    const mockImages = [
      '/assets/thank-you-1.png',
      '/assets/thank-you-2.png',
      '/assets/thank-you-3.png',
    ];
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];

    // Aquí iría el envío de email
    console.log(`RSVP submitted for ${guestName}:`, {
      attendance,
      notes,
    });

    return res.status(200).json({
      success: true,
      message: 'RSVP recorded successfully',
      image: randomImage,
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return res.status(500).json({
      success: false,
      message: 'Error recording RSVP',
      error: (error as Error).message,
    });
  }
}
