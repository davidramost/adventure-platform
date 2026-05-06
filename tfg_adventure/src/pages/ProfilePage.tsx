import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from '../components/Image';
import { useAuth } from '../context/AuthContext';
import { cloudinaryService } from '../services/cloudinaryService';
import { usuarioService } from '../services/usuarioService';
import { useProfileValidation } from '../hooks/useProfileValidation';

export default function ProfilePage() {
  const { usuario, toggleFavorito, esFavorito, rutas, logout, refreshUsuario } = useAuth();
  const navigate = useNavigate();
  const { validateProfileData, normalizeProfileData } = useProfileValidation();
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    domicilio: usuario?.domicilio || '',
    factDomicilio: usuario?.fact_domicilio || '',
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

      await usuarioService.uploadAvatar(cloudinaryUrl);
      await refreshUsuario();
      setSuccessMessage('Foto de perfil actualizada correctamente');
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.error('Mensaje:', error.message);
      console.error('Response data:', error.response?.data);
      setUploadError('Error al subir la foto. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePersonalInfo = async () => {
    const validation = validateProfileData(personalInfo);

    if (!validation.isValid) {
      setUploadError(validation.errors.join('. '));
      return;
    }

    setIsLoading(true);
    setUploadError('');
    setSuccessMessage('');

    try {
      const normalized = normalizeProfileData(personalInfo);
      await usuarioService.updateProfile({
        nombre: normalized.nombre || undefined,
        apellido: normalized.apellido || undefined,
        domicilio: normalized.domicilio || undefined,
        fact_domicilio: normalized.factDomicilio || undefined,
      });
      await refreshUsuario();
      setSuccessMessage('Datos personales actualizados correctamente');
    } catch (error) {
      setUploadError('Error al actualizar los datos personales');
      setPersonalInfo({
        nombre: usuario?.nombre || '',
        apellido: usuario?.apellido || '',
        domicilio: usuario?.domicilio || '',
        factDomicilio: usuario?.fact_domicilio || '',
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
                  <div className="p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400">
                    {usuario.nombre_usuario}
                  </div>
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
                        className="text-gray-300 hover:text-primary-light transition-colors text-xs"
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
                          className="flex-1 px-4 py-2 bg-primary-light text-white hover:bg-primary-dark text-primary-dark hover:text-white font-medium rounded-lg transition-colors disabled:opacity-50"
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
                              factDomicilio: usuario?.fact_domicilio || '',
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
                        <span className="text-gray-400">Facturación:</span> {usuario.fact_domicilio || '—'}
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
                  className="inline-block px-6 py-3 bg-primary-light hover:bg-primary-dark text-white hover:text-white font-medium rounded-lg transition-colors"
                >
                  Explorar rutas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userFavorites.map(ruta => (
                  <div key={ruta.id_ruta} onClick={() => navigate(`/ruta/${ruta.id_ruta}`)} className="bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-xl overflow-hidden hover:border-primary-light/50 transition-colors group cursor-pointer">
                    <Image
                      src={ruta.imagen_url}
                      alt={ruta.nombre_ruta}
                      containerClassName="w-full h-40"
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
                          className="flex-1 px-3 py-2 bg-primary-light text-white hover:bg-primary-dark hover:text-white font-medium rounded-lg text-sm transition-colors"
                        >
                          Ver detalles
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleFavorito(ruta.id_ruta); }}
                          aria-label={esFavorito(ruta.id_ruta) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                          className="px-3 py-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors"
                        >
                          <img
                            src={esFavorito(ruta.id_ruta) ? '/Img/Icons/favorito_solid.png' : '/Img/Icons/favourite.png'}
                            alt=""
                            aria-hidden="true"
                            className="w-[18px] h-[18px]"
                          />
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
