import api from './client';
import type { Order } from '../types';

export const checkout = (shippingAddress: string) =>
  api.post<Order>('/orders', { shippingAddress }).then(r => r.data);

export const getOrders = () => api.get<Order[]>('/orders').then(r => r.data);

export const getOrder = (id: number) =>
  api.get<Order>(`/orders/${id}`).then(r => r.data);
