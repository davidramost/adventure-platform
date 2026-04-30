import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ContentPage from './pages/ContentPage';
import GalleryPage from './pages/GalleryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePage from './pages/CreatePage';
import ProfilePage from './pages/ProfilePage';
import InfoPage from './pages/InfoPage';
import StorePage from './pages/StorePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/senderos" element={<CategoryPage />} />
      <Route path="/ruta/:id" element={<ContentPage />} />
      <Route path="/galeria" element={<GalleryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/crear-ruta" element={<CreatePage />} />
      <Route path="/favoritos" element={<Navigate to="/perfil" replace />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/info" element={<InfoPage />} />
      <Route path="/tienda" element={<StorePage />} />
      <Route path="/producto/:id" element={<ProductPage />} />
      <Route path="/carrito" element={<CartPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
