import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { rutas } = useAuth();

  const rutaBaja = rutas.find(r => r.dificultad === 'Baja');
  const rutaMedia = rutas.find(r => r.dificultad === 'Media');
  const rutaAlta = rutas.find(r => r.dificultad === 'Alta');

  const trails = [
    {
      level: 'Bajo',
      dificultad: 'baja',
      title: rutaBaja?.titulo || 'EL DESPERTAR',
      distance: `${rutaBaja?.distancia_km || 6}KM`,
      img: rutaBaja?.imagen_url || '/Img/mountain_list_5.jpg',
    },
    {
      level: 'Medio',
      dificultad: 'media',
      title: rutaMedia?.titulo || 'LA MAÑANA',
      distance: `${rutaMedia?.distancia_km || 13}KM`,
      img: rutaMedia?.imagen_url || '/Img/mountain_list_2.jpg',
    },
    {
      level: 'Alto',
      dificultad: 'alta',
      title: rutaAlta?.titulo || 'LA CIMA',
      distance: `${rutaAlta?.distancia_km || 27}KM`,
      img: rutaAlta?.imagen_url || '/Img/mountain_list_3.jpg',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== HEADER / PORTADA ===== */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary-light to-primary-dark">
        <Header transparent />

        <div className="relative px-6 pt-8 pb-16 lg:px-12">
          <h1
            className="text-center text-white text-4xl md:text-[64px] my-4 font-bold tracking-[8px] uppercase"
            style={{ fontFamily: 'var(--font-display)', fontStretch: 'condensed' }}
          >
            AVENTURA
          </h1>

          <div className="flex flex-col lg:flex-row items-center justify-between mt-8 lg:mt-12 px-0 lg:px-8 overflow-hidden">
            {/* Activity icons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 lg:mt-12 mb-8 lg:mb-0">
              {[
                { icon: '/Img/Icons/person.png', label: 'Senderismo' },
                { icon: '/Img/Icons/camping.png', label: 'Camping' },
                { icon: '/Img/Icons/ciclismo.png', label: 'Ciclismo' },
                { icon: '/Img/Icons/esqui.png', label: 'Esquí' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="w-[70px] h-[70px] border-2 border-white rounded-xl flex items-center justify-center 
                             hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-10 h-10 group-hover:scale-110 transition-transform"
                  />
                </div>
              ))}
            </div>

            {/* Description text */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <p className="text-white text-sm leading-[1.8] mb-6">
                Amante de la naturaleza y con ganas de conocer las grandes maravillas que te entrega este país,
                en este lugar encontrarás las mejores rutas, datos y tod...
              </p>
              <Link
                to="/senderos"
                className="inline-flex items-center text-white no-underline border-2 border-white 
                           px-6 py-3 rounded-full text-sm font-medium
                           hover:bg-white hover:text-primary-dark transition-colors group"
              >
                Descubre más
                <img
                  src="/Img/Icons/arrow_right.png"
                  alt="Flecha"
                  className="w-[30px] h-[30px] ml-2 invert group-hover:invert-0 transition-all group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="py-16 px-[5%]">
        {/* Info Section */}
        <section className="flex flex-col lg:flex-row items-center py-8 lg:py-16 gap-8">
          <div className="lg:w-1/2 lg:pr-8 text-center lg:text-left">
            <h2 className="text-primary-dark text-3xl md:text-5xl leading-tight mb-6 font-bold">
              Aventura<br />en la naturaleza
            </h2>
            <p className="text-secondary text-sm leading-[1.8] mb-6">
              Cuando uno ama algo lo respeta, si tu amor es por la naturaleza valorarás el medio ambiente en el que
              vivimos, los animales, las plantas, todo aquello que hace posible la vida en este planeta.
            </p>
            <Link
              to="/senderos"
              className="inline-flex items-center text-primary-dark no-underline text-lg font-medium
                         hover:text-primary-light transition-colors group"
            >
              Ver catálogo
              <span className="ml-3 w-8 h-8 rounded-full bg-primary-dark flex items-center justify-center
                              group-hover:bg-primary-light group-hover:translate-x-1 transition-all">
                <img
                  src="/Img/Icons/arrow_right.png"
                  alt="Flecha"
                  className="w-5 h-5 invert"
                />
              </span>
            </Link>
          </div>

          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden group">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full block brightness-[0.7] group-hover:brightness-[0.85] transition-all duration-500"
              >
                <source src="/Img/mountain_video.mp4" type="video/mp4" />
                Tu navegador no soporta video HTML5.
              </video>
              <div className="absolute bottom-6 left-6 flex items-center text-white">
                <img
                  src="/Img/Icons/button_play.png"
                  alt="Play"
                  className="w-[50px] h-[50px] mr-3"
                />
                <span className="text-sm leading-snug">
                  Aventura todos los días<br />
                  <span className="text-xs text-gray-300">En los mejores recorridos</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Trail cards section */}
        <section className="py-8 lg:py-16 text-center">
          <h2 className="text-primary-dark text-2xl md:text-3xl font-bold mb-10">
            Selecciona tu ruta por niveles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trails.map((trail) => (
              <Link
                key={trail.level}
                to={`/senderos?dificultad=${trail.dificultad}`}
                className="relative inline-block rounded-2xl overflow-hidden no-underline group"
              >
                <img
                  src={trail.img}
                  alt={`Senderismo nivel ${trail.level.toLowerCase()}`}
                  className="w-full h-[350px] object-cover block rounded-2xl brightness-[0.7]
                             group-hover:brightness-90 group-hover:scale-105 transition-all duration-500"
                />
                <span className="absolute top-[5%] left-[5%] bg-black/60 text-white px-5 py-2 rounded-full text-xs font-medium">
                  Nivel {trail.level}
                </span>
                <div className="absolute bottom-6 left-6 text-left text-white">
                  <h3 className="m-0 mb-1 text-base font-bold">{trail.title}</h3>
                  <span className="text-sm text-gray-300">{trail.distance}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
