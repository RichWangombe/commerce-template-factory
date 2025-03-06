
import { useState, useEffect } from 'react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export function useSupabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      setError(null);

      // First check if credentials are configured
      if (!isSupabaseConfigured()) {
        setIsConnected(false);
        setIsChecking(false);
        setError('Supabase credentials are not configured. Please add them to your environment variables.');
        return;
      }

      try {
        // Simple query to check if we can reach Supabase
        const { error } = await supabase.from('products').select('id').limit(1);
        
        if (error) {
          setIsConnected(false);
          setError(`Failed to connect to Supabase: ${error.message}`);
        } else {
          setIsConnected(true);
        }
      } catch (err) {
        setIsConnected(false);
        setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
  }, []);

  return { isConnected, isChecking, error };
}
