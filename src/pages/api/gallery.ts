import type { NextApiRequest, NextApiResponse } from 'next';
import galleryData from '../../data/gallery.json';
import { getStoredGallery, saveStoredGallery } from '../../utils/blobDataStore';

interface GalleryItem {
  id: string;
  url: string;
  tags: string[];
}

let gallery = [...galleryData];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GalleryItem[] | GalleryItem | { error: string }>
) {
  if (req.method === 'GET') {
    gallery = await getStoredGallery(gallery);
    return res.status(200).json(gallery);
  }

  if (req.method === 'POST') {
    gallery = await getStoredGallery(gallery);
    const newItem = {
      id: Date.now().toString(),
      ...req.body,
    };
    gallery.push(newItem);
    await saveStoredGallery(gallery);
    return res.status(201).json(newItem);
  }

  if (req.method === 'DELETE') {
    gallery = await getStoredGallery(gallery);
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing id for delete' });
    }

    gallery = gallery.filter(item => item.id !== id);
    await saveStoredGallery(gallery);
    return res.status(200).json(gallery);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
