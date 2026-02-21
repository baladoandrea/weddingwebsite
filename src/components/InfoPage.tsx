import Header from './Header';
import Footer from './Footer';
import useWebsiteTexts from '../utils/useWebsiteTexts';

export default function InfoPage() {
  const { getText } = useWebsiteTexts();

  return (
    <div className="info-page">
      <Header />

      {/* Imagen superior */}
      <img src="/assets/imagen02.png" alt="Cómo llegar" className="info-hero-img" style={{width:'100%',maxWidth:500,margin:'0 auto 24px',display:'block',borderRadius:'12px'}} />

      {/* How to Get There */}
      <section className="info-section">
        <h2>¿Cómo llegar?</h2>

        <article className="subsection">
          <h3>En coche</h3>
          <p>
            {getText('car-section', 'Para llegar al Casón Amor en coche, dirígete hacia el centro de A Coruña y sigue las indicaciones hacia la zona de la Ciudad Vieja o Torre de Hércules. Existen zonas de aparcamiento habilitadas en las inmediaciones.')}
          </p>
        </article>

        <article className="subsection">
          <h3>En autobús</h3>
          <div className="bus-info">
            <p>
              {getText('bus-section', 'Saldrá un autobús a las 11:30 desde la Plaza de Pontevedra. Habrá servicio de vuelta.')}
            </p>
          </div>

          {/* Imagen eliminada de bus-info */}

            <a
              href="https://www.google.com/maps/place/Plaza+de+Pontevedra,+A+Coru%C3%B1a"
              target="_blank"
              rel="noopener noreferrer"
              className="map-link"
            >
              Ver ubicación en Maps
            </a>

          {/* Imagen de mapa */}
          <img src="/assets/mapa.png" alt="Mapa ubicación" className="info-map-img" style={{width:'100%',maxWidth:400,margin:'16px auto 0',display:'block',borderRadius:'12px'}} />
        </article>
      </section>

      <section className="info-section">
        <h2>¿Alguna duda?</h2>
        <p>
          {getText('questions-section', 'Si tienes cualquier duda, petición o lo que sea, puedes escribirnos a Sergio o Marta.')}
        </p>
      </section>

      {/* Gift Section */}
      <section className="info-section gift-section">
        <h2>Regalo</h2>
        <div className="gift-content">
          <p>
            {getText('gift-section', 'Vuestra presencia es nuestro mejor regalo. Pero si queréis tener un detalle con nosotros para nuestra nueva etapa, podéis hacerlo a través del siguiente número de cuenta:')}
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