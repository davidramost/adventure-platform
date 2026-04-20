import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import * as resenaService from '../services/resenaService';
import type { Resena } from '../types';

export default function ContentPage() {
  const { id } = useParams<{ id: string }>();
  const { rutas, usuario } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [comentario, setComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState(0);
  const [mensaje, setMensaje] = useState('');

  const idRuta = parseInt(id || '0');
  const ruta = rutas.find(r => r.id_ruta === idRuta);

  useEffect(() => {
    if (idRuta > 0) {
      resenaService.getResenasByRuta(idRuta).then(setResenas).catch(() => setResenas([]));
    }
  }, [idRuta]);

  if (!ruta) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-gradient-to-br from-primary-light to-primary-dark">
          <Header transparent />
        </header>
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
          <div className="text-center text-white">
            <h1 className="text-2xl mb-4">Ruta no encontrada</h1>
            <Link to="/senderos" className="text-white underline">Volver al listado</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (puntuacion < 1 || puntuacion > 5) {
      setMensaje('La puntuación debe estar entre 1 y 5.');
      return;
    }
    if (!comentario.trim()) {
      setMensaje('El comentario no puede estar vacío.');
      return;
    }
    try {
      const newResena = await resenaService.createResena(idRuta, { comentario, puntuacion });
      setResenas(prev => [newResena, ...prev]);
      setMensaje('¡Reseña publicada con éxito!');
      setComentario('');
      setPuntuacion(0);
    } catch (err: any) {
      setMensaje(err.response?.data?.message || 'Error al publicar la reseña.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-primary-light to-primary-dark">
        <Header transparent />
      </header>

      <main>
        <section className="bg-gradient-to-br from-primary-light to-primary-dark py-12 text-center">
          <div className="mx-auto px-[5%] text-left">
            {/* Header grid: image + description */}
            <div className="flex flex-col-reverse lg:flex-row gap-10 items-center mb-10">
              {/* Description */}
              <article className="flex-1 text-white">
                <h1 className="text-white text-[30px] font-bold italic mb-4 tracking-wider">
                  {ruta.dificultad.toUpperCase()}
                </h1>
                <h2 className="text-white text-2xl italic mb-6">{ruta.nombre_ruta}</h2>

                <div className="mb-5 space-y-1">
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Distancia:</strong> {ruta.distancia_km} km
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Duración:</strong> {ruta.duracion_estimada}
                  </p>
                  <p className="text-sm text-gray-300">
                    <strong className="text-white">Desnivel:</strong> {ruta.desnivel_metros} m
                  </p>
                </div>

                <div className="text-sm text-gray-300 leading-[1.8]">
                  {ruta.descripcion.split('\n').map((line, i) => (
                    <p key={i} className="mb-3">{line}</p>
                  ))}
                </div>
              </article>

              {/* Main image */}
              <div className="flex-1 w-full">
                {ruta.imagen_url ? (
                  <img
                    src={ruta.imagen_url}
                    alt="Imagen ruta"
                    className="w-full h-auto max-h-[500px] object-cover rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-[300px] bg-primary rounded-xl">
                    <img src="/Img/Icons/sin-imagen.png" alt="Sin foto" className="w-[50px] h-[50px] opacity-40" />
                  </div>
                )}
              </div>
            </div>

            {/* Comments section */}
            <div className="mt-12 border-t border-white/20 pt-8">
              <h3 className="text-white text-xl mb-6">Comentarios ({resenas.length})</h3>

              {/* Review form */}
              {usuario ? (
                <>
                  {mensaje && (
                    <div className={`p-4 rounded-xl mb-6 text-center text-sm ${mensaje.includes('éxito')
                      ? 'bg-success/25 border border-success text-green-300'
                      : 'bg-error/30 border border-error text-white'
                      }`}>
                      {mensaje}
                    </div>
                  )}
                  <form onSubmit={handleSubmitReview} className="mb-8">
                    <div className="mb-4">
                      <label className="block text-white text-sm mb-2">Puntuación:</label>
                      <div className="flex flex-row-reverse justify-end gap-1">
                        {[5, 4, 3, 2, 1].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setPuntuacion(star)}
                            className={`text-3xl bg-transparent border-none cursor-pointer transition-colors ${star <= puntuacion ? 'text-yellow-400' : 'text-gray-500'
                              } hover:text-yellow-400`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="comentario" className="block text-white text-sm mb-2">Tu opinión:</label>
                      <textarea
                        id="comentario"
                        rows={4}
                        value={comentario}
                        onChange={e => setComentario(e.target.value)}
                        required
                        placeholder="Comparte tu experiencia..."
                        className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none 
                                   placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex justify-center items-center px-8 py-3 bg-white border-2 border-white rounded-full 
                                 text-primary-dark text-base font-medium cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      Publicar Reseña
                    </button>
                  </form>
                </>
              ) : (
                <div className="bg-white/5 border border-white/20 rounded-xl p-6 mb-8 text-center">
                  <p className="text-white text-sm">
                    Para dejar una reseña, necesitas{' '}
                    <Link to="/login" className="text-yellow-400 underline">iniciar sesión</Link>.
                  </p>
                </div>
              )}

              {/* Reviews list */}
              <div className="space-y-4">
                {resenas.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">No hay reseñas todavía. ¡Sé el primero en comentar!</p>
                ) : (
                  resenas.map(resena => (
                    <div key={resena.id_resena} className="bg-white/5 border border-white/10 rounded-xl p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold text-sm">{resena.nombre_usuario}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                              <span
                                key={i}
                                className={`text-lg ${i <= resena.puntuacion ? 'text-yellow-400' : 'text-gray-600'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-xs">
                            {new Date(resena.fecha).toLocaleDateString('es-ES')}
                          </span>
                          {usuario?.rol === 'admin' && (
                            <button
                              onClick={async () => {
                                if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
                                  await resenaService.deleteResena(resena.id_resena);
                                  setResenas(prev => prev.filter(r => r.id_resena !== resena.id_resena));
                                }
                              }}
                              className="bg-transparent border-none cursor-pointer p-0"
                              title="Eliminar reseña"
                            >
                              <img src="/Img/Icons/delete.png" alt="Eliminar" className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed m-0">{resena.comentario}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Back button */}
            <nav className="text-right mt-8">
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
