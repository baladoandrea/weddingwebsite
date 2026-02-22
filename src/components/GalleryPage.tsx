import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface GalleryItem {
  id: string;
  url: string;
  tags: string[];
}

const defaultPhotos: GalleryItem[] = [
  { id: '1', url: '/assets/foto01.png', tags: ['ceremonia', 'novios'] },
  { id: '2', url: '/assets/foto02.png', tags: ['aperitivo', 'convite'] },
  { id: '3', url: '/assets/foto03.png', tags: ['ceremonia', 'momentos'] },
];

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultPhotos);
  const [searchTag, setSearchTag] = useState('');
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>(defaultPhotos);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    filterGallery();
  }, [gallery, searchTag]);

  useEffect(() => {
    if (lightboxIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null);
        return;
      }

      if (event.key === 'ArrowRight') {
        setLightboxIndex(prev => {
          if (prev === null || filteredGallery.length === 0) {
            return null;
          }
          return (prev + 1) % filteredGallery.length;
        });
        return;
      }

      if (event.key === 'ArrowLeft') {
        setLightboxIndex(prev => {
          if (prev === null || filteredGallery.length === 0) {
            return null;
          }
          return (prev - 1 + filteredGallery.length) % filteredGallery.length;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, filteredGallery.length]);

  useEffect(() => {
    if (lightboxIndex === null) {
      return;
    }

    if (filteredGallery.length === 0) {
      setLightboxIndex(null);
      return;
    }

    if (lightboxIndex >= filteredGallery.length) {
      setLightboxIndex(0);
    }
  }, [filteredGallery.length, lightboxIndex]);

  const loadGallery = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setGallery(data);
        }
      }
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  };

  const filterGallery = () => {
    if (!searchTag.trim()) {
      setFilteredGallery(gallery);
      return;
    }

    const normalized = searchTag
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const filtered = gallery.filter(item =>
      item.tags.some(tag =>
        tag
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(normalized)
      )
    );

    setFilteredGallery(filtered);
  };

  const allTags = Array.from(
    new Set(gallery.flatMap(item => item.tags))
  ).sort();

  const closeLightbox = () => setLightboxIndex(null);

  const showNextImage = () => {
    setLightboxIndex(prev => {
      if (prev === null || filteredGallery.length === 0) {
        return null;
      }
      return (prev + 1) % filteredGallery.length;
    });
  };

  const showPrevImage = () => {
    setLightboxIndex(prev => {
      if (prev === null || filteredGallery.length === 0) {
        return null;
      }
      return (prev - 1 + filteredGallery.length) % filteredGallery.length;
    });
  };

  const activeImage = lightboxIndex !== null ? filteredGallery[lightboxIndex] : null;
  const lightboxCounter = lightboxIndex !== null ? `${lightboxIndex + 1} / ${filteredGallery.length}` : '';

  return (
    <div className="gallery-page">
      <Header />

      <section className="gallery-header">
        <h2>Galería</h2>
        <p>Momentos especiales de la boda</p>
      </section>

      {/* Filter */}
      <section className="gallery-filter">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por etiqueta (ej: ceremonia, aperitivo...)..."
            value={searchTag}
            onChange={e => setSearchTag(e.target.value)}
            className="filter-input"
          />
          {searchTag && (
            <button
              className="clear-filter"
              onClick={() => setSearchTag('')}
            >
              Limpiar filtro
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="tag-suggestions">
            <p className="tags-label">Etiquetas disponibles:</p>
            <div className="tags-list">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-btn ${searchTag === tag ? 'active' : ''}`}
                  onClick={() => setSearchTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-section">
        {filteredGallery.length > 0 ? (
          <div className="gallery-grid">
            {filteredGallery.map((item, index) => (
              <div key={item.id} className="gallery-item">
                <img
                  src={item.url}
                  alt="Foto de la boda"
                  onClick={() => setLightboxIndex(index)}
                />
                {item.tags.length > 0 && (
                  <div className="item-tags">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="tag-badge"
                        onClick={e => {
                          e.stopPropagation();
                          setSearchTag(tag);
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No hay fotos con la etiqueta "{searchTag}"</p>
            <button
              className="btn-primary"
              onClick={() => setSearchTag('')}
            >
              Ver todas las fotos
            </button>
          </div>
        )}
      </section>

      {gallery.length === 0 && (
        <section className="empty-gallery">
          <p>Pronto habrá fotos de la boda aquí</p>
        </section>
      )}

      {activeImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-counter">{lightboxCounter}</div>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Cerrar">
            ×
          </button>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={e => {
              e.stopPropagation();
              showPrevImage();
            }}
            aria-label="Anterior"
          >
            ‹
          </button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={activeImage.url} alt="Foto ampliada" className="lightbox-image" />
          </div>
          <button
            className="lightbox-nav lightbox-next"
            onClick={e => {
              e.stopPropagation();
              showNextImage();
            }}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}