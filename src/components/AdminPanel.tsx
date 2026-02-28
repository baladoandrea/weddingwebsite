import { useEffect, useMemo, useRef, useState } from 'react';
import GalleryUpload from './GalleryUpload';
import textsData from '../data/texts.json';
import { ADMIN_PREVIEW_ITEMS, PAGE_LABELS, shouldHideInfoDynamicSection, isCorunaCardSectionId } from '../utils/textSyncConfig';

interface Section {
  id: string;
  title: string;
  content: string;
  page: string;
  order?: number;
}

interface Guest {
  id: string;
  name: string;
  attendance?: string;
  notes?: string;
}

interface GalleryItem {
  id: string;
  url: string;
  tags: string[];
}

interface AdminToast {
  type: 'success' | 'error' | 'info';
  message: string;
  durationMs: number;
}

interface ImageSlot {
  id: string;
  label: string;
  page: Section['page'];
  fallbackUrl: string;
  alt: string;
}

const FIXED_IDS = new Set(ADMIN_PREVIEW_ITEMS.map(item => item.id));
const FIXED_ORDER_BY_ID = ADMIN_PREVIEW_ITEMS.reduce((acc, item, index) => {
  acc[item.id] = index * 10;
  return acc;
}, {} as Record<string, number>);

const DEFAULT_TITLE_BY_ID = textsData.reduce((acc, section) => {
  acc[section.id] = section.title;
  return acc;
}, {} as Record<string, string>);

const DEFAULT_CONTENT_BY_ID = textsData.reduce((acc, section) => {
  acc[section.id] = section.content;
  return acc;
}, {} as Record<string, string>);

const URL_DEFAULTS: Record<string, string> = {
  'map-embed-url': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2963.7456321!2d-8.3855!3d43.3704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2sCas%C3%B3n%20Amor%2C%20Calle%20Vistas%202%2C%20A%20Coru%C3%B1a!5e0!3m2!1ses!2ses!4v1629728200000',
  'map-directions-url': 'https://www.google.com/maps/place/Plaza+de+Pontevedra,+A+Coru%C3%B1a',
  'spotify-playlist-url': 'https://open.spotify.com/embed/playlist/37i9dQZEVXbJwoKy8qKpHG?utm_source=generator',
};

const IMAGE_SLOT_CONFIG: ImageSlot[] = [
  {
    id: 'main-photo-image-url',
    label: 'Principal - Foto de pareja',
    page: 'principal',
    fallbackUrl: '/assets/imagen01.png',
    alt: 'Marta y Sergio',
  },
  {
    id: 'info-hero-image-url',
    label: 'Información - Imagen superior',
    page: 'info',
    fallbackUrl: '/assets/imagen02.png',
    alt: 'Cómo llegar',
  },
  {
    id: 'info-map-image-url',
    label: 'Información - Imagen del mapa',
    page: 'info',
    fallbackUrl: '/assets/mapa.png',
    alt: 'Mapa ubicación',
  },
  {
    id: 'coruna-hero-image-url',
    label: 'Coruña - Imagen cabecera',
    page: 'coruna',
    fallbackUrl: '/assets/imagen03.png',
    alt: 'A Coruña',
  },
  {
    id: 'eat-section-image-url',
    label: 'Coruña - Imagen sección comer',
    page: 'coruna',
    fallbackUrl: '/assets/imagen05.png',
    alt: 'Dónde comer',
  },
  {
    id: 'drink-section-image-url',
    label: 'Coruña - Imagen sección beber',
    page: 'coruna',
    fallbackUrl: '/assets/imagen06.png',
    alt: 'Dónde beber',
  },
  {
    id: 'stay-section-image-url',
    label: 'Coruña - Imagen sección alojarse',
    page: 'coruna',
    fallbackUrl: '/assets/alojamiento.png',
    alt: 'Dónde alojarse',
  },
  {
    id: 'rsvp-bottom-image-url',
    label: 'RSVP - Imagen inferior',
    page: 'rsvp',
    fallbackUrl: '/assets/imagen04.png',
    alt: 'RSVP',
  },
];

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const normalizeAndParseUrl = (value: string): URL | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const collapsedSpaces = trimmed.replace(/\s+/g, '');
  return parseUrl(collapsedSpaces) || parseUrl(encodeURI(collapsedSpaces));
};

const normalizeGoogleMapsEmbedUrl = (value: string): string | null => {
  const parsed = normalizeAndParseUrl(value);
  if (!parsed) {
    return null;
  }

  if (
    parsed.protocol !== 'https:'
    || !parsed.hostname.includes('google.')
    || !parsed.pathname.toLowerCase().includes('/maps/embed')
  ) {
    return null;
  }

  return parsed.toString();
};

const normalizeGoogleMapsUrl = (value: string): string | null => {
  const parsed = normalizeAndParseUrl(value);
  if (!parsed) {
    return null;
  }

  if (
    parsed.protocol !== 'https:'
    || (!parsed.hostname.includes('google.') && parsed.hostname !== 'maps.app.goo.gl')
  ) {
    return null;
  }

  return parsed.toString();
};

const normalizeSpotifyEmbedUrl = (value: string): string | null => {
  const parsed = normalizeAndParseUrl(value);
  if (!parsed || parsed.protocol !== 'https:' || parsed.hostname !== 'open.spotify.com') {
    return null;
  }

  const cleanPath = parsed.pathname.replace(/\/+$/, '');
  if (cleanPath.startsWith('/embed/')) {
    return parsed.toString();
  }

  if (cleanPath.startsWith('/playlist/')) {
    parsed.pathname = cleanPath.replace('/playlist/', '/embed/playlist/');
    return parsed.toString();
  }

  return null;
};

export default function AdminPanel() {
  const menuRef = useRef<HTMLDivElement>(null);
  const saveStatusTimeoutRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'texts' | 'images' | 'gallery' | 'guests'>('texts');
  const [selectedPage, setSelectedPage] = useState<'all' | 'principal' | 'info' | 'coruna' | 'rsvp'>('all');

  const [sections, setSections] = useState<Section[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<{ id: string; field: 'title' | 'content' } | null>(null);
  const [savingField, setSavingField] = useState<{ id: string; field: 'title' | 'content' } | null>(null);
  const [justSavedField, setJustSavedField] = useState<{ id: string; field: 'title' | 'content' } | null>(null);
  const [toast, setToast] = useState<AdminToast | null>(null);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
  const [resettingImageId, setResettingImageId] = useState<string | null>(null);

  const toastIconByType: Record<AdminToast['type'], string> = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️',
  };

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin';
      return;
    }

    setIsAuthenticated(true);
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAdminMenuOpen(false);
      }
    };

    if (isAdminMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAdminMenuOpen]);

  useEffect(() => {
    if (!editingField) {
      return;
    }

    const target = document.querySelector(
      `[data-edit-key="${editingField.id}-${editingField.field}"]`
    ) as HTMLElement | null;

    if (!target) {
      return;
    }

    target.focus();
    const selection = window.getSelection();
    if (!selection) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(target);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, [editingField]);

  useEffect(() => {
    return () => {
      if (saveStatusTimeoutRef.current !== null) {
        window.clearTimeout(saveStatusTimeoutRef.current);
      }
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (type: AdminToast['type'], message: string, duration = 2600) => {
    setToast({ type, message, durationMs: duration });

    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimeoutRef.current = null;
    }, duration);
  };

  const showSavedStatus = (field: { id: string; field: 'title' | 'content' }) => {
    setJustSavedField(field);
    if (saveStatusTimeoutRef.current !== null) {
      window.clearTimeout(saveStatusTimeoutRef.current);
    }
    saveStatusTimeoutRef.current = window.setTimeout(() => {
      setJustSavedField(current => {
        if (current?.id === field.id && current.field === field.field) {
          return null;
        }
        return current;
      });
      saveStatusTimeoutRef.current = null;
    }, 1400);
  };

  const loadData = async () => {
    try {
      const [textsRes, galleryRes, guestsRes] = await Promise.all([
        fetch('/api/texts'),
        fetch('/api/gallery'),
        fetch('/api/guests'),
      ]);

      if (textsRes.ok) {
        setSections(await textsRes.json());
      }
      if (galleryRes.ok) {
        setGallery(await galleryRes.json());
      }
      if (guestsRes.ok) {
        setGuests(await guestsRes.json());
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sectionById = useMemo(
    () => new Map(sections.map(section => [section.id, section])),
    [sections]
  );

  const allDisplaySections = useMemo(() => {
    const fixedSections = ADMIN_PREVIEW_ITEMS.map(item => {
      const existing = sectionById.get(item.id);
      return existing || {
        id: item.id,
        title: DEFAULT_TITLE_BY_ID[item.id] || item.label,
        content: DEFAULT_CONTENT_BY_ID[item.id] || URL_DEFAULTS[item.id] || '',
        page: item.page,
        order: FIXED_ORDER_BY_ID[item.id],
      };
    });

    const customSections = sections.filter(section => !FIXED_IDS.has(section.id));
    return [...fixedSections, ...customSections];
  }, [sections, sectionById]);

  const groupedSections = useMemo(() => {
    const groups = new Map<string, Section[]>();
    const filtered = selectedPage === 'all'
      ? allDisplaySections
      : allDisplaySections.filter(section => section.page === selectedPage);

    for (const section of filtered) {
      if (!groups.has(section.page)) {
        groups.set(section.page, []);
      }
      groups.get(section.page)?.push(section);
    }

    for (const [pageId, pageSections] of groups.entries()) {
      pageSections.sort((left, right) => {
        const leftOrder = typeof left.order === 'number'
          ? left.order
          : (FIXED_ORDER_BY_ID[left.id] ?? 1000);
        const rightOrder = typeof right.order === 'number'
          ? right.order
          : (FIXED_ORDER_BY_ID[right.id] ?? 1000);
        return leftOrder - rightOrder;
      });
      groups.set(pageId, pageSections);
    }

    return groups;
  }, [allDisplaySections, selectedPage]);

  const customSectionsByPage = useMemo(() => {
    const grouped = new Map<string, Section[]>();
    const custom = sections
      .filter(section => !FIXED_IDS.has(section.id))
      .sort((left, right) => (left.order ?? 1000) - (right.order ?? 1000));

    for (const section of custom) {
      if (!grouped.has(section.page)) {
        grouped.set(section.page, []);
      }
      grouped.get(section.page)?.push(section);
    }

    return grouped;
  }, [sections]);

  const getSection = (id: string, page: string): Section => {
    const existing = sectionById.get(id);
    if (existing) {
      return existing;
    }

    return {
      id,
      page,
      title: DEFAULT_TITLE_BY_ID[id] || id,
      content: DEFAULT_CONTENT_BY_ID[id] || URL_DEFAULTS[id] || '',
      order: FIXED_ORDER_BY_ID[id],
    };
  };

  const upsertSection = async (payload: Partial<Section>, allowCreateFallback: boolean): Promise<Section | null> => {
    let response = await fetch('/api/texts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (allowCreateFallback && response.status === 404) {
      response = await fetch('/api/texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      let message = 'Error al guardar la sección';
      try {
        const data = await response.json();
        message = data.error || message;
      } catch {
        message = `${message} (HTTP ${response.status})`;
      }
      showToast('error', message);
      return null;
    }

    const updated = await response.json() as Section;
    setSections(current => {
      const exists = current.some(section => section.id === updated.id);
      if (!exists) {
        return [...current, updated];
      }
      return current.map(section => (section.id === updated.id ? updated : section));
    });

    return updated;
  };

  const normalizeFieldValue = (section: Section, field: 'title' | 'content', value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    if (field !== 'content') {
      return trimmed;
    }

    if (section.id === 'map-embed-url') {
      return normalizeGoogleMapsEmbedUrl(trimmed);
    }

    if (section.id === 'map-directions-url') {
      return normalizeGoogleMapsUrl(trimmed);
    }

    if (section.id === 'spotify-playlist-url') {
      return normalizeSpotifyEmbedUrl(trimmed);
    }

    return trimmed;
  };

  const startInlineEdit = (sectionId: string, field: 'title' | 'content') => {
    setEditingField({ id: sectionId, field });
  };

  const cancelInlineEdit = () => {
    setEditingField(null);
  };

  const saveInlineEdit = async (section: Section, field: 'title' | 'content', value: string) => {
    const normalized = normalizeFieldValue(section, field, value);
    if (!normalized) {
      showToast('info', 'El valor no es válido para este campo.');
      cancelInlineEdit();
      return;
    }

    const currentValue = field === 'title' ? section.title : section.content;
    if (currentValue === normalized) {
      cancelInlineEdit();
      return;
    }

    setSavingField({ id: section.id, field });
    await upsertSection({ ...section, [field]: normalized }, true);
    setSavingField(null);
    showSavedStatus({ id: section.id, field });
    cancelInlineEdit();
  };

  const deleteCustomSection = async (sectionId: string) => {
    if (!confirm('¿Eliminar esta sección?')) {
      return;
    }

    try {
      const response = await fetch(`/api/texts?id=${encodeURIComponent(sectionId)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        showToast('error', 'No se pudo eliminar la sección.');
        return;
      }

      setSections(current => current.filter(section => section.id !== sectionId));
      cancelInlineEdit();
      showToast('success', 'Sección eliminada correctamente.');
    } catch {
      showToast('error', 'Error al eliminar la sección.');
    }
  };

  const deleteCorunaCardPair = async (sectionId: string) => {
    const match = sectionId.match(/^(eat|drink|stay|see)-card-([^-]+)-(title|content)$/);
    if (!match) {
      await deleteCustomSection(sectionId);
      return;
    }

    const [, prefix, key] = match;
    const titleId = `${prefix}-card-${key}-title`;
    const contentId = `${prefix}-card-${key}-content`;

    if (!confirm('¿Eliminar esta tarjeta completa?')) {
      return;
    }

    try {
      const [titleResponse, contentResponse] = await Promise.all([
        fetch(`/api/texts?id=${encodeURIComponent(titleId)}`, { method: 'DELETE' }),
        fetch(`/api/texts?id=${encodeURIComponent(contentId)}`, { method: 'DELETE' }),
      ]);

      if (!titleResponse.ok || !contentResponse.ok) {
        showToast('error', 'No se pudo eliminar la tarjeta completa.');
        return;
      }

      setSections(current => current.filter(section => section.id !== titleId && section.id !== contentId));
      cancelInlineEdit();
      showToast('success', 'Tarjeta eliminada correctamente.');
    } catch {
      showToast('error', 'Error al eliminar la tarjeta.');
    }
  };

  const handleTrashField = async (section: Section, field: 'title' | 'content') => {
    if (!FIXED_IDS.has(section.id)) {
      if (isCorunaCardSectionId(section.id)) {
        await deleteCorunaCardPair(section.id);
        return;
      }

      await deleteCustomSection(section.id);
      return;
    }

    const defaultValue = field === 'title'
      ? (DEFAULT_TITLE_BY_ID[section.id] || section.title)
      : (DEFAULT_CONTENT_BY_ID[section.id] || URL_DEFAULTS[section.id] || section.content);

    setSavingField({ id: section.id, field });
    await upsertSection({ ...section, [field]: defaultValue }, true);
    setSavingField(null);
    showSavedStatus({ id: section.id, field });
    cancelInlineEdit();
  };

  const createSectionBetween = async (pageId: string, afterSectionId?: string) => {
    const pageSections = groupedSections.get(pageId) || [];
    const afterIndex = afterSectionId
      ? pageSections.findIndex(section => section.id === afterSectionId)
      : -1;

    const prev = afterIndex >= 0 ? pageSections[afterIndex] : undefined;
    const next = afterIndex >= 0 ? pageSections[afterIndex + 1] : pageSections[0];

    const prevOrder = prev?.order ?? FIXED_ORDER_BY_ID[prev?.id || ''] ?? 0;
    const nextOrder = next?.order ?? FIXED_ORDER_BY_ID[next?.id || ''] ?? (prevOrder + 20);

    let order = (prevOrder + nextOrder) / 2;
    if (!Number.isFinite(order) || prevOrder === nextOrder) {
      order = (pageSections.length + 1) * 10;
    }

    const response = await fetch('/api/texts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Nuevo título',
        content: 'Nuevo contenido',
        page: pageId,
        order,
      }),
    });

    if (!response.ok) {
      showToast('error', 'No se pudo crear la nueva sección.');
      return;
    }

    const created = await response.json() as Section;
    setSections(current => [...current, created]);
    startInlineEdit(created.id, 'title');
    showToast('success', 'Sección creada. Ya puedes editar su título.');
  };

  const handleGalleryUpload = async (file: File, tags: string[]) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', JSON.stringify(tags));

    try {
      const response = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newItem = await response.json();
        setGallery([...gallery, newItem]);
        alert('Foto subida correctamente');
      } else {
        alert('Error al subir la foto');
      }
    } catch {
      alert('Error al subir la foto');
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('¿Eliminar esta foto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setGallery(gallery.filter(item => item.id !== id));
      }
    } catch {
      alert('Error al eliminar la foto');
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm('¿Eliminar este invitado?')) {
      return;
    }

    try {
      const response = await fetch(`/api/guests?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setGuests(guests.filter(guest => guest.id !== id));
      }
    } catch {
      alert('Error al eliminar el invitado');
    }
  };

  const renderEditableField = (
    section: Section,
    field: 'title' | 'content',
    options?: { as?: 'span' | 'p' | 'h2' | 'h3'; className?: string; allowEnter?: boolean }
  ) => {
    const editKey = `${section.id}-${field}`;
    const isEditing = editingField?.id === section.id && editingField.field === field;
    const isSaving = savingField?.id === section.id && savingField.field === field;
    const isSaved = justSavedField?.id === section.id && justSavedField.field === field;
    const Element = options?.as || 'p';
    const className = options?.className || 'inline-editable-content';
    const allowEnter = options?.allowEnter ?? true;
    const value = field === 'title' ? section.title : section.content;

    return (
      <div className="inline-content-row">
        <Element
          className={`${className} ${isEditing ? 'is-editing' : ''}`}
          data-edit-key={editKey}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={event => saveInlineEdit(section, field, event.currentTarget.innerText)}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              event.preventDefault();
              cancelInlineEdit();
            }
            if (!allowEnter && event.key === 'Enter') {
              event.preventDefault();
              (event.currentTarget as HTMLElement).blur();
            }
          }}
        >
          {value}
        </Element>
        <div className="inline-actions">
          <button
            className="inline-icon-btn"
            onClick={() => startInlineEdit(section.id, field)}
            title={field === 'title' ? 'Editar título' : 'Editar contenido'}
            disabled={isSaving}
          >
            ✏️
          </button>
          <button
            className="inline-icon-btn danger"
            onClick={() => handleTrashField(section, field)}
            title={field === 'title' ? 'Eliminar/restablecer título' : 'Eliminar/restablecer contenido'}
            disabled={isSaving}
          >
            🗑️
          </button>
          {isSaving && <span className="inline-field-status saving">Guardando…</span>}
          {!isSaving && isSaved && <span className="inline-field-status saved">Guardado</span>}
        </div>
      </div>
    );
  };

  const handleSiteImageUpload = async (slot: ImageSlot, file: File) => {
    setUploadingImageId(slot.id);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slotId', slot.id);

      const uploadResponse = await fetch('/api/site-images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json().catch(() => ({ error: 'No se pudo subir la imagen.' }));
        showToast('error', uploadError.error || 'No se pudo subir la imagen.');
        return;
      }

      const uploaded = await uploadResponse.json() as { url: string };
      const saved = await upsertSection({
        id: slot.id,
        title: `Imagen - ${slot.label}`,
        content: uploaded.url,
        page: slot.page,
      }, true);

      if (!saved) {
        showToast('error', 'La imagen se subió pero no se pudo guardar su URL.');
        return;
      }

      showToast('success', 'Imagen actualizada correctamente.');
    } catch {
      showToast('error', 'Error al subir la imagen.');
    } finally {
      setUploadingImageId(null);
    }
  };

  const handleResetSiteImage = async (slot: ImageSlot) => {
    setResettingImageId(slot.id);

    try {
      const saved = await upsertSection({
        id: slot.id,
        title: `Imagen - ${slot.label}`,
        content: slot.fallbackUrl,
        page: slot.page,
      }, true);

      if (!saved) {
        showToast('error', 'No se pudo restablecer la imagen.');
        return;
      }

      showToast('success', 'Imagen restablecida al valor por defecto.');
    } catch {
      showToast('error', 'Error al restablecer la imagen.');
    } finally {
      setResettingImageId(null);
    }
  };

  const renderCustomSections = (pageId: string) => {
    const custom = (customSectionsByPage.get(pageId) || []).filter(section => {
      if (pageId !== 'info') {
        if (pageId === 'coruna') {
          return !isCorunaCardSectionId(section.id);
        }
        return true;
      }

      return !shouldHideInfoDynamicSection(section.title);
    });
    return custom.map(section => (
      <div key={section.id} className="inline-section-block">
        <section className="admin-mirror-section info-section">
          {renderEditableField(section, 'title', { as: 'h2', className: 'inline-editable-title', allowEnter: false })}
          {renderEditableField(section, 'content')}
        </section>
        <div className="inline-add-row">
          <button className="inline-add-btn" onClick={() => createSectionBetween(pageId, section.id)} title="Añadir sección aquí">+</button>
        </div>
      </div>
    ));
  };

  const createCorunaCard = async (prefix: 'eat' | 'drink' | 'stay' | 'see') => {
    const regex = new RegExp(`^${prefix}-card-([^-]+)-title$`);
    const usedNumbers = sections
      .map(section => section.id.match(regex)?.[1])
      .filter((value): value is string => Boolean(value))
      .map(value => Number(value))
      .filter(value => Number.isFinite(value));

    const nextNumber = usedNumbers.length > 0
      ? Math.max(...usedNumbers) + 1
      : 1;

    const key = `${nextNumber}`;

    const titleSection = await upsertSection({
      id: `${prefix}-card-${key}-title`,
      title: `${prefix.toUpperCase()} - Tarjeta ${key} título`,
      content: 'Nuevo título',
      page: 'coruna',
    }, true);

    const contentSection = await upsertSection({
      id: `${prefix}-card-${key}-content`,
      title: `${prefix.toUpperCase()} - Tarjeta ${key} texto`,
      content: 'Nuevo texto',
      page: 'coruna',
    }, true);

    if (titleSection && contentSection) {
      showToast('success', 'Tarjeta añadida. Ya puedes editarla.');
      startInlineEdit(titleSection.id, 'content');
    }
  };

  const getSortedCorunaCardKeys = (
    prefix: 'eat' | 'drink' | 'stay' | 'see',
    cards: Array<{ titleId: string; contentId: string }>
  ): string[] => {
    const regex = new RegExp(`^${prefix}-card-([^-]+)-title$`);
    const dynamicCardIds = sections
      .map(item => item.id.match(regex)?.[1])
      .filter((value): value is string => Boolean(value));

    return Array.from(new Set([
      ...cards.map(card => card.titleId.replace(`${prefix}-card-`, '').replace('-title', '')),
      ...dynamicCardIds,
    ])).sort((left, right) => {
      const leftNumber = Number(left);
      const rightNumber = Number(right);
      const leftIsNumber = Number.isFinite(leftNumber);
      const rightIsNumber = Number.isFinite(rightNumber);

      if (leftIsNumber && rightIsNumber) {
        return leftNumber - rightNumber;
      }

      if (leftIsNumber) {
        return -1;
      }

      if (rightIsNumber) {
        return 1;
      }

      return left.localeCompare(right);
    });
  };

  const moveCorunaCard = async (
    prefix: 'eat' | 'drink' | 'stay' | 'see',
    cards: Array<{ titleId: string; contentId: string }>,
    key: string,
    direction: 'up' | 'down'
  ) => {
    const allCardKeys = getSortedCorunaCardKeys(prefix, cards);
    const currentIndex = allCardKeys.indexOf(key);
    if (currentIndex === -1) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= allCardKeys.length) {
      return;
    }

    const targetKey = allCardKeys[targetIndex];
    const fromTitleId = `${prefix}-card-${key}-title`;
    const fromContentId = `${prefix}-card-${key}-content`;
    const toTitleId = `${prefix}-card-${targetKey}-title`;
    const toContentId = `${prefix}-card-${targetKey}-content`;

    const fromTitleSection = getSection(fromTitleId, 'coruna');
    const fromContentSection = getSection(fromContentId, 'coruna');
    const toTitleSection = getSection(toTitleId, 'coruna');
    const toContentSection = getSection(toContentId, 'coruna');

    const [savedFromTitle, savedFromContent, savedToTitle, savedToContent] = await Promise.all([
      upsertSection({ ...fromTitleSection, content: toTitleSection.content }, true),
      upsertSection({ ...fromContentSection, content: toContentSection.content }, true),
      upsertSection({ ...toTitleSection, content: fromTitleSection.content }, true),
      upsertSection({ ...toContentSection, content: fromContentSection.content }, true),
    ]);

    if (savedFromTitle && savedFromContent && savedToTitle && savedToContent) {
      showToast('success', 'Tarjeta reordenada.');
    }
  };

  const renderCorunaSeparatedCardsEditor = (
    sectionId: string,
    prefix: 'eat' | 'drink' | 'stay' | 'see',
    cards: Array<{
      titleId: string;
      contentId: string;
    }>
  ) => {
    const section = getSection(sectionId, 'coruna');
    const allCardKeys = getSortedCorunaCardKeys(prefix, cards);

    return (
      <section className="coruna-section admin-mirror-section">
        {renderEditableField(section, 'title', { as: 'h2', allowEnter: false })}
        <div className="content-cards admin-structured-preview">
          {allCardKeys.map((key, index) => {
            const titleId = `${prefix}-card-${key}-title`;
            const contentId = `${prefix}-card-${key}-content`;
            return (
              <article key={titleId} className="recommendation-card">
              <div className="card-order-actions">
                <button
                  className="inline-icon-btn"
                  title="Subir tarjeta"
                  onClick={() => void moveCorunaCard(prefix, cards, key, 'up')}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  className="inline-icon-btn"
                  title="Bajar tarjeta"
                  onClick={() => void moveCorunaCard(prefix, cards, key, 'down')}
                  disabled={index === allCardKeys.length - 1}
                >
                  ↓
                </button>
              </div>
              {renderEditableField(
                getSection(titleId, 'coruna'),
                'content',
                { as: 'h3', allowEnter: false }
              )}
              {renderEditableField(
                getSection(contentId, 'coruna'),
                'content'
              )}
              </article>
            );
          })}
        </div>
        <div className="inline-add-row">
          <button className="inline-add-btn" onClick={() => createCorunaCard(prefix)} title="Añadir tarjeta">
            +
          </button>
        </div>
      </section>
    );
  };

  const renderMultilinePreview = (content: string) => {
    const paragraphs = content
      .split(/\n+/)
      .map(text => text.trim())
      .filter(Boolean);

    if (paragraphs.length === 0) {
      return <p className="admin-preview-empty">Sin contenido</p>;
    }

    return paragraphs.map((paragraph, index) => (
      <p key={`${paragraph}-${index}`}>{paragraph}</p>
    ));
  };

  const renderGuidedLongTextField = (
    section: Section,
    hint = 'Consejo: usa saltos de línea para separar párrafos y mejorar la lectura.'
  ) => (
    <>
      {renderEditableField(section, 'content')}
      <p className="admin-inline-help">{hint}</p>
      <div className="admin-text-preview">
        {renderMultilinePreview(section.content)}
      </div>
    </>
  );

  if (!isAuthenticated || loading) {
    return <div className="admin-loading">Cargando...</div>;
  }

  return (
    <div className="admin-panel">
      {toast && (
        <div className={`admin-toast ${toast.type}`} role="status" aria-live="polite">
          <span className="admin-toast-icon" aria-hidden>{toastIconByType[toast.type]}</span>
          <span className="admin-toast-message">{toast.message}</span>
          <span className="admin-toast-progress" aria-hidden>
            <span
              className="admin-toast-progress-bar"
              style={{ animationDuration: `${toast.durationMs}ms` }}
            />
          </span>
        </div>
      )}

      <header className="admin-header">
        <h1>Panel Administrativo</h1>
        <div className="admin-header-actions" ref={menuRef}>
          <button
            className="menu-btn"
            onClick={() => setIsAdminMenuOpen(current => !current)}
            title="Menú admin"
            aria-label="Abrir menú de administración"
          >
            <span className={`ios-menu-icon ${isAdminMenuOpen ? 'open' : ''}`} aria-hidden>
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </span>
          </button>

          {isAdminMenuOpen && (
            <nav className="admin-sidebar" aria-label="Navegación de admin">
              <button className={`admin-sidebar-link ${activeTab === 'texts' ? 'active' : ''}`} onClick={() => { setActiveTab('texts'); setIsAdminMenuOpen(false); }}>
                Textos
              </button>
              <button className={`admin-sidebar-link ${activeTab === 'images' ? 'active' : ''}`} onClick={() => { setActiveTab('images'); setIsAdminMenuOpen(false); }}>
                Imágenes
              </button>
              <button className={`admin-sidebar-link ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => { setActiveTab('gallery'); setIsAdminMenuOpen(false); }}>
                Galería
              </button>
              <button className={`admin-sidebar-link ${activeTab === 'guests' ? 'active' : ''}`} onClick={() => { setActiveTab('guests'); setIsAdminMenuOpen(false); }}>
                Invitados
              </button>
              <button
                className="admin-sidebar-link admin-sidebar-danger"
                onClick={() => {
                  sessionStorage.removeItem('adminToken');
                  window.location.href = '/';
                }}
              >
                Cerrar sesión
              </button>
            </nav>
          )}
        </div>
      </header>

      <div className="admin-content">
        {activeTab === 'texts' && (
          <div className="admin-section admin-inline-editor">
            <p className="admin-editor-note">
              Edición en vivo: usa ✏️ para editar y 🗑️ para restablecer/eliminar. Los cambios se guardan automáticamente al salir del campo.
            </p>
            <div className="page-filter-tabs">
              <button className={`page-filter-btn ${selectedPage === 'all' ? 'active' : ''}`} onClick={() => setSelectedPage('all')}>
                Todas
              </button>
              <button className={`page-filter-btn ${selectedPage === 'principal' ? 'active' : ''}`} onClick={() => setSelectedPage('principal')}>
                Principal
              </button>
              <button className={`page-filter-btn ${selectedPage === 'info' ? 'active' : ''}`} onClick={() => setSelectedPage('info')}>
                Información
              </button>
              <button className={`page-filter-btn ${selectedPage === 'coruna' ? 'active' : ''}`} onClick={() => setSelectedPage('coruna')}>
                A Coruña
              </button>
              <button className={`page-filter-btn ${selectedPage === 'rsvp' ? 'active' : ''}`} onClick={() => setSelectedPage('rsvp')}>
                RSVP
              </button>
            </div>

            {(selectedPage === 'all' || selectedPage === 'principal') && (
              <section className="admin-live-page admin-mirror-page principal-mirror">
                <h3 className="admin-live-page-title">{PAGE_LABELS.principal}</h3>

                <section className="text-section admin-mirror-section">
                  {renderEditableField(getSection('site-header-title', 'principal'), 'content', { as: 'h2', className: 'header-title', allowEnter: false })}
                  {renderEditableField(getSection('site-footer-text', 'principal'), 'content', { as: 'p', className: 'footer-text', allowEnter: false })}
                </section>

                <div className="video-section admin-mirror-hero" />

                <section className="text-section admin-mirror-section">
                  {renderEditableField(getSection('main-quote', 'principal'), 'content', { as: 'h2', className: 'main-quote', allowEnter: true })}
                  {renderEditableField(getSection('main-event-date-text', 'principal'), 'content', { as: 'p', className: 'event-date', allowEnter: false })}
                  {renderEditableField(getSection('main-cta-button-text', 'principal'), 'content', { as: 'p', className: 'btn-primary', allowEnter: false })}
                </section>
                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('principal', 'main-quote')}>+</button></div>

                <section className="location-section admin-mirror-section">
                  {renderEditableField(getSection('location-title', 'principal'), 'content', { as: 'h3', className: 'location-title', allowEnter: false })}
                  <div className="location-info">
                    <div className="info-row">
                      {renderEditableField(getSection('location-city-label', 'principal'), 'content', { as: 'span', className: 'label', allowEnter: false })}
                      {renderEditableField(getSection('location-city-value', 'principal'), 'content', { as: 'span', className: 'value', allowEnter: false })}
                    </div>
                    <div className="info-row">
                      {renderEditableField(getSection('location-date-label', 'principal'), 'content', { as: 'span', className: 'label', allowEnter: false })}
                      {renderEditableField(getSection('location-date-value', 'principal'), 'content', { as: 'span', className: 'value', allowEnter: false })}
                    </div>
                    <div className="info-row">
                      {renderEditableField(getSection('location-time-label', 'principal'), 'content', { as: 'span', className: 'label', allowEnter: false })}
                      {renderEditableField(getSection('location-time-value', 'principal'), 'content', { as: 'span', className: 'value', allowEnter: false })}
                    </div>
                    <div className="info-row">
                      {renderEditableField(getSection('location-place-label', 'principal'), 'content', { as: 'span', className: 'label', allowEnter: false })}
                      {renderEditableField(getSection('location-place-value', 'principal'), 'content', { as: 'span', className: 'value', allowEnter: false })}
                    </div>
                    <div className="info-row">
                      {renderEditableField(getSection('location-address-label', 'principal'), 'content', { as: 'span', className: 'label', allowEnter: false })}
                      {renderEditableField(getSection('location-address-value', 'principal'), 'content', { as: 'span', className: 'value', allowEnter: false })}
                    </div>
                  </div>
                  <div className="map-container">
                    <iframe src={getSection('map-embed-url', 'principal').content} title="Mapa principal" width="100%" height="260" />
                  </div>
                  <div className="admin-inline-url-row">
                    {renderEditableField(getSection('map-embed-url', 'principal'), 'content', { as: 'p', className: 'inline-editable-url', allowEnter: false })}
                  </div>
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('principal', 'map-embed-url')}>+</button></div>

                {renderCustomSections('principal')}
              </section>
            )}

            {(selectedPage === 'all' || selectedPage === 'info') && (
              <section className="admin-live-page admin-mirror-page info-mirror">
                <h3 className="admin-live-page-title">{PAGE_LABELS.info}</h3>
                <img src={getSection('info-hero-image-url', 'info').content || '/assets/imagen02.png'} alt="Info" className="info-hero-img" />

                <section className="info-section admin-mirror-section">
                  {renderEditableField(getSection('info-howto-title', 'info'), 'content', { as: 'h2', allowEnter: false })}
                  <article className="subsection">
                    {renderEditableField(getSection('car-section', 'info'), 'title', { as: 'h3', allowEnter: false })}
                    {renderGuidedLongTextField(
                      getSection('car-section', 'info'),
                      'Consejo: describe la ruta en pasos cortos para que sea más clara.'
                    )}
                  </article>
                  <article className="subsection">
                    {renderEditableField(getSection('info-bus-title', 'info'), 'content', { as: 'h3', allowEnter: false })}
                    <div className="bus-info">
                      <div className="admin-bus-row">
                        {renderEditableField(getSection('bus-out-label', 'info'), 'content', { as: 'span', allowEnter: false })}
                        {renderEditableField(getSection('bus-out-text', 'info'), 'content', { as: 'span', allowEnter: true })}
                      </div>
                      <div className="admin-bus-row">
                        {renderEditableField(getSection('bus-return-label', 'info'), 'content', { as: 'span', allowEnter: false })}
                        {renderEditableField(getSection('bus-return-text', 'info'), 'content', { as: 'span', allowEnter: true })}
                      </div>
                    </div>
                    <div className="map-link admin-inline-link-block">{renderEditableField(getSection('info-map-link-text', 'info'), 'content', { as: 'span', allowEnter: false })}</div>
                    <p className="admin-inline-help">URL del botón “Ver en Google Maps”:</p>
                    <div className="admin-inline-link-block">{renderEditableField(getSection('map-directions-url', 'info'), 'content', { as: 'p', className: 'inline-editable-url', allowEnter: false })}</div>
                  </article>
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('info', 'bus-return-text')}>+</button></div>

                <section className="info-section admin-mirror-section">
                  {renderEditableField(getSection('questions-section', 'info'), 'title', { as: 'h2', allowEnter: false })}
                  {renderGuidedLongTextField(getSection('questions-section', 'info'))}
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('info', 'questions-section')}>+</button></div>

                <section className="info-section gift-section admin-mirror-section">
                  {renderEditableField(getSection('gift-section', 'info'), 'title', { as: 'h2', allowEnter: false })}
                  {renderGuidedLongTextField(
                    getSection('gift-section', 'info'),
                    'Consejo: puedes separar mensaje emocional y datos prácticos en líneas distintas.'
                  )}
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('info', 'gift-section')}>+</button></div>

                <section className="info-section playlist-section admin-mirror-section">
                  {renderEditableField(getSection('info-playlist-title', 'info'), 'content', { as: 'h2', allowEnter: false })}
                  <div className="spotify-embed">
                    <iframe src={getSection('spotify-playlist-url', 'info').content} width="100%" height="300" title="Spotify playlist" />
                  </div>
                  <div className="admin-inline-url-row">
                    {renderEditableField(getSection('spotify-playlist-url', 'info'), 'content', { as: 'p', className: 'inline-editable-url', allowEnter: false })}
                  </div>
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('info', 'spotify-playlist-url')}>+</button></div>

                {renderCustomSections('info')}
              </section>
            )}

            {(selectedPage === 'all' || selectedPage === 'coruna') && (
              <section className="admin-live-page admin-mirror-page coruna-mirror">
                <h3 className="admin-live-page-title">{PAGE_LABELS.coruna}</h3>
                <div className="coruna-hero"><img src={getSection('coruna-hero-image-url', 'coruna').content || '/assets/imagen03.png'} alt="A Coruña" className="coruna-hero-img" /></div>
                {renderEditableField(getSection('coruna-page-title', 'coruna'), 'content', { as: 'h2', className: 'coruna-title', allowEnter: false })}

                {renderCorunaSeparatedCardsEditor('eat-section', 'eat', [
                  {
                    titleId: 'eat-card-1-title',
                    contentId: 'eat-card-1-content',
                  },
                  {
                    titleId: 'eat-card-2-title',
                    contentId: 'eat-card-2-content',
                  },
                ])}
                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('coruna', 'eat-section')}>+</button></div>
                {renderCorunaSeparatedCardsEditor('drink-section', 'drink', [
                  {
                    titleId: 'drink-card-1-title',
                    contentId: 'drink-card-1-content',
                  },
                  {
                    titleId: 'drink-card-2-title',
                    contentId: 'drink-card-2-content',
                  },
                ])}
                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('coruna', 'drink-section')}>+</button></div>
                {renderCorunaSeparatedCardsEditor('stay-section', 'stay', [
                  {
                    titleId: 'stay-card-1-title',
                    contentId: 'stay-card-1-content',
                  },
                ])}
                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('coruna', 'stay-section')}>+</button></div>
                {renderCorunaSeparatedCardsEditor('see-section', 'see', [
                  {
                    titleId: 'see-card-1-title',
                    contentId: 'see-card-1-content',
                  },
                  {
                    titleId: 'see-card-2-title',
                    contentId: 'see-card-2-content',
                  },
                  {
                    titleId: 'see-card-3-title',
                    contentId: 'see-card-3-content',
                  },
                ])}
                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('coruna', 'see-section')}>+</button></div>

                {renderCustomSections('coruna')}
              </section>
            )}

            {(selectedPage === 'all' || selectedPage === 'rsvp') && (
              <section className="admin-live-page admin-mirror-page rsvp-mirror">
                <h3 className="admin-live-page-title">{PAGE_LABELS.rsvp}</h3>

                <section className="rsvp-header admin-mirror-section">
                  {renderEditableField(getSection('rsvp-intro-title', 'rsvp'), 'content', { as: 'h2', allowEnter: false })}
                  {renderGuidedLongTextField(
                    getSection('rsvp-intro-text', 'rsvp'),
                    'Consejo: usa un tono cercano y párrafos breves para facilitar lectura móvil.'
                  )}
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('rsvp', 'rsvp-intro-text')}>+</button></div>

                <section className="attendance-options admin-mirror-section">
                  {renderEditableField(getSection('rsvp-attendance-title', 'rsvp'), 'content', { as: 'h3', allowEnter: false })}

                  <div className="admin-bus-row">
                    {renderEditableField(getSection('rsvp-attendance-option-yes-label', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                    {renderEditableField(getSection('rsvp-attendance-option-yes-value', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>

                  <div className="admin-bus-row">
                    {renderEditableField(getSection('rsvp-attendance-option-kids-label', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                    {renderEditableField(getSection('rsvp-attendance-option-kids-value', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>

                  <div className="admin-bus-row">
                    {renderEditableField(getSection('rsvp-attendance-option-no-label', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                    {renderEditableField(getSection('rsvp-attendance-option-no-value', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>
                </section>

                <section className="attendance-options admin-mirror-section">
                  <h3>Textos del formulario</h3>

                  <div className="admin-bus-row">
                    {renderEditableField(getSection('rsvp-search-placeholder', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                    {renderEditableField(getSection('rsvp-no-results-text', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>

                  <div className="admin-bus-row">
                    {renderEditableField(getSection('rsvp-selected-guest-label', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                    {renderEditableField(getSection('rsvp-change-guest-button', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>

                  <div className="admin-bus-row">
                    {renderEditableField(getSection('rsvp-notes-label', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                    {renderEditableField(getSection('rsvp-notes-placeholder', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>

                  <div className="admin-bus-row">
                    {renderEditableField(getSection('rsvp-submit-button', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                    {renderEditableField(getSection('rsvp-submitting-button', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>

                  <div className="admin-bus-row">
                    {renderEditableField(getSection('rsvp-validation-alert', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                    {renderEditableField(getSection('rsvp-submit-error-alert', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('rsvp', 'rsvp-attendance-option-no-value')}>+</button></div>

                <section className="rsvp-success admin-mirror-section">
                  <div className="success-modal">
                    {renderEditableField(getSection('rsvp-success-title', 'rsvp'), 'content', { as: 'h2', allowEnter: false })}
                    {renderGuidedLongTextField(getSection('rsvp-success-text', 'rsvp'))}
                    {renderGuidedLongTextField(getSection('rsvp-success-closing', 'rsvp'))}
                    {renderEditableField(getSection('rsvp-success-button', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('rsvp', 'rsvp-success-button')}>+</button></div>

                {renderCustomSections('rsvp')}
              </section>
            )}

          </div>
        )}

        {activeTab === 'images' && (
          <div className="admin-section">
            <h2>Modificar imágenes</h2>
            <p className="admin-editor-note">
              Sube una nueva imagen en cada bloque para reemplazar la que se muestra actualmente en la web.
            </p>

            <div className="admin-image-grid">
              {IMAGE_SLOT_CONFIG.map(slot => {
                const currentUrl = getSection(slot.id, slot.page).content || slot.fallbackUrl;
                const isUploading = uploadingImageId === slot.id;
                const isResetting = resettingImageId === slot.id;
                return (
                  <article key={slot.id} className="admin-image-card">
                    <h3>{slot.label}</h3>
                    <img src={currentUrl} alt={slot.alt} className="admin-image-preview" />
                    <label className="upload-btn admin-image-upload-btn">
                      {isUploading ? 'Subiendo...' : 'Subir nueva imagen'}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading || isResetting}
                        onChange={event => {
                          const file = event.target.files?.[0];
                          if (file) {
                            void handleSiteImageUpload(slot, file);
                          }
                          event.currentTarget.value = '';
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="admin-image-reset-btn"
                      disabled={isUploading || isResetting}
                      onClick={() => void handleResetSiteImage(slot)}
                    >
                      {isResetting ? 'Restableciendo...' : 'Restablecer por defecto'}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="admin-section">
            <h2>Gestionar Galería</h2>
            <GalleryUpload onUpload={handleGalleryUpload} />
            <div className="gallery-grid">
              {gallery.map(item => (
                <div key={item.id} className="gallery-item-admin">
                  <img src={item.url} alt="foto" />
                  <div className="item-tags">
                    {item.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <button className="delete-btn" onClick={() => handleDeleteGalleryItem(item.id)}>
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'guests' && (
          <div className="admin-section">
            <h2>Gestionar Invitados</h2>
            <div className="guests-table">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Asistencia</th>
                    <th>Notas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map(guest => (
                    <tr key={guest.id}>
                      <td>{guest.name}</td>
                      <td>{guest.attendance || 'Pendiente'}</td>
                      <td>{guest.notes || '-'}</td>
                      <td>
                        <button className="delete-btn" onClick={() => handleDeleteGuest(guest.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
