import Header from './Header';
import Footer from './Footer';
import useWebsiteTexts from '../utils/useWebsiteTexts';

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
  const customSections = getCustomSections('coruna', [
    'eat-section',
    'drink-section',
    'stay-section',
    'see-section',
  ]);

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
          <article className="recommendation-card">
            <p>{eatSection.content}</p>
          </article>
        </div>
      </section>

      {/* Where to Drink */}
      <section className="coruna-section">
        <h2>{drinkSection.title}</h2>
        <img src="/assets/imagen06.png" alt="Dónde beber" className="section-image" />
        <div className="content-cards">
          <article className="recommendation-card">
            <p>{drinkSection.content}</p>
          </article>
        </div>
      </section>

      {/* Where to Stay */}
      <section className="coruna-section">
        <h2>{staySection.title}</h2>
        <img src="/assets/alojamiento.png" alt="Dónde alojarse" className="section-image" />
        <div className="content-cards">
          <article className="recommendation-card">
            <p>{staySection.content}</p>
          </article>
        </div>
      </section>

      {/* What to See */}
      <section className="coruna-section">
        <h2>{seeSection.title}</h2>
        <div className="content-cards">
          <article className="recommendation-card">
            <p>{seeSection.content}</p>
          </article>
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