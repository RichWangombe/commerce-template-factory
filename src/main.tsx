
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Create a simple root renderer without any authentication wrapper
// This ensures the app will always render regardless of auth state
createRoot(document.getElementById("root")!).render(<App />);
