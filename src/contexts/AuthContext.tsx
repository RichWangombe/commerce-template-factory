
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Create a context that will provide fallback values when Clerk isn't available
// This is useful for development and testing
interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  user: any | null;
  mockMode: boolean;
}

const defaultAuthContext: AuthContextType = {
  isLoaded: true,
  isSignedIn: true, // Default to signed in for demo purposes
  user: {
    id: 'mock-user-id',
    firstName: 'Demo',
    lastName: 'User',
    fullName: 'Demo User',
    imageUrl: '',
    primaryEmailAddress: { emailAddress: 'demo@example.com' },
    publicMetadata: { role: 'user' }
  },
  mockMode: true
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authValues, setAuthValues] = useState<AuthContextType>(defaultAuthContext);
  const [hasShownMockNotice, setHasShownMockNotice] = useState(false);
  const clerkAvailable = typeof window !== 'undefined' && 
                        import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
                        import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.length > 0;
  
  useEffect(() => {
    // Only try to use Clerk if we actually have a publishable key
    if (clerkAvailable) {
      // Import Clerk's useUser hook dynamically to prevent errors when not wrapped in ClerkProvider
      import('@clerk/clerk-react').then(({ useUser }) => {
        try {
          // This will throw an error if not inside ClerkProvider
          const { isLoaded, isSignedIn, user } = useUser();
          
          setAuthValues({
            isLoaded,
            isSignedIn,
            user,
            mockMode: false
          });
        } catch (error) {
          console.warn('Error using Clerk authentication:', error);
          enableMockMode();
        }
      }).catch(() => {
        enableMockMode();
      });
    } else {
      // No Clerk key available, use mock mode
      enableMockMode();
    }
  }, [clerkAvailable, hasShownMockNotice]);

  const enableMockMode = () => {
    // Only show the mock mode toast once
    if (!hasShownMockNotice) {
      toast.info('Authentication is in demo mode', {
        description: 'Set VITE_CLERK_PUBLISHABLE_KEY in your environment to enable real authentication.'
      });
      setHasShownMockNotice(true);
    }
    
    // Use the default mock values
    setAuthValues(defaultAuthContext);
  };

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
