import type { NextApiRequest, NextApiResponse } from 'next';

interface UploadResponse {
  id: string;
  url: string;
  tags: string[];
}

/**
 * API para subir fotos a la galería
 * En producción, guardar en un servicio como:
 * - Vercel Blob Storage
 * - AWS S3
 * - Cloudinary
 * - Firebase Storage
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simulamos la subida de foto
  // En producción, aquí validar el archivo y guardarlo
  const { file, tags } = req.body;

  if (!file || !tags) {
    return res.status(400).json({ error: 'Missing file or tags' });
  }

  // Simulamos una respuesta de éxito
  const newItem: UploadResponse = {
    id: Date.now().toString(),
    url: `/assets/gallery/${Date.now()}.jpg`,
    tags: JSON.parse(typeof tags === 'string' ? tags : JSON.stringify(tags)),
  };

  return res.status(201).json(newItem);
}
