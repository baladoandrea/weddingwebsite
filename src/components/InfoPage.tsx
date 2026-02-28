import Header from './Header';
import Footer from './Footer';
import useWebsiteTexts from '../utils/useWebsiteTexts';
import { getReservedSectionIds, shouldHideInfoDynamicSection } from '../utils/textSyncConfig';

const DEFAULT_MAPS_DIRECTIONS_URL = 'https://www.google.com/maps/place/Plaza+de+Pontevedra,+A+Coru%C3%B1a';
const DEFAULT_SPOTIFY_EMBED_URL = 'https://open.spotify.com/embed/playlist/37i9dQZEVXbJwoKy8qKpHG?utm_source=generator';

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const isValidGoogleMapsUrl = (value: string): boolean => {
  const parsed = parseUrl(value);
  if (!parsed) {
    return false;
  }

  return parsed.protocol === 'https:'
    && (
      parsed.hostname.includes('google.')
      || parsed.hostname === 'maps.app.goo.gl'
    );
};

const isValidSpotifyEmbedUrl = (value: string): boolean => {
  const parsed = parseUrl(value);
  if (!parsed) {
    return false;
  }

  return parsed.protocol === 'https:'
    && parsed.hostname === 'open.spotify.com'
    && parsed.pathname.startsWith('/embed/');
};

export default function InfoPage() {
  const { getSection, getText, getCustomSections } = useWebsiteTexts();
  const carSection = getSection('car-section', {
    title: 'Cómo llegar en coche',
    content: 'Para llegar al Casón Amor en coche, dirígete hacia el centro de A Coruña y sigue las indicaciones hacia la zona de la Ciudad Vieja o Torre de Hércules. Existen zonas de aparcamiento habilitadas en las inmediaciones.',
    page: 'info',
  });
  const questionsSection = getSection('questions-section', {
    title: '¿Alguna duda?',
    content: 'Si tienes cualquier duda, petición o lo que sea, puedes escribirnos a Sergio o Marta.',
    page: 'info',
  });
  const giftSection = getSection('gift-section', {
    title: 'Regalo',
    content: 'Vuestra presencia es nuestro mejor regalo. Pero si queréis tener un detalle con nosotros para nuestra nueva etapa, podéis hacerlo a través del siguiente número de cuenta:',
    page: 'info',
  });
  const mapsDirectionsUrl = getText('map-directions-url', DEFAULT_MAPS_DIRECTIONS_URL);
  const spotifyEmbedUrl = getText('spotify-playlist-url', DEFAULT_SPOTIFY_EMBED_URL);
  const safeMapsDirectionsUrl = isValidGoogleMapsUrl(mapsDirectionsUrl)
    ? mapsDirectionsUrl
    : DEFAULT_MAPS_DIRECTIONS_URL;
  const safeSpotifyEmbedUrl = isValidSpotifyEmbedUrl(spotifyEmbedUrl)
    ? spotifyEmbedUrl
    : DEFAULT_SPOTIFY_EMBED_URL;
  const customSections = getCustomSections('info', getReservedSectionIds('info'))
    .filter(section => !shouldHideInfoDynamicSection(section.title));

  return (
    <div className="info-page">
      <Header />

      {/* Imagen superior */}
      <img src="/assets/imagen02.png" alt="Cómo llegar" className="info-hero-img" style={{width:'100%',maxWidth:500,margin:'0 auto 24px',display:'block',borderRadius:'12px'}} />

      {/* How to Get There */}
      <section className="info-section">
        <h2>¿Cómo llegar?</h2>

        <article className="subsection">
          <h3>{carSection.title}</h3>
          <p>{carSection.content}</p>
        </article>

        <article className="subsection">
          <h3>En autobús</h3>
          <div className="bus-info">
            <p>
              <strong>{getText('bus-out-label', 'Salida:')}</strong>{' '}
              {getText(
                'bus-out-text',
                'Sábado 29 de agosto a las 12:30 desde la Avenida de Córcega.'
              )}
            </p>

            <p>
              <strong>{getText('bus-return-label', 'Servicio de vuelta:')}</strong>{' '}
              {getText(
                'bus-return-text',
                'Se dispondrá de servicio de autobús al finalizar la boda.'
              )}
            </p>
          </div>

          {/* Imagen eliminada de bus-info */}

            <a
              href={safeMapsDirectionsUrl}
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
        <h2>{questionsSection.title}</h2>
        <p>{questionsSection.content}</p>
      </section>

      {/* Gift Section */}
      <section className="info-section gift-section">
        <h2>{giftSection.title}</h2>
        <div className="gift-content">
          <p>{giftSection.content}</p>
        </div>
      </section>

      {/* Spotify Playlist */}
      <section className="info-section playlist-section">
        <h2>Ve calentando motores</h2>
        <div className="spotify-embed">
          <iframe
            style={{ borderRadius: '12px' }}
            src={safeSpotifyEmbedUrl}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {customSections.map(section => (
        <section key={section.id} className="info-section dynamic-section">
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </section>
      ))}

      <Footer />
    </div>
  );
}