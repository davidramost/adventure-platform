import api from '../api/client';
import type { PedidoResponse, Producto, ProductoRequest, Ruta, Usuario } from '../types';

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

    getProductos: () => api.get<Producto[]>('/admin/productos'),
    createProducto: (data: ProductoRequest) => api.post<Producto>('/admin/productos', data),
    updateProducto: (id: number, data: ProductoRequest) => api.put<Producto>(`/admin/productos/${id}`, data),
    deleteProducto: (id: number) => api.delete(`/admin/productos/${id}`),

    getPedidosDeUsuario: (idUsuario: number) =>
        api.get<PedidoResponse[]>(`/admin/usuarios/${idUsuario}/pedidos`),

    getAllPedidos: () => api.get<PedidoResponse[]>('/admin/pedidos'),
};
