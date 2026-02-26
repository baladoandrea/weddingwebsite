import { useEffect, useMemo, useRef, useState } from 'react';
import GalleryUpload from './GalleryUpload';
import textsData from '../data/texts.json';

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

interface PreviewItem {
  id: string;
  label: string;
  page: string;
  kind?: 'text' | 'url';
}

const PREVIEW_ITEMS: PreviewItem[] = [
  { id: 'main-quote', label: 'Frase principal', page: 'principal' },
  { id: 'location-title', label: 'Título de ubicación', page: 'principal' },
  { id: 'location-city-label', label: 'Etiqueta ciudad', page: 'principal' },
  { id: 'location-city-value', label: 'Valor ciudad', page: 'principal' },
  { id: 'location-date-label', label: 'Etiqueta fecha', page: 'principal' },
  { id: 'location-date-value', label: 'Valor fecha', page: 'principal' },
  { id: 'location-time-label', label: 'Etiqueta hora', page: 'principal' },
  { id: 'location-time-value', label: 'Valor hora', page: 'principal' },
  { id: 'location-place-label', label: 'Etiqueta lugar', page: 'principal' },
  { id: 'location-place-value', label: 'Valor lugar', page: 'principal' },
  { id: 'location-address-label', label: 'Etiqueta dirección', page: 'principal' },
  { id: 'location-address-value', label: 'Valor dirección', page: 'principal' },
  { id: 'map-embed-url', label: 'URL embebida de Google Maps', page: 'principal', kind: 'url' },
  { id: 'map-directions-url', label: 'URL de Google Maps (botón)', page: 'info', kind: 'url' },
  { id: 'car-section', label: 'Cómo llegar en coche', page: 'info' },
  { id: 'bus-out-label', label: 'Etiqueta salida bus', page: 'info' },
  { id: 'bus-out-text', label: 'Texto salida bus', page: 'info' },
  { id: 'bus-return-label', label: 'Etiqueta vuelta bus', page: 'info' },
  { id: 'bus-return-text', label: 'Texto vuelta bus', page: 'info' },
  { id: 'questions-section', label: 'Sección dudas', page: 'info' },
  { id: 'gift-section', label: 'Sección regalo', page: 'info' },
  { id: 'spotify-playlist-url', label: 'URL embed de Spotify', page: 'info', kind: 'url' },
  { id: 'eat-section', label: 'Dónde comer', page: 'coruna' },
  { id: 'drink-section', label: 'Dónde beber', page: 'coruna' },
  { id: 'stay-section', label: 'Dónde alojarse', page: 'coruna' },
  { id: 'see-section', label: 'Qué ver', page: 'coruna' },
];

const PAGE_LABELS: Record<string, string> = {
  principal: 'Página Principal',
  info: 'Página Información',
  coruna: 'Página A Coruña',
};

const FIXED_IDS = new Set(PREVIEW_ITEMS.map(item => item.id));
const FIXED_ORDER_BY_ID = PREVIEW_ITEMS.reduce((acc, item, index) => {
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
  const [selectedPage, setSelectedPage] = useState<'all' | 'principal' | 'info' | 'coruna'>('all');

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
    const fixedSections = PREVIEW_ITEMS.map(item => {
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

  const renderEditableTitle = (section: Section) => {
    const titleEditKey = `${section.id}-title`;
    const isTitleEditing = editingField?.id === section.id && editingField.field === 'title';

    return (
      <div className="inline-title-row">
        <h2
          className={`inline-editable-title ${isTitleEditing ? 'is-editing' : ''}`}
          data-edit-key={titleEditKey}
          contentEditable={isTitleEditing}
          suppressContentEditableWarning
          onBlur={event => saveInlineEdit(section, 'title', event.currentTarget.innerText)}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              event.preventDefault();
              cancelInlineEdit();
            }
            if (event.key === 'Enter') {
              event.preventDefault();
              (event.currentTarget as HTMLElement).blur();
            }
          }}
        >
          {section.title}
        </h2>
        <div className="inline-actions">
          <button className="inline-icon-btn" onClick={() => startInlineEdit(section.id, 'title')} title="Editar título">✏️</button>
          <button className="inline-icon-btn danger" onClick={() => handleTrashField(section, 'title')} title="Eliminar/restablecer título">🗑️</button>
        </div>
      </div>
    );
  };

  const renderEditableContent = (section: Section) => {
    const contentEditKey = `${section.id}-content`;
    const isContentEditing = editingField?.id === section.id && editingField.field === 'content';

    return (
      <div className="inline-content-row">
        <p
          className={`inline-editable-content ${isContentEditing ? 'is-editing' : ''}`}
          data-edit-key={contentEditKey}
          contentEditable={isContentEditing}
          suppressContentEditableWarning
          onBlur={event => saveInlineEdit(section, 'content', event.currentTarget.innerText)}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              event.preventDefault();
              cancelInlineEdit();
            }
          }}
        >
          {section.content}
        </p>
        <div className="inline-actions">
          <button className="inline-icon-btn" onClick={() => startInlineEdit(section.id, 'content')} title="Editar contenido">✏️</button>
          <button className="inline-icon-btn danger" onClick={() => handleTrashField(section, 'content')} title="Eliminar/restablecer contenido">🗑️</button>
        </div>
      </div>
    );
  };

  const renderSectionInline = (pageId: string, section: Section) => {
    const wrapperClass = pageId === 'coruna'
      ? 'coruna-section admin-mirror-section'
      : pageId === 'info'
        ? 'info-section admin-mirror-section'
        : 'location-section admin-mirror-section';

    return (
      <div key={section.id} className="inline-section-block">
        <section className={wrapperClass}>
          {renderEditableTitle(section)}
          {renderEditableContent(section)}
        </section>

        <div className="inline-add-row">
          <button
            className="inline-add-btn"
            onClick={() => createSectionBetween(pageId, section.id)}
            title="Añadir sección aquí"
          >
            +
          </button>
        </div>
      </div>
    );
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
            </div>

            {Array.from(groupedSections.entries()).map(([pageId, pageSections]) => (
              <section key={pageId} className={`admin-live-page admin-mirror-page ${pageId}-mirror`}>
                <h3 className="admin-live-page-title">{PAGE_LABELS[pageId] || pageId}</h3>

                {pageId === 'principal' && <div className="video-section admin-mirror-hero" />}
                {pageId === 'info' && <img src="/assets/imagen02.png" alt="Info" className="info-hero-img" />}
                {pageId === 'coruna' && <div className="coruna-hero"><img src="/assets/imagen03.png" alt="A Coruña" className="coruna-hero-img" /></div>}

                {pageSections.length === 0 && (
                  <div className="inline-add-row empty">
                    <button className="inline-add-btn" onClick={() => createSectionBetween(pageId)} title="Añadir sección">
                      +
                    </button>
                  </div>
                )}

                {pageSections.map(section => renderSectionInline(pageId, section))}
              </section>
            ))}

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
