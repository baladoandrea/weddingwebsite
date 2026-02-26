import { useMemo, useState, useEffect } from 'react';
import GalleryUpload from './GalleryUpload';

interface Section {
  id: string;
  title: string;
  content: string;
  page: string;
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
  helper?: string;
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
  {
    id: 'map-embed-url',
    label: 'URL embebida de Google Maps',
    page: 'principal',
    kind: 'url',
    helper: 'Pega una URL de Google Maps para iframe (https://www.google.com/maps/embed?...).',
  },
  {
    id: 'map-directions-url',
    label: 'URL de Google Maps (botón “Ver ubicación”)',
    page: 'info',
    kind: 'url',
    helper: 'Pega una URL de Google Maps normal para abrir en nueva pestaña.',
  },
  { id: 'car-section', label: 'Cómo llegar en coche', page: 'info' },
  { id: 'bus-out-label', label: 'Etiqueta salida bus', page: 'info' },
  { id: 'bus-out-text', label: 'Texto salida bus', page: 'info' },
  { id: 'bus-return-label', label: 'Etiqueta vuelta bus', page: 'info' },
  { id: 'bus-return-text', label: 'Texto vuelta bus', page: 'info' },
  { id: 'questions-section', label: 'Sección dudas', page: 'info' },
  { id: 'gift-section', label: 'Sección regalo', page: 'info' },
  {
    id: 'spotify-playlist-url',
    label: 'URL embed de Spotify',
    page: 'info',
    kind: 'url',
    helper: 'Pega una URL de embed de Spotify (https://open.spotify.com/embed/playlist/...).',
  },
  { id: 'eat-section', label: 'Dónde comer', page: 'coruna' },
  { id: 'drink-section', label: 'Dónde beber', page: 'coruna' },
  { id: 'stay-section', label: 'Dónde alojarse', page: 'coruna' },
  { id: 'see-section', label: 'Qué ver', page: 'coruna' },
];

const FIXED_PREVIEW_IDS = new Set(PREVIEW_ITEMS.map(item => item.id));

const PAGE_LABELS: Record<string, string> = {
  principal: 'Página Principal',
  info: 'Página Información',
  coruna: 'Página A Coruña',
};

const DEFAULT_BY_ID: Record<string, string> = {
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
  let parsed = parseUrl(collapsedSpaces);
  if (parsed) {
    return parsed;
  }

  parsed = parseUrl(encodeURI(collapsedSpaces));
  return parsed;
};

const normalizeGoogleMapsEmbedUrl = (value: string): string | null => {
  const parsed = normalizeAndParseUrl(value);
  if (!parsed) {
    return null;
  }

  const pathname = parsed.pathname.toLowerCase();
  if (
    parsed.protocol !== 'https:'
    || !parsed.hostname.includes('google.')
    || !pathname.includes('/maps/embed')
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
    || (
      !parsed.hostname.includes('google.')
      && parsed.hostname !== 'maps.app.goo.gl'
    )
  ) {
    return null;
  }

  return parsed.toString();
};

const normalizeSpotifyEmbedUrl = (value: string): string | null => {
  const parsed = normalizeAndParseUrl(value);
  if (!parsed) {
    return null;
  }

  if (parsed.protocol !== 'https:' || parsed.hostname !== 'open.spotify.com') {
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'texts' | 'gallery' | 'guests'>('texts');
  const [sections, setSections] = useState<Section[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<'all' | string>('all');
  const [editorMode, setEditorMode] = useState<'edit' | 'create' | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [originalSection, setOriginalSection] = useState<Section | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftPage, setDraftPage] = useState('principal');
  const [savingText, setSavingText] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin';
      return;
    }
    setIsAuthenticated(true);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [textsRes, galleryRes, guestsRes] = await Promise.all([
        fetch('/api/texts'),
        fetch('/api/gallery'),
        fetch('/api/guests'),
      ]);

      if (textsRes.ok) {
        const loadedSections = await textsRes.json();
        setSections(loadedSections);
      }
      if (galleryRes.ok) setGallery(await galleryRes.json());
      if (guestsRes.ok) setGuests(await guestsRes.json());
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

  const visiblePreviewItems = useMemo(() => {
    const customItems: PreviewItem[] = sections
      .filter(section => !FIXED_PREVIEW_IDS.has(section.id))
      .map(section => ({
        id: section.id,
        label: section.title || 'Sección personalizada',
        page: section.page,
        kind: 'text',
      }));

    const allItems = [...PREVIEW_ITEMS, ...customItems];

    if (selectedPage === 'all') {
      return allItems;
    }

    return allItems.filter(item => item.page === selectedPage);
  }, [selectedPage, sections]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, PreviewItem[]>();

    for (const item of visiblePreviewItems) {
      if (!groups.has(item.page)) {
        groups.set(item.page, []);
      }
      groups.get(item.page)?.push(item);
    }

    return groups;
  }, [visiblePreviewItems]);

  const getDisplaySection = (item: PreviewItem): Section => {
    const existing = sectionById.get(item.id);
    if (existing) {
      return existing;
    }

    return {
      id: item.id,
      title: item.label,
      content: DEFAULT_BY_ID[item.id] || '',
      page: item.page,
    };
  };

  const handleEditSection = (item: PreviewItem) => {
    const section = getDisplaySection(item);
    setEditorMode('edit');
    setEditingSectionId(section.id);
    setOriginalSection({ ...section });
    setDraftTitle(section.title);
    setDraftContent(section.content);
    setDraftPage(section.page);
  };

  const handleDeleteTextSection = async (sectionId: string) => {
    if (FIXED_PREVIEW_IDS.has(sectionId)) {
      alert('Esta sección es parte de la estructura base y no se puede eliminar.');
      return;
    }

    if (!confirm('¿Eliminar esta sección personalizada?')) {
      return;
    }

    try {
      const response = await fetch(`/api/texts?id=${encodeURIComponent(sectionId)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        let message = 'No se pudo eliminar la sección';
        try {
          const data = await response.json();
          message = data.error || message;
        } catch {
          message = `${message} (HTTP ${response.status})`;
        }
        alert(message);
        return;
      }

      setSections(currentSections => currentSections.filter(section => section.id !== sectionId));

      if (editingSectionId === sectionId) {
        closeEditor();
      }
    } catch {
      alert('Error al eliminar la sección');
    }
  };

  const handleCreateSection = () => {
    setEditorMode('create');
    setEditingSectionId(null);
    setOriginalSection(null);
    setDraftTitle('');
    setDraftContent('');
    setDraftPage(selectedPage !== 'all' ? selectedPage : 'principal');
  };

  useEffect(() => {
    if (editorMode !== 'edit' || !editingSectionId) {
      return;
    }

    setSections(currentSections => {
      const exists = currentSections.some(section => section.id === editingSectionId);

      if (!exists) {
        return [
          ...currentSections,
          {
            id: editingSectionId,
            title: draftTitle,
            content: draftContent,
            page: draftPage,
          },
        ];
      }

      return currentSections.map(section =>
        section.id === editingSectionId
          ? { ...section, title: draftTitle, content: draftContent, page: draftPage }
          : section
      );
    });
  }, [editorMode, editingSectionId, draftTitle, draftContent, draftPage]);

  const closeEditor = () => {
    if (editingSectionId && originalSection) {
      setSections(currentSections => {
        const exists = currentSections.some(section => section.id === editingSectionId);
        if (!exists) {
          return currentSections;
        }

        return currentSections.map(section =>
          section.id === editingSectionId ? originalSection : section
        );
      });
    }

    setEditingSectionId(null);
    setEditorMode(null);
    setOriginalSection(null);
    setDraftTitle('');
    setDraftContent('');
    setDraftPage('principal');
  };

  const handleSaveSection = async () => {
    if (editorMode === 'edit' && !editingSectionId) {
      return;
    }

    const trimmedTitle = draftTitle.trim();
    if (!trimmedTitle) {
      alert('El título no puede estar vacío.');
      return;
    }

    const trimmedContent = draftContent.trim();
    if (!trimmedContent) {
      alert('El contenido no puede estar vacío.');
      return;
    }

    let normalizedContent = trimmedContent;

    if (editingSectionId === 'map-embed-url') {
      const normalized = normalizeGoogleMapsEmbedUrl(trimmedContent);
      if (!normalized) {
        alert('La URL del mapa embebido debe ser un enlace HTTPS de Google Maps Embed.');
        return;
      }
      normalizedContent = normalized;
    }

    if (editingSectionId === 'map-directions-url') {
      const normalized = normalizeGoogleMapsUrl(trimmedContent);
      if (!normalized) {
        alert('La URL de ubicación debe ser un enlace HTTPS válido de Google Maps.');
        return;
      }
      normalizedContent = normalized;
    }

    if (editingSectionId === 'spotify-playlist-url') {
      const normalized = normalizeSpotifyEmbedUrl(trimmedContent);
      if (!normalized) {
        alert('La URL de Spotify debe ser un enlace embed válido de open.spotify.com.');
        return;
      }
      normalizedContent = normalized;
    }

    const sectionToSave: Partial<Section> = {
      title: trimmedTitle,
      content: normalizedContent,
      page: draftPage,
    };

    if (editorMode === 'edit' && editingSectionId) {
      sectionToSave.id = editingSectionId;
    }

    try {
      setSavingText(true);
      const method = editorMode === 'create' ? 'POST' : 'PUT';
      let response = await fetch('/api/texts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionToSave),
      });

      if (editorMode === 'edit' && response.status === 404) {
        response = await fetch('/api/texts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sectionToSave),
        });
      }

      if (response.ok) {
        const updatedSection = await response.json() as Section;

        if (editorMode === 'create') {
          setSections(currentSections => [...currentSections, updatedSection]);
        } else {
          setSections(currentSections =>
            currentSections.map(section =>
              section.id === updatedSection.id ? updatedSection : section
            )
          );
        }

        setEditorMode(null);
        setEditingSectionId(null);
        setOriginalSection(null);
        setDraftTitle('');
        setDraftContent('');
        setDraftPage('principal');
        alert(editorMode === 'create' ? 'Sección creada correctamente' : 'Sección actualizada correctamente');
      } else {
        let message = 'Error al guardar la sección';
        try {
          const data = await response.json();
          message = data.error || message;
        } catch {
          message = `Error al guardar la sección (HTTP ${response.status})`;
        }
        alert(message);
      }
    } catch (error) {
      alert('Error al guardar la sección');
    } finally {
      setSavingText(false);
    }
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
        const rawBody = await response.text();
        let message = `Error al subir la foto (HTTP ${response.status})`;

        try {
          const parsed = JSON.parse(rawBody) as { error?: string };
          if (parsed?.error) {
            message = parsed.error;
          } else if (rawBody.trim().length > 0) {
            message = rawBody;
          }
        } catch {
          if (rawBody.trim().length > 0) {
            message = rawBody;
          }
        }

        alert(message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al subir la foto';
      alert(message);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (confirm('¿Eliminar esta foto?')) {
      try {
        const response = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
        if (response.ok) {
          setGallery(gallery.filter(item => item.id !== id));
        }
      } catch (error) {
        alert('Error al eliminar la foto');
      }
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (confirm('¿Eliminar este invitado?')) {
      try {
        const response = await fetch(`/api/guests?id=${id}`, { method: 'DELETE' });
        if (response.ok) {
          setGuests(guests.filter(g => g.id !== id));
        }
      } catch (error) {
        alert('Error al eliminar el invitado');
      }
    }
  };

  if (!isAuthenticated || loading) {
    return <div className="admin-loading">Cargando...</div>;
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Panel Administrativo</h1>
        <button onClick={() => {
          sessionStorage.removeItem('adminToken');
          window.location.href = '/';
        }} className="logout-btn">
          Cerrar sesión
        </button>
      </header>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'texts' ? 'active' : ''}`}
          onClick={() => setActiveTab('texts')}
        >
          Textos
        </button>
        <button
          className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Galería
        </button>
        <button
          className={`tab ${activeTab === 'guests' ? 'active' : ''}`}
          onClick={() => setActiveTab('guests')}
        >
          Invitados
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'texts' && (
          <div className="admin-section visual-admin-section">
            <div className="visual-editor-header">
              <h2>Editor visual de textos</h2>
              <p>
                Haz clic en el lápiz de cada bloque para editarlo. Verás el cambio al instante en esta vista previa.
              </p>
              <button className="edit-btn" onClick={handleCreateSection}>
                + Nueva sección (H2 + contenido)
              </button>
            </div>

            <div className="page-filter-tabs">
              <button
                className={`page-filter-btn ${selectedPage === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedPage('all')}
              >
                Todas
              </button>
              {Object.entries(PAGE_LABELS).map(([pageId, pageLabel]) => (
                <button
                  key={pageId}
                  className={`page-filter-btn ${selectedPage === pageId ? 'active' : ''}`}
                  onClick={() => setSelectedPage(pageId)}
                >
                  {pageLabel}
                </button>
              ))}
            </div>

            <div className="visual-editor-layout">
              <div className="visual-preview">
                {Array.from(groupedItems.entries()).map(([pageId, items]) => (
                  <section key={pageId} className="preview-page-block">
                    <h3>{PAGE_LABELS[pageId] || pageId}</h3>

                    <div className="preview-items-grid">
                      {items.map(item => {
                        const section = getDisplaySection(item);
                        const isEditing = editingSectionId === item.id;
                        const isCustomSection = !FIXED_PREVIEW_IDS.has(item.id);

                        return (
                          <article
                            key={item.id}
                            className={`preview-item ${isEditing ? 'editing' : ''}`}
                          >
                            <div className="preview-item-top">
                              <h4>{section.title || item.label}</h4>
                              <button
                                className="icon-edit-btn"
                                onClick={() => handleEditSection(item)}
                                title="Editar"
                                aria-label={`Editar ${section.title || item.label}`}
                              >
                                ✏️
                              </button>
                              {isCustomSection && (
                                <button
                                  className="icon-delete-btn"
                                  onClick={() => handleDeleteTextSection(item.id)}
                                  title="Eliminar"
                                  aria-label={`Eliminar ${section.title || item.label}`}
                                >
                                  🗑️
                                </button>
                              )}
                            </div>

                            <p className="preview-item-label">{item.label}</p>
                            <p className={`preview-item-content ${item.kind === 'url' ? 'is-url' : ''}`}>
                              {section.content || 'Sin contenido'}
                            </p>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              <aside className="visual-editor-panel">
                {editorMode ? (
                  <>
                    <h3>{editorMode === 'create' ? 'Nueva sección' : 'Editar bloque'}</h3>

                    <div className="form-group">
                      <label>Título</label>
                      <input
                        type="text"
                        value={draftTitle}
                        onChange={event => setDraftTitle(event.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Contenido</label>
                      <textarea
                        value={draftContent}
                        onChange={event => setDraftContent(event.target.value)}
                        rows={editingSectionId?.includes('url') ? 4 : 8}
                      />
                    </div>

                    {PREVIEW_ITEMS.find(item => item.id === editingSectionId)?.helper && (
                      <p className="editor-helper">
                        {PREVIEW_ITEMS.find(item => item.id === editingSectionId)?.helper}
                      </p>
                    )}

                    <div className="form-group">
                      <label>Página</label>
                      <select
                        value={draftPage}
                        onChange={event => setDraftPage(event.target.value)}
                      >
                        <option value="principal">Principal</option>
                        <option value="info">Información</option>
                        <option value="coruna">Sobre A Coruña</option>
                      </select>
                    </div>

                    <div className="modal-actions">
                      <button type="button" className="btn-cancel" onClick={closeEditor}>
                        Cancelar
                      </button>
                      {editorMode === 'edit' && editingSectionId && !FIXED_PREVIEW_IDS.has(editingSectionId) && (
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDeleteTextSection(editingSectionId)}
                        >
                          Eliminar
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-save"
                        onClick={handleSaveSection}
                        disabled={savingText}
                      >
                        {savingText ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="editor-empty">
                    <h3>Selecciona un bloque</h3>
                    <p>
                      Pulsa el botón de lápiz de cualquier título o sección para empezar a editar.
                    </p>
                  </div>
                )}
              </aside>
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
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteGalleryItem(item.id)}
                  >
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
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteGuest(guest.id)}
                        >
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