
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserPreferences } from '@/types/recommendation';
import { useAuth } from '@/contexts/AuthContext';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isLoading: boolean;
}

const defaultPreferences: UserPreferences = {
  favoriteCategories: [],
  preferredPriceRange: [0, 1000],
  dislikedProductIds: [],
  showRecentlyViewed: true,
  showTrending: true,
  showSimilar: true,
  showSeasonalOffers: true,
  showCollaborative: true, // Set default value to true
  recommendationCount: 4,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSignedIn, user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage when component mounts
  useEffect(() => {
    const loadPreferences = () => {
      setIsLoading(true);
      try {
        let storedPreferences;
        
        if (isSignedIn && user?.id) {
          storedPreferences = localStorage.getItem(`user_preferences_${user.id}`);
        } else {
          storedPreferences = localStorage.getItem('user_preferences');
        }

        if (storedPreferences) {
          setPreferences({
            ...defaultPreferences,
            ...JSON.parse(storedPreferences)
          });
        }
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [isSignedIn, user?.id]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (isLoading) return;
    
    try {
      if (isSignedIn && user?.id) {
        localStorage.setItem(`user_preferences_${user.id}`, JSON.stringify(preferences));
      } else {
        localStorage.setItem('user_preferences', JSON.stringify(preferences));
      }
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }, [preferences, isSignedIn, user?.id, isLoading]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences,
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetPreferences,
        isLoading,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
