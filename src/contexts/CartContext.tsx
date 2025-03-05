import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { useUser } from '@clerk/clerk-react';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  variant?: string;
};

type UserPreferences = {
  darkMode?: boolean;
  currency?: string;
  notificationEnabled?: boolean;
  language?: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  userPreferences: UserPreferences;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART'; payload?: boolean }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> };

const initialState: CartState = {
  items: [],
  isOpen: false,
  userPreferences: {
    darkMode: false,
    currency: 'USD',
    notificationEnabled: true,
    language: 'en',
  },
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity,
        };
        return { ...state, items: updatedItems };
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: action.payload !== undefined ? action.payload : !state.isOpen };

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload },
      };

    default:
      return state;
  }
};

type CartContextType = {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (isOpen?: boolean) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const loadUserData = () => {
      const userId = user?.id;
      if (!userId) return;

      try {
        const savedCart = localStorage.getItem(`cart_${userId}`);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          parsedCart.items.forEach((item: CartItem) => {
            dispatch({ type: 'ADD_ITEM', payload: item });
          });
        }

        const savedPreferences = localStorage.getItem(`preferences_${userId}`);
        if (savedPreferences) {
          const parsedPreferences = JSON.parse(savedPreferences);
          dispatch({ type: 'UPDATE_PREFERENCES', payload: parsedPreferences });
        }
      } catch (error) {
        console.error('Failed to load user data from localStorage:', error);
      }
    };

    if (isSignedIn) {
      loadUserData();
    } else {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          parsedCart.items.forEach((item: CartItem) => {
            dispatch({ type: 'ADD_ITEM', payload: item });
          });
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
        }
      }
    }
  }, [isSignedIn, user?.id]);

  useEffect(() => {
    const saveUserData = () => {
      const userId = user?.id;
      if (!userId) return;

      localStorage.setItem(`cart_${userId}`, JSON.stringify({ items: state.items }));
      localStorage.setItem(`preferences_${userId}`, JSON.stringify(state.userPreferences));
    };

    if (isSignedIn) {
      saveUserData();
    } else {
      localStorage.setItem('cart', JSON.stringify({ items: state.items }));
    }
  }, [state.items, state.userPreferences, isSignedIn, user?.id]);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(`Added ${item.name} to cart`);
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    toast.info('Item removed from cart');
  };

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.info('Cart cleared');
  };

  const toggleCart = (isOpen?: boolean) => {
    dispatch({ type: 'TOGGLE_CART', payload: isOpen });
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    toast.success('Preferences updated');
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
