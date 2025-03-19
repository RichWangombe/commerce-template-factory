
import React from "react";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { PaymentStatusMessage } from "../pesapal/PaymentStatusMessage";
import { PaymentIframe } from "../pesapal/PaymentIframe";
import { CompletedPaymentMessage } from "../pesapal/CompletedPaymentMessage";
import { PaymentStatus } from "@/hooks/payment/types";

interface PesapalPaymentComponentProps {
  isLoading: boolean;
  paymentValid: boolean;
  paymentStatus: PaymentStatus | null;
  errorMessage: string | null;
  showIframe: boolean;
  iframeUrl: string | null;
  iframeHeight: string;
  orderTotal: number;
  handleInitiatePayment: () => Promise<void>;
  onSimulateCompletion: () => void;
  onRetry?: () => void;
  isMobile: boolean;
}

export const PesapalPaymentComponent: React.FC<PesapalPaymentComponentProps> = ({
  isLoading,
  paymentValid,
  paymentStatus,
  errorMessage,
  showIframe,
  iframeUrl,
  iframeHeight,
  orderTotal,
  handleInitiatePayment,
  onSimulateCompletion,
  onRetry,
  isMobile
}) => {
  return (
    <div className="space-y-4">
      {paymentStatus && (
        <PaymentStatusMessage 
          paymentStatus={paymentStatus} 
          errorMessage={errorMessage}
          onRetry={onRetry}
        />
      )}
      
      {!showIframe && !paymentValid && paymentStatus !== 'error' && (
        <div className="text-center py-4">
          <p className="mb-4 text-sm text-gray-600">
            Click below to proceed to the secure Pesapal payment page
          </p>
          <Button 
            type="button" 
            onClick={handleInitiatePayment}
            disabled={isLoading || paymentValid}
            className="w-full"
          >
            {isLoading ? (
              <>
                <LoadingIndicator size="sm" />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              `Pay ${orderTotal ? `$${orderTotal.toFixed(2)}` : ''}`
            )}
          </Button>
        </div>
      )}
      
      {showIframe && iframeUrl && (
        <PaymentIframe 
          iframeUrl={iframeUrl}
          iframeHeight={iframeHeight}
          onSimulateCompletion={onSimulateCompletion}
          isMobile={isMobile}
          isLoading={isLoading}
        />
      )}
      
      {paymentValid && (
        <CompletedPaymentMessage />
      )}
    </div>
  );
};
