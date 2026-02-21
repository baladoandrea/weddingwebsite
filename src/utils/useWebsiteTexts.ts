import { useEffect, useState } from 'react';
import textsData from '../data/texts.json';

interface Section {
  id: string;
  title: string;
  content: string;
  page: string;
}

export default function useWebsiteTexts() {
  const [sections, setSections] = useState<Section[]>([...textsData]);

  useEffect(() => {
    const loadTexts = async () => {
      try {
        const response = await fetch('/api/texts');
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

  return { getText };
}
