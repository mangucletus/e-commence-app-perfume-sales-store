import api from './client';
import type { Product } from '../types';

export const getProducts = (category?: string) =>
  api.get<Product[]>('/products', { params: category ? { category } : {} }).then(r => r.data);

export const getProduct = (id: number) =>
  api.get<Product>(`/products/${id}`).then(r => r.data);
