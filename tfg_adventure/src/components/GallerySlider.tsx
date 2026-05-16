import {useCallback, useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import Image from './Image';
import type {Ruta} from '../types';

const BATCH_SIZE = 10;

interface GallerySliderProps {
    rutas: Ruta[];
}

export default function GallerySlider({rutas}: GallerySliderProps) {
    const rutasConImagen = rutas.filter(r => r.imagen_url);
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const [loadedCount, setLoadedCount] = useState(() =>
        Math.min(BATCH_SIZE, rutasConImagen.length)
    );
    const prefersReducedMotion = useRef(
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    useEffect(() => {
        if (current >= loadedCount - 3 && loadedCount < rutasConImagen.length) {
            setLoadedCount(c => Math.min(c + BATCH_SIZE, rutasConImagen.length));
        }
    }, [current, loadedCount, rutasConImagen.length]);

    const nextSlide = useCallback(() => {
        if (loadedCount < 2) return;
        setCurrent(prev => (prev + 1) % loadedCount);
    }, [loadedCount]);

    const prevSlide = () => {
        if (loadedCount < 2) return;
        setCurrent(prev => (prev - 1 + loadedCount) % loadedCount);
    };

    useEffect(() => {
        if (paused || prefersReducedMotion.current || loadedCount < 2) return;
        const timer = setInterval(nextSlide, 3500);
        return () => clearInterval(timer);
    }, [nextSlide, paused, loadedCount]);

    if (rutasConImagen.length === 0) return null;

    return (
        <section
            className="py-8 lg:py-16"
            aria-label="Galería de rutas"
        >
            <h2 className="text-primary-dark text-2xl md:text-3xl font-bold mb-10 text-center">
                Galería de rutas
            </h2>

            <div
                className="relative w-full h-[60vh] rounded-2xl overflow-hidden"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                role="region"
                aria-roledescription="carrusel"
                aria-label="Imágenes de rutas"
            >
                {/* Slides — only the loaded batch is in the DOM */}
                {rutasConImagen.slice(0, loadedCount).map((ruta, index) => (
                    <div
                        key={ruta.id_ruta}
                        className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                        role="group"
                        aria-roledescription="diapositiva"
                        aria-label={`${index + 1} de ${loadedCount}: ${ruta.nombre_ruta}`}
                        aria-hidden={index !== current}
                    >
                        <Link
                            to={`/ruta/${ruta.id_ruta}`}
                            className="block w-full h-full"
                            tabIndex={index !== current ? -1 : 0}
                        >
                            <Image
                                src={ruta.imagen_url}
                                alt={ruta.nombre_ruta}
                                containerClassName="w-full h-full"
                                className="w-full h-full object-cover brightness-[0.75] hover:brightness-[0.9] transition-[filter] duration-300"
                            />
                            <div
                                className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/70 to-transparent text-white py-6 px-6">
                                <h3 className="m-0 mb-1 text-2xl font-bold">{ruta.nombre_ruta}</h3>
                                {ruta.nombre_ubicacion && (
                                    <span className="text-sm text-gray-300">{ruta.nombre_ubicacion}</span>
                                )}
                            </div>
                        </Link>
                    </div>
                ))}

                {/* Prev / Next — only if more than one slide */}
                {loadedCount > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            aria-label="Diapositiva anterior"
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                         w-12 h-12 rounded-full bg-black/40 text-white text-2xl border-none cursor-pointer
                         hover:bg-black/60 transition-colors flex items-center justify-center
                         focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                        >
                            ‹
                        </button>
                        <button
                            onClick={nextSlide}
                            aria-label="Diapositiva siguiente"
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                         w-12 h-12 rounded-full bg-black/40 text-white text-2xl border-none cursor-pointer
                         hover:bg-black/60 transition-colors flex items-center justify-center
                         focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            <p className="text-center mt-6">
                <Link
                    to="/senderos"
                    className="inline-flex items-center text-primary-dark no-underline text-sm font-medium
                     hover:text-primary-light transition-colors group"
                >
                    Ver todas las rutas
                    <span className="ml-2 w-6 h-6 rounded-full bg-primary-dark flex items-center justify-center
                           group-hover:bg-primary-light group-hover:translate-x-1 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                             stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             aria-hidden="true">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </span>
                </Link>
            </p>
        </section>
    );
}
