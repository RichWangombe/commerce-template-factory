
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { CartState, CartItem } from '@/types/cart';

export const useCartStorage = (
  state: CartState,
  dispatch: React.Dispatch<any>
) => {
  const { isSignedIn, user } = useUser();

  // Load cart data from localStorage
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
  }, [isSignedIn, user?.id, dispatch]);

  // Save cart data to localStorage
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
};
