/**
 * EXAMPLE API module — Demonstrates API call patterns with Axios.
 * DELETE this file and create your own domain API modules.
 *
 * To remove:
 * 1. Delete this file
 * 2. Remove references in hooks/useItems.ts
 * 3. Create your domain API modules (e.g., api/products.ts, api/posts.ts)
 */
import apiClient from './client';
import type {
  Item,
  Tag,
  ItemCreateRequest,
  ItemUpdateRequest,
  TagCreateRequest,
  ItemsQueryParams,
  PaginatedResponse,
} from '../types';

export const itemsApi = {
  async list(params: ItemsQueryParams = {}): Promise<PaginatedResponse<Item>> {
    const queryParams: Record<string, string | number> = {};

    if (params.page) queryParams.page = params.page;
    if (params.per_page) queryParams.per_page = params.per_page;
    if (params.search) queryParams.search = params.search;
    if (params.sort_by) queryParams.sort_by = params.sort_by;
    if (params.tags && params.tags.length > 0) {
      queryParams.tags = params.tags.join(',');
    }

    const response = await apiClient.get<PaginatedResponse<Item>>('/items', {
      params: queryParams,
    });
    return response.data;
  },

  async getById(id: string): Promise<Item> {
    const response = await apiClient.get<Item>(`/items/${id}`);
    return response.data;
  },

  async create(data: ItemCreateRequest): Promise<Item> {
    const response = await apiClient.post<Item>('/items', data);
    return response.data;
  },

  async update(id: string, data: ItemUpdateRequest): Promise<Item> {
    const response = await apiClient.put<Item>(`/items/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/items/${id}`);
  },
};

export const tagsApi = {
  async list(): Promise<{ tags: Tag[] }> {
    const response = await apiClient.get<{ tags: Tag[] }>('/tags');
    return response.data;
  },

  async create(data: TagCreateRequest): Promise<Tag> {
    const response = await apiClient.post<Tag>('/tags', data);
    return response.data;
  },
};