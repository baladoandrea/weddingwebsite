import type { NextApiRequest, NextApiResponse } from 'next';
import galleryData from '../../data/gallery.json';

interface GalleryItem {
  id: string;
  url: string;
  tags: string[];
}

let gallery = [...galleryData];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GalleryItem[] | GalleryItem | { error: string }>
) {
  if (req.method === 'GET') {
    return res.status(200).json(gallery);
  }

  if (req.method === 'POST') {
    const newItem = {
      id: Date.now().toString(),
      ...req.body,
    };
    gallery.push(newItem);
    return res.status(201).json(newItem);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    gallery = gallery.filter(item => item.id !== id);
    return res.status(200).json(gallery);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
