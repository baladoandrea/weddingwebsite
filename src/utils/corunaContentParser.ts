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

  const markerRegex = /(^|[.!?]\s+)([^:\n]{2,80}):\s*/g;
  const markerPositions: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = markerRegex.exec(normalized)) !== null) {
    const separator = match[1] || '';
    markerPositions.push(match.index + separator.length);
  }

  if (markerPositions.length <= 1) {
    return [normalized];
  }

  const parts: string[] = [];
  for (let index = 0; index < markerPositions.length; index += 1) {
    const start = markerPositions[index];
    const end = markerPositions[index + 1] ?? normalized.length;
    const segment = normalized.slice(start, end).trim();
    if (segment) {
      parts.push(segment);
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
