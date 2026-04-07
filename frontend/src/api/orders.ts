import apiClient from './client';
import type { Order, OrderCreate, OrderListResponse } from '../types';

export const ordersApi = {
  list: async (page = 1, pageSize = 10): Promise<OrderListResponse> => {
    const response = await apiClient.get<OrderListResponse>('/orders', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  create: async (data: OrderCreate): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data);
    return response.data;
  },

  cancel: async (id: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/cancel`);
    return response.data;
  },
};