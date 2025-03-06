
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
      <Alert variant="success" className="mb-4">
        <AlertTitle>Supabase Connected</AlertTitle>
        <AlertDescription>Your application is successfully connected to Supabase.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="warning" className="mb-4">
      <AlertTitle>Supabase Not Connected</AlertTitle>
      <AlertDescription>
        Please check your environment variables and make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.
      </AlertDescription>
    </Alert>
  );
}
