import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders';
import { OrderCreate } from '../types';
import { useAuth } from './useAuth';

export const useOrders = (page: number = 1, pageSize: number = 20) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['orders', page, pageSize],
    queryFn: () => ordersApi.list(page, pageSize),
    enabled: isAuthenticated,
  });
};

export const useOrder = (orderId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getById(orderId),
    enabled: isAuthenticated && !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrderCreate) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};