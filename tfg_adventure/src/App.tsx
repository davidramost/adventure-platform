import { lazy, Suspense, useState, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ToastContainer from './components/ToastContainer';
import ServerUnavailableBanner from './components/ServerUnavailableBanner';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ContentPage from './pages/ContentPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePage from './pages/CreatePage';
import EditRutaPage from './pages/EditRutaPage';
import ProfilePage from './pages/ProfilePage';
import InfoPage from './pages/InfoPage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import NotFoundPage from './pages/NotFoundPage';
import CreateProductoPage from './pages/CreateProductoPage';
import EditProductoPage from './pages/EditProductoPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const AdminPage = lazy(() => import('./pages/AdminPage'));

function App() {
    const [isServerReady, setIsServerReady] = useState(() => {
        return sessionStorage.getItem('serverReady') === 'true';
    });

    useEffect(() => {
        // If already marked as ready in this session, no need to check again and delay rendering
        if (isServerReady) return;

        let isMounted = true;
        
        const checkServer = async () => {
            const baseUrl = import.meta.env.VITE_API_URL || 'https://tfg-daw-smx4.onrender.com/api';
            
            const ping = async (retries = 24) => {
                if (!isMounted) return;
                try {
                    const response = await fetch(`${baseUrl}/health`);
                    if (response.ok && isMounted) {
                        sessionStorage.setItem('serverReady', 'true');
                        setIsServerReady(true);
                    } else if (isMounted) {
                        throw new Error('Server not ready yet');
                    }
                } catch (error) {
                    if (isMounted && retries > 0) {
                        setTimeout(() => ping(retries - 1), 5000);
                    } else if (isMounted) {
                        setIsServerReady(true);
                    }
                }
            };
            
            ping();
        };
        
        checkServer();

        return () => {
            isMounted = false;
        };
    }, [isServerReady]);

    if (!isServerReady) {
        return (
            <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#263238] font-sans">
                {/* Background Video */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-1000"
                >
                    <source src="/Img/mountain_video.mp4" type="video/mp4" />
                </video>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-white px-6 w-full max-w-lg animate-fade-in-down">
                    {/* Logo Section */}
                    <div className="relative flex items-center justify-center mb-16 mt-4">
                        {/* Outer pulsing ring */}
                        <div className="absolute w-64 h-64 rounded-full border border-white/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30"></div>
                        {/* Inner spinning ring */}
                        <div className="absolute w-56 h-56 rounded-full border-2 border-white/20 border-t-white/80 animate-[spin_4s_linear_infinite]"></div>
                        {/* Logo Image */}
                        <img 
                            src="/Img/logo_adventure.png" 
                            alt="Adventure Platform" 
                            className="w-44 h-44 object-contain z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/Img/the_logo.png';
                            }}
                        />
                    </div>

                    {/* Status Card */}
                    <div className="flex flex-col items-center bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <h2 className="text-lg font-medium tracking-wider text-white/90 uppercase text-sm">
                                Iniciando Sistemas
                            </h2>
                        </div>

                        <p className="text-gray-300 text-center text-sm leading-relaxed mb-6 font-light">
                            Conectando con el servidor base...<br />
                            <span className="opacity-50 text-xs mt-2 block italic">Este proceso puede tardar un par de minutos en el primer inicio.</span>
                        </p>

                        <div className="w-full bg-white/5 rounded-full h-1 mb-1 overflow-hidden relative">
                            {/* Indeterminate progress animation */}
                            <div className="absolute top-0 bottom-0 left-0 bg-emerald-500/80 w-1/2 rounded-full animate-[shimmer_2s_infinite_ease-in-out]"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <ScrollToTop />
            <ToastContainer />
            <ServerUnavailableBanner />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/senderos" element={<CategoryPage />} />
                <Route path="/ruta/:id/editar" element={<EditRutaPage />} />
                <Route path="/ruta/:id" element={<ContentPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/crear-ruta" element={<CreatePage />} />
                <Route path="/favoritos" element={<Navigate to="/perfil" replace />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/info" element={<InfoPage />} />
                <Route path="/tienda" element={<StorePage />} />
                <Route path="/producto/crear" element={<CreateProductoPage />} />
                <Route path="/producto/:id/editar" element={<EditProductoPage />} />
                <Route path="/producto/:id" element={<ProductPage />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <Suspense fallback={
                                <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-light to-primary-dark">
                                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            }>
                                <AdminPage />
                            </Suspense>
                        </AdminRoute>
                    }
                />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;
