
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
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
  
  useEffect(() => {
    // Try to use the real Clerk auth if available
    try {
      const { isLoaded, isSignedIn, user } = useUser();
      
      setAuthValues({
        isLoaded,
        isSignedIn,
        user,
        mockMode: false
      });
    } catch (error) {
      // If Clerk isn't properly set up, use mock values
      console.warn('Using mock authentication because Clerk is not available:', error);
      
      // Only show the mock mode toast once
      if (!hasShownMockNotice) {
        toast.info('Authentication is in demo mode', {
          description: 'Set VITE_CLERK_PUBLISHABLE_KEY in your environment to enable real authentication.'
        });
        setHasShownMockNotice(true);
      }
      
      // Use the default mock values
      setAuthValues(defaultAuthContext);
    }
  }, [hasShownMockNotice]);

  return (
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
