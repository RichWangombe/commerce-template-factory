
import { useAuth } from "@/contexts/AuthContext";

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

export const useAuthFunctions = () => {
  const auth = useAuth();
  
  const getToken = async (): Promise<string> => {
    // In a real app with Clerk properly configured, we would get the actual token
    // For our mock mode, return a fake token
    if (auth.mockMode) {
      return "mock-auth-token-for-development";
    }
    
    // This would be replaced with actual Clerk token fetching if Clerk is properly configured
    return Promise.resolve("auth-token");
  };
  
  return {
    getToken,
  };
};
