const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

export const cloudinaryService = {
  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'tfg_adventure/avatars');
    formData.append('quality', 'auto');
    formData.append('fetch_format', 'auto');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Error uploading avatar');
    }

    const data = await response.json();
    return data.secure_url;
  },

  getPlaceholderAvatar(): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}&scale=80`;
  },
};
