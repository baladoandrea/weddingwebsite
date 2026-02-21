import type { NextApiRequest, NextApiResponse } from 'next';
import { put } from '@vercel/blob';
import galleryData from '../../../data/gallery.json';
import { getStoredGallery, saveStoredGallery } from '../../../utils/blobDataStore';

interface UploadResponse {
  id: string;
  url: string;
  tags: string[];
}

interface UploadRequestBody {
  fileName?: string;
  mimeType?: string;
  base64Data?: string;
  tags?: string[];
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '12mb',
    },
  },
};

const sanitizeFileName = (name: string): string =>
  name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN no está configurado' });
  }

  try {
    const { fileName, mimeType, base64Data, tags } = (req.body || {}) as UploadRequestBody;

    if (!fileName || !mimeType || !base64Data) {
      return res.status(400).json({ error: 'Faltan datos de la imagen' });
    }

    if (!mimeType.startsWith('image/')) {
      return res.status(400).json({ error: 'Solo se permiten imágenes' });
    }

    const safeFileName = sanitizeFileName(fileName || 'photo.jpg');
    const fileBuffer = Buffer.from(base64Data, 'base64');

    if (fileBuffer.length === 0) {
      return res.status(400).json({ error: 'Archivo inválido' });
    }

    if (fileBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'La imagen supera el límite de 10MB' });
    }

    const uploadResult = await put(`gallery/${Date.now()}-${safeFileName}`, fileBuffer, {
      access: 'public',
      contentType: mimeType,
    });

    const newItem: UploadResponse = {
      id: Date.now().toString(),
      url: uploadResult.url,
      tags: Array.isArray(tags)
        ? tags.map(tag => String(tag).trim()).filter(tag => tag.length > 0)
        : [],
    };

    const currentGallery = await getStoredGallery([...galleryData]);
    const updatedGallery = [...currentGallery, newItem];
    await saveStoredGallery(updatedGallery);

    return res.status(201).json(newItem);
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    return res.status(500).json({ error: 'Error al subir la foto' });
  }
}
