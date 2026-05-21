import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { resetPassword } from '../services/authService';
import { useToast } from '../hooks/useToast';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token') ?? '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            addToast('Las contraseñas no coinciden.', 'error');
            return;
        }

        if (newPassword.length < 6) {
            addToast('La contraseña debe tener al menos 6 caracteres.', 'error');
            return;
        }

        setLoading(true);

        try {
            await resetPassword(token, newPassword);
            addToast('Contraseña actualizada correctamente. Ya puedes iniciar sesión.', 'success');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 400) {
                addToast('El enlace ha expirado o ya ha sido utilizado. Solicita uno nuevo.', 'error');
            } else {
                addToast('Ha ocurrido un error. Inténtalo de nuevo más tarde.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                    <Header transparent />
                </header>
                <main
                    className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark py-12">
                    <div className="text-center px-6 w-full max-w-md">
                        <p className="text-white text-lg mb-6">El enlace de recuperación no es válido.</p>
                        <Link to="/forgot-password" className="text-white underline text-sm">
                            Solicitar un nuevo enlace
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                <Header transparent />
            </header>

            <main
                className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark py-12">
                <div className="text-center px-6 w-full max-w-md">
                    <h1 className="text-white text-4xl font-bold mb-4 tracking-wider">Nueva contraseña</h1>
                    <p className="text-white/80 text-sm mb-10">
                        Introduce tu nueva contraseña para recuperar el acceso a tu cuenta.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 text-left">
                            <label htmlFor="newPassword" className="block text-white text-sm mb-2 font-medium">Nueva
                                contraseña</label>
                            <div className="relative">
                                <img src="/Img/Icons/lock.png" alt="Contraseña"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[25px] h-[25px]" />
                                <input
                                    type="password"
                                    id="newPassword"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    disabled={loading}
                                    className="w-full p-4 pl-12 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none 
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="mb-6 text-left">
                            <label htmlFor="confirmPassword" className="block text-white text-sm mb-2 font-medium">Confirmar
                                contraseña</label>
                            <div className="relative">
                                <img src="/Img/Icons/lock.png" alt="Confirmar"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[25px] h-[25px]" />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Repite la contraseña"
                                    required
                                    disabled={loading}
                                    className="w-full p-4 pl-12 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none 
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
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
                                    <span>Guardando...</span>
                                </>
                            ) : (
                                <span>Guardar nueva contraseña</span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <Link to="/login" className="text-white no-underline text-sm hover:underline">
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
