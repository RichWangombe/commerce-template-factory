
import React from "react";
import { useFormContext } from "react-hook-form";
import { PaymentProviderName } from "@/hooks/payment/types";

interface PaymentMethodSelectorProps {
  availableProviders: Array<{
    name: PaymentProviderName;
    displayName: string;
  }>;
  selectedPaymentMethod: PaymentProviderName;
  isLoading: boolean;
  paymentValid: boolean;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  availableProviders,
  selectedPaymentMethod,
  isLoading,
  paymentValid
}) => {
  const { setValue } = useFormContext();

  return (
    <div className="grid grid-cols-1 gap-4">
      {availableProviders.map(provider => (
        <div key={provider.name} className="flex items-center space-x-3">
          <input
            id={`${provider.name}-payment`}
            name="paymentMethod"
            type="radio"
            value={provider.name}
            className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary"
            checked={selectedPaymentMethod === provider.name}
            onChange={() => setValue("paymentMethod", provider.name)}
            disabled={isLoading || paymentValid}
          />
          <label htmlFor={`${provider.name}-payment`} className="block text-sm font-medium text-neutral-700">
            {provider.displayName}
          </label>
        </div>
      ))}
    </div>
  );
};
