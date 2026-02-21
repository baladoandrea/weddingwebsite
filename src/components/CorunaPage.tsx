import Header from './Header';
import Footer from './Footer';
import useWebsiteTexts from '../utils/useWebsiteTexts';

export default function CorunaPage() {
  const { getText } = useWebsiteTexts();

  return (
    <div className="coruna-page">
      <Header />

      {/* Hero Mejorado */}
      <section className="coruna-hero">
        <img src="/assets/imagen03.png" alt="A Coruña" className="coruna-hero-img" />
        <h2 className="coruna-title">A Coruña</h2>
      </section>

      {/* Where to Eat */}
      <section className="coruna-section">
        <h2>Dónde comer</h2>
        <img src="/assets/imagen05.png" alt="Dónde comer" className="section-image" />
        <div className="content-cards">
          <article className="recommendation-card">
            <h3>A Pulpeira de Melide</h3>
            <p>
            {getText('eat-section', 'No puedes irte de A Coruña sin probar el pulpo a feira.')}
            </p>
          </article>

          <article className="recommendation-card">
            <h3>Casa Virginia</h3>
            <p>
              Cocina de la mejor calidad. Recomendado el caldo gallego y
              las filloas, todo hecho con amor y dedicación.
            </p>
          </article>
        </div>
      </section>

      {/* Where to Drink */}
      <section className="coruna-section">
        <h2>Dónde beber</h2>
        <img src="/assets/imagen06.png" alt="Dónde beber" className="section-image" />
        <div className="content-cards">
          <article className="recommendation-card">
            <h3>La Cervecería</h3>
            <p>
              {getText('drink-section', 'Más conocida como la estrella, esta cervecería es una parada imprescindible en A Coruña.')}
            </p>
          </article>

          <article className="recommendation-card">
            <h3>Calle Galera</h3>
            <p>
              Repleta de buenos bares y establecimientos con auténtico ambiente
              coruñés. Ideal para disfrutar de la noche en compañía y probar la
              gastronomía local.
            </p>
          </article>
        </div>
      </section>

      {/* Where to Stay */}
      <section className="coruna-section">
        <h2>Dónde alojarse</h2>
        <img src="/assets/alojamiento.png" alt="Dónde alojarse" className="section-image" />
        <div className="content-cards">
          <article className="recommendation-card">
            <h3>Casa Gerardo</h3>
            <p>
              {getText('stay-section', ' Buen anfitrión, mejor abuelo. Un lugar acogedor donde te sentirás como\nen casa. Atención personalizada y un ambiente familiar.')}
            </p>
          </article>
        </div>
      </section>

      {/* What to See */}
      <section className="coruna-section">
        <h2>Qué ver</h2>
        <div className="content-cards">
          <article className="recommendation-card">
            <h3>Estadio de Riazor</h3>
              <p>
              {getText('see-section', 'Hogar del Deportivo de La Coruña. Si tienes la oportunidad, ve a un partido del depor, derrota garantizada.')}
            </p>
          </article>

          <article className="recommendation-card">
            <h3>Torre de Hércules</h3>
            <p>
              El faro más antiguo del mundo en funcionamiento. Vistas
              espectaculares del Atlántico.
            </p>
          </article>

          <article className="recommendation-card">
            <h3>Paseo Marítimo</h3>
            <p>
              Camina por el hermoso paseo marítimo, respira el aire del mar y
              disfruta de las vistas.
            </p>
          </article>
        </div>
      </section>



      <Footer />
    </div>
  );
}