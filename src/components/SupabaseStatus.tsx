
import React from 'react';
import { useSupabaseStatus } from '@/hooks/useSupabaseStatus';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

export function SupabaseStatus() {
  const { isConnected, isChecking, error } = useSupabaseStatus();

  if (isChecking) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <Spinner size="sm" />
        <span>Checking Supabase connection...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Supabase Connection Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isConnected) {
    return (
      <Alert className="mb-4 border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
        <AlertTitle>Supabase Connected</AlertTitle>
        <AlertDescription>Your application is successfully connected to Supabase.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
      <AlertTitle>Supabase Not Connected</AlertTitle>
      <AlertDescription>
        Please check your environment variables and make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
      </AlertDescription>
    </Alert>
  );
}
