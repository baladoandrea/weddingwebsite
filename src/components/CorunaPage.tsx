import Header from './Header';
import Footer from './Footer';
import useWebsiteTexts from '../utils/useWebsiteTexts';
import { getReservedSectionIds, isCorunaCardSectionId } from '../utils/textSyncConfig';

interface CardSeed {
  key: string;
  titleFallback: string;
  contentFallback: string;
}

export default function CorunaPage() {
  const { getSection, getText, getCustomSections, getSectionsByPage } = useWebsiteTexts();
  const corunaSections = getSectionsByPage('coruna');
  const eatSection = getSection('eat-section', {
    title: 'Dónde comer',
    content: 'A Pulpeira de Melide: No puedes irte de A Coruña sin probar el pulpo a feira.\nCasa Virginia: Cocina de gran calidad, con platos tradicionales hechos con cariño.',
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
  const customSections = getCustomSections('coruna', getReservedSectionIds('coruna'))
    .filter(section => !isCorunaCardSectionId(section.id));
  const corunaPageTitle = getText('coruna-page-title', 'A Coruña');
  const corunaHeroImageUrl = getText('coruna-hero-image-url', '/assets/imagen03.png');
  const eatSectionImageUrl = getText('eat-section-image-url', '/assets/imagen05.png');
  const drinkSectionImageUrl = getText('drink-section-image-url', '/assets/imagen06.png');
  const staySectionImageUrl = getText('stay-section-image-url', '/assets/alojamiento.png');
  const eatCardOneTitle = getText('eat-card-1-title', 'A Pulpeira de Melide');
  const eatCardOneContent = getText('eat-card-1-content', 'Para un pulpiño á feira.');
  const eatCardTwoTitle = getText('eat-card-2-title', 'Casa Virginia');
  const eatCardTwoContent = getText('eat-card-2-content', 'Recomendado el caldo y las filloas. Todo hecho con amor.');
  const drinkCardOneTitle = getText('drink-card-1-title', 'La Cervecería');
  const drinkCardOneContent = getText('drink-card-1-content', 'Más conocida como LA ESTRELLA, parada imprescindible.');
  const drinkCardTwoTitle = getText('drink-card-2-title', 'Calle Galera');
  const drinkCardTwoContent = getText('drink-card-2-content', 'Repleta de buenos bares.');
  const seeCardOneTitle = getText('see-card-1-title', 'Estadio de Riazor');
  const seeCardOneContent = getText('see-card-1-content', 'Hogar del Deportivo de La Coruña. Si tienes la oportunidad, ve a un partido del depor, derrota garantizada.');
  const seeCardTwoTitle = getText('see-card-2-title', 'Torre de Hércules');
  const seeCardTwoContent = getText('see-card-2-content', 'El faro más antiguo del mundo en funcionamiento. Vistas espectaculares del Atlántico.');
  const seeCardThreeTitle = getText('see-card-3-title', 'Paseo Marítimo');
  const seeCardThreeContent = getText('see-card-3-content', 'Camina por el hermoso paseo marítimo, respira el aire del mar y disfruta de las vistas.');

  const getCardsByPrefix = (prefix: 'eat' | 'drink' | 'stay' | 'see', seeds: CardSeed[]) => {
    const keySet = new Set(seeds.map(seed => seed.key));
    const regex = new RegExp(`^${prefix}-card-([^-]+)-title$`);

    for (const section of corunaSections) {
      const match = section.id.match(regex);
      if (match?.[1]) {
        keySet.add(match[1]);
      }
    }

    const seedByKey = new Map(seeds.map(seed => [seed.key, seed]));

    return Array.from(keySet)
      .sort((left, right) => {
        const leftNumber = Number(left);
        const rightNumber = Number(right);
        const leftIsNumber = Number.isFinite(leftNumber);
        const rightIsNumber = Number.isFinite(rightNumber);

        if (leftIsNumber && rightIsNumber) {
          return leftNumber - rightNumber;
        }

        if (leftIsNumber) {
          return -1;
        }

        if (rightIsNumber) {
          return 1;
        }

        return left.localeCompare(right);
      })
      .map(key => {
        const seed = seedByKey.get(key);
        const titleId = `${prefix}-card-${key}-title`;
        const contentId = `${prefix}-card-${key}-content`;

        return {
          key,
          title: getText(titleId, seed?.titleFallback || 'Nueva tarjeta'),
          content: getText(contentId, seed?.contentFallback || ''),
        };
      })
      .filter(card => card.title.trim() || card.content.trim());
  };

  const eatCards = getCardsByPrefix('eat', [
    { key: '1', titleFallback: eatCardOneTitle, contentFallback: eatCardOneContent },
    { key: '2', titleFallback: eatCardTwoTitle, contentFallback: eatCardTwoContent },
  ]);

  const drinkCards = getCardsByPrefix('drink', [
    { key: '1', titleFallback: drinkCardOneTitle, contentFallback: drinkCardOneContent },
    { key: '2', titleFallback: drinkCardTwoTitle, contentFallback: drinkCardTwoContent },
  ]);

  const stayCards = getCardsByPrefix('stay', [
    {
      key: '1',
      titleFallback: getText('stay-card-1-title', 'Casa Gerardo'),
      contentFallback: getText('stay-card-1-content', 'Buen anfitrión, mejor abuelo.'),
    },
  ]);

  const seeCards = getCardsByPrefix('see', [
    { key: '1', titleFallback: seeCardOneTitle, contentFallback: seeCardOneContent },
    { key: '2', titleFallback: seeCardTwoTitle, contentFallback: seeCardTwoContent },
    { key: '3', titleFallback: seeCardThreeTitle, contentFallback: seeCardThreeContent },
  ]);

  return (
    <div className="coruna-page">
      <Header />

      {/* Hero Mejorado */}
      <section className="coruna-hero">
        <img src={corunaHeroImageUrl} alt="A Coruña" className="coruna-hero-img" />
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
        {corunaPageTitle}
      </h1>

      {/* Where to Eat */}
      <section className="coruna-section">
        <h2>{eatSection.title}</h2>
        <img src={eatSectionImageUrl} alt="Dónde comer" className="section-image" />
        <div className="content-cards">
          {eatCards.map(card => (
            <article key={`${eatSection.id}-${card.key}`} className="recommendation-card">
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Where to Drink */}
      <section className="coruna-section">
        <h2>{drinkSection.title}</h2>
        <img src={drinkSectionImageUrl} alt="Dónde beber" className="section-image" />
        <div className="content-cards">
          {drinkCards.map(card => (
            <article key={`${drinkSection.id}-${card.key}`} className="recommendation-card">
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Where to Stay */}
      <section className="coruna-section">
        <h2>{staySection.title}</h2>
        <img src={staySectionImageUrl} alt="Dónde alojarse" className="section-image" />
        <div className="content-cards">
          {stayCards.map(card => (
            <article key={`${staySection.id}-${card.key}`} className="recommendation-card">
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
          {seeCards.map(card => (
            <article key={`${seeSection.id}-${card.key}`} className="recommendation-card">
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