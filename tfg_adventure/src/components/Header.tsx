import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header({ transparent = false }: { transparent?: boolean }) {
  const { usuario, logout } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const bgClass = transparent ? '' : 'bg-gradient-to-br from-primary-light to-primary-dark';

  return (
    <nav className={`relative flex items-center justify-between px-6 md:px-8 py-5 ${bgClass}`}>
      {/* Logo */}
      <Link to="/" className="shrink-0 mr-5">
        <img src="/Img/the_logo.png" className="w-[80px]" alt="Inicio" />
      </Link>

      {/* Mobile menu button */}
      <button
        className="block md:hidden cursor-pointer bg-transparent border-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <img src="/Img/Icons/lineas.png" className="w-[35px]" alt="Menú" />
      </button>

      {/* Nav links */}
      <ul className={`
        list-none p-0 m-0
        md:absolute md:left-1/2 md:-translate-x-1/2 md:flex md:gap-8 md:whitespace-nowrap
        ${menuOpen
          ? 'flex flex-col items-center gap-6 absolute top-full left-0 right-0 bg-primary-dark/95 backdrop-blur-sm py-6 z-[2000] border-t border-white/10'
          : 'hidden md:flex'
        }
      `}>
        <li>
          <Link
            to="/"
            className="text-white no-underline text-sm font-medium tracking-wider hover:text-gray-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            INICIO
          </Link>
        </li>
        <li>
          <Link
            to="/galeria"
            className="text-white no-underline text-sm font-medium tracking-wider hover:text-gray-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            GALERÍA
          </Link>
        </li>
        <li>
          <Link
            to="/senderos"
            className="text-white no-underline text-sm font-medium tracking-wider hover:text-gray-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            SENDEROS
          </Link>
        </li>
        <li>
          <Link
            to="/tienda"
            className="text-white no-underline text-sm font-medium tracking-wider hover:text-gray-300 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            TIENDA
          </Link>
        </li>
      </ul>

      {/* Right side: Login/User menu + Cart */}
      <div className="relative z-10 hidden md:flex items-center gap-6">
        {/* Login / User menu */}
        {usuario ? (
          <div
            className="relative"
            onMouseEnter={() => setUserMenuOpen(true)}
            onMouseLeave={() => setUserMenuOpen(false)}
          >
            <button className="text-white hover:text-gray-300 transition-colors flex items-center justify-center w-8 h-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            {userMenuOpen && (
              <div className="absolute top-full left-0 mt-0 pt-2">
                <div className="bg-black/90 rounded-xl min-w-[160px] overflow-hidden shadow-xl">
                  <Link
                    to="/favoritos"
                    className="block px-5 py-3 text-white no-underline text-sm border-b border-white/10 hover:bg-white/10 transition-colors"
                  >
                    Favoritos
                  </Link>
                  <Link
                    to="/crear-ruta"
                    className="block px-5 py-3 text-white no-underline text-sm border-b border-white/10 hover:bg-white/10 transition-colors"
                  >
                    Crear ruta
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-5 py-3 text-white text-sm bg-transparent border-none cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="text-white hover:text-gray-300 transition-colors flex items-center justify-center w-8 h-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
        )}

        {/* Cart Icon */}
        <Link to="/carrito" className="relative text-white hover:text-gray-300 transition-colors flex items-center group">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-primary-dark group-hover:border-primary-light transition-colors">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
