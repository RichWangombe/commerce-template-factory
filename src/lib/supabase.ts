
import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and anon key
const supabaseUrl = 'https://enhzqovqksjxzfcrbctg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuaHpxb3Zxa3NqeHpmY3JiY3RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTAxNzMsImV4cCI6MjA1NjkyNjE3M30.3bATVRoG4Cm5v0FXxl1rQt3AC75nA8-ZJ0NavoOVCww';

// Check if Supabase credentials are configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && supabaseUrl !== '';
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export configured status for easy checking
export const supabaseStatus = {
  isConfigured: isSupabaseConfigured(),
  url: supabaseUrl
};

// Log configuration status for debugging
console.log('Supabase configuration status:', supabaseStatus.isConfigured ? 'Configured' : 'Not configured');
