interface MapEmbedProps {
  location?: string;
  address?: string;
  embedUrl?: string;
}

const parseUrl = (value: string): URL | null => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

const isValidGoogleMapsEmbedUrl = (value: string): boolean => {
  const parsed = parseUrl(value);
  if (!parsed) {
    return false;
  }

  return parsed.protocol === 'https:'
    && parsed.hostname.includes('google.')
    && parsed.pathname.includes('/maps/embed');
};

export default function MapEmbed({ 
  location = "Casón Amor, Calle Vistas 2, A Coruña",
  address = "Casón Amor, A Coruña",
  embedUrl,
}: MapEmbedProps) {
  const encodedLocation = encodeURIComponent(location);
  const defaultMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2963.7456321!2d-8.3855!3d43.3704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2s${encodedLocation}!5e0!3m2!1ses!2ses!4v1629728200000`;
  const hasValidEmbedUrl = typeof embedUrl === 'string' && isValidGoogleMapsEmbedUrl(embedUrl);
  const mapsUrl = hasValidEmbedUrl
    ? embedUrl
    : defaultMapsUrl;

  return (
    <div className="map-container">
      <iframe
        title={`Mapa de ${address}`}
        src={mapsUrl}
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
