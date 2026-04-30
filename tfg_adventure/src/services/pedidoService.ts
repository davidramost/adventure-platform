import api from '../api/client';
import type { CrearPedidoRequest, PedidoResponse } from '../types';

export const pedidoService = {
  crear: (data: CrearPedidoRequest) => api.post<PedidoResponse>('/pedidos', data),
  getMisPedidos: () => api.get<PedidoResponse[]>('/pedidos/mis-pedidos'),
};
