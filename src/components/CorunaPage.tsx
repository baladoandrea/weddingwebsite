import SidebarMenu from './SidebarMenu';
import Footer from './Footer';

export default function CorunaPage() {
  return (
    <div className="coruna-page">
      <SidebarMenu />

      {/* Hero Image */}
      <section className="coruna-hero">
        <img src="/assets/imagen03.png" alt="A Coruña" className="hero-image-full" />
        <div className="hero-overlay">
          <h1>A Coruña</h1>
          <p>Tu guía de la ciudad mágica</p>
        </div>
      </section>

      {/* Where to Eat */}
      <section className="coruna-section">
        <h2>Dónde comer</h2>
        <div className="content-cards">
          <article className="recommendation-card">
            <h3>A Pulpeira de Melide</h3>
            <p>
              Para probar el auténtico pulpo a la gallega. Un lugar icónico donde la
              tradición se mantiene viva en cada plato. Una experiencia culinaria que
              no puedes perderte.
            </p>
          </article>

          <article className="recommendation-card">
            <h3>Casa Virginia</h3>
            <p>
              Especializada en platos gallegos auténticos. Prueba el caldo gallego y
              las filloas, todo hecho con amor y ingredientes de la mejor calidad.
              Un hogar en cada comida.
            </p>
          </article>
        </div>
      </section>

      {/* Where to Drink */}
      <section className="coruna-section">
        <h2>Dónde beber</h2>
        <div className="content-cards">
          <article className="recommendation-card">
            <h3>La Cervecería (La Estrella)</h3>
            <p>
              Más conocida como "la estrella", esta cervecería es una parada
              imprescindible en A Coruña. Ambiente acogedor, buenas cervezas y la
              mejor compañía.
            </p>
          </article>

          <article className="recommendation-card">
            <h3>Calle Galera</h3>
            <p>
              Repleta de buenos bares y establecimientos con auténtico ambiente
              coruñés. Ideal para disfrutar de la noche en compañía y probar la
              gastronomía local en un entorno joven y divertido.
            </p>
          </article>
        </div>
      </section>

      {/* Where to Stay */}
      <section className="coruna-section">
        <h2>Dónde alojarse</h2>
        <div className="content-cards">
          <article className="recommendation-card">
            <h3>Casa Gerardo</h3>
            <p>
              Buen anfitrión, mejor abuelo. Un lugar acogedor donde te sentirás como
              en casa. Atención personalizada y un ambiente familiar que te hará
              sentir especial desde el primer momento.
            </p>
          </article>
        </div>
      </section>

      {/* What to See */}
      <section className="coruna-section">
        <h2>Qué ver</h2>
        <div className="content-cards">
          <article className="recommendation-card">
            <h3>Estadio Municipal de Riazor</h3>
              <p>
              Hogar del Deportivo de La Coruña. Si tienes la oportunidad, presencia
              un partido en Riazor para vivir la pasión del fútbol gallego. Aunque
              con nuestra suerte... ¡derrota garantizada!
            </p>
          </article>

          <article className="recommendation-card">
            <h3>Torre de Hércules</h3>
            <p>
              El faro más antiguo del mundo en funcionamiento continuo. Mientras
              estés aquí, no te pierdas esta maravilla arquitectónica. Vistas
              espectaculares del Atlántico.
            </p>
          </article>

          <article className="recommendation-card">
            <h3>Paseo Marítimo</h3>
            <p>
              Camina por el hermoso paseo marítimo, respira el aire del mar y
              disfruta de las vistas de la Costa da Morte. Un lugar perfecto para
              reflexionar y disfrutar de la naturaleza.
            </p>
          </article>
        </div>
      </section>

      {/* Curiosity Section */}
      <section className="coruna-section curiosity-section">
        <h2>Dato curioso</h2>
        <p>
          A Coruña es una ciudad costera llena de historia, tradición y magia. Es el
          lugar donde el Atlántico abraza la tierra, donde la leyenda de Hercules se
          mezcla con la modernidad. Es el corazón de Galicia en el océano.
        </p>
      </section>

      <Footer />
    </div>
  );
}