import api from '../api/client';
import type { Usuario, Ruta } from '../types';

export interface AdminUpdateUsuarioRequest {
    nombre_usuario?: string;
    nombre?: string;
    apellido?: string;
    domicilio?: string;
    fact_domicilio?: string;
}

export const adminService = {
    getUsuarios: () => api.get<Usuario[]>('/admin/usuarios'),
    updateUsuario: (id: number, data: AdminUpdateUsuarioRequest) =>
        api.put<Usuario>(`/admin/usuarios/${id}`, data),
    deleteUsuario: (id: number) => api.delete(`/admin/usuarios/${id}`),

    getRutas: () => api.get<Ruta[]>('/admin/rutas'),
    deleteRuta: (id: number) => api.delete(`/admin/rutas/${id}`),
};
