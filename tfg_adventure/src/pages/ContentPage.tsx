import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import * as resenaService from '../services/resenaService';
import * as rutaService from '../services/rutaService';
import { useWeather } from '../hooks/useWeather';
import { useToast } from '../hooks/useToast';
import type { Resena, Ruta } from '../types';

function FitBoundsToTrack({ points }: { points: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (points.length > 1) map.fitBounds(points);
    }, [map, points]);
    return null;
}

export default function ContentPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { rutas, usuario, loading, esFavorito, toggleFavorito } = useAuth();
    const { addToast } = useToast();
    const [resenas, setResenas] = useState<Resena[]>([]);
    const [comentario, setComentario] = useState('');
    const [puntuacion, setPuntuacion] = useState(0);
    const [hoverPuntuacion, setHoverPuntuacion] = useState(0);
    const [gpxPoints, setGpxPoints] = useState<[number, number][]>([]);
    const [rutaFallback, setRutaFallback] = useState<Ruta | null>(null);
    const [fallbackChecked, setFallbackChecked] = useState(false);

    const idRuta = parseInt(id || '0');
    const rutaFromContext = rutas.find(r => r.id_ruta === idRuta);
    const ruta = rutaFromContext ?? rutaFallback ?? undefined;
    const { weather, loading: weatherLoading } = useWeather(
        ruta?.latitud ?? null,
        ruta?.longitud ?? null
    );

    useEffect(() => {
        if (idRuta > 0) {
            resenaService.getResenasByRuta(idRuta).then(setResenas).catch(() => setResenas([]));
        }
    }, [idRuta]);

    useEffect(() => {
        if (loading || rutaFromContext || idRuta <= 0) {
            setFallbackChecked(true);
            return;
        }
        let cancelled = false;
        setFallbackChecked(false);
        rutaService.getRutaById(idRuta)
            .then(data => {
                if (!cancelled) setRutaFallback(data);
            })
            .catch(() => {
                if (!cancelled) setRutaFallback(null);
            })
            .finally(() => {
                if (!cancelled) setFallbackChecked(true);
            });
        return () => {
            cancelled = true;
        };
    }, [idRuta, loading, rutaFromContext]);

    useEffect(() => {
        if (!ruta?.gpx_url) return;
        fetch(ruta.gpx_url)
            .then(res => res.text())
            .then(text => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, 'application/xml');
                const trkpts = xml.querySelectorAll('trkpt');
                const points: [number, number][] = Array.from(trkpts).map(pt => [
                    parseFloat(pt.getAttribute('lat') || '0'),
                    parseFloat(pt.getAttribute('lon') || '0'),
                ]);
                setGpxPoints(points);
            })
            .catch(() => setGpxPoints([]));
    }, [ruta?.gpx_url]);

    if (loading || (!ruta && !fallbackChecked)) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                    <Header transparent />
                </header>
                <main
                    className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
                    <div className="text-center text-white">
                        <div
                            className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4" />
                        <p>Cargando ruta...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!ruta) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                    <Header transparent />
                </header>
                <main
                    className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
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
            addToast('La puntuación debe estar entre 1 y 5.', 'error');
            return;
        }
        if (!comentario.trim()) {
            addToast('El comentario no puede estar vacío.', 'error');
            return;
        }
        try {
            const newResena = await resenaService.createResena(idRuta, { comentario, puntuacion });
            setResenas(prev => [newResena, ...prev]);
            addToast('¡Reseña publicada con éxito!', 'success');
            setComentario('');
            setPuntuacion(0);
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Error al publicar la reseña.', 'error');
        }
    };

    const difficultyColor: Record<string, string> = {
        baja: 'bg-green-500/30 text-green-300 border-green-500/50',
        media: 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50',
        alta: 'bg-red-500/30 text-red-300 border-red-500/50',
    };
    const difficultyBadge = difficultyColor[ruta.dificultad.toLowerCase()] ?? 'bg-white/10 text-white border-white/20';

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                <Header transparent />
            </header>

            <main className="flex-1 bg-gradient-to-br from-primary-light to-primary-dark">

                {/* ── HERO ───────────────────────────────────────────────── */}
                <div className="relative w-full h-[340px] md:h-[440px] overflow-hidden">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-black/50 hover:bg-black/70 text-white text-sm px-3 py-2 rounded-full backdrop-blur-sm transition-colors border-none cursor-pointer no-underline"
                        aria-label="Volver a la pantalla anterior"
                        title="Volver"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clipRule="evenodd" />
                        </svg>
                        Volver
                    </button>
                    {usuario && (
                        <button
                            onClick={() => toggleFavorito(ruta.id_ruta)}
                            aria-label={esFavorito(ruta.id_ruta) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                            className="absolute top-4 right-4 z-5 bg-black/50 hover:bg-black/70 p-2.5 rounded-full backdrop-blur-sm transition-colors"
                            title={esFavorito(ruta.id_ruta) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                        >
                            <img
                                src={esFavorito(ruta.id_ruta) ? '/Img/Icons/favorito_solid.png' : '/Img/Icons/favourite.png'}
                                alt=""
                                aria-hidden="true"
                                className="w-6 h-6"
                            />
                        </button>
                    )}
                    {ruta.imagen_url ? (
                        <img
                            src={ruta.imagen_url}
                            alt={ruta.nombre_ruta}
                            onError={(e) => {
                                e.currentTarget.src = '/Img/Icons/sin-imagen.png';
                            }}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-primary-dark flex items-center justify-center">
                            <img src="/Img/Icons/sin-imagen.png" alt="Sin foto" className="w-16 h-16 opacity-20" />
                        </div>
                    )}
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 px-[5%] pb-8">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${difficultyBadge}`}>
                                    {ruta.dificultad.toUpperCase()}
                                </span>
                                <h1 className="text-white text-3xl md:text-4xl font-bold italic tracking-wide drop-shadow-lg">
                                    {ruta.nombre_ruta}
                                </h1>
                            </div>
                            {usuario && (usuario.id_usuario === ruta.id_usuario || usuario.rol === 'admin') && (
                                <Link
                                    to={`/ruta/${ruta.id_ruta}/editar`}
                                    state={{ from: 'content' }}
                                    className="px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg text-sm font-medium transition-colors shrink-0 no-underline"
                                >
                                    Editar ruta
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── BODY: main content + sidebar ───────────────────────── */}
                <div className="mx-auto px-[5%] py-10">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* ── LEFT: description + GPX map + comments ─────────── */}
                        <div className="flex-1 min-w-0 space-y-8 order-2 lg:order-1">

                            {/* Description */}
                            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h2 className="text-white font-semibold text-lg mb-4">Sobre esta ruta</h2>
                                <div className="text-sm text-gray-300 leading-[1.9]">
                                    {ruta.descripcion.split('\n').map((line, i) => (
                                        <p key={i} className="mb-3 last:mb-0">{line}</p>
                                    ))}
                                </div>
                            </section>

                            {/* GPX Map */}
                            {ruta.gpx_url && (
                                <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <h2 className="text-white font-semibold text-lg mb-4">Mapa del recorrido</h2>
                                    <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                                        {gpxPoints.length > 0 ? (
                                            <MapContainer
                                                center={gpxPoints[0]}
                                                zoom={13}
                                                style={{ width: '100%', height: '100%' }}
                                                scrollWheelZoom={false}
                                            >
                                                <TileLayer
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                />
                                                <Polyline positions={gpxPoints}
                                                    pathOptions={{ color: '#f97316', weight: 3 }} />
                                                <FitBoundsToTrack points={gpxPoints} />
                                            </MapContainer>
                                        ) : (
                                            <div
                                                className="w-full h-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center">
                                                <div
                                                    className="animate-spin rounded-full h-8 w-8 border-4 border-white/40 border-t-transparent" />
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* Comments */}
                            <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h2 className="text-white font-semibold text-lg mb-6">Comentarios
                                    ({resenas.length})</h2>

                                {usuario ? (
                                    <>
                                        <form onSubmit={handleSubmitReview}
                                            className="mb-8 bg-white/5 rounded-xl p-5 border border-white/10">
                                            <div className="mb-4">
                                                <label
                                                    className="block text-white text-sm font-medium mb-2">Puntuación:</label>
                                                <div className="flex justify-start gap-1">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setPuntuacion(star)}
                                                            onMouseEnter={() => setHoverPuntuacion(star)}
                                                            onMouseLeave={() => setHoverPuntuacion(0)}
                                                            className={`text-3xl bg-transparent border-none cursor-pointer transition-colors ${star <= (hoverPuntuacion || puntuacion) ? 'text-yellow-400' : 'text-gray-500'}`}
                                                        >
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="comentario"
                                                    className="block text-white text-sm font-medium mb-2">Tu
                                                    opinión:</label>
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
                                            <Link to="/login" className="text-yellow-400 underline">iniciar
                                                sesión</Link>.
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {resenas.length === 0 ? (
                                        <p className="text-gray-400 text-sm italic">No hay reseñas todavía. ¡Sé el
                                            primero en comentar!</p>
                                    ) : (
                                        resenas.map(resena => (
                                            <div key={resena.id_resena}
                                                className="bg-white/5 border border-white/10 rounded-xl p-5">
                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className="text-white font-bold text-sm">{resena.nombre_usuario}</span>
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                <span key={i}
                                                                    className={`text-lg ${i <= resena.puntuacion ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
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
                                                                <img src="/Img/Icons/delete.png" alt="Eliminar"
                                                                    className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm leading-relaxed m-0">{resena.comentario}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* ── RIGHT: sidebar ─────────────────────────────────── */}
                        <aside className="lg:w-80 xl:w-96 flex-shrink-0 space-y-5 order-1 lg:order-2">

                            {/* Stats card */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                <h3 className="text-white font-semibold text-base">Datos de la ruta</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                                        <p className="text-gray-400 text-xs mb-1">Distancia</p>
                                        <p className="text-white font-bold text-lg leading-none">{ruta.distancia_km}</p>
                                        <p className="text-gray-400 text-xs mt-1">km</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                                        <p className="text-gray-400 text-xs mb-1">Duración</p>
                                        <p className="text-white font-bold text-base leading-none">{ruta.duracion_estimada}</p>
                                        <p className="text-gray-400 text-xs mt-1">aprox.</p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                                        <p className="text-gray-400 text-xs mb-1">Desnivel</p>
                                        <p className="text-white font-bold text-lg leading-none">{ruta.desnivel_metros}</p>
                                        <p className="text-gray-400 text-xs mt-1">m</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-gray-400 text-sm">Dificultad</span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyBadge}`}>
                                        {ruta.dificultad.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Weather card */}
                            {(ruta.latitud !== null && ruta.longitud !== null) && (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-white font-semibold text-base mb-4">Tiempo actual</h3>
                                    {weatherLoading ? (
                                        <p className="text-gray-300 text-sm">Cargando tiempo...</p>
                                    ) : weather ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                                                    alt={weather.description}
                                                    className="w-16 h-16 flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-bold text-4xl leading-none">{weather.temp}°C</p>
                                                    <p className="text-gray-300 text-xs capitalize mt-1">{weather.description}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                    <p className="text-gray-400 text-xs">Sensación</p>
                                                    <p className="text-white font-semibold text-lg leading-none mt-1">{weather.feels_like}°C</p>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                    <p className="text-gray-400 text-xs">Humedad</p>
                                                    <p className="text-white font-semibold text-lg leading-none mt-1">{weather.humidity}%</p>
                                                </div>

                                                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                    <p className="text-gray-400 text-xs">Viento</p>
                                                    <div className="flex items-baseline gap-1 mt-1">
                                                        <span
                                                            className="text-white font-semibold text-lg">{weather.wind_speed}</span>
                                                        <span className="text-gray-300 text-xs">m/s</span>
                                                    </div>
                                                    <p className="text-gray-400 text-xs mt-1">{weather.wind_deg}°</p>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                    <p className="text-gray-400 text-xs">Ráfagas</p>
                                                    <div className="flex items-baseline gap-1 mt-1">
                                                        <span
                                                            className="text-white font-semibold text-lg">{weather.wind_gust}</span>
                                                        <span className="text-gray-300 text-xs">m/s</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                    <p className="text-gray-400 text-xs">Visibilidad</p>
                                                    <div className="flex items-baseline gap-1 mt-1">
                                                        <span
                                                            className="text-white font-semibold text-lg">{weather.visibility}</span>
                                                        <span className="text-gray-300 text-xs">km</span>
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                    <p className="text-gray-400 text-xs">Nubes</p>
                                                    <p className="text-white font-semibold text-lg leading-none mt-1">{weather.cloudiness}%</p>
                                                </div>

                                                <div
                                                    className="bg-white/5 rounded-lg p-3 border border-white/10 col-span-2">
                                                    <p className="text-gray-400 text-xs">Presión</p>
                                                    <div className="flex items-baseline gap-1 mt-1">
                                                        <span
                                                            className="text-white font-semibold text-lg">{weather.pressure}</span>
                                                        <span className="text-gray-300 text-xs">hPa</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm">Tiempo no disponible.</p>
                                    )}
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
