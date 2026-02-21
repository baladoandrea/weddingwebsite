import { list, put } from '@vercel/blob';

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

export async function getStoredTexts(fallback: Section[]): Promise<Section[]> {
  return readLatestJson(TEXTS_PREFIX, fallback);
}

export async function saveStoredTexts(texts: Section[]): Promise<boolean> {
  return saveJson(TEXTS_PREFIX, texts);
}

export async function getStoredGallery(fallback: GalleryItem[]): Promise<GalleryItem[]> {
  return readLatestJson(GALLERY_PREFIX, fallback);
}

export async function saveStoredGallery(gallery: GalleryItem[]): Promise<boolean> {
  return saveJson(GALLERY_PREFIX, gallery);
}
