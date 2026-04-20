import api from '../api/client';
import type { Ruta } from '../types';

export async function getFavoritos(): Promise<Ruta[]> {
    const res = await api.get<Ruta[]>('/favoritos');
    return res.data;
}

export async function toggleFavorito(idRuta: number): Promise<void> {
    await api.post(`/favoritos/${idRuta}`);
}

export async function checkFavorito(idRuta: number): Promise<boolean> {
    const res = await api.get<boolean>(`/favoritos/check/${idRuta}`);
    return res.data;
}
