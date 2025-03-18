
import React from "react";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { Info } from "lucide-react";

interface InitiatePaymentButtonProps {
  isProcessing: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export const InitiatePaymentButton: React.FC<InitiatePaymentButtonProps> = ({
  isProcessing,
  isLoading,
  onClick,
}) => {
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
            <LoadingIndicator size="sm" />
            <span className="ml-2">Initializing payment...</span>
          </>
        ) : (
          "Proceed to Payment"
        )}
      </Button>
    </div>
  );
};
