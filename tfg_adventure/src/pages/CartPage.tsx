import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { pedidoService } from '../services/pedidoService';

export default function CartPage() {
  const { usuario } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!usuario) {
      alert("Debes iniciar sesión para finalizar la compra.");
      navigate('/login');
      return;
    }
    try {
      await pedidoService.crear({
        lineas: cart.map(item => ({ id_producto: item.producto.id_producto, cantidad: item.cantidad })),
      });
      alert("¡Compra realizada con éxito! Gracias por tu pedido.");
      clearCart();
      navigate('/tienda');
    } catch {
      alert("Ha ocurrido un error al procesar tu pedido. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-primary-light to-primary-dark">
        <Header transparent />
      </header>

      <main className="flex-1 bg-surface-dark py-12 px-[5%]">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-8">Tu Carrito</h1>

          {cart.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-[#333] p-12 text-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mx-auto mb-6">
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <h2 className="text-white text-2xl mb-4">Tu carrito está vacío</h2>
              <p className="text-gray-400 mb-8">Parece que aún no has añadido ningún producto de nuestra tienda.</p>
              <Link to="/tienda" className="inline-block bg-primary-dark hover:bg-primary-light text-white font-bold py-3 px-8 rounded-full transition-colors no-underline">
                Ir a la Tienda
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items List */}
              <div className="lg:w-2/3">
                <div className="bg-surface rounded-2xl border border-[#333] overflow-hidden shadow-lg">
                  <div className="p-6 hidden sm:grid grid-cols-12 gap-4 border-b border-white/10 text-gray-400 text-sm font-medium">
                    <div className="col-span-6">Producto</div>
                    <div className="col-span-2 text-center">Precio</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>

                  <ul className="list-none p-0 m-0">
                    {cart.map((item) => (
                      <li key={item.producto.id_producto} className="p-6 border-b border-white/10 last:border-b-0 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                        {/* Product Info */}
                        <div className="col-span-6 flex items-center gap-4 w-full">
                          <button
                            onClick={() => removeFromCart(item.producto.id_producto)}
                            className="text-gray-500 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer p-1"
                            title="Eliminar producto"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                          </button>
                          <Link to={`/producto/${item.producto.id_producto}`} className="shrink-0">
                            <img src={item.producto.imagen} alt={item.producto.nombre} className="w-20 h-20 object-cover rounded-lg" />
                          </Link>
                          <Link to={`/producto/${item.producto.id_producto}`} className="no-underline text-white hover:text-primary-light transition-colors font-medium">
                            {item.producto.nombre}
                          </Link>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 text-center text-gray-300 w-full sm:w-auto flex justify-between sm:block">
                          <span className="sm:hidden text-gray-500">Precio:</span>
                          {item.producto.precio.toFixed(2)} €
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2 flex justify-center w-full sm:w-auto">
                          <div className="flex items-center bg-[#222] rounded overflow-hidden border border-[#444] inline-flex">
                            <button
                              onClick={() => updateQuantity(item.producto.id_producto, item.cantidad - 1)}
                              className="px-2 py-1 text-white bg-transparent border-none hover:bg-[#333] transition-colors cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-white px-2 py-1 text-sm min-w-[2ch] text-center border-l border-r border-[#444]">
                              {item.cantidad}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.producto.id_producto, Math.min(item.producto.stock, item.cantidad + 1))}
                              className="px-2 py-1 text-white bg-transparent border-none hover:bg-[#333] transition-colors cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="col-span-2 text-right text-white font-bold w-full sm:w-auto flex justify-between sm:block">
                          <span className="sm:hidden text-gray-500 font-normal">Subtotal:</span>
                          {(item.producto.precio * item.cantidad).toFixed(2)} €
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3">
                <div className="bg-surface rounded-2xl border border-[#333] p-6 shadow-lg sticky top-6">
                  <h2 className="text-white text-xl font-bold mb-6 border-b border-white/10 pb-4">Resumen de compra</h2>

                  <div className="flex justify-between mb-4 text-gray-300">
                    <span>Productos ({totalItems}):</span>
                    <span>{totalPrice.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between mb-6 text-gray-300">
                    <span>Envío:</span>
                    <span className="text-green-500">Gratis</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-8">
                    <span className="text-white font-bold text-lg">Total:</span>
                    <span className="text-white font-bold text-2xl">{totalPrice.toFixed(2)} €</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-primary-dark hover:bg-primary-light text-white font-bold py-3 rounded-xl transition-colors shadow-lg cursor-pointer border-none mb-4"
                  >
                    Finalizar Compra
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full bg-transparent hover:bg-white/5 text-gray-400 font-medium py-3 rounded-xl transition-colors cursor-pointer border border-gray-600 hover:border-gray-400"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
