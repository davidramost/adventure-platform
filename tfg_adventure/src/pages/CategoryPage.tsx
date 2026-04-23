import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { getAllRutas } from '../services/rutaService';
import type { Ruta } from '../types';

export default function CategoryPage() {
  const { usuario, esFavorito, toggleFavorito, deleteRuta } = useAuth();
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');

  const dificultadFilter = searchParams.get('dificultad');

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const data = await getAllRutas();
        setRutas(data);
      } catch (error) {
        console.error("Error fetching rutas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRutas();
  }, []);

  const filteredRutas = rutas.filter(ruta => {
    const matchDificultad = !dificultadFilter ||
      ruta.dificultad.toLowerCase() === dificultadFilter.toLowerCase();
    const matchSearch = !search || search.length <= 3 ||
      ruta.nombre_ruta.toLowerCase().includes(search.toLowerCase()) ||
      ruta.titulo.toLowerCase().includes(search.toLowerCase()) ||
      ruta.nombre_ubicacion.toLowerCase().includes(search.toLowerCase());
    return matchDificultad && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-primary-light to-primary-dark">
        <Header transparent />
      </header>

      <main className="flex-1 bg-surface-dark">
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center px-[5%] py-6 bg-gradient-to-br from-primary-light to-primary-dark">
          <h1 className="text-white text-lg font-bold m-0 leading-9 w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
            Nuestra selección de rutas
          </h1>
          <div className="flex items-center bg-[#555] rounded overflow-hidden mx-auto md:mx-0">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none text-white px-4 py-2.5 text-sm w-[150px] outline-none placeholder:text-[#aaa]"
            />
            <button className="bg-transparent border-none text-white px-4 py-2.5 cursor-pointer hover:text-gray-300">
              <img src="/Img/Icons/search.png" alt="Buscar" className="w-[25px] h-[25px] align-middle" />
            </button>
          </div>
        </div>

        {/* Route list */}
        <section>
          {loading ? (
            <p className="text-white text-center py-8">Cargando rutas...</p>
          ) : filteredRutas.length > 0 ? (
            filteredRutas.map(ruta => (
              <article key={ruta.id_ruta} className="block bg-surface border-b-2 border-[#333] relative">
                <Link
                  to={`/ruta/${ruta.id_ruta}`}
                  className="flex flex-col md:flex-row w-full no-underline text-inherit pr-0 md:pr-[50px] hover:bg-[#555] transition-colors"
                >
                  {/* Image */}
                  <div className="w-full md:w-[280px] shrink-0">
                    {ruta.imagen_url ? (
                      <img
                        src={ruta.imagen_url}
                        alt="Imagen ruta"
                        className="w-full md:w-[280px] h-[180px] md:h-[120px] object-cover block"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-[120px] bg-primary">
                        <img src="/Img/Icons/sin-imagen.png" alt="Sin foto" className="w-[50px] h-[50px] opacity-40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 md:p-6">
                    <h2 className="text-white text-base font-bold m-0 mb-1">{ruta.nombre_ruta}</h2>
                    <p className="text-[#bbb] text-[13px] m-0 mb-2">{ruta.nombre_ubicacion}</p>
                    <div className="text-[#ddd] text-[13px] flex flex-wrap gap-1 items-center">
                      <span className="flex items-center gap-1">
                        <img src="/Img/Icons/star.png" alt="Estrella" className="w-4 h-4 align-middle" />
                        {(ruta.media_puntuacion ?? 0).toFixed(1)}
                      </span>
                      <span>• {ruta.duracion_estimada}</span>
                      <span>• {ruta.distancia_km}km</span>
                    </div>
                  </div>
                </Link>

                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorito(ruta.id_ruta)}
                  className="absolute top-1/2 right-5 -translate-y-1/2 md:block bg-transparent border-none cursor-pointer p-0
                             md:top-1/2 top-4 right-4 translate-y-0 md:-translate-y-1/2"
                >
                  <img
                    src={esFavorito(ruta.id_ruta) ? '/Img/Icons/favorito_solid.png' : '/Img/Icons/favourite.png'}
                    alt="Favorito"
                    className="w-[30px] h-[30px]"
                  />
                </button>

                {/* Admin delete */}
                {usuario?.rol === 'admin' && (
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de que quieres eliminar esta ruta?')) {
                        deleteRuta(ruta.id_ruta);
                      }
                    }}
                    className="absolute top-2.5 left-2.5 z-10 bg-transparent border-none cursor-pointer p-0"
                  >
                    <img src="/Img/Icons/delete.png" alt="Eliminar" title="Eliminar ruta" className="w-6 h-6" />
                  </button>
                )}
              </article>
            ))
          ) : (
            <p className="text-white text-center py-8">No hay rutas disponibles actualmente.</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
