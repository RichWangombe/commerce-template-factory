
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useCart } from '@/contexts/CartContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export const useCartPreferences = () => {
  const { state, updatePreferences: updateCartPreferences } = useCart();
  const { preferences } = useUserPreferences();
  const { isSignedIn } = useUser();

  // Sync dark mode preference between cart and user preferences
  useEffect(() => {
    if (preferences && 'darkMode' in state.userPreferences) {
      updateCartPreferences({
        darkMode: state.userPreferences.darkMode,
      });
    }
  }, [preferences, state.userPreferences.darkMode, updateCartPreferences]);

  return {
    cartPreferences: state.userPreferences,
    updateCartPreferences,
  };
};
