import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import MapEmbed from './MapEmbed';
import useWebsiteTexts from '../utils/useWebsiteTexts';

export default function MainPage() {
  const [showText, setShowText] = useState(false);
  const { getText } = useWebsiteTexts();

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
          <p className="event-date">Boda Marta & Sergio · 29 de Agosto de 2026</p>

          <a href="/rsvp" className="btn-primary">
            ✓ Confirmar Asistencia
          </a>
        </div>
      </section>

      {/* Photo Section */}
      <section className="photo-section">
        <img
          src="/assets/imagen01.png"
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
              <span className="label">Ciudad:</span>
              <span className="value">A Coruña</span>
            </div>
            <div className="info-row">
              <span className="label">Fecha:</span>
              <span className="value">29 de Agosto de 2026 (Sábado)</span>
            </div>
            <div className="info-row">
              <span className="label">Hora:</span>
              <span className="value">12:00</span>
            </div>
            <div className="info-row">
              <span className="label">Lugar:</span>
              <span className="value">Casón Amor</span>
            </div>
            <div className="info-row">
              <span className="label">Dirección:</span>
              <span className="value">Calle Vistas, 2 Villabonita, A Coruña</span>
            </div>
          </div>

          <MapEmbed />
        </div>
      </section>

      <Footer />
    </div>
  );
}