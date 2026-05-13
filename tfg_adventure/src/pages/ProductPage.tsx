import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from '../components/Image';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/useToast';
import type { Producto } from '../types';
import { productoService } from '../services/productoService';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    productoService.getById(Number(id))
      .then(response => {
        setProducto(response.data);
      })
      .catch(() => {
        setProducto(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-surface-dark flex items-center justify-center">
          <p className="text-white text-center py-20">Cargando producto...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-surface-dark flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-white text-2xl mb-4">Producto no encontrado</h2>
            <Link to="/tienda" className="text-primary-light hover:underline">Volver a la tienda</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (producto.stock === 0) {
      addToast('Este producto no tiene stock disponible. ¡Próximamente estará disponible!', 'info');
      return;
    }
    if (!usuario) {
      addToast("Por favor, inicia sesión para añadir al carrito", 'info');
      navigate('/login');
      return;
    }
    addToCart(producto, cantidad);
    addToast(`${producto.nombre} añadido al carrito`, 'success');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-primary-light to-primary-dark">
        <Header transparent />
      </header>

      <main className="flex-1 bg-surface-dark py-12 px-[5%]">
        <Link to="/tienda" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors no-underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver a la tienda
        </Link>

        <div className="bg-surface rounded-2xl overflow-hidden border border-[#333] flex flex-col md:flex-row shadow-2xl">
          {/* Image */}
          <div className="md:w-2/5 relative overflow-hidden">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              containerClassName="w-full min-h-[280px]"
              className="w-full h-full object-cover min-h-[280px]"
            />
            <div className="absolute top-4 left-4 bg-primary-dark text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
              {producto.categoria}
            </div>
          </div>

          {/* Details */}
          <div className="md:w-3/5 p-8 md:p-12 flex flex-col">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <h1 className="text-white text-3xl md:text-4xl font-bold">{producto.nombre}</h1>
              {usuario?.rol === 'admin' && (
                <Link
                  to={`/producto/${producto.id_producto}/editar`}
                  className="px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg text-sm font-medium transition-colors flex-shrink-0 no-underline"
                >
                  Editar producto
                </Link>
              )}
            </div>
            <div className="mb-8">
              <span className="text-gray-400 text-sm font-medium block mb-2">PRECIO</span>
              <p className="text-white text-5xl md:text-6xl font-bold tracking-tight">
                {producto.precio.toFixed(2)}
                <span className="text-3xl md:text-4xl ml-2">€</span>
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-white text-lg mb-2 font-medium">Descripción</h3>
              <p className="text-[#bbb] leading-relaxed text-base">{producto.descripcion}</p>
            </div>

            <div className="border-t border-white/10 pt-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-300">Cantidad:</span>
                <div className="flex items-center bg-[#222] rounded-lg overflow-hidden border border-[#444]">
                  <button
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    disabled={producto.stock === 0}
                    className={`px-4 py-2 text-white bg-transparent border-none transition-colors cursor-pointer ${producto.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#333]'}`}
                  >
                    -
                  </button>
                  <span className="text-white px-4 py-2 font-medium min-w-[3ch] text-center border-l border-r border-[#444]">
                    {cantidad}
                  </span>
                  <button
                    onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                    disabled={producto.stock === 0 || cantidad >= producto.stock}
                    className={`px-4 py-2 text-white bg-transparent border-none transition-colors cursor-pointer ${producto.stock === 0 || cantidad >= producto.stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#333]'}`}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-400">({producto.stock} disponibles)</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={producto.stock === 0}
                className={`w-full font-bold py-4 rounded-xl transition-colors text-lg shadow-lg text-white flex items-center justify-center gap-2 cursor-pointer border-none ${producto.stock === 0 ? 'bg-gray-600 opacity-50 cursor-not-allowed' : 'bg-primary-dark hover:bg-primary-light text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {producto.stock === 0 ? 'Próximamente' : 'Añadir al carrito'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
