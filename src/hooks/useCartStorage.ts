
import { useState, useEffect } from 'react';
import { useUserData } from '@/utils/auth';
import { CartItem } from '@/types/cart';

// This hook manages persistent cart storage
export const useCartStorage = () => {
  const { getUserId } = useUserData();
  const userId = getUserId();
  
  // Get the cart storage key for the current user
  const getCartKey = () => {
    return `cart-${userId || 'guest'}`;
  };

  // Load initial cart state from storage
  const loadCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const savedCart = localStorage.getItem(getCartKey());
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      return [];
    }
  };

  // Store the current cart in localStorage
  const saveCart = (cart: CartItem[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(getCartKey(), JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  return {
    loadCart,
    saveCart
  };
};
