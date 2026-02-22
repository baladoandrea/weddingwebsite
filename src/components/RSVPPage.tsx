import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface Guest {
  id: string;
  name: string;
  attendance: string;
  notes: string;
  image: string;
}

interface RSVPFormData {
  guestName: string;
  attendance: string;
  notes: string;
}

const MIN_SEARCH_CHARS = 7;

export default function RSVPPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedGuests, setMatchedGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState<RSVPFormData>({
    guestName: '',
    attendance: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [successImage, setSuccessImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      const response = await fetch('/api/guests');
      if (response.ok) {
        setGuests(await response.json());
      }
    } catch (error) {
      console.error('Error loading guests:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const trimmedQuery = query.trim();

    if (trimmedQuery.length < MIN_SEARCH_CHARS) {
      setMatchedGuests([]);
      return;
    }

    const normalized = trimmedQuery
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const matches = guests.filter(guest => {
      const guestNormalized = guest.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return guestNormalized.includes(normalized);
    });

    setMatchedGuests(matches);
  };

  const handleSelectGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setFormData({
      guestName: guest.name,
      attendance: guest.attendance || '',
      notes: guest.notes || '',
    });
    setSearchQuery('');
    setMatchedGuests([]);
  };

  const handleAttendanceChange = (attendance: string) => {
    setFormData({ ...formData, attendance });
  };

  const handleNotesChange = (notes: string) => {
    if (notes.length <= 240) {
      setFormData({ ...formData, notes });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGuest || !formData.attendance) {
      alert('Por favor selecciona tu nombre y una opción de asistencia');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/rsvp/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: selectedGuest.id,
          guestName: selectedGuest.name,
          attendance: formData.attendance,
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessImage(data.image || '');
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Error al enviar la confirmación');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rsvp-page">
        <Header />
        <div className="rsvp-success">
          <div className="success-modal">
            <h2>¡Gracias!</h2>
            <p>Nos hace muchísima ilusión que confirmes tu asistencia.</p>

            {successImage && (
              <img
                src={successImage}
                alt="Gracias"
                className="success-image"
              />
            )}

            <p className="success-text">
              Te esperamos el 29 de agosto en A Coruña. ¡Será un día inolvidable!
            </p>

            <a href="/" className="btn-primary">
              Volver al inicio
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="rsvp-page">
      <Header />

      <section className="rsvp-header">
        <h2>¿Contamos contigo?</h2>
        <p className="rsvp-subtitle">
          ¡Nos hace muchísima ilusión compartir este día contigo! Para ayudarnos
          a organizarlo todo a la perfección, por favor introduce tu nombre. Si
          estás en la lista, podrás confirmarnos si vienes y puedes dejarnos un
          mensajito en las notas. ¡Estamos deseando leerte!
        </p>
      </section>

      <section className="rsvp-form-section">
        {!selectedGuest ? (
          <>
            <div className="guest-search">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder="Busca tu nombre..."
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  className="search-input"
                />
              </div>

              {matchedGuests.length > 0 && (
                <div className="guest-list">
                  {matchedGuests.map(guest => (
                    <button
                      key={guest.id}
                      className="guest-item"
                      onClick={() => handleSelectGuest(guest)}
                    >
                      {guest.name}
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.trim().length > 0 && searchQuery.trim().length < MIN_SEARCH_CHARS && (
                <p className="no-results">
                  Escribe al menos {MIN_SEARCH_CHARS} caracteres para buscar tu nombre
                </p>
              )}

              {searchQuery.trim().length >= MIN_SEARCH_CHARS && matchedGuests.length === 0 && (
                <p className="no-results">
                  No encontramos tu nombre. Contacta con Marta o Sergio
                </p>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="attendance-form">
            <div className="selected-guest">
              <p>Invitado: <strong>{selectedGuest.name}</strong></p>
              <button
                type="button"
                className="change-guest-btn"
                onClick={() => {
                  setSelectedGuest(null);
                  setFormData({ guestName: '', attendance: '', notes: '' });
                }}
              >
                Cambiar
              </button>
            </div>

            <div className="attendance-options">
              <h3>¿Vas a asistir?</h3>

                <label className="attendance-option">
                <input
                  type="radio"
                  name="attendance"
                  value="Sí, allí estaré"
                  checked={formData.attendance === 'Sí, allí estaré'}
                  onChange={e => handleAttendanceChange(e.target.value)}
                />
                <span className="option-text">Sí, allí estaré. Contad conmigo.</span>
              </label>

              <label className="attendance-option">
                <input
                  type="radio"
                  name="attendance"
                  value="Con niños"
                  checked={formData.attendance === 'Con niños'}
                  onChange={e => handleAttendanceChange(e.target.value)}
                />
                <span className="option-text">Sí, asistiré con niños.</span>
              </label>

              <label className="attendance-option">
                <input
                  type="radio"
                  name="attendance"
                  value="No puedo"
                  checked={formData.attendance === 'No puedo'}
                  onChange={e => handleAttendanceChange(e.target.value)}
                />
                <span className="option-text">Me encantaría, pero no puedo ir.</span>
              </label>
            </div>

            <div className="notes-field">
              <label htmlFor="notes">Déjanos una nota</label>
              <textarea
                id="notes"
                placeholder="Cuéntanos algo especial..."
                value={formData.notes}
                onChange={e => handleNotesChange(e.target.value)}
                maxLength={240}
                rows={4}
              />
              <small>{formData.notes.length}/240</small>
            </div>

            <button
              type="submit"
              className="btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Confirmación'}
            </button>
          </form>
        )}
      </section>

      <Footer />
      <img src="/assets/imagen04.png" alt="RSVP" className="rsvp-bottom-img" style={{width:'100%',maxWidth:400,margin:'24px auto 0',display:'block',borderRadius:'12px'}} />
    </div>
  );
}