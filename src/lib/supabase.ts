
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Environment variables for Supabase (will need to be set in your deployment)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing. Using fallback mock data.');
}

// Create a Supabase client
export const supabase = createClient<Database>(
  supabaseUrl || 'https://example.supabase.co',
  supabaseKey || 'fallback-key-for-development'
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseKey;
};
