
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary.tsx';

// Mock Clerk publishable key - in a real app, this would come from an environment variable
// Replace this with your actual Clerk publishable key when available
const CLERK_PUBLISHABLE_KEY = "pk_test_••••••••••••••••••••••••••••••••••";

// Create a simple root renderer with error boundary and Clerk provider
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </ErrorBoundary>
);
