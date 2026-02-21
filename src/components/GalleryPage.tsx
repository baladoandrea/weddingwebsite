import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface GalleryItem {
  id: string;
  url: string;
  tags: string[];
}

const defaultPhotos: GalleryItem[] = [
  { id: '1', url: '/assets/foto01.png', tags: ['ceremonia', 'playa'] },
  { id: '2', url: '/assets/foto02.png', tags: ['aperitivo', 'convite'] },
  { id: '3', url: '/assets/foto03.png', tags: ['ceremonia', 'momentos'] },
];

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>(defaultPhotos);
  const [searchTag, setSearchTag] = useState('');
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>(defaultPhotos);

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    filterGallery();
  }, [gallery, searchTag]);

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

  return (
    <div className="gallery-page">
      <Header />

      <section className="gallery-header">
        <h1>Galería</h1>
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
            {filteredGallery.map(item => (
              <div key={item.id} className="gallery-item">
                <img src={item.url} alt="Foto de la boda" />
                {item.tags.length > 0 && (
                  <div className="item-tags">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="tag-badge"
                        onClick={() => setSearchTag(tag)}
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

      <Footer />
    </div>
  );
}