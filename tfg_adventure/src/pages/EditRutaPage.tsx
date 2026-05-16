import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { getRutaById } from '../services/rutaService';
import { cloudinaryService } from '../services/cloudinaryService';

export default function EditRutaPage() {
    const { usuario, updateRuta } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const from = (location.state as { from?: string } | null)?.from;

    const [form, setForm] = useState({
        tituloRuta: '',
        nombreRuta: '',
        nivelRuta: '',
        distanciaRuta: '',
        desnivelRuta: '',
        duracionHoras: '',
        duracionMinutos: '',
        ubicacionRuta: '',
        latitudUbicacion: '',
        longitudUbicacion: '',
        descripcionRuta: '',
        recomendacionesRuta: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [imagenFileName, setImagenFileName] = useState('');
    const [imagenPreview, setImagenPreview] = useState<string | null>(null);
    const [imagenDeleted, setImagenDeleted] = useState(false);
    const [gpxFile, setGpxFile] = useState<File | null>(null);
    const [gpxFileName, setGpxFileName] = useState('');
    const [gpxUrl, setGpxUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadRuta = async () => {
            try {
                if (!id) throw new Error('ID no válido');
                const data = await getRutaById(parseInt(id));

                const dificultadMap: Record<string, string> = {
                    'Baja': 'bajo',
                    'Media': 'medio',
                    'Alta': 'alto',
                };

                const duracion = data.duracion_estimada?.match(/(\d+)h\s?(\d+)?m/);
                const horas = duracion?.[1] || '0';
                const minutos = duracion?.[2] || '0';

                const descripcionParts = data.descripcion?.split('\n\nRecomendaciones: ') || [];
                const descripcion = descripcionParts[0] || '';
                const recomendaciones = descripcionParts[1] || '';

                setForm({
                    tituloRuta: data.titulo || '',
                    nombreRuta: data.nombre_ruta || '',
                    nivelRuta: dificultadMap[data.dificultad] || '',
                    distanciaRuta: data.distancia_km?.toString() || '',
                    desnivelRuta: data.desnivel_metros?.toString() || '',
                    duracionHoras: horas,
                    duracionMinutos: minutos,
                    ubicacionRuta: data.nombre_ubicacion || '',
                    latitudUbicacion: '',
                    longitudUbicacion: '',
                    descripcionRuta: descripcion,
                    recomendacionesRuta: recomendaciones,
                });

                if (data.imagen_url) {
                    setImagenPreview(data.imagen_url);
                }

                setImagenDeleted(false);

                if (data.gpx_url) {
                    setGpxUrl(data.gpx_url);
                }

                if (!usuario || (usuario.id_usuario !== data.id_usuario && usuario.rol !== 'admin')) {
                    setError('No tienes permiso para editar esta ruta.');
                    setTimeout(() => navigate('/senderos'), 2000);
                }
            } catch (err: any) {
                setError('Error al cargar la ruta.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadRuta();
    }, [id, usuario, navigate]);

    if (!usuario) {
        navigate('/login');
        return null;
    }

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                    <Header transparent />
                </header>
                <main className="flex-1 bg-surface-dark flex items-center justify-center">
                    <p className="text-white text-lg">Cargando ruta...</p>
                </main>
                <Footer />
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                setError('La imagen no debe superar los 3MB.');
                return;
            }
            setImagenFile(file);
            setImagenFileName(file.name);
            setImagenDeleted(false);
            const reader = new FileReader();
            reader.onloadend = () => setImagenPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = () => {
        setImagenPreview(null);
        setImagenFile(null);
        setImagenFileName('');
        setImagenDeleted(true);
    };

    const handleGpxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.gpx')) {
            setError('Solo se permiten archivos .gpx');
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            setError('El archivo .gpx no debe superar los 3MB');
            return;
        }
        setGpxFile(file);
        setGpxFileName(file.name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const dificultadMap: Record<string, 'Baja' | 'Media' | 'Alta'> = {
            bajo: 'Baja',
            medio: 'Media',
            alto: 'Alta',
        };

        const dificultad = dificultadMap[form.nivelRuta];
        if (!dificultad) {
            setError('Selecciona un nivel de dificultad.');
            setSubmitting(false);
            return;
        }

        const horas = parseInt(form.duracionHoras || '0');
        const minutos = parseInt(form.duracionMinutos || '0');
        let descripcion = form.descripcionRuta;
        if (form.recomendacionesRuta.trim()) {
            descripcion += '\n\nRecomendaciones: ' + form.recomendacionesRuta;
        }

        try {
            let imagen_url = '';
            if (imagenDeleted) {
                imagen_url = '';
            } else if (imagenFile) {
                imagen_url = await cloudinaryService.uploadRutaImage(imagenFile);
            } else if (imagenPreview) {
                imagen_url = imagenPreview;
            }

            let gpx_url = gpxUrl || '';
            if (gpxFile) {
                gpx_url = await cloudinaryService.uploadGpxFile(gpxFile);
            }

            await updateRuta(parseInt(id!), {
                titulo: form.tituloRuta,
                nombre_ruta: form.nombreRuta,
                descripcion,
                distancia_km: parseFloat(form.distanciaRuta) || 0,
                duracion_estimada: `${horas}h ${minutos}m`,
                dificultad,
                desnivel_metros: parseInt(form.desnivelRuta) || 0,
                imagen_url,
                gpx_url,
                nombre_ubicacion: form.ubicacionRuta,
            });
            navigate(from === 'admin' ? '/admin' : `/ruta/${id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar la ruta.');
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                <Header transparent />
            </header>

            <main>
                <section className="bg-gradient-to-br from-primary-light to-primary-dark py-12">
                    <div className="mx-auto px-[5%] text-left">
                        <h1 className="text-white text-[30px] font-bold italic mb-8 tracking-wider">EDITAR RUTA</h1>

                        {error && (
                            <div
                                className="bg-error/30 border border-error text-white p-4 rounded-xl mb-6 text-sm">{error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="max-w-[800px] mx-auto">
                            <div className="mb-6">
                                <label htmlFor="tituloRuta" className="block text-white text-sm font-medium mb-2">Título
                                    de la publicación</label>
                                <input
                                    type="text" id="tituloRuta" name="tituloRuta" value={form.tituloRuta}
                                    onChange={handleChange}
                                    placeholder="Ej: Aventura en el Bosque" required
                                    className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="nombreRuta" className="block text-white text-sm font-medium mb-2">Nombre
                                    de la ruta (Lugar)</label>
                                <input
                                    type="text" id="nombreRuta" name="nombreRuta" value={form.nombreRuta}
                                    onChange={handleChange}
                                    placeholder="Ej: Arroyo del Bejarano" required
                                    className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <label htmlFor="nivelRuta" className="block text-white text-sm font-medium mb-2">Nivel
                                        de dificultad</label>
                                    <select
                                        id="nivelRuta" name="nivelRuta" value={form.nivelRuta} onChange={handleChange}
                                        required
                                        className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                               focus:border-white focus:bg-white/15 font-[Montserrat]"
                                    >
                                        <option value="" className="bg-primary-dark">Selecciona un nivel</option>
                                        <option value="bajo" className="bg-primary-dark">Nivel Bajo</option>
                                        <option value="medio" className="bg-primary-dark">Nivel Medio</option>
                                        <option value="alto" className="bg-primary-dark">Nivel Alto</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="distanciaRuta"
                                        className="block text-white text-sm font-medium mb-2">Distancia (km)
                                        *</label>
                                    <input
                                        type="number" id="distanciaRuta" name="distanciaRuta" value={form.distanciaRuta}
                                        onChange={handleChange}
                                        placeholder="Ej: 10.5" step="0.1" min="0" required
                                        className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                               placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <label htmlFor="desnivelRuta" className="block text-white text-sm font-medium mb-2">Desnivel
                                        (m) *</label>
                                    <input
                                        type="number" id="desnivelRuta" name="desnivelRuta" value={form.desnivelRuta}
                                        onChange={handleChange}
                                        placeholder="Ej: 300" step="1" min="0" required
                                        className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                               placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <fieldset className="border-none p-0 m-0">
                                        <legend className="block text-white text-sm font-medium mb-2">Duración
                                            estimada
                                        </legend>
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="duracionHoras" className="sr-only">Horas</label>
                                            <input
                                                id="duracionHoras" type="number" name="duracionHoras"
                                                value={form.duracionHoras} onChange={handleChange}
                                                placeholder="Horas" min="0" max="24"
                                                className="w-[40%] p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                                   placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                            />
                                            <span className="text-white text-sm" aria-hidden="true">h</span>
                                            <label htmlFor="duracionMinutos" className="sr-only">Minutos</label>
                                            <input
                                                id="duracionMinutos" type="number" name="duracionMinutos"
                                                value={form.duracionMinutos} onChange={handleChange}
                                                placeholder="Min" min="0" max="59"
                                                className="w-[40%] p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                                   placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                            />
                                            <span className="text-white text-sm" aria-hidden="true">min</span>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="ubicacionRuta" className="block text-white text-sm font-medium mb-2">Ubicación
                                    (Nombre)</label>
                                <input
                                    type="text" id="ubicacionRuta" name="ubicacionRuta" value={form.ubicacionRuta}
                                    onChange={handleChange}
                                    placeholder="Ej: Trassierra, Córdoba" required
                                    className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="descripcionRuta" className="block text-white text-sm font-medium mb-2">Descripción
                                    de la ruta</label>
                                <textarea
                                    id="descripcionRuta" name="descripcionRuta" rows={5} value={form.descripcionRuta}
                                    onChange={handleChange}
                                    placeholder="Describe la ruta, el recorrido, puntos de interés..." required
                                    className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="recomendacionesRuta"
                                    className="block text-white text-sm font-medium mb-2">Recomendaciones de ropa y
                                    equipo</label>
                                <textarea
                                    id="recomendacionesRuta" name="recomendacionesRuta" rows={3}
                                    value={form.recomendacionesRuta} onChange={handleChange}
                                    placeholder="Calzado recomendado, ropa, equipo necesario..."
                                    className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-white text-sm font-medium mb-2">Imagen de la ruta (Máx. 1
                                    imagen, 3MB)</label>
                                <div className="bg-white/5 border-2 border-dashed border-white/30 rounded-xl p-6">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        onChange={handleImageChange}
                                        className="text-white text-sm cursor-pointer file:bg-accent file:text-white file:border-none file:px-5 file:py-2
                               file:rounded-lg file:cursor-pointer file:text-sm file:mr-4 file:hover:bg-primary-light"
                                    />
                                    <p className="text-white/50 text-xs mt-3">Formatos: JPG, PNG, GIF, WEBP — Máx. 1
                                        imagen de 3MB</p>
                                    {imagenFileName && (
                                        <p className="text-white/70 text-xs mt-2">Archivo
                                            seleccionado: {imagenFileName}</p>
                                    )}
                                    {imagenPreview && (
                                        <div className="mt-4">
                                            <img src={imagenPreview} alt="Preview"
                                                className="max-h-[200px] rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={handleDeleteImage}
                                                className="mt-3 px-4 py-2 bg-error text-white text-sm rounded-lg hover:bg-error/80 transition-colors"
                                            >
                                                Borrar imagen
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-white text-sm font-medium mb-2">Archivo GPX de la ruta
                                    (Opcional, máx. 3MB)</label>
                                <div className="bg-white/5 border-2 border-dashed border-white/30 rounded-xl p-6">
                                    <input
                                        type="file"
                                        accept=".gpx"
                                        onChange={handleGpxChange}
                                        className="text-white text-sm cursor-pointer file:bg-accent file:text-white file:border-none file:px-5 file:py-2
                               file:rounded-lg file:cursor-pointer file:text-sm file:mr-4 file:hover:bg-primary-light"
                                    />
                                    <p className="text-white/50 text-xs mt-3">Formato: GPX — Máx. 3MB</p>
                                    {gpxFileName && (
                                        <p className="text-white/70 text-xs mt-2">Archivo
                                            seleccionado: {gpxFileName}</p>
                                    )}
                                    {gpxUrl && !gpxFileName && (
                                        <p className="text-white/70 text-xs mt-2">GPX actual: archivo subido</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col md:flex-row justify-end gap-4">
                                <Link
                                    to={from === 'admin' ? '/admin' : `/ruta/${id}`}
                                    className="inline-flex justify-center items-center px-8 py-3 bg-transparent border-2 border-white/50 rounded-full 
                             text-white no-underline text-base hover:border-white hover:bg-white/10 transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex justify-center items-center px-8 py-3 bg-white border-2 border-white rounded-full
                             text-primary-dark text-base font-medium cursor-pointer hover:bg-gray-200 transition-colors
                             disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5 mr-2 text-primary-dark"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                    stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            Guardar cambios
                                            <img src="/Img/Icons/check.png" alt="Guardar" className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
