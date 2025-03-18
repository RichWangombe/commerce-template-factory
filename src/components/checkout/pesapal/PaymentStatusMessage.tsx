
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { PaymentStatus } from "./PaymentStatus";
import { PaymentStatus as PaymentStatusType } from "@/hooks/payment/types";

interface PaymentStatusMessageProps {
  paymentStatus: PaymentStatusType;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export const PaymentStatusMessage: React.FC<PaymentStatusMessageProps> = ({
  paymentStatus,
  errorMessage,
  onRetry
}) => {
  if (!paymentStatus) return null;
  
  return (
    <div className="mb-4">
      {paymentStatus === 'error' && errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
            {onRetry && (
              <button 
                onClick={onRetry}
                className="ml-2 underline text-sm hover:text-primary"
              >
                Retry
              </button>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <PaymentStatus status={paymentStatus} errorMessage={errorMessage} />
    </div>
  );
};
