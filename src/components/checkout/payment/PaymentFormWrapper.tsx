
import React from "react";
import { Separator } from "@/components/ui/separator";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { PaymentProviderName } from "@/hooks/payment/types";
import { PaymentAnalytics } from "../pesapal/PaymentAnalytics";

interface PaymentFormWrapperProps {
  children: React.ReactNode;
  title?: string;
  availableProviders: Array<{
    name: PaymentProviderName;
    displayName: string;
  }>;
  selectedPaymentMethod: PaymentProviderName;
  isLoading: boolean;
  paymentValid: boolean;
  showAnalytics: boolean;
  analyticsSummary: any;
  onToggleAnalytics: () => void;
}

export const PaymentFormWrapper: React.FC<PaymentFormWrapperProps> = ({
  children,
  title = "Payment Method",
  availableProviders,
  selectedPaymentMethod,
  isLoading,
  paymentValid,
  showAnalytics,
  analyticsSummary,
  onToggleAnalytics
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <PaymentMethodSelector
          availableProviders={availableProviders}
          selectedPaymentMethod={selectedPaymentMethod}
          isLoading={isLoading}
          paymentValid={paymentValid}
        />
        
        <div className="mt-6">
          {children}
        </div>
        
        <PaymentAnalytics 
          show={showAnalytics}
          onToggle={onToggleAnalytics}
          analytics={analyticsSummary}
        />
      </div>
    </div>
  );
};
