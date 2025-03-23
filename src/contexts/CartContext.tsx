
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartState, CartItem, CartPreferences } from '@/types/cart';
import { cartReducer, initialCartState } from '@/reducers/cartReducer';
import { useCartStorage } from '@/hooks/useCartStorage';
import { toast } from '@/hooks/use-toast';

type CartContextType = {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (isOpen?: boolean) => void;
  updatePreferences: (preferences: Partial<CartPreferences>) => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  
  // Use the custom hook for storage management
  const { loadCart, saveCart } = useCartStorage();
  
  // Load cart from storage when component mounts
  useEffect(() => {
    const savedCart = loadCart();
    if (savedCart.length > 0) {
      // Initialize cart with saved items
      savedCart.forEach(item => {
        dispatch({ type: 'ADD_ITEM', payload: item });
      });
    }
  }, []);
  
  // Save cart to storage whenever it changes
  useEffect(() => {
    saveCart(state.items);
  }, [state.items]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast({
      title: "Item Added",
      description: `Added ${item.name} to cart`,
      variant: "default",
    });
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    toast({
      title: "Item Removed",
      description: "Item removed from cart",
      variant: "default",
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
      variant: "default",
    });
  };

  const toggleCart = (isOpen?: boolean) => {
    dispatch({ type: 'TOGGLE_CART', payload: isOpen });
  };

  const updatePreferences = (preferences: Partial<CartPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    toast({
      title: "Preferences Updated",
      description: "Your cart preferences have been updated",
      variant: "default",
    });
  };

  const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
  
  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        updatePreferences,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
