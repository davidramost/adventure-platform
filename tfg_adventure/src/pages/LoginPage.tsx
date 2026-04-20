import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = await login(email.trim(), contrasena.trim());
    if (err) {
      setError(err);
    } else {
      if (recordar) {
        localStorage.setItem('email_recordado', email);
      } else {
        localStorage.removeItem('email_recordado');
      }
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
          <h1 className="text-white text-4xl font-bold mb-10 tracking-wider">Iniciar Sesión</h1>

          {error && (
            <div className="bg-error/30 border border-error text-white p-4 rounded-xl mb-6 text-center text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6 text-left">
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
                  className="w-full p-4 pl-12 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none 
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15"
                />
              </div>
            </div>

            <div className="mb-6 text-left">
              <label htmlFor="contrasena" className="block text-white text-sm mb-2 font-medium">Contraseña</label>
              <div className="relative">
                <img src="/Img/Icons/lock.png" alt="Contraseña" className="absolute left-4 top-1/2 -translate-y-1/2 w-[25px] h-[25px]" />
                <input
                  type="password"
                  id="contrasena"
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  placeholder="Tu contraseña"
                  required
                  className="w-full p-4 pl-12 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none 
                             placeholder:text-[#aaa] focus:border-white focus:bg-white/15"
                />
              </div>
            </div>

            <div className="mb-6 flex items-center gap-2.5">
              <input
                type="checkbox"
                id="recordar"
                checked={recordar}
                onChange={e => setRecordar(e.target.checked)}
                className="w-auto"
              />
              <label htmlFor="recordar" className="text-white text-sm cursor-pointer">Recordar mi email</label>
            </div>

            <button
              type="submit"
              className="w-full p-4 text-base font-medium text-primary-dark bg-white border-none rounded-full cursor-pointer mt-4
                         hover:bg-gray-200 transition-colors"
            >
              Entrar
              <img src="/Img/Icons/arrow_right_black.png" alt="Entrar" className="w-[25px] h-[25px] align-middle ml-2" />
            </button>
          </form>

          <div className="mt-8">
            <Link to="/registro" className="text-white no-underline text-sm hover:underline">
              ¿No tienes cuenta? Regístrate
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
