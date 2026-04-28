import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function FavoritesPage() {
  const { usuario, rutas, favoritos, toggleFavorito } = useAuth();
  const navigate = useNavigate();

  if (!usuario) {
    navigate('/login');
    return null;
  }

  const favRutas = rutas.filter(r => favoritos.includes(r.id_ruta));

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-primary-light to-primary-dark">
        <Header transparent />
      </header>

      <main className="flex-1 bg-surface-dark">
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center px-[5%] py-6 bg-gradient-to-br from-primary-light to-primary-dark">
          <h1 className="text-white text-lg font-bold m-0 leading-9">Mis rutas favoritas</h1>
        </div>

        {/* Favorites list */}
        <section>
          {favRutas.length > 0 ? (
            favRutas.map(ruta => (
              <article key={ruta.id_ruta} className="block bg-surface border-b-2 border-[#333] relative">
                <Link
                  to={`/ruta/${ruta.id_ruta}`}
                  className="flex flex-col md:flex-row w-full no-underline text-inherit pr-0 md:pr-[50px] hover:bg-[#555] transition-colors"
                >
                  <div className="w-full md:w-[280px] shrink-0">
                    {ruta.imagen_url ? (
                      <img src={ruta.imagen_url} alt="Imagen ruta" className="w-full md:w-[280px] h-[180px] md:h-[120px] object-cover block" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-[120px] bg-primary">
                        <img src="/Img/Icons/sin-imagen.png" alt="Sin foto" className="w-[50px] h-[50px] opacity-40" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 md:p-6">
                    <h2 className="text-white text-base font-bold m-0 mb-1">{ruta.nombre_ruta}</h2>
                    <p className="text-[#bbb] text-[13px] m-0 mb-2">{ruta.nombre_ubicacion}</p>
                    <div className="text-[#ddd] text-[13px] flex flex-wrap gap-1 items-center">
                      <span className="flex items-center gap-1">
                        <img src="/Img/Icons/star.png" alt="Estrella" className="w-4 h-4" />
                        {ruta.media_puntuacion?.toFixed(1) || 'N/A'}
                      </span>
                      <span>• {ruta.duracion_estimada}</span>
                      <span>• {ruta.distancia_km}km</span>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => toggleFavorito(ruta.id_ruta)}
                  className="absolute top-4 right-4 md:top-1/2 md:right-5 md:-translate-y-1/2 bg-transparent border-none cursor-pointer p-0"
                >
                  <img src="/Img/Icons/favorito_solid.png" alt="Favorito" className="w-[30px] h-[30px]" />
                </button>
              </article>
            ))
          ) : (
            <p className="text-white text-center py-8">No tienes rutas favoritas guardadas.</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
