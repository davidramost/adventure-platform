import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import { cloudinaryService } from '../services/cloudinaryService';

const CATEGORIAS = [
    'Camping',
    'Seguridad',
    'Mochilas',
    'Escalada',
    'Ropa',
    'Calzado',
    'Iluminación',
    'Accesorios',
    'Hidratación',
    'Bastones',
];

export default function CreateProductoPage() {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        categoria: '',
    });
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [imagenFileName, setImagenFileName] = useState('');
    const [imagenPreview, setImagenPreview] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!usuario || usuario.rol !== 'admin') {
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
                setError('La imagen no debe superar los 3MB.');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (imagenFile && imagenFile.size > 3 * 1024 * 1024) {
            setError('La imagen no debe superar los 3MB.');
            return;
        }

        if (!form.categoria) {
            setError('Selecciona una categoría.');
            return;
        }

        setSubmitting(true);

        try {
            let imagen = '';
            if (imagenFile) {
                imagen = await cloudinaryService.uploadProductImage(imagenFile);
            }

            await adminService.createProducto({
                nombre: form.nombre,
                descripcion: form.descripcion,
                precio: parseFloat(form.precio),
                stock: parseInt(form.stock) || 0,
                categoria: form.categoria,
                imagen,
            });

            navigate('/admin');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear el producto.');
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
                        <h1 className="text-white text-[30px] font-bold italic mb-8 tracking-wider">CREAR PRODUCTO</h1>

                        {error && (
                            <div className="bg-error/30 border border-error text-white p-4 rounded-xl mb-6 text-sm">{error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="max-w-[800px] mx-auto">
                            <div className="mb-6">
                                <label htmlFor="nombre" className="block text-white text-sm font-medium mb-2">Nombre del producto *</label>
                                <input
                                    type="text" id="nombre" name="nombre" value={form.nombre} onChange={handleChange}
                                    placeholder="Ej: Mochila de senderismo 40L" required
                                    className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                                     placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="descripcion" className="block text-white text-sm font-medium mb-2">Descripción</label>
                                <textarea
                                    id="descripcion" name="descripcion" rows={4} value={form.descripcion} onChange={handleChange}
                                    placeholder="Describe el producto..."
                                    className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                                     placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <label htmlFor="precio" className="block text-white text-sm font-medium mb-2">Precio (€) *</label>
                                    <input
                                        type="number" id="precio" name="precio" value={form.precio} onChange={handleChange}
                                        placeholder="Ej: 49.99" step="0.01" min="0" required
                                        className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                                         placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="stock" className="block text-white text-sm font-medium mb-2">Stock *</label>
                                    <input
                                        type="number" id="stock" name="stock" value={form.stock} onChange={handleChange}
                                        placeholder="Ej: 100" step="1" min="0" required
                                        className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                                         placeholder:text-[#aaa] focus:border-white focus:bg-white/15 font-[Montserrat]"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="categoria" className="block text-white text-sm font-medium mb-2">Categoría *</label>
                                <select
                                    id="categoria" name="categoria" value={form.categoria} onChange={handleChange} required
                                    className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                                     focus:border-white focus:bg-white/15 font-[Montserrat]"
                                >
                                    <option value="" className="bg-primary-dark">Selecciona una categoría</option>
                                    {CATEGORIAS.map(cat => (
                                        <option key={cat} value={cat} className="bg-primary-dark">{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-white text-sm font-medium mb-2">Imagen del producto (Máx. 1 imagen, 3MB)</label>
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
                                    <p className="text-white/50 text-xs mt-3">Formatos: JPG, PNG, GIF, WEBP — Máx. 1 imagen de 3MB</p>
                                    {imagenFileName && (
                                        <p className="text-white/70 text-xs mt-2">Archivo seleccionado: {imagenFileName}</p>
                                    )}
                                    {imagenPreview && (
                                        <div className="mt-4">
                                            <img src={imagenPreview} alt="Preview" className="max-h-[200px] rounded-lg" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col md:flex-row justify-end gap-4">
                                <Link
                                    to="/admin"
                                    className="inline-flex justify-center items-center px-8 py-3 bg-transparent border-2 border-white/50 rounded-full
                                     text-white no-underline text-base hover:border-white hover:bg-white/10 transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex justify-center items-center px-8 py-3 bg-accent rounded-full text-white text-base
                                     font-semibold hover:bg-primary-light transition-colors border-none cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? 'Creando...' : 'Crear Producto'}
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
