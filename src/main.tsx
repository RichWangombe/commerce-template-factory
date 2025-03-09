
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary.tsx';

// Get Clerk publishable key from environment variable
// In development or when not properly configured, we'll use a fallback mock mode
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

// Create a simple root renderer with error boundary and Clerk provider
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    {CLERK_PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      // When no publishable key is available, skip the Clerk provider entirely
      <App />
    )}
  </ErrorBoundary>
);
