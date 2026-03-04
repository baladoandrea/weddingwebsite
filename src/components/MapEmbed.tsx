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

  const isGoogleHost = parsed.hostname.includes('google.') || parsed.hostname === 'maps.app.goo.gl';
  if (!isGoogleHost || parsed.protocol !== 'https:') {
    return false;
  }

  return parsed.pathname.includes('/maps/embed') || parsed.searchParams.get('output') === 'embed';
};

export default function MapEmbed({ 
  location = "Lugar, Campo Costa, 1, 15145 A Laracha, A Coruña",
  address = "Costa Caión, A Laracha, A Coruña",
  embedUrl,
}: MapEmbedProps) {
  const mapsUrl = resolveMapUrl(embedUrl, location);

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

const buildQueryEmbedUrl = (query: string): string => {
  const encodedQuery = encodeURIComponent(query);
  return `https://www.google.com/maps?q=${encodedQuery}&output=embed`;
};

const resolveMapUrl = (embedUrl: string | undefined, fallbackLocation: string): string => {
  const value = typeof embedUrl === 'string' ? embedUrl.trim() : '';

  if (!value) {
    return buildQueryEmbedUrl(fallbackLocation);
  }

  if (isValidGoogleMapsEmbedUrl(value)) {
    return value;
  }

  const parsed = parseUrl(value);
  if (parsed) {
    const isGoogleHost = parsed.hostname.includes('google.') || parsed.hostname === 'maps.app.goo.gl';
    if (isGoogleHost && parsed.protocol === 'https:') {
      return buildQueryEmbedUrl(value);
    }
  }

  return buildQueryEmbedUrl(value);
};
