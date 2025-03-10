
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
    getUserName: () => {
      if (!user) return 'Guest';
      
      // Handle both Supabase and mock user formats
      const firstName = user.user_metadata?.first_name || '';
      const lastName = user.user_metadata?.last_name || '';
      
      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }
      
      return user.email || 'Guest';
    },
    getUserEmail: () => user?.email || '',
    getUserId: () => user?.id || '',
    getUserInitials: () => {
      if (!user) return 'G';
      
      // Handle both Supabase and mock user formats
      const firstName = user.user_metadata?.first_name || '';
      const lastName = user.user_metadata?.last_name || '';
      
      const first = firstName?.[0] || '';
      const last = lastName?.[0] || '';
      
      if (first || last) {
        return (first + last).toUpperCase();
      }
      
      // Fallback to email initial if no name
      return (user.email?.[0] || 'G').toUpperCase();
    },
    getImageUrl: () => user?.user_metadata?.avatar_url || '',
    isAdmin: () => user?.user_metadata?.role === 'admin' || false,
  };
};

export const useAuthFunctions = () => {
  const { signIn, signUp, signOut } = useAuth();
  
  const getToken = async (): Promise<string> => {
    // Using Supabase this would typically be handled automatically
    // This is just for compatibility with any code expecting a token
    return "auth-token";
  };
  
  return {
    signIn,
    signUp,
    signOut,
    getToken,
  };
};
