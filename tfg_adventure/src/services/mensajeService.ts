import api from '../api/client';
import type { Mensaje } from '../types';

export async function getGeneralMessages(): Promise<Mensaje[]> {
    const res = await api.get<Mensaje[]>('/mensajes/general');
    return res.data;
}

export async function sendGeneralMessage(contenido: string): Promise<Mensaje> {
    const res = await api.post<Mensaje>('/mensajes/general', { contenido });
    return res.data;
}
