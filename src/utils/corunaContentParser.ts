export interface CorunaCard {
  title: string;
  content: string;
}

const splitCardCandidates = (rawContent: string): string[] => {
  const normalized = rawContent.replace(/\r/g, '').trim();
  if (!normalized) {
    return [];
  }

  const lines = normalized
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return lines;
  }

  const markerMatches = normalized.match(/[^:\n]+:\s*/g) || [];
  if (markerMatches.length <= 1) {
    return [normalized];
  }

  const parts: string[] = [];
  let cursor = 0;

  for (let index = 0; index < markerMatches.length; index += 1) {
    const marker = markerMatches[index];
    const markerIndex = normalized.indexOf(marker, cursor);
    if (markerIndex === -1) {
      continue;
    }

    if (index > 0) {
      const segment = normalized.slice(cursor, markerIndex).trim();
      if (segment) {
        parts.push(segment);
      }
    }

    cursor = markerIndex;

    if (index === markerMatches.length - 1) {
      const lastSegment = normalized.slice(cursor).trim();
      if (lastSegment) {
        parts.push(lastSegment);
      }
    }
  }

  return parts.length > 0 ? parts : [normalized];
};

export const parseCorunaCards = (rawContent: string, fallbackTitle: string): CorunaCard[] => {
  const candidates = splitCardCandidates(rawContent);
  const cards = candidates
    .map(candidate => {
      const parts = candidate.split(/:(.+)/).map(value => value.trim());
      if (parts.length < 2 || !parts[0] || !parts[1]) {
        return null;
      }

      return {
        title: parts[0],
        content: parts[1],
      };
    })
    .filter((card): card is CorunaCard => card !== null);

  if (cards.length > 0) {
    return cards;
  }

  const fallbackContent = rawContent.trim();
  if (!fallbackContent) {
    return [];
  }

  return [{
    title: fallbackTitle,
    content: fallbackContent,
  }];
};
