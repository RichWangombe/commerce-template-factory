
import React from 'react';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface LoadingStateProps {
  text?: string;
}

export const LoadingState = ({ text = "Loading new arrivals..." }: LoadingStateProps) => (
  <div className="flex justify-center items-center py-12">
    <LoadingIndicator size="lg" text={text} />
  </div>
);

interface ErrorStateProps {
  message?: string;
}

export const ErrorState = ({ message = "There was an error loading the new arrivals. Please try again later." }: ErrorStateProps) => (
  <Alert variant="destructive" className="my-6">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

interface EmptyStateProps {
  message?: string;
  submessage?: string;
}

export const EmptyState = ({ 
  message = "No new arrivals yet", 
  submessage = "Check back soon for new products!" 
}: EmptyStateProps) => (
  <div className="text-center py-12">
    <h3 className="text-lg font-medium">{message}</h3>
    <p className="text-muted-foreground mt-2">{submessage}</p>
  </div>
);
