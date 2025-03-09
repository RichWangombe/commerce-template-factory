
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export type WishlistItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
};

type WishlistState = {
  items: WishlistItem[];
};

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'CLEAR_WISHLIST' };

const initialState: WishlistState = {
  items: [],
};

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return state; // Item already exists in wishlist
      }
      
      return { ...state, items: [...state.items, action.payload] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };

    case 'CLEAR_WISHLIST':
      return { ...state, items: [] };

    default:
      return state;
  }
};

type WishlistContextType = {
  state: WishlistState;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
  isInWishlist: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { isSignedIn, user } = useAuth();

  useEffect(() => {
    const loadWishlist = () => {
      try {
        let savedWishlist;
        
        if (isSignedIn && user?.id) {
          savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
        } else {
          savedWishlist = localStorage.getItem('wishlist');
        }
        
        if (savedWishlist) {
          const parsedWishlist = JSON.parse(savedWishlist);
          
          // Reset the state first
          dispatch({ type: 'CLEAR_WISHLIST' });
          
          // Add each item
          parsedWishlist.items.forEach((item: WishlistItem) => {
            dispatch({ type: 'ADD_ITEM', payload: item });
          });
        }
      } catch (error) {
        console.error('Failed to load wishlist from localStorage:', error);
      }
    };

    loadWishlist();
  }, [isSignedIn, user?.id]);

  useEffect(() => {
    const saveWishlist = () => {
      try {
        if (isSignedIn && user?.id) {
          localStorage.setItem(`wishlist_${user.id}`, JSON.stringify({ items: state.items }));
        } else {
          localStorage.setItem('wishlist', JSON.stringify({ items: state.items }));
        }
      } catch (error) {
        console.error('Failed to save wishlist to localStorage:', error);
      }
    };

    saveWishlist();
  }, [state.items, isSignedIn, user?.id]);

  const addToWishlist = (item: WishlistItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(`Added ${item.name} to wishlist`);
  };

  const removeFromWishlist = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    toast.info('Item removed from wishlist');
  };

  const clearWishlist = () => {
    dispatch({ type: 'CLEAR_WISHLIST' });
    toast.info('Wishlist cleared');
  };

  const isInWishlist = (id: number): boolean => {
    return state.items.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        state,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
