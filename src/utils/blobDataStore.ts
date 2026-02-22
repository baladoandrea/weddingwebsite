import { list, put } from '@vercel/blob';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface Section {
  id: string;
  title: string;
  content: string;
  page: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  tags: string[];
}

const TEXTS_PREFIX = 'data/texts/';
const GALLERY_PREFIX = 'data/gallery/metadata/';
const LOCAL_GALLERY_PATH = path.join(process.cwd(), 'src', 'data', 'gallery.json');

const hasBlobToken = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

async function readLatestJson<T>(prefix: string, fallback: T): Promise<T> {
  if (!hasBlobToken()) {
    return fallback;
  }

  try {
    const { blobs } = await list({ prefix });

    if (blobs.length === 0) {
      return fallback;
    }

    const latestBlob = [...blobs].sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0];

    const response = await fetch(latestBlob.url, { cache: 'no-store' });
    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`Error reading data from Blob (${prefix}):`, error);
    return fallback;
  }
}

async function saveJson<T>(prefix: string, data: T): Promise<boolean> {
  if (!hasBlobToken()) {
    return false;
  }

  try {
    await put(`${prefix}${Date.now()}.json`, JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
    });
    return true;
  } catch (error) {
    console.error(`Error saving data to Blob (${prefix}):`, error);
    return false;
  }
}

async function readLocalGallery(fallback: GalleryItem[]): Promise<GalleryItem[]> {
  try {
    const raw = await readFile(LOCAL_GALLERY_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as GalleryItem[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return fallback;
  } catch (error) {
    console.error('Error reading local gallery data:', error);
    return fallback;
  }
}

async function saveLocalGallery(gallery: GalleryItem[]): Promise<boolean> {
  try {
    await mkdir(path.dirname(LOCAL_GALLERY_PATH), { recursive: true });
    await writeFile(LOCAL_GALLERY_PATH, `${JSON.stringify(gallery, null, 2)}\n`, 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving local gallery data:', error);
    return false;
  }
}

export async function getStoredTexts(fallback: Section[]): Promise<Section[]> {
  return readLatestJson(TEXTS_PREFIX, fallback);
}

export async function saveStoredTexts(texts: Section[]): Promise<boolean> {
  return saveJson(TEXTS_PREFIX, texts);
}

export async function getStoredGallery(fallback: GalleryItem[]): Promise<GalleryItem[]> {
  if (hasBlobToken()) {
    return readLatestJson(GALLERY_PREFIX, fallback);
  }

  return readLocalGallery(fallback);
}

export async function saveStoredGallery(gallery: GalleryItem[]): Promise<boolean> {
  if (hasBlobToken()) {
    return saveJson(GALLERY_PREFIX, gallery);
  }

  return saveLocalGallery(gallery);
}
