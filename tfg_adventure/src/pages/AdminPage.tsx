import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { adminService, type AdminUpdateUsuarioRequest } from '../services/adminService';
import type { Usuario, Ruta } from '../types';

type Tab = 'usuarios' | 'rutas';

export default function AdminPage() {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState<Tab>('usuarios');
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
    const [editForm, setEditForm] = useState<AdminUpdateUsuarioRequest>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!usuario || usuario.rol !== 'admin') {
            navigate('/');
        }
    }, [usuario, navigate]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [usuariosRes, rutasRes] = await Promise.all([
                adminService.getUsuarios(),
                adminService.getRutas(),
            ]);
            setUsuarios(usuariosRes.data);
            setRutas(rutasRes.data);
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
                    <div className="mb-4 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-4 font-bold bg-transparent border-none text-white cursor-pointer">✕</button>
                    </div>
                )}

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setTab('usuarios')}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer border-none ${tab === 'usuarios' ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Usuarios ({usuarios.length})
                    </button>
                    <button
                        onClick={() => setTab('rutas')}
                        className={`px-6 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer border-none ${tab === 'rutas' ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        Rutas ({rutas.length})
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
                                                <tr key={u.id_usuario} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 text-gray-400">{u.id_usuario}</td>
                                                    <td className="px-4 py-3 font-medium">{u.nombre_usuario}</td>
                                                    <td className="px-4 py-3 text-gray-300">{u.email}</td>
                                                    <td className="px-4 py-3 text-gray-300">{[u.nombre, u.apellido].filter(Boolean).join(' ') || '—'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.rol === 'admin' ? 'bg-purple-600' : 'bg-gray-600'}`}>
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
                                            <div key={u.id_usuario} className="bg-black/30 rounded-xl p-4 space-y-2 border border-white/10">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-gray-400 text-xs">ID: {u.id_usuario}</p>
                                                        <p className="text-white font-semibold text-sm">{u.nombre_usuario}</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${u.rol === 'admin' ? 'bg-purple-600' : 'bg-gray-600'}`}>
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

                        {tab === 'rutas' && (
                            <>
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
                                                <tr key={r.id_ruta} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="px-4 py-3 text-gray-400">{r.id_ruta}</td>
                                                    <td className="px-4 py-3 font-medium">{r.nombre_ruta}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.dificultad === 'Alta' ? 'bg-red-700' : r.dificultad === 'Media' ? 'bg-yellow-600' : 'bg-green-700'}`}>
                                                            {r.dificultad}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-300">{r.distancia_km} km</td>
                                                    <td className="px-4 py-3 text-gray-300">{r.media_puntuacion ? r.media_puntuacion.toFixed(1) : '—'}</td>
                                                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                        <Link
                                                            to={`/ruta/${r.id_ruta}/editar`}
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
                                            <div key={r.id_ruta} className="bg-black/30 rounded-xl p-4 space-y-2 border border-white/10">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-gray-400 text-xs">ID: {r.id_ruta}</p>
                                                        <p className="text-white font-semibold text-sm">{r.nombre_ruta}</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.dificultad === 'Alta' ? 'bg-red-700' : r.dificultad === 'Media' ? 'bg-yellow-600' : 'bg-green-700'}`}>
                                                        {r.dificultad}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-300 space-y-1">
                                                    <p><span className="text-gray-400">Distancia:</span> {r.distancia_km} km</p>
                                                    <p><span className="text-gray-400">Puntuación:</span> {r.media_puntuacion ? r.media_puntuacion.toFixed(1) : '—'}</p>
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <Link
                                                        to={`/ruta/${r.id_ruta}/editar`}
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
                    </>
                )}
            </main>

            {editingUsuario && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-white text-xl font-bold mb-5">Editar usuario #{editingUsuario.id_usuario}</h2>
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
                                onClick={() => { setEditingUsuario(null); setError(null); }}
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
