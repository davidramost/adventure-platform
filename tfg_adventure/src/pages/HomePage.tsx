import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from '../components/Image';
import GallerySlider from '../components/GallerySlider';
import GeneralChat from '../components/GeneralChat';
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

                <div className="relative px-6 py-12 lg:py-16 lg:px-12">

                    <div
                        className="flex flex-col lg:flex-row items-center justify-between px-0 lg:px-8 overflow-hidden">
                        {/* Activity icons */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8 lg:mb-0">
                            {[
                                { icon: '/Img/Icons/person.png', label: 'Senderismo' },
                                { icon: '/Img/Icons/camping.png', label: 'Camping' },
                                { icon: '/Img/Icons/ciclismo.png', label: 'Ciclismo' },
                                { icon: '/Img/Icons/esqui.png', label: 'Esquí' },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    aria-label={item.label}
                                    className="w-[70px] h-[70px] border-2 border-white rounded-xl flex items-center justify-center"
                                >
                                    <img
                                        src={item.icon}
                                        alt=""
                                        aria-hidden="true"
                                        className="w-10 h-10"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Description text */}
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <p className="text-white text-sm leading-[1.8] mb-6">
                                Amante de la naturaleza y con ganas de conocer las grandes maravillas que te entrega
                                este país,
                                en este lugar encontrarás las mejores rutas, datos y todo lo necesario para tu próxima
                                aventura.
                            </p>
                            <Link
                                to="/senderos"
                                className="inline-flex items-center text-white no-underline border-2 border-white
                           px-6 py-3 rounded-full text-sm font-medium
                           hover:bg-white hover:text-primary-dark transition-colors group"
                            >
                                Descubre más
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="ml-2 group-hover:translate-x-1 transition-transform">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
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
                            Cuando uno ama algo lo respeta, si tu amor es por la naturaleza valorarás el medio ambiente
                            en el que
                            vivimos, los animales, las plantas, todo aquello que hace posible la vida en este planeta.
                        </p>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden group">
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full block brightness-[0.7] group-hover:brightness-[0.85] transition-[filter] duration-500"
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

                {/* Gallery slider section */}
                <GallerySlider rutas={rutas} />

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
                                <Image
                                    src={trail.img}
                                    alt={`Senderismo nivel ${trail.level.toLowerCase()}`}
                                    containerClassName="w-full h-[350px] rounded-2xl"
                                    className="w-full h-[350px] object-cover block rounded-2xl brightness-[0.7]
                             group-hover:brightness-90 group-hover:scale-105 transition-[filter,transform] duration-500"
                                />
                                <span
                                    className="absolute top-[5%] left-[5%] bg-black/60 text-white px-5 py-2 rounded-full text-xs font-medium">
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
                {/* Chat general */}
                <div className="px-[5%] pb-8">
                    <GeneralChat />
                </div>
            </main>

            <Footer />
        </div>
    );
}
