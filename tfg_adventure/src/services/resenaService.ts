import api from '../api/client';
import type { Resena, ResenaRequest } from '../types';

export async function getResenasByRuta(idRuta: number): Promise<Resena[]> {
    const res = await api.get<Resena[]>(`/resenas/ruta/${idRuta}`);
    return res.data;
}

export async function createResena(idRuta: number, data: ResenaRequest): Promise<Resena> {
    const res = await api.post<Resena>(`/resenas/ruta/${idRuta}`, data);
    return res.data;
}

export async function deleteResena(idResena: number): Promise<void> {
    await api.delete(`/resenas/${idResena}`);
}
