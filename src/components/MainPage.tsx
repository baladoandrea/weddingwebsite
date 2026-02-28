import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import MapEmbed from './MapEmbed';
import useWebsiteTexts from '../utils/useWebsiteTexts';
import { getReservedSectionIds } from '../utils/textSyncConfig';

export default function MainPage() {
  const [showText, setShowText] = useState(false);
  const { getText, getCustomSections } = useWebsiteTexts();
  const customSections = getCustomSections('principal', getReservedSectionIds('principal'));
  const mainPhotoUrl = getText('main-photo-image-url', '/assets/imagen01.png');
  const eventDateText = getText('main-event-date-text', 'Boda Marta & Sergio · 29 de Agosto de 2026');
  const ctaButtonText = getText('main-cta-button-text', '✓ Confirmar Asistencia');

  useEffect(() => {
    setTimeout(() => setShowText(true), 500);
  }, []);

  return (
    <div className="main-page">
      <Header />

      {/* Video Hero */}
      <section className="video-section">
        <video className="hero-video" autoPlay loop muted playsInline preload="auto">
          <source src="/assets/video01.mp4" type="video/mp4" />
          Tu navegador no soporta vídeo HTML5.
        </video>
        <div className="video-overlay"></div>
      </section>
      {/* Text Section */}
      <section className="text-section">
        <div className={`main-text ${showText ? 'visible' : ''}`}>
          <h2 className="main-quote">
            {getText('main-quote', 'En el Atlántico nos prometimos, y ante el mar queremos celebrar...')}
          </h2>
          <p className="event-date">{eventDateText}</p>

          <a href="/rsvp" className="btn-primary">
            {ctaButtonText}
          </a>
        </div>
      </section>

      {/* Photo Section */}
      <section className="photo-section">
        <img
          src={mainPhotoUrl}
          alt="Marta y Sergio"
          className="main-photo fade-in"
        />
      </section>

      {/* Location Section */}
      <section className="location-section">
        <div className="location-content">
          <h3 className="location-title">📍 {getText('location-title', 'Ubicación')}</h3>

          <div className="location-info">
            <div className="info-row">
              <span className="label">{getText('location-city-label', 'Ciudad:')}</span>
              <span className="value">{getText('location-city-value', 'A Coruña')}</span>
            </div>
            <div className="info-row">
              <span className="label">{getText('location-date-label', 'Fecha:')}</span>
              <span className="value">{getText('location-date-value', '29 de Agosto de 2026 (Sábado)')}</span>
            </div>
            <div className="info-row">
              <span className="label">{getText('location-time-label', 'Hora:')}</span>
              <span className="value">{getText('location-time-value', '12:00')}</span>
            </div>
            <div className="info-row">
              <span className="label">{getText('location-place-label', 'Lugar:')}</span>
              <span className="value">{getText('location-place-value', 'Casón Amor')}</span>
            </div>
            <div className="info-row">
              <span className="label">{getText('location-address-label', 'Dirección:')}</span>
              <span className="value">{getText('location-address-value', 'Calle Vistas, 2 Villabonita, A Coruña')}</span>
            </div>
          </div>

          <MapEmbed
            embedUrl={getText(
              'map-embed-url',
              'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2963.7456321!2d-8.3855!3d43.3704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2sCas%C3%B3n%20Amor%2C%20Calle%20Vistas%202%2C%20A%20Coru%C3%B1a!5e0!3m2!1ses!2ses!4v1629728200000'
            )}
          />
        </div>
      </section>

      {customSections.map(section => (
        <section key={section.id} className="location-section dynamic-section">
          <div className="location-content">
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </div>
        </section>
      ))}

      <Footer />
    </div>
  );
}