import { useEffect, useMemo, useRef, useState } from 'react';
import GalleryUpload from './GalleryUpload';
import textsData from '../data/texts.json';
import { ADMIN_PREVIEW_ITEMS, PAGE_LABELS, shouldHideInfoDynamicSection } from '../utils/textSyncConfig';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'texts' | 'gallery' | 'guests'>('texts');
  const [selectedPage, setSelectedPage] = useState<'all' | 'principal' | 'info' | 'coruna' | 'rsvp'>('all');

  const [sections, setSections] = useState<Section[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingText, setSavingText] = useState(false);
  const [editingField, setEditingField] = useState<{ id: string; field: 'title' | 'content' } | null>(null);

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
      alert(message);
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
      alert('El valor no es válido para este campo.');
      cancelInlineEdit();
      return;
    }

    const currentValue = field === 'title' ? section.title : section.content;
    if (currentValue === normalized) {
      cancelInlineEdit();
      return;
    }

    setSavingText(true);
    await upsertSection({ ...section, [field]: normalized }, true);
    setSavingText(false);
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
        alert('No se pudo eliminar la sección');
        return;
      }

      setSections(current => current.filter(section => section.id !== sectionId));
      cancelInlineEdit();
    } catch {
      alert('Error al eliminar la sección');
    }
  };

  const handleTrashField = async (section: Section, field: 'title' | 'content') => {
    if (!FIXED_IDS.has(section.id)) {
      await deleteCustomSection(section.id);
      return;
    }

    const defaultValue = field === 'title'
      ? (DEFAULT_TITLE_BY_ID[section.id] || section.title)
      : (DEFAULT_CONTENT_BY_ID[section.id] || URL_DEFAULTS[section.id] || section.content);

    setSavingText(true);
    await upsertSection({ ...section, [field]: defaultValue }, true);
    setSavingText(false);
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
      alert('No se pudo crear la nueva sección');
      return;
    }

    const created = await response.json() as Section;
    setSections(current => [...current, created]);
    startInlineEdit(created.id, 'title');
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
          >
            ✏️
          </button>
          <button
            className="inline-icon-btn danger"
            onClick={() => handleTrashField(section, field)}
            title={field === 'title' ? 'Eliminar/restablecer título' : 'Eliminar/restablecer contenido'}
          >
            🗑️
          </button>
        </div>
      </div>
    );
  };

  const renderCustomSections = (pageId: string) => {
    const custom = (customSectionsByPage.get(pageId) || []).filter(section => {
      if (pageId !== 'info') {
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

  if (!isAuthenticated || loading) {
    return <div className="admin-loading">Cargando...</div>;
  }

  return (
    <div className="admin-panel">
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
                <div className="video-section admin-mirror-hero" />

                <section className="text-section admin-mirror-section">
                  {renderEditableField(getSection('main-quote', 'principal'), 'content', { as: 'h2', className: 'main-quote', allowEnter: true })}
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
                <img src="/assets/imagen02.png" alt="Info" className="info-hero-img" />

                <section className="info-section admin-mirror-section">
                  <h2>¿Cómo llegar?</h2>
                  <article className="subsection">
                    {renderEditableField(getSection('car-section', 'info'), 'title', { as: 'h3', allowEnter: false })}
                    {renderEditableField(getSection('car-section', 'info'), 'content')}
                  </article>
                  <article className="subsection">
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
                    <div className="map-link admin-inline-link-block">{renderEditableField(getSection('map-directions-url', 'info'), 'content', { as: 'span', allowEnter: false })}</div>
                  </article>
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('info', 'bus-return-text')}>+</button></div>

                <section className="info-section admin-mirror-section">
                  {renderEditableField(getSection('questions-section', 'info'), 'title', { as: 'h2', allowEnter: false })}
                  {renderEditableField(getSection('questions-section', 'info'), 'content')}
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('info', 'questions-section')}>+</button></div>

                <section className="info-section gift-section admin-mirror-section">
                  {renderEditableField(getSection('gift-section', 'info'), 'title', { as: 'h2', allowEnter: false })}
                  {renderEditableField(getSection('gift-section', 'info'), 'content')}
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('info', 'gift-section')}>+</button></div>

                <section className="info-section playlist-section admin-mirror-section">
                  <h2>Ve calentando motores</h2>
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
                <div className="coruna-hero"><img src="/assets/imagen03.png" alt="A Coruña" className="coruna-hero-img" /></div>

                <section className="coruna-section admin-mirror-section">
                  {renderEditableField(getSection('eat-section', 'coruna'), 'title', { as: 'h2', allowEnter: false })}
                  {renderEditableField(getSection('eat-section', 'coruna'), 'content')}
                </section>
                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('coruna', 'eat-section')}>+</button></div>
                <section className="coruna-section admin-mirror-section">
                  {renderEditableField(getSection('drink-section', 'coruna'), 'title', { as: 'h2', allowEnter: false })}
                  {renderEditableField(getSection('drink-section', 'coruna'), 'content')}
                </section>
                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('coruna', 'drink-section')}>+</button></div>
                <section className="coruna-section admin-mirror-section">
                  {renderEditableField(getSection('stay-section', 'coruna'), 'title', { as: 'h2', allowEnter: false })}
                  {renderEditableField(getSection('stay-section', 'coruna'), 'content')}
                </section>
                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('coruna', 'stay-section')}>+</button></div>
                <section className="coruna-section admin-mirror-section">
                  {renderEditableField(getSection('see-section', 'coruna'), 'title', { as: 'h2', allowEnter: false })}
                  {renderEditableField(getSection('see-section', 'coruna'), 'content')}
                </section>
                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('coruna', 'see-section')}>+</button></div>

                {renderCustomSections('coruna')}
              </section>
            )}

            {(selectedPage === 'all' || selectedPage === 'rsvp') && (
              <section className="admin-live-page admin-mirror-page rsvp-mirror">
                <h3 className="admin-live-page-title">{PAGE_LABELS.rsvp}</h3>

                <section className="rsvp-header admin-mirror-section">
                  {renderEditableField(getSection('rsvp-intro-title', 'rsvp'), 'content', { as: 'h2', allowEnter: false })}
                  {renderEditableField(getSection('rsvp-intro-text', 'rsvp'), 'content')}
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('rsvp', 'rsvp-intro-text')}>+</button></div>

                <section className="attendance-options admin-mirror-section">
                  {renderEditableField(getSection('rsvp-attendance-title', 'rsvp'), 'content', { as: 'h3', allowEnter: false })}

                  <div className="admin-bus-row">
                    {renderEditableField(getSection('rsvp-search-placeholder', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                    {renderEditableField(getSection('rsvp-no-results-text', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>

                  <div className="admin-bus-row">
                    {renderEditableField(getSection('rsvp-selected-guest-label', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                    {renderEditableField(getSection('rsvp-change-guest-button', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>

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
                    {renderEditableField(getSection('rsvp-success-text', 'rsvp'), 'content')}
                    {renderEditableField(getSection('rsvp-success-closing', 'rsvp'), 'content')}
                    {renderEditableField(getSection('rsvp-success-button', 'rsvp'), 'content', { as: 'span', allowEnter: false })}
                  </div>
                </section>

                <div className="inline-add-row"><button className="inline-add-btn" onClick={() => createSectionBetween('rsvp', 'rsvp-success-button')}>+</button></div>

                {renderCustomSections('rsvp')}
              </section>
            )}

            {savingText && <p className="inline-saving">Guardando cambios…</p>}
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
