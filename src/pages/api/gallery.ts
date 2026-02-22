import type { NextApiRequest, NextApiResponse } from 'next';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import galleryData from '../../data/gallery.json';
import { getStoredGallery, saveStoredGallery } from '../../utils/blobDataStore';

interface GalleryItem {
  id: string;
  url: string;
  tags: string[];
}

let gallery = [...galleryData];

const loadEffectiveGallery = async (): Promise<GalleryItem[]> => {
  const fallbackSource = gallery.length > 0 ? gallery : [...galleryData];
  gallery = await getStoredGallery(fallbackSource);
  return gallery;
};

const deleteLocalGalleryFile = async (url: string): Promise<void> => {
  if (!url.startsWith('/uploads/gallery/')) {
    return;
  }

  const relativeFilePath = path.normalize(url.replace(/^\//, ''));
  const expectedPrefix = path.join('uploads', 'gallery');

  if (!relativeFilePath.startsWith(expectedPrefix)) {
    return;
  }

  const absolutePath = path.join(process.cwd(), 'public', relativeFilePath);

  try {
    await unlink(absolutePath);
  } catch (error) {
    console.warn('No se pudo eliminar el archivo local de galería:', error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GalleryItem[] | GalleryItem | { error: string }>
) {
  if (req.method === 'GET') {
    await loadEffectiveGallery();
    return res.status(200).json(gallery);
  }

  if (req.method === 'POST') {
    await loadEffectiveGallery();
    const newItem = {
      id: Date.now().toString(),
      ...req.body,
    };
    gallery.push(newItem);
    const saved = await saveStoredGallery(gallery);
    if (!saved) {
      console.warn('No se pudo persistir la galería. Se mantiene fallback en memoria.');
    }
    return res.status(201).json(newItem);
  }

  if (req.method === 'DELETE') {
    await loadEffectiveGallery();
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing id for delete' });
    }

    const itemToDelete = gallery.find(item => item.id === id);

    gallery = gallery.filter(item => item.id !== id);
    const saved = await saveStoredGallery(gallery);
    if (!saved) {
      console.warn('No se pudo persistir la galería. Se mantiene fallback en memoria.');
    }

    if (itemToDelete) {
      await deleteLocalGalleryFile(itemToDelete.url);
    }

    return res.status(200).json(gallery);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
