import api from '../api/client';
import type { Producto } from '../types';

export const productoService = {
  getAll: (params?: { categoria?: string; search?: string }) =>
    api.get<Producto[]>('/productos', { params }),
  getById: (id: number) => api.get<Producto>(`/productos/${id}`),
};
