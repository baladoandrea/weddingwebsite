export const availableTags = ['ceremonia', 'aperitivo', 'convite', 'momentos', 'playa'];

export const normalizeTag = (tag: string): string => {
  return tag
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const validateTags = (tags: string[]): boolean => {
  return tags.every(tag => availableTags.includes(normalizeTag(tag)));
};

export const sanitizeTags = (tags: string[]): string[] => {
  return tags
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0 && availableTags.includes(normalizeTag(tag)));
};

export const getTagColor = (tag: string): string => {
  const colors: Record<string, string> = {
    ceremonia: '#006B8E',
    aperitivo: '#FF6B9D',
    convite: '#FFD966',
    momentos: '#70AD47',
    playa: '#4DB8FF',
  };

  return colors[normalizeTag(tag)] || '#999999';
};

export const getTagEmoji = (tag: string): string => {
  // Emojis removed per design preference; return empty string
  return '';
};

export const filterByTag = <T extends { tags: string[] }>(items: T[], tag: string): T[] => {
  const normalizedTag = normalizeTag(tag);
  return items.filter(item =>
    item.tags.some(t => normalizeTag(t) === normalizedTag)
  );
};

export const getPopularTags = <T extends { tags: string[] }>(items: T[]): string[] => {
  const tagCount: Record<string, number> = {};

  items.forEach(item => {
    item.tags.forEach(tag => {
      const normalized = normalizeTag(tag);
      tagCount[normalized] = (tagCount[normalized] || 0) + 1;
    });
  });

  return Object.keys(tagCount)
    .sort((a, b) => tagCount[b] - tagCount[a])
    .slice(0, 5);
};
