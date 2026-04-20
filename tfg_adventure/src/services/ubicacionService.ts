import api from '../api/client';
import type { Ubicacion } from '../types';

export async function getAllUbicaciones(): Promise<Ubicacion[]> {
    const res = await api.get<Ubicacion[]>('/ubicaciones');
    return res.data;
}

export async function getUbicacionById(id: number): Promise<Ubicacion> {
    const res = await api.get<Ubicacion>(`/ubicaciones/${id}`);
    return res.data;
}
