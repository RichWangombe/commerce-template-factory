
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';

// Get Clerk publishable key from environment variable
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Create a root renderer with error boundary and our custom AuthProvider
// We'll only use ClerkProvider if a valid key is available
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    {CLERK_PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ClerkProvider>
    ) : (
      // Fall back to just using our custom AuthProvider when no valid Clerk key
      <AuthProvider>
        <App />
      </AuthProvider>
    )}
  </ErrorBoundary>
);
