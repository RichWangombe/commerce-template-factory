
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

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
    isAdmin: () => {
      // First check if the user has admin role in user_metadata (from Supabase auth)
      if (user?.user_metadata?.role === 'admin') return true;
      
      // For checking profiles table role, we'd ideally do this as a separate hook
      // or database query, but returning false for now as a fallback
      return false;
    },
  };
};

export const useAuthFunctions = () => {
  const { signIn, signUp, signOut } = useAuth();
  
  const getToken = async (): Promise<string> => {
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token || "";
    }
    // Fallback for mock mode
    return "auth-token";
  };
  
  return {
    signIn,
    signUp,
    signOut,
    getToken,
  };
};

// New hook to manage profile data
export const useProfile = () => {
  const { user } = useAuth();
  
  const fetchProfile = async () => {
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  };
  
  const updateProfile = async (profileData: any) => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  };
  
  return {
    fetchProfile,
    updateProfile,
  };
};
