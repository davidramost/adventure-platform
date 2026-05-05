import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { cloudinaryService } from '../services/cloudinaryService';
import { usuarioService } from '../services/usuarioService';

export default function ProfilePage() {
  const { usuario, toggleFavorito, esFavorito, rutas, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(usuario?.nombre_usuario || '');
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    domicilio: usuario?.domicilio || '',
    factDomicilio: usuario?.factDomicilio || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!usuario) {
    navigate('/login');
    return null;
  }

  const userFavorites = rutas.filter(r => esFavorito(r.id_ruta));
  const avatarUrl = usuario.imagen || cloudinaryService.getPlaceholderAvatar(usuario.nombre_usuario);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadError('');
    setSuccessMessage('');

    try {
      console.log('📸 Iniciando upload de avatar...');
      const cloudinaryUrl = await cloudinaryService.uploadAvatar(file);
      console.log('📤 Enviando URL al backend:', cloudinaryUrl);

      const response = await usuarioService.uploadAvatar(cloudinaryUrl);
      console.log('✅ Respuesta del backend:', response);

      setSuccessMessage('Foto de perfil actualizada correctamente');
      setTimeout(() => {
        console.log('🔄 Recargando página...');
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.error('Mensaje:', error.message);
      console.error('Response data:', error.response?.data);
      setUploadError('Error al subir la foto. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === usuario.nombre_usuario) {
      setIsEditingName(false);
      return;
    }

    setIsLoading(true);
    setUploadError('');
    setSuccessMessage('');

    try {
      await usuarioService.updateProfile({ nombre_usuario: newName.trim() });
      setSuccessMessage('Nombre de usuario actualizado');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setUploadError('Error al actualizar el nombre');
      setNewName(usuario.nombre_usuario);
    } finally {
      setIsLoading(false);
      setIsEditingName(false);
    }
  };

  const handleUpdatePersonalInfo = async () => {
    setIsLoading(true);
    setUploadError('');
    setSuccessMessage('');

    try {
      await usuarioService.updateProfile({
        nombre: personalInfo.nombre || undefined,
        apellido: personalInfo.apellido || undefined,
        domicilio: personalInfo.domicilio || undefined,
        factDomicilio: personalInfo.factDomicilio || undefined,
      });
      setSuccessMessage('Datos personales actualizados correctamente');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setUploadError('Error al actualizar los datos personales');
      setPersonalInfo({
        nombre: usuario?.nombre || '',
        apellido: usuario?.apellido || '',
        domicilio: usuario?.domicilio || '',
        factDomicilio: usuario?.factDomicilio || '',
      });
    } finally {
      setIsLoading(false);
      setIsEditingPersonalInfo(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-gray-900 to-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4">
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-xl mb-6">
              {successMessage}
            </div>
          )}
          {uploadError && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-xl mb-6">
              {uploadError}
            </div>
          )}

          <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={avatarUrl}
                    alt={usuario.nombre_usuario}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-light"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    aria-label="Cambiar foto de perfil"
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-gray-400 text-sm mt-2">Haz clic para cambiar foto</p>
              </div>

              <div className="flex-1 w-full">
                <div className="mb-6">
                  <label className="block text-white text-sm font-medium mb-2">Nombre de usuario</label>
                  {isEditingName ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        autoComplete="username"
                        disabled={isLoading}
                        className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-primary-light disabled:opacity-50"
                      />
                      <button
                        onClick={handleUpdateName}
                        disabled={isLoading}
                        className="px-4 py-3 bg-primary-light hover:bg-primary-dark text-primary-dark font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setNewName(usuario.nombre_usuario);
                        }}
                        disabled={isLoading}
                        className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
                      <span className="text-white">{usuario.nombre_usuario}</span>
                      <button
                        onClick={() => setIsEditingName(true)}
                        aria-label="Editar nombre de usuario"
                        className="text-primary-light hover:text-primary-dark transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-white text-sm font-medium mb-2">Email</label>
                  <div className="p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400">
                    {usuario.email}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-white text-sm font-medium">Datos Personales (para envíos)</label>
                    {!isEditingPersonalInfo && (
                      <button
                        onClick={() => setIsEditingPersonalInfo(true)}
                        className="text-primary-light hover:text-primary-dark transition-colors text-xs"
                      >
                        Editar
                      </button>
                    )}
                  </div>

                  {isEditingPersonalInfo ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={personalInfo.nombre}
                        onChange={e => setPersonalInfo({ ...personalInfo, nombre: e.target.value })}
                        disabled={isLoading}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-primary-light disabled:opacity-50"
                      />
                      <input
                        type="text"
                        placeholder="Apellido"
                        value={personalInfo.apellido}
                        onChange={e => setPersonalInfo({ ...personalInfo, apellido: e.target.value })}
                        disabled={isLoading}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-primary-light disabled:opacity-50"
                      />
                      <input
                        type="text"
                        placeholder="Domicilio de envío"
                        value={personalInfo.domicilio}
                        onChange={e => setPersonalInfo({ ...personalInfo, domicilio: e.target.value })}
                        disabled={isLoading}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-primary-light disabled:opacity-50"
                      />
                      <input
                        type="text"
                        placeholder="Domicilio de facturación"
                        value={personalInfo.factDomicilio}
                        onChange={e => setPersonalInfo({ ...personalInfo, factDomicilio: e.target.value })}
                        disabled={isLoading}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white outline-none focus:border-primary-light disabled:opacity-50"
                      />
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleUpdatePersonalInfo}
                          disabled={isLoading}
                          className="flex-1 px-4 py-2 bg-primary-light hover:bg-primary-dark text-primary-dark font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingPersonalInfo(false);
                            setPersonalInfo({
                              nombre: usuario?.nombre || '',
                              apellido: usuario?.apellido || '',
                              domicilio: usuario?.domicilio || '',
                              factDomicilio: usuario?.factDomicilio || '',
                            });
                          }}
                          disabled={isLoading}
                          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-3 space-y-2 text-sm">
                      <p className="text-gray-300">
                        <span className="text-gray-400">Nombre:</span> {usuario.nombre || '—'}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Apellido:</span> {usuario.apellido || '—'}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Envío:</span> {usuario.domicilio || '—'}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-400">Facturación:</span> {usuario.factDomicilio || '—'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Mis Rutas Favoritas ({userFavorites.length})</h2>

            {userFavorites.length === 0 ? (
              <div className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-2xl p-12 text-center">
                <p className="text-gray-400 mb-4">Aún no tienes rutas favoritas</p>
                <button
                  onClick={() => navigate('/senderos')}
                  className="inline-block px-6 py-3 bg-primary-light hover:bg-primary-dark text-primary-dark hover:text-secondary font-medium rounded-lg transition-colors"
                >
                  Explorar rutas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userFavorites.map(ruta => (
                  <div key={ruta.id_ruta} onClick={() => navigate(`/ruta/${ruta.id_ruta}`)} className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl overflow-hidden hover:border-primary-light/50 transition-colors group cursor-pointer">
                    <img
                      src={ruta.imagen_url}
                      alt={ruta.nombre_ruta}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="p-4">
                      <h3 className="text-white font-bold mb-2 truncate">{ruta.nombre_ruta}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{ruta.descripcion}</p>

                      <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                        <div className="bg-gray-700/50 p-2 rounded">
                          <p className="text-gray-400">Distancia</p>
                          <p className="text-white font-bold">{ruta.distancia_km} km</p>
                        </div>
                        <div className="bg-gray-700/50 p-2 rounded">
                          <p className="text-gray-400">Dificultad</p>
                          <p className="text-white font-bold">{ruta.dificultad}</p>
                        </div>
                        <div className="bg-gray-700/50 p-2 rounded">
                          <p className="text-gray-400">Puntuación</p>
                          <p className="text-white font-bold">{ruta.media_puntuacion?.toFixed(1) || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/ruta/${ruta.id_ruta}`); }}
                          className="flex-1 px-3 py-2 bg-primary-light hover:bg-primary-dark text-primary-dark font-medium rounded-lg text-sm transition-colors"
                        >
                          Ver detalles
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorito(ruta.id_ruta); }}
                          className="px-3 py-2 bg-gray-700 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
