import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import MapEmbed from './MapEmbed';

export default function InfoPage() {
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    setEditMode(!!token);
  }, []);

  return (
    <div className="info-page">
      <Header />

      {/* How to Get There */}
      <section className="info-section">
        <h2>¿Cómo llegar?</h2>

        <article className="subsection">
          <h3>En coche</h3>
          <p>
            Para llegar al Casón Amor en coche, dirígete hacia el centro de A Coruña
            y sigue las indicaciones hacia la zona de la Ciudad Vieja o "Torre de
            Hércules". Desde la avenida principal de acceso a la ciudad (AC-11), toma
            la salida hacia el Paseo Marítimo en dirección norte. Continúa por el
            Paseo Marítimo bordeando la costa durante varios kilómetros hasta
            encontrar la señalización hacia el destino.
          </p>
          <p>
            El lugar se encuentra dentro de un área peatonal y protegida, por lo que
            el acceso directo en coche hasta la entrada no está permitido. Existen
            zonas de aparcamiento habilitadas en las inmediaciones, a unos minutos a
            pie. Desde allí, sigue los senderos señalizados hasta el acceso principal
            al recinto.
          </p>
        </article>

        <article className="subsection">
          <h3>En autobús</h3>
          <div className="bus-info">
            <p>
              <strong>Salida:</strong> Viernes 28 de agosto a las 11:30 desde la Plaza
              de Pontevedra.
            </p>
            <p>
              <strong>Servicio de vuelta:</strong> Sábado 29 de agosto a las 02:00 y
              04:00.
            </p>
          </div>

          <img src="/assets/imagen02.png" alt="Ubicación salida autobús" className="info-image" />

            <a
              href="https://www.google.com/maps/place/Plaza+de+Pontevedra,+A+Coru%C3%B1a"
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              Ver ubicación en Maps
            </a>
        </article>
      </section>

      {/* Gift Section */}
      <section className="info-section gift-section">
        <h2>Regalo</h2>
        <div className="gift-content">
          <p>
            Vuestra presencia es nuestro mejor regalo. Pero si queréis tener un
            detalle con nosotros para nuestra nueva etapa, podéis hacerlo a través
            del siguiente número de cuenta:
          </p>
          <div className="bank-info">
            <code>ES12 3456 7890 0000 0000</code>
            <span className="bank-name">Banco Ejemplo</span>
          </div>
        </div>
      </section>

      {/* Spotify Playlist */}
      <section className="info-section playlist-section">
        <h2>Ve calentando motores</h2>
        <p>Aquí va la playlist que nos encanta:</p>
        <div className="spotify-embed">
          <iframe
            style={{ borderRadius: '12px' }}
            src="https://open.spotify.com/embed/playlist/37i9dQZEVXbJwoKy8qKpHG?utm_source=generator"
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      </section>

      <Footer />
    </div>
  );
}