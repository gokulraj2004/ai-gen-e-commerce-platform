/**
 * EXAMPLE HOOKS — Demonstrates React Query patterns with CRUD operations.
 * DELETE this file and create your own domain hooks.
 *
 * To remove:
 * 1. Delete this file
 * 2. Create your domain hooks (e.g., hooks/useProducts.ts)
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getTags,
  createTag,
} from '../api/items';
import type {
  ItemsQueryParams,
  ItemCreateRequest,
  ItemUpdateRequest,
  TagCreateRequest,
} from '../types';

export function useItems(params: ItemsQueryParams = {}) {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => getItems(params),
  });
}

export function useItem(itemId: string) {
  return useQuery({
    queryKey: ['items', itemId],
    queryFn: () => getItem(itemId),
    enabled: !!itemId,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ItemCreateRequest) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useUpdateItem(itemId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ItemUpdateRequest) => updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['items', itemId] });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TagCreateRequest) => createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}