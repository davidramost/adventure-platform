import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function GalleryPage() {
  const { rutas } = useAuth();
  const [current, setCurrent] = useState(0);
  const rutasConImagen = rutas.filter(r => r.imagen_url);

  const nextSlide = useCallback(() => {
    setCurrent(prev => (prev + 1) % rutasConImagen.length);
  }, [rutasConImagen.length]);

  const prevSlide = () => {
    setCurrent(prev => (prev - 1 + rutasConImagen.length) % rutasConImagen.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 3500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-primary-light to-primary-dark">
        <Header transparent />
      </header>

      {/* Title */}
      <section className="bg-gradient-to-br from-primary-light to-primary-dark py-8 text-center">
        <h1
          className="text-white text-[40px] font-bold tracking-[8px] uppercase m-0"
          style={{ fontFamily: 'var(--font-display)', fontStretch: 'condensed' }}
        >
          GALERÍA DE RUTAS
        </h1>
      </section>

      <main>
        <section className="bg-gradient-to-br from-primary-light to-primary-dark py-12">
          <div className="mx-auto px-[5%]">
            {/* Swiper-like carousel */}
            {rutasConImagen.length > 0 && (
              <div className="relative w-full h-[60vh] mt-5">
                {/* Slides */}
                {rutasConImagen.map((ruta, index) => (
                  <div
                    key={ruta.id_ruta}
                    className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                  >
                    <Link
                      to={`/ruta/${ruta.id_ruta}`}
                      className="block w-full h-full rounded-2xl overflow-hidden relative"
                    >
                      <img
                        src={ruta.imagen_url}
                        alt={ruta.nombre_ruta}
                        className="w-full h-full object-cover brightness-[0.8] hover:brightness-100 transition-[filter] duration-300"
                      />
                      <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white py-5 text-center">
                        <h3 className="m-0 text-2xl font-bold">{ruta.nombre_ruta}</h3>
                      </div>
                    </Link>
                  </div>
                ))}

                {/* Navigation buttons */}
                <button
                  onClick={prevSlide}
                  aria-label="Diapositiva anterior"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 
                             w-12 h-12 rounded-full bg-black/40 text-white text-2xl border-none cursor-pointer
                             hover:bg-black/60 transition-colors flex items-center justify-center"
                >
                  ‹
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Diapositiva siguiente"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 
                             w-12 h-12 rounded-full bg-black/40 text-white text-2xl border-none cursor-pointer
                             hover:bg-black/60 transition-colors flex items-center justify-center"
                >
                  ›
                </button>


              </div>
            )}

            {/* Dots */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {rutasConImagen.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Ir a imagen ${index + 1}`}
                  className={`w-3 h-3 rounded-full border-none cursor-pointer transition-colors ${index === current ? 'bg-white' : 'bg-white/40'
                    }`}
                />
              ))}
            </div>

            <nav className="mt-8 text-center">
              <Link
                to="/senderos"
                className="text-white no-underline text-lg hover:text-gray-300 transition-colors"
              >
                Volver al listado
              </Link>
            </nav>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
