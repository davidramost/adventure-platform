import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { forgotPassword } from '../services/authService';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await forgotPassword(email.trim());
            setSuccess(true);
        } catch {
            setError('Ha ocurrido un error. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                <Header transparent />
            </header>

            <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark py-12">
                <div className="text-center px-6 w-full max-w-md">
                    <h1 className="text-white text-4xl font-bold mb-4 tracking-wider">Recuperar contraseña</h1>
                    <p className="text-white/80 text-sm mb-10">
                        Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
                    </p>

                    {error && (
                        <div className="bg-error/30 border border-error text-white p-4 rounded-xl mb-6 text-center text-sm">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="bg-white/20 border border-white/40 text-white p-6 rounded-xl text-sm leading-relaxed">
                            Si el email está registrado, recibirás un enlace de recuperación en unos minutos. Revisa también tu carpeta de spam.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6 text-left">
                                <label htmlFor="email" className="block text-white text-sm mb-2 font-medium">Email</label>
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full p-4 text-base font-medium text-primary-dark bg-white border-none rounded-full cursor-pointer mt-4
                           hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25"></circle>
                                            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" fill="none"></path>
                                        </svg>
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <span>Enviar enlace de recuperación</span>
                                )}
                            </button>
                        </form>
                    )}

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
