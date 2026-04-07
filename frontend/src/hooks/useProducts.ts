import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { ProductListParams } from '../types';

export const useProducts = (params?: ProductListParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.list(params),
  });
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getById(productId),
    enabled: !!productId,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
};