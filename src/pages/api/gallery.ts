import type { NextApiRequest, NextApiResponse } from 'next';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import galleryData from '../../data/gallery.json';
import { getStoredGallery, saveStoredGallery } from '../../utils/blobDataStore';

interface GalleryItem {
  id: string;
  url: string;
  tags: string[];
  blobPathname?: string;
}

let gallery = [...galleryData];
const BLOB_ACCESS = process.env.BLOB_OBJECT_ACCESS === 'public' ? 'public' : 'private';

const loadEffectiveGallery = async (): Promise<GalleryItem[]> => {
  const fallbackSource = gallery.length > 0 ? gallery : [...galleryData];
  gallery = await getStoredGallery(fallbackSource);
  return gallery;
};

const getBlobPathnameFromUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.replace(/^\//, '');
    if (!pathname.startsWith('gallery/')) {
      return null;
    }
    return pathname;
  } catch {
    return null;
  }
};

const resolveGalleryUrls = async (items: GalleryItem[]): Promise<GalleryItem[]> => {
  if (!process.env.BLOB_READ_WRITE_TOKEN || BLOB_ACCESS === 'public') {
    return items;
  }

  return items.map((item) => {
    const resolvedPathname = item.blobPathname || getBlobPathnameFromUrl(item.url);

    if (!resolvedPathname) {
      return item;
    }

    return {
      ...item,
      url: `/api/gallery/image?pathname=${encodeURIComponent(resolvedPathname)}`,
      blobPathname: resolvedPathname,
    };
  });
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
    const resolvedGallery = await resolveGalleryUrls(gallery);
    return res.status(200).json(resolvedGallery);
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
