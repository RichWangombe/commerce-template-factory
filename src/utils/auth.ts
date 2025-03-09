
import { useAuth } from '@/contexts/AuthContext';

// Utility hook to get user data
export const useUserData = () => {
  const { isLoaded, isSignedIn, user, mockMode } = useAuth();
  
  return {
    isLoaded,
    isSignedIn,
    user,
    mockMode,
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
  const { mockMode } = useAuth();
  
  // Mock versions of auth functions when in demo mode
  const mockGetToken = async () => "mock-jwt-token";
  const mockSignOut = async () => {
    console.log("Mock sign out - in a real app, this would sign the user out");
    return Promise.resolve();
  };
  
  return {
    getToken: mockMode ? mockGetToken : async () => {
      try {
        // This would normally call Clerk's getToken
        // But we're just handling the mock case for now
        return mockGetToken();
      } catch (error) {
        console.error("Error getting token:", error);
        return mockGetToken();
      }
    },
    signOut: mockMode ? mockSignOut : async () => {
      try {
        // This would normally call Clerk's signOut
        // But we're just handling the mock case for now
        return mockSignOut();
      } catch (error) {
        console.error("Error signing out:", error);
        return mockSignOut();
      }
    },
  };
};
