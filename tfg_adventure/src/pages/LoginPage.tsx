import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

export default function LoginPage() {
    const { login, usuario } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const mensajeExito = (location.state as { mensaje?: string } | null)?.mensaje;
    const [email, setEmail] = useState(() => localStorage.getItem('email_recordado') || '');
    const [contrasena, setContrasena] = useState('');
    const [recordar, setRecordar] = useState(() => !!localStorage.getItem('email_recordado'));
    const [loading, setLoading] = useState(false);

    if (usuario) return <Navigate to="/" replace />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const err = await login(email.trim(), contrasena.trim());
        if (err) {
            addToast(err, 'error');
            setContrasena('');
            setLoading(false);
        } else {
            if (recordar) {
                localStorage.setItem('email_recordado', email);
            } else {
                localStorage.removeItem('email_recordado');
            }
            navigate('/');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                <Header transparent />
            </header>

            <main
                className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark py-12">
                <div className="text-center px-6 w-full max-w-md">
                    <h1 className="text-white text-4xl font-bold mb-10 tracking-wider">Iniciar Sesión</h1>

                    {mensajeExito && (
                        <div
                            className="bg-green-500/30 border border-green-400 text-white p-4 rounded-xl mb-6 text-center text-sm">
                            {mensajeExito}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 text-left">
                            <label htmlFor="email" className="block text-white text-sm mb-2 font-medium">Email</label>
                            <div className="relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </svg>
                                <input
                                    type="email"
                                    id="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Tu correo electrónico"
                                    required
                                    disabled={loading}
                                    className="w-full p-4 pl-12 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="mb-6 text-left">
                            <label htmlFor="contrasena"
                                className="block text-white text-sm mb-2 font-medium">Contraseña</label>
                            <div className="relative">
                                <img src="/Img/Icons/lock.png" alt="Contraseña"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[25px] h-[25px]" />
                                <input
                                    type="password"
                                    id="contrasena"
                                    autoComplete="current-password"
                                    value={contrasena}
                                    onChange={e => setContrasena(e.target.value)}
                                    placeholder="Tu contraseña"
                                    required
                                    disabled={loading}
                                    className="w-full p-4 pl-12 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="mb-6 flex items-center gap-2.5">
                            <input
                                type="checkbox"
                                id="recordar"
                                checked={recordar}
                                onChange={e => setRecordar(e.target.checked)}
                                disabled={loading}
                                className="w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <label htmlFor="recordar" className="text-white text-sm cursor-pointer">Recordar mi email</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full p-4 text-base font-medium text-primary-dark bg-white border-none rounded-full cursor-pointer mt-4
                         hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"
                                            opacity="0.25"></circle>
                                        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2"
                                            fill="none"></path>
                                    </svg>
                                    <span>Iniciando sesión...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                        strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                    <span>Entrar</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <Link to="/forgot-password" className="text-white no-underline text-sm hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <div className="mt-4">
                        <Link to="/register" className="text-white no-underline text-sm hover:underline">
                            ¿No tienes cuenta? Regístrate
                        </Link>
                    </div>

                    <div className="mt-6">
                        <Link to="/"
                            className="text-white no-underline text-sm hover:underline inline-flex items-center gap-2">
                            <img src="/Img/Icons/arrow_left.png" alt="Volver"
                                className="w-[25px] h-[25px] align-middle" />
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
