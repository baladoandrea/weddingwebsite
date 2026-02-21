import { useState, useEffect } from 'react';
import GalleryUpload from './GalleryUpload';
import EditModal from './EditModal';

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

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'texts' | 'gallery' | 'guests'>('texts');
  const [sections, setSections] = useState<Section[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
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

      if (textsRes.ok) setSections(await textsRes.json());
      if (galleryRes.ok) setGallery(await galleryRes.json());
      if (guestsRes.ok) setGuests(await guestsRes.json());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSection = (section: Section) => {
    setEditingSection(section);
    setShowEditModal(true);
  };

  const handleSaveSection = async (section: Section) => {
    try {
      const response = await fetch('/api/texts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(section),
      });

      if (response.ok) {
        const updatedSection = await response.json();
        setSections(sections.map(s => s.id === section.id ? updatedSection : s));
        await loadData();
        setShowEditModal(false);
        alert('Sección actualizada correctamente');
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
        const data = await response.json();
        alert(data.error || 'Error al subir la foto');
      }
    } catch (error) {
      alert('Error al subir la foto');
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
          <div className="admin-section">
            <h2>Gestionar Textos</h2>
            <div className="texts-list">
              {sections.map(section => (
                <div key={section.id} className="text-item">
                  <div className="text-header">
                    <h3>{section.title}</h3>
                    <span className="page-badge">{section.page}</span>
                  </div>
                  <p className="text-preview">{section.content.substring(0, 100)}...</p>
                  <button
                    className="edit-btn"
                    onClick={() => handleEditSection(section)}
                  >
                    Editar
                  </button>
                </div>
              ))}
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

      {showEditModal && editingSection && (
        <EditModal
          section={editingSection}
          onSave={handleSaveSection}
          onClose={() => setShowEditModal(false)}
          onChange={setEditingSection}
        />
      )}
    </div>
  );
}