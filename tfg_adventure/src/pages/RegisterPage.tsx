import { useState, useRef } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useProfileValidation } from '../hooks/useProfileValidation';
import { cloudinaryService } from '../services/cloudinaryService';

export default function RegisterPage() {
  const { register, usuario } = useAuth();
  const navigate = useNavigate();
  const { validateProfileData, normalizeProfileData } = useProfileValidation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (usuario) return <Navigate to="/" replace />;
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [factDomicilio, setFactDomicilio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setAvatarError('La foto no debe superar los 3MB.');
      return;
    }

    setAvatarFile(file);
    setAvatarError('');
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setAvatarError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

    if (nombre || apellido || domicilio || factDomicilio) {
      const profileValidation = validateProfileData({
        nombre,
        apellido,
        domicilio,
        factDomicilio,
      });

      if (!profileValidation.isValid) {
        setError(profileValidation.errors.join('. '));
        return;
      }
    }

    setLoading(true);
    const normalized = normalizeProfileData({
      nombre,
      apellido,
      domicilio,
      factDomicilio,
    });

    try {
      let imagenUrl: string | undefined;

      if (avatarFile) {
        imagenUrl = await cloudinaryService.uploadAvatar(avatarFile);
      }

      const err = await register(
        nombreUsuario.trim(),
        email.trim(),
        password,
        normalized.nombre || undefined,
        normalized.apellido || undefined,
        normalized.domicilio || undefined,
        normalized.factDomicilio || undefined,
        imagenUrl
      );
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError('Error al subir la foto de perfil. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <div className="flex flex-1 lg:flex-row min-h-0">

        {/* ── Panel izquierdo – solo desktop ── */}
        <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative flex-col shrink-0">
          <img
            src="/Img/mountain_list_2.jpg"
            alt="Montaña"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-primary-dark/70 via-primary-dark/60 to-primary-dark/90" />

          <div className="relative z-10 flex flex-col justify-between h-full p-12">
            <div>
              <h2 className="text-white text-4xl font-bold leading-tight mb-4">
                Tu próxima<br />aventura<br />empieza aquí.
              </h2>
              <p className="text-white/70 text-base leading-relaxed mb-10">
                Únete a la comunidad y descubre senderos, rutas de ciclismo y mucho más cerca de ti.
              </p>

              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <img src="/Img/Icons/map.png" alt="" className="w-4 h-4" />
                  </span>
                  Accede a cientos de rutas con mapas GPX
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <img src="/Img/Icons/favourite.png" alt="" className="w-4 h-4" />
                  </span>
                  Guarda tus rutas favoritas
                </li>
                <li className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <img src="/Img/Icons/camping.png" alt="" className="w-4 h-4" />
                  </span>
                  Equípate en nuestra tienda especializada
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ── Panel derecho – formulario ── */}
        <div className="flex flex-col flex-1 bg-linear-to-br from-primary-light to-primary-dark overflow-y-auto">

          <main className="flex-1 flex items-center justify-center py-12 lg:py-16 px-6 lg:px-10 xl:px-16">
            <div className="w-full max-w-xl">
              <h1 className="text-white text-3xl lg:text-4xl font-bold mb-2 tracking-wide">Crear Cuenta</h1>
              <p className="text-white/60 text-sm mb-8">Rellena los datos para unirte a la aventura.</p>

              {error && (
                <div className="bg-error/30 border border-error text-white p-4 rounded-xl mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* ── Sección: Cuenta ── */}
                <div className="mb-2">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-4 font-semibold">Datos de acceso</p>

                  <div className="mb-5">
                    <label htmlFor="nombre_usuario" className="block text-white text-sm mb-2 font-medium">Nombre de usuario</label>
                    <div className="relative">
                      <img src="/Img/Icons/user.png" alt="Usuario" className="absolute left-4 top-1/2 -translate-y-1/2 w-5.5 h-5.5" />
                      <input
                        type="text"
                        id="nombre_usuario"
                        autoComplete="username"
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

                  <div className="mb-5">
                    <label htmlFor="email" className="block text-white text-sm mb-2 font-medium">Email</label>
                    <div className="relative">
                      <img src="/Img/Icons/mail.png" alt="Email" className="absolute left-4 top-1/2 -translate-y-1/2 w-5.5 h-5.5" />
                      <input
                        type="email"
                        id="email"
                        autoComplete="email"
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

                  {/* Contraseñas en grid 2 col */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label htmlFor="password" className="block text-white text-sm mb-2 font-medium">Contraseña</label>
                      <div className="relative">
                        <img src="/Img/Icons/lock.png" alt="Contraseña" className="absolute left-4 top-1/2 -translate-y-1/2 w-5.5 h-5.5" />
                        <input
                          type="password"
                          id="password"
                          autoComplete="new-password"
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

                    <div>
                      <label htmlFor="confirmar_password" className="block text-white text-sm mb-2 font-medium">Confirmar contraseña</label>
                      <div className="relative">
                        <img src="/Img/Icons/lock.png" alt="Confirmar" className="absolute left-4 top-1/2 -translate-y-1/2 w-5.5 h-5.5" />
                        <input
                          type="password"
                          id="confirmar_password"
                          autoComplete="new-password"
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
                  </div>
                </div>

                {/* ── Sección: Foto de perfil ── */}
                <div className="my-8 border-t border-white/20 pt-6">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-5 font-semibold">Foto de perfil <span className="normal-case">(opcional)</span></p>

                  <div className="flex items-center gap-6">
                    <div className="relative group shrink-0">
                      {avatarPreview ? (
                        <>
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading}
                            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                              <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={loading}
                          className="w-20 h-20 rounded-full bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center hover:border-white/50 hover:bg-white/15 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14M5 12h14"></path>
                          </svg>
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        disabled={loading}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-white text-sm">Sube tu foto de perfil</p>
                      <p className="text-white/50 text-xs">Formatos: JPG, PNG, WEBP. Máx. 3MB.</p>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          disabled={loading}
                          className="self-start px-3 py-1 bg-error/20 text-error border border-error/50 text-xs rounded-lg hover:bg-error/30 transition-colors disabled:opacity-50"
                        >
                          Eliminar foto
                        </button>
                      )}
                      {avatarError && (
                        <p className="text-error text-xs">{avatarError}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Sección: Datos de envío ── */}
                <div className="my-8 border-t border-white/20 pt-6">
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-5 font-semibold">
                    Datos de envío <span className="normal-case">(opcionales — requeridos para comprar)</span>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label htmlFor="nombre" className="block text-white text-sm mb-2 font-medium">Nombre</label>
                      <input
                        type="text"
                        id="nombre"
                        autoComplete="given-name"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        placeholder="Tu nombre"
                        disabled={loading}
                        className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                                 placeholder:text-[#aaa] focus:border-white focus:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label htmlFor="apellido" className="block text-white text-sm mb-2 font-medium">Apellido</label>
                      <input
                        type="text"
                        id="apellido"
                        autoComplete="family-name"
                        value={apellido}
                        onChange={e => setApellido(e.target.value)}
                        placeholder="Tu apellido"
                        disabled={loading}
                        className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                                 placeholder:text-[#aaa] focus:border-white focus:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label htmlFor="domicilio" className="block text-white text-sm mb-2 font-medium">Domicilio</label>
                    <input
                      type="text"
                      id="domicilio"
                      autoComplete="street-address"
                      value={domicilio}
                      onChange={e => setDomicilio(e.target.value)}
                      placeholder="Tu domicilio para envío"
                      disabled={loading}
                      className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                               placeholder:text-[#aaa] focus:border-white focus:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="fact_domicilio" className="block text-white text-sm mb-2 font-medium">Domicilio de Facturación</label>
                    <input
                      type="text"
                      id="fact_domicilio"
                      autoComplete="billing address-line1"
                      value={factDomicilio}
                      onChange={e => setFactDomicilio(e.target.value)}
                      placeholder="Tu domicilio de facturación"
                      disabled={loading}
                      className="w-full p-4 text-sm border-2 border-white/30 rounded-xl bg-white/10 text-white outline-none
                               placeholder:text-[#aaa] focus:border-white focus:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full p-4 text-base font-medium text-primary-dark bg-white border-none rounded-full cursor-pointer mt-2
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
                      <img src="/Img/Icons/arrow_right_black.png" alt="Registrar" className="w-5.5 h-5.5" />
                      <span>Registrarse</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 flex flex-col items-center gap-3">
                <Link to="/login" className="text-white/70 hover:text-white no-underline text-sm transition-colors">
                  ¿Ya tienes cuenta? <span className="underline">Inicia sesión</span>
                </Link>
                <Link to="/" className="text-white/50 hover:text-white no-underline text-xs transition-colors inline-flex items-center gap-2 lg:hidden">
                  <img src="/Img/Icons/arrow_left.png" alt="Volver" className="w-4 h-4" />
                  Volver al inicio
                </Link>
              </div>
            </div>
          </main>
        </div>

      </div>

      <Footer />
    </div>
  );
}
