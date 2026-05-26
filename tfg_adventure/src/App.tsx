import { lazy, Suspense } from 'react';
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
