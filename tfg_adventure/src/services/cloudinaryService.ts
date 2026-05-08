const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

async function uploadToCloudinary(file: File, folder: string): Promise<string> {
  console.log('🎨 Subiendo a Cloudinary:', { folder, fileName: file.name, fileSize: file.size, CLOUD_NAME, UPLOAD_PRESET });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  formData.append('quality', 'auto');
  formData.append('fetch_format', 'auto');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error Cloudinary:', { status: response.status, error: errorData });
      throw new Error(`Cloudinary error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Imagen subida exitosamente:', data.secure_url);
    return data.secure_url as string;
  } catch (error) {
    console.error('🔥 Error fatal en uploadToCloudinary:', error);
    throw error;
  }
}

async function uploadRawToCloudinary(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Cloudinary error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url as string;
}

export const cloudinaryService = {
  uploadAvatar(file: File): Promise<string> {
    return uploadToCloudinary(file, 'tfg_adventure/avatars');
  },

  uploadRutaImage(file: File): Promise<string> {
    return uploadToCloudinary(file, 'tfg_adventure/rutas');
  },

  uploadProductImage(file: File): Promise<string> {
    return uploadToCloudinary(file, 'tfg_adventure/productos');
  },

  uploadGpxFile(file: File): Promise<string> {
    if (!file.name.toLowerCase().endsWith('.gpx')) {
      return Promise.reject(new Error('Solo se permiten archivos .gpx'));
    }
    if (file.size > 3 * 1024 * 1024) {
      return Promise.reject(new Error('El archivo .gpx no debe superar los 3MB'));
    }
    return uploadRawToCloudinary(file, 'tfg_adventure/gpx');
  },

  getPlaceholderAvatar(seed: string = 'default'): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&scale=80`;
  },
};
