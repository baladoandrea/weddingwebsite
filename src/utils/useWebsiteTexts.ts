import { useEffect, useState } from 'react';
import textsData from '../data/texts.json';

interface Section {
  id: string;
  title: string;
  content: string;
  page: string;
  order?: number;
}

export default function useWebsiteTexts() {
  const [sections, setSections] = useState<Section[]>([...textsData]);

  useEffect(() => {
    const loadTexts = async () => {
      try {
        const response = await fetch(`/api/texts?ts=${Date.now()}`, {
          cache: 'no-store',
        });
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setSections(data);
        }
      } catch (error) {
        console.error('Error loading website texts:', error);
      }
    };

    loadTexts();
  }, []);

  const getText = (id: string, fallback: string): string => {
    const section = sections.find(item => item.id === id);
    return section?.content || fallback;
  };

  const getSection = (
    id: string,
    fallback: Pick<Section, 'title' | 'content' | 'page'>
  ): Section => {
    const section = sections.find(item => item.id === id);
    if (section) {
      return section;
    }

    return {
      id,
      title: fallback.title,
      content: fallback.content,
      page: fallback.page,
    };
  };

  const getTitle = (id: string, fallback: string): string => {
    const section = sections.find(item => item.id === id);
    return section?.title || fallback;
  };

  const getCustomSections = (page: string, excludedIds: string[] = []): Section[] => {
    const excludedSet = new Set(excludedIds);

    return sections.filter(section => section.page === page && !excludedSet.has(section.id));
  };

  const getSectionsByPage = (page: string): Section[] => {
    return sections.filter(section => section.page === page);
  };

  return { getText, getTitle, getSection, getCustomSections, getSectionsByPage };
}
