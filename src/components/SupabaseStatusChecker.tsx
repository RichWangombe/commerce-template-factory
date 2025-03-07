
import React, { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export const SupabaseStatusChecker = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (!isSupabaseConfigured()) {
          setStatus('disconnected');
          setError('Supabase credentials are not configured');
          return;
        }

        // Try a simple query to verify connection
        const { data, error } = await supabase.from('products').select('id').limit(1);
        
        if (error) {
          setStatus('disconnected');
          setError(`Connection error: ${error.message}`);
        } else {
          setStatus('connected');
          setError(null);
        }
      } catch (err) {
        setStatus('disconnected');
        setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    checkConnection();
  }, []);

  // Don't render anything in production
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg bg-white border">
      <h3 className="text-sm font-semibold mb-1">Supabase Status</h3>
      <div className="flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full ${
            status === 'checking' ? 'bg-yellow-500' : 
            status === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`} 
        />
        <span className="text-xs">
          {status === 'checking' ? 'Checking connection...' : 
           status === 'connected' ? 'Connected to Supabase' : 'Not connected to Supabase'}
        </span>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
