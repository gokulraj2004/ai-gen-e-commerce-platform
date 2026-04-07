import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { cartApi } from '../api/cart';
import type { Cart, CartItemAdd } from '../types';

export interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addItem: (data: CartItemAdd) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    try {
      const data = await cartApi.get();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (data: CartItemAdd) => {
    const updatedCart = await cartApi.addItem(data);
    setCart(updatedCart);
  };

  const updateItem = async (itemId: string, quantity: number) => {
    const updatedCart = await cartApi.updateItem(itemId, { quantity });
    setCart(updatedCart);
  };

  const removeItem = async (itemId: string) => {
    const updatedCart = await cartApi.removeItem(itemId);
    setCart(updatedCart);
  };

  const clearCart = async () => {
    await cartApi.clear();
    setCart(null);
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, addItem, updateItem, removeItem, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};