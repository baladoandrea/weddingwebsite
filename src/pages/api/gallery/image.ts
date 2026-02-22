import type { NextApiRequest, NextApiResponse } from 'next';
import { head } from '@vercel/blob';

const BLOB_ACCESS = process.env.BLOB_OBJECT_ACCESS === 'public' ? 'public' : 'private';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pathnameParam = req.query.pathname;
  const pathname = Array.isArray(pathnameParam) ? pathnameParam[0] : pathnameParam;

  if (!pathname || typeof pathname !== 'string') {
    return res.status(400).json({ error: 'Missing pathname' });
  }

  if (!pathname.startsWith('gallery/')) {
    return res.status(400).json({ error: 'Invalid pathname' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN no está configurado' });
  }

  try {
    const blob = await head(pathname);
    const targetUrl = blob.downloadUrl || blob.url;

    const headers: Record<string, string> = {};

    if (BLOB_ACCESS === 'private') {
      headers.Authorization = `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`;
    }

    const response = await fetch(targetUrl, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'No se pudo descargar la imagen' });
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, max-age=60');

    return res.status(200).send(Buffer.from(arrayBuffer));
  } catch (error) {
    console.error('Error serving gallery image:', error);
    return res.status(500).json({ error: 'Error al servir la imagen' });
  }
}
