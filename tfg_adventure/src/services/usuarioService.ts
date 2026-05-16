import api from '../api/client';
import type { UpdateUsuarioRequest, UploadAvatarResponse, Usuario } from '../types';

export const usuarioService = {
    getMe: async (): Promise<Usuario> => {
        const res = await api.get<Usuario>('/usuarios/me');
        return res.data;
    },

    updateProfile: async (data: UpdateUsuarioRequest): Promise<Usuario> => {
        const res = await api.put<Usuario>('/usuarios/me', data);
        return res.data;
    },

    uploadAvatar: async (imageUrl: string): Promise<UploadAvatarResponse> => {
        const res = await api.post<UploadAvatarResponse>('/usuarios/me/avatar', {
            imagen: imageUrl,
        });
        return res.data;
    },
};
