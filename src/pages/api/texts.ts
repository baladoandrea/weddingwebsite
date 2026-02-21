import type { NextApiRequest, NextApiResponse } from 'next';
import textsData from '../../data/texts.json';
import { getStoredTexts, saveStoredTexts } from '../../utils/blobDataStore';

interface Section {
  id: string;
  title: string;
  content: string;
  page: string;
}

interface ErrorResponse {
  error: string;
}

const defaultTexts: Section[] = [...textsData];
let texts = [...defaultTexts];

const mergeTextsWithDefaults = (storedTexts: Section[]): Section[] => {
  const defaultIds = new Set(defaultTexts.map(section => section.id));
  const mergedMap = new Map(defaultTexts.map(section => [section.id, section]));

  for (const section of storedTexts) {
    mergedMap.set(section.id, section);
  }

  const merged = defaultTexts.map(section => mergedMap.get(section.id) || section);
  const customSections = storedTexts.filter(section => !defaultIds.has(section.id));

  return [...merged, ...customSections];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Section[] | Section | ErrorResponse>
) {
  if (req.method === 'GET') {
    const storedTexts = await getStoredTexts(defaultTexts);
    texts = mergeTextsWithDefaults(storedTexts);
    return res.status(200).json(texts);
  }

  if (req.method === 'POST') {
    const storedTexts = await getStoredTexts(defaultTexts);
    texts = mergeTextsWithDefaults(storedTexts);

    const newSection = {
      id: Date.now().toString(),
      ...req.body,
    };

    texts.push(newSection);
    const saved = await saveStoredTexts(texts);
    if (!saved) {
      return res.status(500).json({ error: 'No se pudieron guardar los textos. Revisa BLOB_READ_WRITE_TOKEN.' });
    }

    return res.status(201).json(newSection);
  }

  if (req.method === 'PUT') {
    const storedTexts = await getStoredTexts(defaultTexts);
    texts = mergeTextsWithDefaults(storedTexts);

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
    const saved = await saveStoredTexts(texts);
    if (!saved) {
      return res.status(500).json({ error: 'No se pudieron guardar los textos. Revisa BLOB_READ_WRITE_TOKEN.' });
    }

    return res.status(200).json(texts[sectionIndex]);
  }

  if (req.method === 'DELETE') {
    const storedTexts = await getStoredTexts(defaultTexts);
    texts = mergeTextsWithDefaults(storedTexts);

    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing id for delete' });
    }

    texts = texts.filter(s => s.id !== id);
    const saved = await saveStoredTexts(texts);
    if (!saved) {
      return res.status(500).json({ error: 'No se pudieron guardar los textos. Revisa BLOB_READ_WRITE_TOKEN.' });
    }

    return res.status(200).json(texts);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
