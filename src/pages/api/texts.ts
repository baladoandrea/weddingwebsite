import type { NextApiRequest, NextApiResponse } from 'next';
import textsData from '../../data/texts.json';

interface Section {
  id: string;
  title: string;
  content: string;
  page: string;
}

let texts = [...textsData];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Section[] | Section | { error: string }>
) {
  if (req.method === 'GET') {
    return res.status(200).json(texts);
  }

  if (req.method === 'POST') {
    const newSection = {
      id: Date.now().toString(),
      ...req.body,
    };
    texts.push(newSection);
    return res.status(201).json(newSection);
  }

  if (req.method === 'PUT') {
    // Allow id to be sent either as query param or in the request body
    const id = (req.query.id as string) || (req.body && req.body.id);
    if (!id) {
      return res.status(400).json({ error: 'Missing id for update' });
    }

    const sectionIndex = texts.findIndex(s => s.id === id);

    if (sectionIndex === -1) {
      return res.status(404).json({ error: 'Section not found' });
    }

    texts[sectionIndex] = { ...texts[sectionIndex], ...req.body };
    return res.status(200).json(texts[sectionIndex]);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    texts = texts.filter(s => s.id !== id);
    return res.status(200).json(texts);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
