import api from './client';
import type { Product, PagedResponse } from '../types';

export interface ProductFilter {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export const getProducts = (filter: ProductFilter = {}) => {
  const params: Record<string, string | number> = {};
  if (filter.category) params.category = filter.category;
  if (filter.brand) params.brand = filter.brand;
  if (filter.search) params.search = filter.search;
  if (filter.minPrice != null) params.minPrice = filter.minPrice;
  if (filter.maxPrice != null) params.maxPrice = filter.maxPrice;
  params.page = filter.page ?? 0;
  params.size = filter.size ?? 12;
  if (filter.sortBy) params.sortBy = filter.sortBy;
  if (filter.sortDir) params.sortDir = filter.sortDir;
  return api.get<PagedResponse<Product>>('/products', { params }).then((r) => r.data);
};

export const getBrands = () =>
  api.get<string[]>('/products/brands').then((r) => r.data);

export const getProduct = (id: number) =>
  api.get<Product>(`/products/${id}`).then((r) => r.data);
