import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { type Producto, mockProductos } from '../data/mockProductos';

export default function StorePage() {
  const { usuario } = useAuth();
  const { addToCart } = useCart();
  const [productos] = useState<Producto[]>(mockProductos);
  const [search, setSearch] = useState('');

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(search.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-primary-light to-primary-dark">
        <Header transparent />
      </header>

      <main className="flex-1 bg-surface-dark">
        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center px-[5%] py-6 bg-gradient-to-br from-primary-light to-primary-dark border-t border-white/10">
          <h1 className="text-white text-lg font-bold m-0 leading-9 w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
            Tienda de Aventura
          </h1>
          <div className="flex items-center bg-[#555] rounded overflow-hidden mx-auto md:mx-0">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none text-white px-4 py-2.5 text-sm w-[150px] outline-none placeholder:text-[#aaa]"
            />
            <button className="bg-transparent border-none text-white px-4 py-2.5 cursor-pointer hover:text-gray-300">
              <img src="/Img/Icons/search.png" alt="Buscar" className="w-[25px] h-[25px] align-middle invert" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <section className="px-[5%] py-8 lg:py-12">
          {filteredProductos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProductos.map(producto => (
                <article key={producto.id_producto} className="bg-surface rounded-xl overflow-hidden border border-[#333] hover:border-primary-light transition-colors group flex flex-col">
                  {/* Image container */}
                  <Link to={`/producto/${producto.id_producto}`} className="w-full h-[200px] overflow-hidden relative block">
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-primary-dark text-white text-xs font-bold px-3 py-1 rounded-full">
                      {producto.categoria}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <Link to={`/producto/${producto.id_producto}`} className="no-underline">
                      <h2 className="text-white hover:text-primary-light text-lg font-bold m-0 mb-2 leading-tight transition-colors">{producto.nombre}</h2>
                    </Link>
                    <p className="text-[#bbb] text-sm mb-4 line-clamp-2 flex-1">{producto.descripcion}</p>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-white font-bold text-xl">{producto.precio.toFixed(2)} €</span>
                      <button
                        className="bg-primary-dark hover:bg-primary-light text-white border-none px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        onClick={() => {
                          if (!usuario) {
                            alert("Por favor, inicia sesión para añadir al carrito");
                          } else {
                            addToCart(producto, 1);
                          }
                        }}
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-white text-center py-12 text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
