import type { NextApiRequest, NextApiResponse } from 'next';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * API para enviar emails
 * En producción, usar un servicio como:
 * - Resend (recomendado para Vercel)
 * - SendGrid
 * - Mailgun
 * - AWS SES
 * - Nodemailer
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmailResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    const { to, subject, html } = req.body as EmailRequest;

    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    // IMPORTANTE: En producción, usar un servicio real de email
    // Ejemplo con Resend (npm install resend):
    /*
    import { Resend } from 'resend';
    
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const data = await resend.emails.send({
      from: 'Boda Marta & Sergio <onboarding@resend.dev>',
      to: to,
      subject: subject,
      html: html,
    });

    if (data.error) {
      throw new Error(data.error.message);
    }
    */

    // Por ahora, simulamos el envío
    console.log(`Email sent to ${to}:`, {
      subject,
      htmlLength: html.length,
    });

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending email',
      error: (error as Error).message,
    });
  }
}
