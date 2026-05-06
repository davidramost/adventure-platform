import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from '../components/Image';
import { useAuth } from '../context/AuthContext';
import { getAllRutas } from '../services/rutaService';
import type { Ruta } from '../types';

export default function CategoryPage() {
  const navigate = useNavigate();
  const { usuario, esFavorito, toggleFavorito, deleteRuta } = useAuth();
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeDif, setActiveDif] = useState(searchParams.get('dificultad') ?? '');

  const dificultades = ['', 'baja', 'media', 'alta'];
  const dificultadLabels: Record<string, string> = { '': 'Todas', baja: 'Baja', media: 'Media', alta: 'Alta' };
  const difficultyColor: Record<string, string> = {
    baja: 'bg-green-500/25 text-green-300 border-green-500/40',
    media: 'bg-yellow-500/25 text-yellow-300 border-yellow-500/40',
    alta: 'bg-red-500/25 text-red-300 border-red-500/40',
  };

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
    const matchDificultad = !activeDif ||
      ruta.dificultad.toLowerCase() === activeDif.toLowerCase();
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

      <main className="flex-1 bg-gradient-to-br from-primary-light to-primary-dark">

        {/* ── HERO ───────────────────────────────────────────────── */}
        <div className="px-[5%] pt-14 pb-12 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Senderos
          </h1>
          <p className="text-gray-300 text-base mb-8">
            Descubre las mejores rutas de senderismo
          </p>
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Buscar por nombre, ubicación..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-5 pr-14 py-3.5 rounded-full bg-white/10 border border-white/20 text-white text-sm
                         outline-none placeholder:text-gray-400 focus:bg-white/15 focus:border-white/40 transition-colors"
            />
            <button
              aria-label="Buscar rutas"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-2 cursor-pointer transition-colors"
            >
              <img src="/Img/Icons/search.png" alt="" aria-hidden="true" className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── FILTER BAR ──────────────────────────────────────────── */}
        <div className="bg-white/5 border-y border-white/10 px-[5%] py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {dificultades.map(dif => (
                <button
                  key={dif}
                  onClick={() => setActiveDif(dif)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${activeDif === dif
                    ? 'bg-white text-primary-dark border-white'
                    : 'bg-white/5 text-gray-300 border-white/20 hover:bg-white/10'
                    }`}
                >
                  {dificultadLabels[dif]}
                </button>
              ))}
            </div>
            <span className="text-gray-400 text-sm">
              {loading ? '...' : `${filteredRutas.length} ruta${filteredRutas.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>

        {/* ── CARD GRID ───────────────────────────────────────────── */}
        <div className="px-[5%] py-10">
          {loading ? (
            <p className="text-white text-center py-16">Cargando rutas...</p>
          ) : filteredRutas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRutas.map(ruta => (
                <article
                  key={ruta.id_ruta}
                  onClick={() => navigate(`/ruta/${ruta.id_ruta}`)}
                  className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden
                             hover:border-white/25 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30
                             transition-all duration-200 group h-full flex flex-col cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={ruta.imagen_url || ''}
                      alt={ruta.nombre_ruta}
                      loading="lazy"
                      width={400}
                      height={176}
                      containerClassName="w-full h-44"
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Difficulty badge */}
                    <span className={`absolute bottom-2 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyColor[ruta.dificultad.toLowerCase()] ?? 'bg-white/10 text-white border-white/20'}`}>
                      {ruta.dificultad.toUpperCase()}
                    </span>

                    {/* Favorite button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorito(ruta.id_ruta); }}
                      aria-label={esFavorito(ruta.id_ruta) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                      className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 rounded-full p-2 border-none cursor-pointer transition-colors"
                    >
                      <img
                        src={esFavorito(ruta.id_ruta) ? '/Img/Icons/favorito_solid.png' : '/Img/Icons/favourite.png'}
                        alt=""
                        aria-hidden="true"
                        className="w-6 h-6"
                      />
                    </button>

                    {/* Admin delete */}
                    {usuario?.rol === 'admin' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('¿Estás seguro de que quieres eliminar esta ruta?')) {
                            deleteRuta(ruta.id_ruta);
                            setRutas(rutas.filter(r => r.id_ruta !== ruta.id_ruta));
                          }
                        }}
                        className="absolute top-2 left-2 bg-black/40 hover:bg-red-600/80 rounded-full p-2 border-none cursor-pointer transition-colors"
                      >
                        <img src="/Img/Icons/delete.png" alt="" aria-hidden="true" title="Eliminar ruta" className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="flex-1 p-4">
                    <h2 className="text-white font-bold text-sm leading-snug mb-1 line-clamp-2">
                      {ruta.nombre_ruta}
                    </h2>
                    <p className="text-gray-400 text-xs mb-3 truncate">{ruta.nombre_ubicacion}</p>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-300 mb-3">
                      <span>{ruta.distancia_km} km</span>
                      {ruta.duracion_estimada && <span>· {ruta.duracion_estimada}</span>}
                      {ruta.desnivel_metros != null && <span>· ↑{ruta.desnivel_metros} m</span>}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} className={`text-sm ${i <= Math.round(ruta.media_puntuacion ?? 0) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                      <span className="text-gray-400 text-xs ml-1">{(ruta.media_puntuacion ?? 0).toFixed(1)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <p className="text-gray-400 text-base">No hay rutas que coincidan con tu búsqueda.</p>
              <button
                onClick={() => { setSearch(''); setActiveDif(''); }}
                className="px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/15 cursor-pointer transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
