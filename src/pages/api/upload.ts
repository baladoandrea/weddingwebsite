import type { NextApiRequest, NextApiResponse } from 'next';

interface UploadResponse {
  success: boolean;
  url?: string;
  message: string;
  error?: string;
}

/**
 * API para subir archivos/imágenes
 * En producción, usar un servicio de almacenamiento como:
 * - Vercel Blob (recomendado para Vercel)
 * - AWS S3
 * - Cloudinary
 * - Firebase Storage
 * - Google Cloud Storage
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    // El archivo está en req.file o req.body.file dependiendo del middleware
    // Para un ejemplo completo, aquí está el flujo:

    /*
    import formidable from 'formidable';
    import fs from 'fs';
    import path from 'path';

    export const config = {
      api: {
        bodyParser: false,
      },
    };

    export default async function handler(
      req: NextApiRequest,
      res: NextApiResponse
    ) {
      if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
      }

      try {
        const form = new formidable.IncomingForm();
        const [fields, files] = await form.parse(req);
        
        const file = files.file?.[0];
        if (!file) {
          return res.status(400).json({ success: false, message: 'No file provided' });
        }

        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.mimetype || '')) {
          return res.status(400).json({ success: false, message: 'Invalid file type' });
        }

        // Validar tamaño (máx 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          return res.status(400).json({ success: false, message: 'File too large' });
        }

        // Guardar el archivo
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${file.originalFilename}`;
        const filePath = path.join(uploadDir, fileName);
        
        fs.copyFileSync(file.filepath, filePath);
        fs.unlinkSync(file.filepath);

        return res.status(200).json({
          success: true,
          url: `/uploads/${fileName}`,
          message: 'File uploaded successfully',
        });
      } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({
          success: false,
          message: 'Error uploading file',
          error: (error as Error).message,
        });
      }
    }
    */

    // Por ahora, simulamos la subida
    const fileName = `${Date.now()}.jpg`;

    return res.status(200).json({
      success: true,
      url: `/assets/gallery/${fileName}`,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: (error as Error).message,
    });
  }
}
