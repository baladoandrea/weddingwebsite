import Header from './Header';
import Footer from './Footer';
import useWebsiteTexts from '../utils/useWebsiteTexts';
import { getReservedSectionIds } from '../utils/textSyncConfig';

interface CorunaCard {
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

  return normalized
    .split(/(?<=\.)\s+(?=[^:\n]+:\s*)/)
    .map(part => part.trim())
    .filter(Boolean);
};

const parseCardsFromSection = (rawContent: string, fallbackTitle: string): CorunaCard[] => {
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

export default function CorunaPage() {
  const { getSection, getCustomSections } = useWebsiteTexts();
  const eatSection = getSection('eat-section', {
    title: 'Dónde comer',
    content: 'No puedes irte de A Coruña sin probar el pulpo a feira.',
    page: 'coruna',
  });
  const drinkSection = getSection('drink-section', {
    title: 'Dónde beber',
    content: 'Más conocida como la estrella, esta cervecería es una parada imprescindible en A Coruña.',
    page: 'coruna',
  });
  const staySection = getSection('stay-section', {
    title: 'Dónde alojarse',
    content: 'Buen anfitrión, mejor abuelo. Un lugar acogedor donde te sentirás como en casa. Atención personalizada y un ambiente familiar.',
    page: 'coruna',
  });
  const seeSection = getSection('see-section', {
    title: 'Qué ver',
    content: 'Hogar del Deportivo de La Coruña. Si tienes la oportunidad, ve a un partido del depor, derrota garantizada.',
    page: 'coruna',
  });
  const customSections = getCustomSections('coruna', getReservedSectionIds('coruna'));
  const eatCards = parseCardsFromSection(eatSection.content, eatSection.title);
  const drinkCards = parseCardsFromSection(drinkSection.content, drinkSection.title);
  const stayCards = parseCardsFromSection(staySection.content, staySection.title);
  const seeCards = parseCardsFromSection(seeSection.content, seeSection.title);

  return (
    <div className="coruna-page">
      <Header />

      {/* Hero Mejorado */}
      <section className="coruna-hero">
        <img src="/assets/imagen03.png" alt="A Coruña" className="coruna-hero-img" />
      </section>
      <h1
        className="coruna-title"
        style={{
          position: 'static',
          color: '#041E42',
          textAlign: 'right',
          margin: '12px auto 0',
          width: 'min(100%, 1100px)',
          textShadow: 'none',
          padding: '0 8px',
        }}
      >
        A Coruña
      </h1>

      {/* Where to Eat */}
      <section className="coruna-section">
        <h2>{eatSection.title}</h2>
        <img src="/assets/imagen05.png" alt="Dónde comer" className="section-image" />
        <div className="content-cards">
          {eatCards.map((card, index) => (
            <article key={`${eatSection.id}-${index}`} className="recommendation-card">
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Where to Drink */}
      <section className="coruna-section">
        <h2>{drinkSection.title}</h2>
        <img src="/assets/imagen06.png" alt="Dónde beber" className="section-image" />
        <div className="content-cards">
          {drinkCards.map((card, index) => (
            <article key={`${drinkSection.id}-${index}`} className="recommendation-card">
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Where to Stay */}
      <section className="coruna-section">
        <h2>{staySection.title}</h2>
        <img src="/assets/alojamiento.png" alt="Dónde alojarse" className="section-image" />
        <div className="content-cards">
          {stayCards.map((card, index) => (
            <article key={`${staySection.id}-${index}`} className="recommendation-card">
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </article>
          ))}
        </div>
      </section>

      {/* What to See */}
      <section className="coruna-section">
        <h2>{seeSection.title}</h2>
        <div className="content-cards">
          {seeCards.map((card, index) => (
            <article key={`${seeSection.id}-${index}`} className="recommendation-card">
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </article>
          ))}
        </div>
      </section>

      {customSections.map(section => (
        <section key={section.id} className="coruna-section dynamic-section">
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </section>
      ))}



      <Footer />
    </div>
  );
}