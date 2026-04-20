import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ transparent = false }: { transparent?: boolean }) {
  const { usuario, logout } = useAuth();
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
      </ul>

      {/* Login / User menu */}
      <div className="relative z-10 hidden md:block">
        {usuario ? (
          <div
            className="relative"
            onMouseEnter={() => setUserMenuOpen(true)}
            onMouseLeave={() => setUserMenuOpen(false)}
          >
            <span className="text-white text-sm cursor-pointer px-4 py-2 border border-white/50 rounded-full hover:border-white transition-colors">
              {usuario.nombre_usuario}
            </span>

            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-0 pt-2">
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
          <Link to="/login" className="text-white no-underline text-sm hover:text-gray-300 transition-colors">
            Iniciar sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
