import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import useWebsiteTexts from '../utils/useWebsiteTexts';

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
  const { getSection, getText } = useWebsiteTexts();
  const introTitle = getSection('rsvp-intro-title', {
    title: 'RSVP - Título inicial',
    content: '¿Contamos contigo?',
    page: 'rsvp',
  });
  const introText = getSection('rsvp-intro-text', {
    title: 'RSVP - Texto inicial',
    content: '¡Nos hace muchísima ilusión compartir este día contigo! Para ayudarnos a organizarlo todo a la perfección, por favor introduce tu nombre. Si estás en la lista, podrás confirmarnos si vienes y puedes dejarnos un mensajito en las notas. ¡Estamos deseando leerte!',
    page: 'rsvp',
  });
  const attendanceTitle = getSection('rsvp-attendance-title', {
    title: 'RSVP - Título asistencia',
    content: '¿Vas a asistir?',
    page: 'rsvp',
  });
  const optionYesLabel = getSection('rsvp-attendance-option-yes-label', {
    title: 'RSVP - Opción sí (texto visible)',
    content: 'Sí, allí estaré. Contad conmigo.',
    page: 'rsvp',
  });
  const optionYesValue = getSection('rsvp-attendance-option-yes-value', {
    title: 'RSVP - Opción sí (valor)',
    content: 'Sí, allí estaré',
    page: 'rsvp',
  });
  const optionKidsLabel = getSection('rsvp-attendance-option-kids-label', {
    title: 'RSVP - Opción con niños (texto visible)',
    content: 'Sí, asistiré con niños.',
    page: 'rsvp',
  });
  const optionKidsValue = getSection('rsvp-attendance-option-kids-value', {
    title: 'RSVP - Opción con niños (valor)',
    content: 'Con niños',
    page: 'rsvp',
  });
  const optionNoLabel = getSection('rsvp-attendance-option-no-label', {
    title: 'RSVP - Opción no (texto visible)',
    content: 'Me encantaría, pero no puedo ir.',
    page: 'rsvp',
  });
  const optionNoValue = getSection('rsvp-attendance-option-no-value', {
    title: 'RSVP - Opción no (valor)',
    content: 'No puedo',
    page: 'rsvp',
  });
  const successTitle = getSection('rsvp-success-title', {
    title: 'RSVP - Título éxito',
    content: '¡Gracias!',
    page: 'rsvp',
  });
  const successText = getSection('rsvp-success-text', {
    title: 'RSVP - Texto éxito',
    content: 'Nos hace muchísima ilusión que confirmes tu asistencia.',
    page: 'rsvp',
  });
  const successClosing = getSection('rsvp-success-closing', {
    title: 'RSVP - Cierre éxito',
    content: 'Te esperamos el 29 de agosto en A Coruña. ¡Será un día inolvidable!',
    page: 'rsvp',
  });
  const successButton = getSection('rsvp-success-button', {
    title: 'RSVP - Texto botón éxito',
    content: 'Volver al inicio',
    page: 'rsvp',
  });
  const searchPlaceholder = getText('rsvp-search-placeholder', 'Busca tu nombre...');
  const noResultsText = getText('rsvp-no-results-text', 'No encontramos tu nombre. Contacta con Marta o Sergio');
  const selectedGuestLabel = getText('rsvp-selected-guest-label', 'Invitado:');
  const changeGuestButton = getText('rsvp-change-guest-button', 'Cambiar');
  const notesLabel = getText('rsvp-notes-label', 'Déjanos una nota');
  const notesPlaceholder = getText('rsvp-notes-placeholder', 'Cuéntanos algo especial...');
  const submitButton = getText('rsvp-submit-button', 'Enviar Confirmación');
  const submittingButton = getText('rsvp-submitting-button', 'Enviando...');
  const validationAlert = getText('rsvp-validation-alert', 'Por favor selecciona tu nombre y una opción de asistencia');
  const submitErrorAlert = getText('rsvp-submit-error-alert', 'Error al enviar la confirmación');

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
      alert(validationAlert);
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
      alert(submitErrorAlert);
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
            <h2>{successTitle.content}</h2>
            <p>{successText.content}</p>

            {successImage && (
              <img
                src={successImage}
                alt="Gracias"
                className="success-image"
              />
            )}

            <p className="success-text">{successClosing.content}</p>

            <a href="/" className="btn-primary">
              {successButton.content}
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
        <h2>{introTitle.content}</h2>
        <p className="rsvp-subtitle">{introText.content}</p>
      </section>

      <section className="rsvp-form-section">
        {!selectedGuest ? (
          <>
            <div className="guest-search">
              <div className="search-input-group">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
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

              {searchQuery.trim().length >= MIN_SEARCH_CHARS && matchedGuests.length === 0 && (
                <p className="no-results">{noResultsText}</p>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="attendance-form">
            <div className="selected-guest">
              <p>{selectedGuestLabel} <strong>{selectedGuest.name}</strong></p>
              <button
                type="button"
                className="change-guest-btn"
                onClick={() => {
                  setSelectedGuest(null);
                  setFormData({ guestName: '', attendance: '', notes: '' });
                }}
              >
                {changeGuestButton}
              </button>
            </div>

            <div className="attendance-options">
              <h3>{attendanceTitle.content}</h3>

                <label className="attendance-option">
                <input
                  type="radio"
                  name="attendance"
                  value={optionYesValue.content}
                  checked={formData.attendance === optionYesValue.content}
                  onChange={e => handleAttendanceChange(e.target.value)}
                />
                <span className="option-text">{optionYesLabel.content}</span>
              </label>

              <label className="attendance-option">
                <input
                  type="radio"
                  name="attendance"
                  value={optionKidsValue.content}
                  checked={formData.attendance === optionKidsValue.content}
                  onChange={e => handleAttendanceChange(e.target.value)}
                />
                <span className="option-text">{optionKidsLabel.content}</span>
              </label>

              <label className="attendance-option">
                <input
                  type="radio"
                  name="attendance"
                  value={optionNoValue.content}
                  checked={formData.attendance === optionNoValue.content}
                  onChange={e => handleAttendanceChange(e.target.value)}
                />
                <span className="option-text">{optionNoLabel.content}</span>
              </label>
            </div>

            <div className="notes-field">
              <label htmlFor="notes">{notesLabel}</label>
              <textarea
                id="notes"
                placeholder={notesPlaceholder}
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
              {loading ? submittingButton : submitButton}
            </button>
          </form>
        )}
      </section>

      <Footer />
      <img src="/assets/imagen04.png" alt="RSVP" className="rsvp-bottom-img" style={{width:'100%',maxWidth:400,margin:'24px auto 0',display:'block',borderRadius:'12px'}} />
    </div>
  );
}