/**
 * EXAMPLE HOOK — Demonstrates React Query patterns for data fetching.
 * DELETE this file and create your own domain hooks.
 *
 * To remove:
 * 1. Delete this file
 * 2. Create your domain hooks (e.g., hooks/useProducts.ts, hooks/usePosts.ts)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi, tagsApi } from '../api/items';
import type {
  Item,
  ItemCreateRequest,
  ItemUpdateRequest,
  ItemsQueryParams,
  PaginatedResponse,
} from '../types';

const ITEMS_QUERY_KEY = 'items';
const TAGS_QUERY_KEY = 'tags';

export const useItems = (params: ItemsQueryParams = {}) => {
  return useQuery<PaginatedResponse<Item>>({
    queryKey: [ITEMS_QUERY_KEY, params],
    queryFn: () => itemsApi.list(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useItem = (id: string) => {
  return useQuery<Item>({
    queryKey: [ITEMS_QUERY_KEY, id],
    queryFn: () => itemsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ItemCreateRequest) => itemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ItemUpdateRequest }) =>
      itemsApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ITEMS_QUERY_KEY, variables.id],
      });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ITEMS_QUERY_KEY] });
    },
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: [TAGS_QUERY_KEY],
    queryFn: () => tagsApi.list(),
    select: (data) => data.tags,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) => tagsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_QUERY_KEY] });
    },
  });
};