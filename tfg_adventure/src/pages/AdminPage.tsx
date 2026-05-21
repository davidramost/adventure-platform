import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { adminService, type AdminUpdateUsuarioRequest } from '../services/adminService';
import type { PedidoResponse, Producto, Ruta, Usuario } from '../types';

type Tab = 'usuarios' | 'rutas' | 'productos' | 'pedidos';

export default function AdminPage() {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('usuarios');
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
    const [editForm, setEditForm] = useState<AdminUpdateUsuarioRequest>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [allPedidos, setAllPedidos] = useState<PedidoResponse[]>([]);
    const [selectedUsuarioId, setSelectedUsuarioId] = useState<string>('');

    useEffect(() => {
        if (!usuario || usuario.rol !== 'admin') {
            navigate('/');
        }
    }, [usuario, navigate]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [usuariosRes, rutasRes, productosRes, pedidosRes] = await Promise.all([
                adminService.getUsuarios(),
                adminService.getRutas(),
                adminService.getProductos(),
                adminService.getAllPedidos(),
            ]);
            setUsuarios(usuariosRes.data);
            setRutas(rutasRes.data);
            setProductos(productosRes.data);
            setAllPedidos(pedidosRes.data);
        } catch {
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(null), 3000);
    };

    const handleDeleteUsuario = async (id: number) => {
        if (!confirm('¿Seguro que quieres eliminar este usuario? Se borrarán todas sus rutas y datos.')) return;
        try {
            await adminService.deleteUsuario(id);
            setUsuarios(prev => prev.filter(u => u.id_usuario !== id));
            showSuccess('Usuario eliminado correctamente');
        } catch {
            setError('Error al eliminar el usuario');
        }
    };

    const handleDeleteRuta = async (id: number) => {
        if (!confirm('¿Seguro que quieres eliminar esta ruta?')) return;
        try {
            await adminService.deleteRuta(id);
            setRutas(prev => prev.filter(r => r.id_ruta !== id));
            showSuccess('Ruta eliminada correctamente');
        } catch {
            setError('Error al eliminar la ruta');
        }
    };

    const handleDeleteProducto = async (id: number) => {
        if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
        try {
            await adminService.deleteProducto(id);
            setProductos(prev => prev.filter(p => p.id_producto !== id));
            showSuccess('Producto eliminado correctamente');
        } catch {
            setError('Error al eliminar el producto');
        }
    };

    const handleTabChange = (t: Tab) => {
        setTab(t);
    };

    const startEditUsuario = (u: Usuario) => {
        setEditingUsuario(u);
        setEditForm({
            nombre_usuario: u.nombre_usuario,
            nombre: u.nombre ?? '',
            apellido: u.apellido ?? '',
            domicilio: u.domicilio ?? '',
            fact_domicilio: u.fact_domicilio ?? '',
        });
    };

    const handleSaveUsuario = async () => {
        if (!editingUsuario) return;
        setSaving(true);
        setError(null);
        try {
            const res = await adminService.updateUsuario(editingUsuario.id_usuario, editForm);
            setUsuarios(prev => prev.map(u => u.id_usuario === editingUsuario.id_usuario ? res.data : u));
            setEditingUsuario(null);
            showSuccess('Usuario actualizado correctamente');
        } catch {
            setError('Error al guardar los cambios');
        } finally {
            setSaving(false);
        }
    };

    if (!usuario || usuario.rol !== 'admin') return null;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-light to-primary-dark">
            <Header />
            <main className="flex-1 px-4 md:px-8 py-8 max-w-7xl mx-auto w-full">
                <h1 className="text-white text-3xl font-bold italic tracking-wider mb-8">Panel de Administración</h1>

                {successMsg && (
                    <div className="mb-4 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-medium">
                        {successMsg}
                    </div>
                )}
                {error && (
                    <div
                        className="mb-4 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError(null)}
                            className="ml-4 font-bold bg-transparent border-none text-white cursor-pointer">✕
                        </button>
                    </div>
                )}

                <div className="flex gap-2 mb-6 flex-wrap">
                    <button
                        onClick={() => handleTabChange('usuarios')}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer border-none ${tab === 'usuarios' ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Usuarios ({usuarios.length})
                    </button>
                    <button
                        onClick={() => handleTabChange('rutas')}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer border-none ${tab === 'rutas' ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Rutas ({rutas.length})
                    </button>
                    <button
                        onClick={() => handleTabChange('productos')}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer border-none ${tab === 'productos' ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Productos ({productos.length})
                    </button>
                    <button
                        onClick={() => handleTabChange('pedidos')}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer border-none ${tab === 'pedidos' ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Pedidos ({allPedidos.length})
                    </button>
                </div>

                {loading ? (
                    <div className="text-white text-center py-16">Cargando...</div>
                ) : (
                    <>
                        {tab === 'usuarios' && (
                            <>
                                <div className="hidden md:block bg-black/30 rounded-2xl overflow-hidden">
                                    <table className="w-full text-sm text-white">
                                        <thead>
                                            <tr className="border-b border-white/10 text-left text-gray-400 text-xs uppercase tracking-wider">
                                                <th className="px-4 py-3">ID</th>
                                                <th className="px-4 py-3">Usuario</th>
                                                <th className="px-4 py-3">Email</th>
                                                <th className="px-4 py-3">Nombre</th>
                                                <th className="px-4 py-3">Rol</th>
                                                <th className="px-4 py-3 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usuarios.map(u => (
                                                <tr key={u.id_usuario}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 text-gray-400">{u.id_usuario}</td>
                                                    <td className="px-4 py-3 font-medium">{u.nombre_usuario}</td>
                                                    <td className="px-4 py-3 text-gray-300">{u.email}</td>
                                                    <td className="px-4 py-3 text-gray-300">{[u.nombre, u.apellido].filter(Boolean).join(' ') || '—'}</td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`px-2 py-0.5 rounded text-xs font-semibold ${u.rol === 'admin' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                                                            {u.rol}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                        <button
                                                            onClick={() => startEditUsuario(u)}
                                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium transition-colors border-none cursor-pointer text-white"
                                                        >
                                                            Editar
                                                        </button>
                                                        {u.id_usuario !== usuario.id_usuario && (
                                                            <button
                                                                onClick={() => handleDeleteUsuario(u.id_usuario)}
                                                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-medium transition-colors border-none cursor-pointer text-white"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {usuarios.length === 0 && (
                                        <p className="text-center text-gray-400 py-8">No hay usuarios</p>
                                    )}
                                </div>

                                <div className="md:hidden space-y-3">
                                    {usuarios.length === 0 ? (
                                        <p className="text-center text-gray-400 py-8">No hay usuarios</p>
                                    ) : (
                                        usuarios.map(u => (
                                            <div key={u.id_usuario}
                                                className="bg-black/30 rounded-xl p-4 space-y-2 border border-white/10">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-gray-400 text-xs">ID: {u.id_usuario}</p>
                                                        <p className="text-white font-semibold text-sm">{u.nombre_usuario}</p>
                                                    </div>
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-xs font-semibold ${u.rol === 'admin' ? 'bg-purple-600' : 'bg-gray-600'}`}>
                                                        {u.rol}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-300">
                                                    <p className="truncate">{u.email}</p>
                                                    <p>{[u.nombre, u.apellido].filter(Boolean).join(' ') || '—'}</p>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        onClick={() => startEditUsuario(u)}
                                                        className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium transition-colors border-none cursor-pointer text-white"
                                                    >
                                                        Editar
                                                    </button>
                                                    {u.id_usuario !== usuario.id_usuario && (
                                                        <button
                                                            onClick={() => handleDeleteUsuario(u.id_usuario)}
                                                            className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-medium transition-colors border-none cursor-pointer text-white"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        {tab === 'productos' && (
                            <>
                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={() => navigate('/producto/crear')}
                                        className="px-5 py-2 bg-accent hover:bg-accent/80 text-white text-sm font-semibold rounded-xl transition-colors border-none cursor-pointer"
                                    >
                                        + Crear producto
                                    </button>
                                </div>
                                <div className="hidden md:block bg-black/30 rounded-2xl overflow-hidden">
                                    <table className="w-full text-sm text-white">
                                        <thead>
                                            <tr className="border-b border-white/10 text-left text-gray-400 text-xs uppercase tracking-wider">
                                                <th className="px-4 py-3">ID</th>
                                                <th className="px-4 py-3">Nombre</th>
                                                <th className="px-4 py-3">Precio</th>
                                                <th className="px-4 py-3">Stock</th>
                                                <th className="px-4 py-3">Categoría</th>
                                                <th className="px-4 py-3 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productos.map(p => (
                                                <tr key={p.id_producto}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 text-gray-400">{p.id_producto}</td>
                                                    <td className="px-4 py-3 font-medium">{p.nombre}</td>
                                                    <td className="px-4 py-3 text-gray-300">{p.precio.toFixed(2)} €</td>
                                                    <td className="px-4 py-3 text-gray-300">{p.stock}</td>
                                                    <td className="px-4 py-3 text-gray-300">{p.categoria}</td>
                                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                        <Link
                                                            to={`/producto/${p.id_producto}/editar`}
                                                            state={{ from: 'admin' }}
                                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium transition-colors text-white no-underline"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteProducto(p.id_producto)}
                                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-medium transition-colors border-none cursor-pointer text-white"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {productos.length === 0 && (
                                        <p className="text-center text-gray-400 py-8">No hay productos</p>
                                    )}
                                </div>

                                <div className="md:hidden space-y-3">
                                    {productos.length === 0 ? (
                                        <p className="text-center text-gray-400 py-8">No hay productos</p>
                                    ) : (
                                        productos.map(p => (
                                            <div key={p.id_producto}
                                                className="bg-black/30 rounded-xl p-4 space-y-2 border border-white/10">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-gray-400 text-xs">ID: {p.id_producto}</p>
                                                        <p className="text-white font-semibold text-sm">{p.nombre}</p>
                                                    </div>
                                                    <span
                                                        className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-600">{p.categoria}</span>
                                                </div>
                                                <div className="text-xs text-gray-300 space-y-1">
                                                    <p><span
                                                        className="text-gray-400">Precio:</span> {p.precio.toFixed(2)} €
                                                    </p>
                                                    <p><span className="text-gray-400">Stock:</span> {p.stock}</p>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Link
                                                        to={`/producto/${p.id_producto}/editar`}
                                                        state={{ from: 'admin' }}
                                                        className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium transition-colors text-white text-center no-underline"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteProducto(p.id_producto)}
                                                        className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-medium transition-colors border-none cursor-pointer text-white"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        {tab === 'rutas' && (
                            <>
                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={() => navigate('/crear-ruta')}
                                        className="px-5 py-2 bg-accent hover:bg-accent/80 text-white text-sm font-semibold rounded-xl transition-colors border-none cursor-pointer"
                                    >
                                        + Crear ruta
                                    </button>
                                </div>
                                <div className="hidden md:block bg-black/30 rounded-2xl overflow-hidden">
                                    <table className="w-full text-sm text-white">
                                        <thead>
                                            <tr className="border-b border-white/10 text-left text-gray-400 text-xs uppercase tracking-wider">
                                                <th className="px-4 py-3">ID</th>
                                                <th className="px-4 py-3">Nombre</th>
                                                <th className="px-4 py-3">Dificultad</th>
                                                <th className="px-4 py-3">Distancia</th>
                                                <th className="px-4 py-3">Puntuación</th>
                                                <th className="px-4 py-3 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rutas.map(r => (
                                                <tr key={r.id_ruta}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 text-gray-400">{r.id_ruta}</td>
                                                    <td className="px-4 py-3 font-medium">{r.nombre_ruta}</td>
                                                    <td className="px-4 py-3">
                                                        <span
                                                            className={`px-2 py-0.5 rounded text-xs font-semibold ${r.dificultad === 'Alta' ? 'bg-red-700' : r.dificultad === 'Media' ? 'bg-yellow-600' : 'bg-green-700'}`}>
                                                            {r.dificultad}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-300">{r.distancia_km} km</td>
                                                    <td className="px-4 py-3 text-gray-300">{r.media_puntuacion ? r.media_puntuacion.toFixed(1) : '—'}</td>
                                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                        <Link
                                                            to={`/ruta/${r.id_ruta}/editar`}
                                                            state={{ from: 'admin' }}
                                                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium transition-colors text-white no-underline"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteRuta(r.id_ruta)}
                                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-medium transition-colors border-none cursor-pointer text-white"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {rutas.length === 0 && (
                                        <p className="text-center text-gray-400 py-8">No hay rutas</p>
                                    )}
                                </div>

                                <div className="md:hidden space-y-3">
                                    {rutas.length === 0 ? (
                                        <p className="text-center text-gray-400 py-8">No hay rutas</p>
                                    ) : (
                                        rutas.map(r => (
                                            <div key={r.id_ruta}
                                                className="bg-black/30 rounded-xl p-4 space-y-2 border border-white/10">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-gray-400 text-xs">ID: {r.id_ruta}</p>
                                                        <p className="text-white font-semibold text-sm">{r.nombre_ruta}</p>
                                                    </div>
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-xs font-semibold ${r.dificultad === 'Alta' ? 'bg-red-700' : r.dificultad === 'Media' ? 'bg-yellow-600' : 'bg-green-700'}`}>
                                                        {r.dificultad}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-300 space-y-1">
                                                    <p><span
                                                        className="text-gray-400">Distancia:</span> {r.distancia_km} km
                                                    </p>
                                                    <p><span
                                                        className="text-gray-400">Puntuación:</span> {r.media_puntuacion ? r.media_puntuacion.toFixed(1) : '—'}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Link
                                                        to={`/ruta/${r.id_ruta}/editar`}
                                                        state={{ from: 'admin' }}
                                                        className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-medium transition-colors text-white text-center no-underline"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteRuta(r.id_ruta)}
                                                        className="flex-1 px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-medium transition-colors border-none cursor-pointer text-white"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        {tab === 'pedidos' && (
                            <div>
                                <div className="mb-6">
                                    <label htmlFor="usuario-select" className="block text-gray-300 text-sm font-medium mb-2">
                                        Filtrar por usuario
                                    </label>
                                    <select
                                        id="usuario-select"
                                        value={selectedUsuarioId}
                                        onChange={e => setSelectedUsuarioId(e.target.value)}
                                        className="w-full max-w-xs px-3 py-2 bg-gray-900 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                                        style={{ backgroundColor: '#111827', color: '#ffffff' }}
                                    >
                                        <option value="">Todos los usuarios</option>
                                        {usuarios.map(u => (
                                            <option key={u.id_usuario} value={String(u.id_usuario)}>
                                                {u.nombre_usuario} ({u.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {(() => {
                                    const pedidosFiltrados = selectedUsuarioId
                                        ? allPedidos.filter(p => String(p.id_usuario) === selectedUsuarioId)
                                        : allPedidos;
                                    return pedidosFiltrados.length === 0 ? (
                                        <p className="text-gray-400 text-center py-16">
                                            {selectedUsuarioId ? 'Este usuario no tiene pedidos' : 'No hay pedidos registrados'}
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {pedidosFiltrados.map(pedido => (
                                                <div key={pedido.id_pedido} className="bg-black/30 rounded-2xl p-5 border border-white/10">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <p className="text-white font-semibold">Pedido #{pedido.id_pedido}</p>
                                                            <p className="text-gray-400 text-xs mt-0.5">
                                                                {new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(pedido.fecha))}
                                                            </p>
                                                            {pedido.nombre_usuario && (
                                                                <p className="text-gray-400 text-xs mt-0.5">
                                                                    Usuario: <span className="text-gray-300">{pedido.nombre_usuario}</span>
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-white font-bold text-lg" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(pedido.total)}
                                                            </p>
                                                            <p className="text-gray-400 text-xs mt-0.5">{pedido.metodo_pago}</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {pedido.lineas.map(linea => (
                                                            <div key={linea.id_producto} className="flex justify-between items-center text-sm">
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    {linea.imagen_producto && (
                                                                        <img src={linea.imagen_producto} alt={linea.nombre_producto} width={32} height={32} className="w-8 h-8 rounded object-cover shrink-0" />
                                                                    )}
                                                                    <span className="text-gray-300 truncate">{linea.nombre_producto}</span>
                                                                    <span className="text-gray-500 shrink-0">×{linea.cantidad}</span>
                                                                </div>
                                                                <span className="text-gray-300 shrink-0 ml-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                                                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(linea.subtotal)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-4 text-xs text-gray-400">
                                                        <span>{pedido.tipo_envio.replace('_', ' ')}</span>
                                                        <span className="truncate">{pedido.direccion_envio}</span>
                                                        {pedido.gasto_envio > 0 && (
                                                            <span>Envío: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(pedido.gasto_envio)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </>
                )}
            </main>

            {editingUsuario && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-white text-xl font-bold mb-5">Editar usuario
                            #{editingUsuario.id_usuario}</h2>
                        <div className="flex flex-col gap-3">
                            <label className="text-gray-300 text-sm">
                                Nombre de usuario
                                <input
                                    type="text"
                                    value={editForm.nombre_usuario ?? ''}
                                    onChange={e => setEditForm(f => ({ ...f, nombre_usuario: e.target.value }))}
                                    className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                                />
                            </label>
                            <label className="text-gray-300 text-sm">
                                Nombre
                                <input
                                    type="text"
                                    value={editForm.nombre ?? ''}
                                    onChange={e => setEditForm(f => ({ ...f, nombre: e.target.value }))}
                                    className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                                />
                            </label>
                            <label className="text-gray-300 text-sm">
                                Apellido
                                <input
                                    type="text"
                                    value={editForm.apellido ?? ''}
                                    onChange={e => setEditForm(f => ({ ...f, apellido: e.target.value }))}
                                    className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                                />
                            </label>
                            <label className="text-gray-300 text-sm">
                                Domicilio
                                <input
                                    type="text"
                                    value={editForm.domicilio ?? ''}
                                    onChange={e => setEditForm(f => ({ ...f, domicilio: e.target.value }))}
                                    className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-accent"
                                />
                            </label>
                        </div>
                        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
                        <div className="flex gap-3 mt-6 justify-end">
                            <button
                                onClick={() => {
                                    setEditingUsuario(null);
                                    setError(null);
                                }}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm transition-colors border-none cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveUsuario}
                                disabled={saving}
                                className="px-4 py-2 bg-accent hover:bg-accent/80 rounded-xl text-white text-sm font-semibold transition-colors border-none cursor-pointer disabled:opacity-50"
                            >
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
