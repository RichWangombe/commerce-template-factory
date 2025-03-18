
import React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Info } from "lucide-react";

interface InitiatePaymentButtonProps {
  isProcessing: boolean;
  isLoading: boolean;
  onClick: () => void;
  loadingState?: 'initializing' | 'processing' | 'verifying';
}

export const InitiatePaymentButton: React.FC<InitiatePaymentButtonProps> = ({
  isProcessing,
  isLoading,
  onClick,
  loadingState = 'initializing'
}) => {
  // Determine the loading text based on the current state
  const getLoadingText = () => {
    switch(loadingState) {
      case 'initializing':
        return "Initializing payment...";
      case 'processing':
        return "Processing payment...";
      case 'verifying':
        return "Verifying payment...";
      default:
        return "Initializing payment...";
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground flex items-center gap-1">
        <Info size={14} />
        Pay securely using Pesapal - supports M-Pesa, cards, and more
      </div>
      
      <Button 
        type="button" 
        onClick={onClick}
        disabled={isProcessing || isLoading}
        className="w-full sm:w-auto"
      >
        {isProcessing || isLoading ? (
          <>
            <Spinner size="sm" />
            <span className="ml-2">{getLoadingText()}</span>
          </>
        ) : (
          "Proceed to Payment"
        )}
      </Button>
    </div>
  );
};
