import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { cloudinaryService } from '../services/cloudinaryService';
import { useToast } from '../hooks/useToast';

export default function CreatePage() {
    const { usuario, addRuta } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

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
    const [loading, setLoading] = useState(false);
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [imagenFileName, setImagenFileName] = useState('');
    const [imagenPreview, setImagenPreview] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [gpxFile, setGpxFile] = useState<File | null>(null);
    const [gpxFileName, setGpxFileName] = useState('');

    if (!usuario) {
        navigate('/login');
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClearImage = () => {
        setImagenFile(null);
        setImagenFileName('');
        setImagenPreview(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                addToast('La imagen no debe superar los 3MB.', 'error');
                setImagenFile(null);
                setImagenFileName('');
                setImagenPreview(null);
                if (imageInputRef.current) imageInputRef.current.value = '';
                return;
            }
            setImagenFile(file);
            setImagenFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => setImagenPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleGpxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.gpx')) {
            addToast('Solo se permiten archivos .gpx', 'error');
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            addToast('El archivo .gpx no debe superar los 3MB', 'error');
            return;
        }
        setGpxFile(file);
        setGpxFileName(file.name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (imagenFile && imagenFile.size > 3 * 1024 * 1024) {
            addToast('La imagen no debe superar los 3MB.', 'error');
            return;
        }

        setLoading(true);

        const dificultadMap: Record<string, 'Baja' | 'Media' | 'Alta'> = {
            bajo: 'Baja',
            medio: 'Media',
            alto: 'Alta',
        };

        const dificultad = dificultadMap[form.nivelRuta];
        if (!dificultad) {
            setLoading(false);
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
            if (imagenFile) {
                imagen_url = await cloudinaryService.uploadRutaImage(imagenFile);
            }

            let gpx_url = '';
            if (gpxFile) {
                gpx_url = await cloudinaryService.uploadGpxFile(gpxFile);
            }

            await addRuta({
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
            navigate('/');
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Error al crear la ruta.', 'error');
            setLoading(false);
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
                        <h1 className="text-white text-[30px] font-bold italic mb-8 tracking-wider">CREAR NUEVA
                            RUTA</h1>

                        <form onSubmit={handleSubmit} className="max-w-[800px] mx-auto">
                            {/* Title */}
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

                            {/* Route name */}
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

                            {/* Difficulty + Distance row */}
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

                            {/* Elevation + Duration row */}
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

                            {/* Location */}
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

                            {/* Lat/Long row */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <label htmlFor="latitudUbicacion"
                                        className="block text-white text-sm font-medium mb-2">Latitud</label>
                                    <input
                                        type="number" step="any" id="latitudUbicacion" name="latitudUbicacion"
                                        value={form.latitudUbicacion} onChange={handleChange}
                                        placeholder="Ej: 37.9351"
                                        className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                               placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="longitudUbicacion"
                                        className="block text-white text-sm font-medium mb-2">Longitud</label>
                                    <input
                                        type="number" step="any" id="longitudUbicacion" name="longitudUbicacion"
                                        value={form.longitudUbicacion} onChange={handleChange}
                                        placeholder="Ej: -4.8942"
                                        className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                               placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                    />
                                </div>
                            </div>

                            {/* Description */}
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

                            {/* Recommendations */}
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

                            {/* Image upload */}
                            <div className="mb-6">
                                <label className="block text-white text-sm font-medium mb-2">Imagen de la ruta (Máx. 1
                                    imagen, 3MB)</label>
                                <div className="bg-white/5 border-2 border-dashed border-white/30 rounded-xl p-6">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <input
                                            ref={imageInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            onChange={handleImageChange}
                                            className="text-white text-sm cursor-pointer file:bg-accent file:text-white file:border-none file:px-5 file:py-2
                                 file:rounded-lg file:cursor-pointer file:text-sm file:mr-4 file:hover:bg-primary-light"
                                        />
                                        {imagenFileName && (
                                            <button
                                                type="button"
                                                onClick={handleClearImage}
                                                className="px-4 py-2 bg-error/80 text-white text-sm rounded-lg hover:bg-error transition-colors border-none cursor-pointer"
                                            >
                                                Quitar imagen
                                            </button>
                                        )}
                                    </div>
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
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* GPX upload */}
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
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-8 flex flex-col md:flex-row justify-end gap-4">
                                <Link
                                    to="/senderos"
                                    className="inline-flex justify-center items-center px-8 py-3 bg-transparent border-2 border-white/50 rounded-full
                             text-white no-underline text-base hover:border-white hover:bg-white/10 transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex justify-center items-center px-8 py-3 bg-accent rounded-full text-white text-base
                             font-semibold hover:bg-primary-light transition-colors border-none cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? 'Guardando...' : 'Guardar Ruta'}
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
