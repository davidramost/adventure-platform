import api from '../api/client';
import type { Ruta, RutaRequest } from '../types';

export async function getAllRutas(params?: { dificultad?: string; search?: string }): Promise<Ruta[]> {
    const res = await api.get<Ruta[]>('/rutas', { params });
    return res.data;
}

export async function getRutaById(id: number): Promise<Ruta> {
    const res = await api.get<Ruta>(`/rutas/${id}`);
    return res.data;
}

export async function createRuta(data: RutaRequest): Promise<Ruta> {
    const res = await api.post<Ruta>('/rutas', data);
    return res.data;
}

export async function updateRuta(id: number, data: RutaRequest): Promise<Ruta> {
    const res = await api.put<Ruta>(`/rutas/${id}`, data);
    return res.data;
}

export async function deleteRuta(id: number): Promise<void> {
    await api.delete(`/rutas/${id}`);
}
