
import { useUser, useAuth } from '@clerk/clerk-react';

// Utility hook to get user data
export const useUserData = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  
  return {
    isLoaded,
    isSignedIn,
    user,
    // Helper functions
    getUserName: () => user?.fullName || 'Guest',
    getUserEmail: () => user?.primaryEmailAddress?.emailAddress || '',
    getUserId: () => user?.id || '',
    getUserInitials: () => {
      const first = user?.firstName?.[0] || '';
      const last = user?.lastName?.[0] || '';
      return (first + last).toUpperCase() || 'G';
    },
    getImageUrl: () => user?.imageUrl || '',
    isAdmin: () => user?.publicMetadata?.role === 'admin' || false,
  };
};

// Utility hook to get auth functions
export const useAuthFunctions = () => {
  const { getToken, signOut } = useAuth();
  
  return {
    getToken,
    signOut,
    // Add any other auth functions here
  };
};
