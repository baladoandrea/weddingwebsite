import { readFile } from 'node:fs/promises';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { put } from '@vercel/blob';

interface UploadImageResponse {
  url: string;
  blobPathname?: string;
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
const BLOB_ACCESS = process.env.BLOB_OBJECT_ACCESS === 'public' ? 'public' : 'private';

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

const sanitizeFileName = (name: string): string =>
  name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();

const getBlobImageUrl = (pathname: string): string => {
  if (BLOB_ACCESS === 'public') {
    return pathname;
  }

  return `/api/gallery/image?pathname=${encodeURIComponent(pathname)}`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadImageResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    const slotIdRaw = fields.slotId;
    const slotId = (Array.isArray(slotIdRaw) ? slotIdRaw[0] : slotIdRaw) || 'site-image';
    const safeSlot = String(slotId).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();

    const safeFileName = sanitizeFileName(imageFile.originalFilename || 'image.jpg');
    const fileBuffer = await readFile(imageFile.filepath);
    const timestamp = Date.now();
    const objectName = `site-images/${safeSlot}/${timestamp}-${safeFileName}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const uploadResult = await put(objectName, fileBuffer, {
        access: BLOB_ACCESS,
        contentType: imageFile.mimetype,
      });

      const publicUrl = BLOB_ACCESS === 'public'
        ? (uploadResult.url || uploadResult.downloadUrl)
        : getBlobImageUrl(uploadResult.pathname);

      return res.status(201).json({
        url: publicUrl,
        blobPathname: uploadResult.pathname,
      });
    }

    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      return res.status(500).json({
        error: 'Subida no configurada en producción: define BLOB_READ_WRITE_TOKEN en variables de entorno.',
      });
    }

    const localRelativePath = path.join('uploads', 'site-images', safeSlot, `${timestamp}-${safeFileName}`);
    const localAbsolutePath = path.join(process.cwd(), 'public', localRelativePath);

    await mkdir(path.dirname(localAbsolutePath), { recursive: true });
    await writeFile(localAbsolutePath, fileBuffer);

    return res.status(201).json({
      url: `/${localRelativePath.replace(/\\/g, '/')}`,
    });
  } catch (error) {
    console.error('Error uploading site image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al subir imagen';
    return res.status(500).json({ error: `Error al subir la imagen: ${errorMessage}` });
  }
}
