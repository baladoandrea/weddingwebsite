import { readFile } from 'node:fs/promises';
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { put } from '@vercel/blob';
import galleryData from '../../../data/gallery.json';
import { getStoredGallery, saveStoredGallery } from '../../../utils/blobDataStore';

interface UploadResponse {
  id: string;
  url: string;
  tags: string[];
}

type FormFields = Record<string, string | string[] | undefined>;

interface FormFile {
  filepath: string;
  mimetype?: string | null;
  originalFilename?: string | null;
}

type FormFiles = {
  file?: FormFile | FormFile[];
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = async (
  req: NextApiRequest
): Promise<{ fields: FormFields; files: FormFiles }> => {
  const form = formidable({
    multiples: false,
    maxFileSize: MAX_FILE_SIZE,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err: Error | null, fields: FormFields, files: FormFiles) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
};

const getSingleFile = (files: FormFiles): FormFile | null => {
  const fileInput = files.file;
  if (!fileInput) {
    return null;
  }

  if (Array.isArray(fileInput)) {
    return fileInput[0] ?? null;
  }

  return fileInput;
};

const parseTags = (fields: FormFields): string[] => {
  const rawTags = fields.tags;
  const value = Array.isArray(rawTags) ? rawTags[0] : rawTags;

  if (!value || typeof value !== 'string') {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .map(tag => String(tag).trim())
        .filter(tag => tag.length > 0);
    }
  } catch (error) {
    console.error('Error parsing tags:', error);
  }

  return [];
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
    const { fields, files } = await parseForm(req);
    const imageFile = getSingleFile(files);

    if (!imageFile) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    if (!imageFile.mimetype || !imageFile.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Solo se permiten imágenes' });
    }

    const safeFileName = sanitizeFileName(imageFile.originalFilename || 'photo.jpg');
    const fileBuffer = await readFile(imageFile.filepath);

    const uploadResult = await put(`gallery/${Date.now()}-${safeFileName}`, fileBuffer, {
      access: 'public',
      contentType: imageFile.mimetype,
    });

    const tags = parseTags(fields);

    const newItem: UploadResponse = {
      id: Date.now().toString(),
      url: uploadResult.url,
      tags,
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
