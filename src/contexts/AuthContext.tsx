
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

// Auth context type definition
interface AuthContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: any | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  mockMode: boolean;
}

// Default mock values for development
const defaultAuthContext: AuthContextType = {
  isLoaded: true,
  isSignedIn: false,
  user: null,
  session: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  mockMode: true
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<Omit<AuthContextType, 'signIn' | 'signUp' | 'signOut' | 'resetPassword' | 'updatePassword'>>({
    isLoaded: false,
    isSignedIn: false,
    user: null,
    session: null,
    mockMode: false
  });
  const [hasShownMockNotice, setHasShownMockNotice] = useState(false);
  
  // Check if Supabase is properly configured
  const supabaseConfigured = supabase && supabaseStatus.isConfigured;

  useEffect(() => {
    if (supabaseConfigured) {
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          const isSignedIn = !!session;
          const user = session?.user || null;
          
          setAuthState({
            isLoaded: true,
            isSignedIn,
            user,
            session,
            mockMode: false
          });
          
          // Log auth events for debugging
          console.log('Auth state change:', event, isSignedIn ? 'signed in' : 'signed out');
        }
      );

      // Initial session check
      const initializeAuth = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setAuthState({
              isLoaded: true,
              isSignedIn: true,
              user: session.user,
              session,
              mockMode: false
            });
          } else {
            setAuthState({
              isLoaded: true,
              isSignedIn: false,
              user: null,
              session: null,
              mockMode: false
            });
          }
        } catch (error) {
          console.error("Error getting session:", error);
          // Fallback to mock mode if there's an error
          enableMockMode();
        }
      };
      
      initializeAuth();

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Supabase not configured, use mock mode
      enableMockMode();
    }
  }, [supabaseConfigured]);

  const enableMockMode = () => {
    // Only show the mock mode toast once
    if (!hasShownMockNotice) {
      toast.info('Authentication is in demo mode', {
        description: 'Set up Supabase properly to enable real authentication.'
      });
      setHasShownMockNotice(true);
    }
    
    // Set mock values
    setAuthState({
      isLoaded: true,
      isSignedIn: true,
      user: {
        id: 'mock-user-id',
        email: 'demo@example.com',
        user_metadata: {
          first_name: 'Demo',
          last_name: 'User',
        }
      },
      session: null,
      mockMode: true
    });
  };

  // Auth functions
  const signIn = async (email: string, password: string) => {
    if (supabaseConfigured) {
      try {
        // Use persistSession: true to enable "Remember Me" functionality
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password,
          options: {
            // This enables persistent sessions, effectively implementing "Remember Me"
            // We'll manage the email remembering separately with localStorage
          }
        });
        return { error };
      } catch (error) {
        console.error("Sign in error:", error);
        toast.error("Authentication error", {
          description: "An error occurred while trying to sign in. Please try again."
        });
        return { error };
      }
    }
    
    // Mock signIn when Supabase isn't configured
    console.log('Mock sign in:', email);
    toast.success('Signed in as Demo User');
    
    // Use mock data
    enableMockMode();
    return { error: null };
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    if (supabaseConfigured) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      return { error };
    }
    
    // Mock signUp when Supabase isn't configured
    console.log('Mock sign up:', email);
    toast.success('Account created successfully');
    
    // Use mock data
    enableMockMode();
    return { error: null };
  };

  const signOut = async () => {
    if (supabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      // Mock signOut
      console.log('Mock sign out');
      setAuthState({
        ...authState,
        isSignedIn: false,
        user: null,
        session: null
      });
      
      toast.info('Signed out');
    }
  };

  // Password reset request
  const resetPassword = async (email: string) => {
    if (supabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      return { error };
    }
    
    // Mock resetPassword when Supabase isn't configured
    console.log('Mock password reset for:', email);
    toast.success('Password reset email sent');
    
    return { error: null };
  };

  // Update password (after reset)
  const updatePassword = async (password: string) => {
    if (supabaseConfigured) {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      return { error };
    }
    
    // Mock updatePassword when Supabase isn't configured
    console.log('Mock password update');
    toast.success('Password updated successfully');
    
    return { error: null };
  };

  // Combine state and functions for the full context value
  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access to auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Import supabase status
import { supabaseStatus } from '@/lib/supabase';
