interface MapEmbedProps {
  location?: string;
  address?: string;
}

export default function MapEmbed({ 
  location = "Casón Amor, Calle Vistas 2, A Coruña",
  address = "Casón Amor, A Coruña"
}: MapEmbedProps) {
  const encodedLocation = encodeURIComponent(location);
  const mapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2963.7456321!2d-8.3855!3d43.3704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s!2s${encodedLocation}!5e0!3m2!1ses!2ses!4v1629728200000`;

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
