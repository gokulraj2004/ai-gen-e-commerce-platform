import apiClient from './client';
import type { Product, ProductListParams, ProductListResponse, Category } from '../types';

export const productsApi = {
  list: async (params?: ProductListParams): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>('/products', { params });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },
};