import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombreUsuario || !email || !password || !confirmarPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (nombreUsuario.length < 3 || nombreUsuario.length > 20) {
      setError('El nombre de usuario debe tener entre 3 y 20 caracteres.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('El formato del correo electrónico no es válido.');
      return;
    }
    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8 || password.length > 20) {
      setError('La contraseña debe tener entre 8 y 20 caracteres.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError('La contraseña debe contener al menos una letra mayúscula.');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setError('La contraseña debe contener al menos una letra minúscula.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError('La contraseña debe contener al menos un número.');
      return;
    }
    if (!/[\W_]/.test(password)) {
      setError('La contraseña debe contener al menos un carácter especial.');
      return;
    }

    setLoading(true);
    const err = await register(nombreUsuario.trim(), email.trim(), password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-primary-light to-primary-dark">
        <Header transparent />
      </header>

      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark py-12">
        <div className="text-center px-6 w-full max-w-md">
          <h1 className="text-white text-4xl font-bold mb-10 tracking-wider">Crear Cuenta</h1>

          {error && (
            <div className="bg-error/30 border border-error text-white p-4 rounded-xl mb-6 text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5 text-left">
              <label htmlFor="nombre_usuario" className="block text-white text-sm mb-2 font-medium">Nombre de usuario</label>
              <div className="relative">
                <img src="/Img/Icons/user.png" alt="Usuario" className="absolute left-4 top-1/2 -translate-y-1/2 w-[25px] h-[25px]" />
                <input
                  type="text"
                  id="nombre_usuario"
                  value={nombreUsuario}
                  onChange={e => setNombreUsuario(e.target.value)}
                  placeholder="Tu nombre de usuario"
                  required
                  disabled={loading}
                  className="w-full p-4 pl-12 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mb-5 text-left">
              <label htmlFor="email" className="block text-white text-sm mb-2 font-medium">Email</label>
              <div className="relative">
                <img src="/Img/Icons/mail.png" alt="Email" className="absolute left-4 top-1/2 -translate-y-1/2 w-[25px] h-[25px]" />
                <input
                  type="email"
                  id="email"
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

            <div className="mb-5 text-left">
              <label htmlFor="password" className="block text-white text-sm mb-2 font-medium">Contraseña</label>
              <div className="relative">
                <img src="/Img/Icons/lock.png" alt="Contraseña" className="absolute left-4 top-1/2 -translate-y-1/2 w-[25px] h-[25px]" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  required
                  disabled={loading}
                  className="w-full p-4 pl-12 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="mb-5 text-left">
              <label htmlFor="confirmar_password" className="block text-white text-sm mb-2 font-medium">Confirmar contraseña</label>
              <div className="relative">
                <img src="/Img/Icons/lock.png" alt="Confirmar" className="absolute left-4 top-1/2 -translate-y-1/2 w-[25px] h-[25px]" />
                <input
                  type="password"
                  id="confirmar_password"
                  value={confirmarPassword}
                  onChange={e => setConfirmarPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
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
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <img src="/Img/Icons/arrow_right_black.png" alt="Registrar" className="w-[25px] h-[25px]" />
                  <span>Registrarse</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <Link to="/login" className="text-white no-underline text-sm hover:underline">
              ¿Ya tienes cuenta? Inicia sesión
            </Link>
          </div>

          <div className="mt-6">
            <Link to="/" className="text-white no-underline text-sm hover:underline inline-flex items-center gap-2">
              <img src="/Img/Icons/arrow_left.png" alt="Volver" className="w-[25px] h-[25px] align-middle" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
