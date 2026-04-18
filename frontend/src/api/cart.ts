import api from './client';
import type { Cart } from '../types';

export const getCart = () => api.get<Cart>('/cart').then(r => r.data);

export const addToCart = (productId: number, quantity: number) =>
  api.post<Cart>('/cart/items', { productId, quantity }).then(r => r.data);

export const updateCartItem = (productId: number, quantity: number) =>
  api.put<Cart>(`/cart/items/${productId}`, { productId, quantity }).then(r => r.data);

export const removeCartItem = (productId: number) =>
  api.delete<Cart>(`/cart/items/${productId}`).then(r => r.data);

export const clearCart = () => api.delete('/cart');
