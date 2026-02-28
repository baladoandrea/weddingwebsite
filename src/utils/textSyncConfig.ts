export type WebsitePageId = 'principal' | 'info' | 'coruna' | 'rsvp';

export interface PreviewItem {
  id: string;
  label: string;
  page: WebsitePageId;
  kind?: 'text' | 'url';
}

export const ADMIN_PREVIEW_ITEMS: PreviewItem[] = [
  { id: 'site-header-title', label: 'Global - Título cabecera', page: 'principal' },
  { id: 'site-footer-text', label: 'Global - Texto pie de página', page: 'principal' },
  { id: 'main-quote', label: 'Frase principal', page: 'principal' },
  { id: 'main-event-date-text', label: 'Principal - Fecha evento', page: 'principal' },
  { id: 'main-cta-button-text', label: 'Principal - Botón confirmar', page: 'principal' },
  { id: 'main-photo-image-url', label: 'Imagen principal', page: 'principal', kind: 'url' },
  { id: 'location-title', label: 'Título de ubicación', page: 'principal' },
  { id: 'location-city-label', label: 'Etiqueta ciudad', page: 'principal' },
  { id: 'location-city-value', label: 'Valor ciudad', page: 'principal' },
  { id: 'location-date-label', label: 'Etiqueta fecha', page: 'principal' },
  { id: 'location-date-value', label: 'Valor fecha', page: 'principal' },
  { id: 'location-time-label', label: 'Etiqueta hora', page: 'principal' },
  { id: 'location-time-value', label: 'Valor hora', page: 'principal' },
  { id: 'location-place-label', label: 'Etiqueta lugar', page: 'principal' },
  { id: 'location-place-value', label: 'Valor lugar', page: 'principal' },
  { id: 'location-address-label', label: 'Etiqueta dirección', page: 'principal' },
  { id: 'location-address-value', label: 'Valor dirección', page: 'principal' },
  { id: 'map-embed-url', label: 'URL embebida de Google Maps', page: 'principal', kind: 'url' },
  { id: 'info-hero-image-url', label: 'Info - Imagen superior', page: 'info', kind: 'url' },
  { id: 'info-map-image-url', label: 'Info - Imagen mapa', page: 'info', kind: 'url' },
  { id: 'info-howto-title', label: 'Info - Título cómo llegar', page: 'info' },
  { id: 'info-bus-title', label: 'Info - Título autobús', page: 'info' },
  { id: 'info-map-link-text', label: 'Info - Texto botón Maps', page: 'info' },
  { id: 'info-playlist-title', label: 'Info - Título playlist', page: 'info' },
  { id: 'map-directions-url', label: 'URL de Google Maps (botón)', page: 'info', kind: 'url' },
  { id: 'car-section', label: 'Cómo llegar en coche', page: 'info' },
  { id: 'bus-out-label', label: 'Etiqueta salida bus', page: 'info' },
  { id: 'bus-out-text', label: 'Texto salida bus', page: 'info' },
  { id: 'bus-return-label', label: 'Etiqueta vuelta bus', page: 'info' },
  { id: 'bus-return-text', label: 'Texto vuelta bus', page: 'info' },
  { id: 'questions-section', label: 'Sección dudas', page: 'info' },
  { id: 'gift-section', label: 'Sección regalo', page: 'info' },
  { id: 'spotify-playlist-url', label: 'URL embed de Spotify', page: 'info', kind: 'url' },
  { id: 'coruna-hero-image-url', label: 'Coruña - Imagen cabecera', page: 'coruna', kind: 'url' },
  { id: 'coruna-page-title', label: 'Coruña - Título principal', page: 'coruna' },
  { id: 'eat-section', label: 'Dónde comer', page: 'coruna' },
  { id: 'eat-section-image-url', label: 'Comer - Imagen sección', page: 'coruna', kind: 'url' },
  { id: 'eat-card-1-title', label: 'Comer - Tarjeta 1 título', page: 'coruna' },
  { id: 'eat-card-1-content', label: 'Comer - Tarjeta 1 texto', page: 'coruna' },
  { id: 'eat-card-2-title', label: 'Comer - Tarjeta 2 título', page: 'coruna' },
  { id: 'eat-card-2-content', label: 'Comer - Tarjeta 2 texto', page: 'coruna' },
  { id: 'drink-section', label: 'Dónde beber', page: 'coruna' },
  { id: 'drink-section-image-url', label: 'Beber - Imagen sección', page: 'coruna', kind: 'url' },
  { id: 'drink-card-1-title', label: 'Beber - Tarjeta 1 título', page: 'coruna' },
  { id: 'drink-card-1-content', label: 'Beber - Tarjeta 1 texto', page: 'coruna' },
  { id: 'drink-card-2-title', label: 'Beber - Tarjeta 2 título', page: 'coruna' },
  { id: 'drink-card-2-content', label: 'Beber - Tarjeta 2 texto', page: 'coruna' },
  { id: 'stay-section', label: 'Dónde alojarse', page: 'coruna' },
  { id: 'stay-section-image-url', label: 'Alojarse - Imagen sección', page: 'coruna', kind: 'url' },
  { id: 'stay-card-1-title', label: 'Alojarse - Tarjeta 1 título', page: 'coruna' },
  { id: 'stay-card-1-content', label: 'Alojarse - Tarjeta 1 texto', page: 'coruna' },
  { id: 'see-section', label: 'Qué ver', page: 'coruna' },
  { id: 'see-card-1-title', label: 'Qué ver - Tarjeta 1 título', page: 'coruna' },
  { id: 'see-card-1-content', label: 'Qué ver - Tarjeta 1 texto', page: 'coruna' },
  { id: 'see-card-2-title', label: 'Qué ver - Tarjeta 2 título', page: 'coruna' },
  { id: 'see-card-2-content', label: 'Qué ver - Tarjeta 2 texto', page: 'coruna' },
  { id: 'see-card-3-title', label: 'Qué ver - Tarjeta 3 título', page: 'coruna' },
  { id: 'see-card-3-content', label: 'Qué ver - Tarjeta 3 texto', page: 'coruna' },
  { id: 'rsvp-intro-title', label: 'RSVP - Título inicial', page: 'rsvp' },
  { id: 'rsvp-intro-text', label: 'RSVP - Texto inicial', page: 'rsvp' },
  { id: 'rsvp-attendance-title', label: 'RSVP - Título asistencia', page: 'rsvp' },
  { id: 'rsvp-attendance-option-yes-label', label: 'RSVP - Opción sí (texto visible)', page: 'rsvp' },
  { id: 'rsvp-attendance-option-yes-value', label: 'RSVP - Opción sí (valor)', page: 'rsvp' },
  { id: 'rsvp-attendance-option-kids-label', label: 'RSVP - Opción con niños (texto visible)', page: 'rsvp' },
  { id: 'rsvp-attendance-option-kids-value', label: 'RSVP - Opción con niños (valor)', page: 'rsvp' },
  { id: 'rsvp-attendance-option-no-label', label: 'RSVP - Opción no (texto visible)', page: 'rsvp' },
  { id: 'rsvp-attendance-option-no-value', label: 'RSVP - Opción no (valor)', page: 'rsvp' },
  { id: 'rsvp-search-placeholder', label: 'RSVP - Placeholder búsqueda', page: 'rsvp' },
  { id: 'rsvp-no-results-text', label: 'RSVP - Texto sin resultados', page: 'rsvp' },
  { id: 'rsvp-selected-guest-label', label: 'RSVP - Etiqueta invitado seleccionado', page: 'rsvp' },
  { id: 'rsvp-change-guest-button', label: 'RSVP - Botón cambiar invitado', page: 'rsvp' },
  { id: 'rsvp-notes-label', label: 'RSVP - Etiqueta notas', page: 'rsvp' },
  { id: 'rsvp-notes-placeholder', label: 'RSVP - Placeholder notas', page: 'rsvp' },
  { id: 'rsvp-submit-button', label: 'RSVP - Botón enviar', page: 'rsvp' },
  { id: 'rsvp-submitting-button', label: 'RSVP - Botón enviando', page: 'rsvp' },
  { id: 'rsvp-validation-alert', label: 'RSVP - Alerta validación', page: 'rsvp' },
  { id: 'rsvp-submit-error-alert', label: 'RSVP - Alerta error envío', page: 'rsvp' },
  { id: 'rsvp-success-title', label: 'RSVP - Título éxito', page: 'rsvp' },
  { id: 'rsvp-success-text', label: 'RSVP - Texto éxito', page: 'rsvp' },
  { id: 'rsvp-success-closing', label: 'RSVP - Cierre éxito', page: 'rsvp' },
  { id: 'rsvp-success-button', label: 'RSVP - Texto botón éxito', page: 'rsvp' },
  { id: 'rsvp-bottom-image-url', label: 'RSVP - Imagen inferior', page: 'rsvp', kind: 'url' },
];

export const PAGE_LABELS: Record<WebsitePageId, string> = {
  principal: 'Página Principal',
  info: 'Página Información',
  coruna: 'Página A Coruña',
  rsvp: 'Página RSVP',
};

const RESERVED_SECTION_IDS_BY_PAGE = ADMIN_PREVIEW_ITEMS.reduce((acc, item) => {
  if (!acc[item.page]) {
    acc[item.page] = [];
  }

  acc[item.page].push(item.id);
  return acc;
}, {
  principal: [] as string[],
  info: [] as string[],
  coruna: [] as string[],
  rsvp: [] as string[],
});

export const getReservedSectionIds = (page: WebsitePageId): string[] => {
  return [...RESERVED_SECTION_IDS_BY_PAGE[page]];
};

const INFO_HIDDEN_DYNAMIC_TITLES = new Set([
  'cómo llegar en autobús',
]);

export const shouldHideInfoDynamicSection = (title: string): boolean => {
  return INFO_HIDDEN_DYNAMIC_TITLES.has(title.trim().toLowerCase());
};

export const isCorunaCardSectionId = (id: string): boolean => {
  return /^(eat|drink|stay|see)-card-[^-]+-(title|content)$/.test(id);
};
