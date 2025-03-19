
import React from "react";
import { useFormContext } from "react-hook-form";
import { CardElement } from "@stripe/react-stripe-js";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard } from "lucide-react";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { CompletedPaymentMessage } from "../pesapal/CompletedPaymentMessage";
import { PaymentProviderConfig } from "@/hooks/payment/types";

interface StripePaymentComponentProps {
  isLoading: boolean;
  paymentValid: boolean;
  orderTotal: number;
  handleInitiatePayment: () => Promise<void>;
  currentProviderConfig: {
    supportsSavedCards?: boolean;
  };
}

export const StripePaymentComponent: React.FC<StripePaymentComponentProps> = ({
  isLoading,
  paymentValid,
  orderTotal,
  handleInitiatePayment,
  currentProviderConfig
}) => {
  const { control, setValue } = useFormContext();
  
  return (
    <div className="rounded-md border border-input p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-colors">
      <div className="mb-3 text-sm font-medium flex items-center gap-2">
        <CreditCard size={16} />
        Credit Card Details
      </div>
      
      <CardElement 
        onChange={(e) => setValue("paymentValid", e.complete)}
        className="p-3 border border-input rounded-md"
        options={{
          style: {
            base: {
              color: "#32325d",
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: "antialiased",
              fontSize: "16px",
              "::placeholder": {
                color: "#aab7c4",
              },
              padding: "16px 0",
            },
            invalid: {
              color: "#fa755a",
              iconColor: "#fa755a",
            },
          }
        }}
      />
      
      <Button 
        type="button" 
        onClick={handleInitiatePayment}
        disabled={isLoading || paymentValid}
        className="w-full mt-4"
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
      
      {paymentValid && (
        <CompletedPaymentMessage />
      )}
      
      {currentProviderConfig.supportsSavedCards && (
        <FormField
          control={control}
          name="savePaymentInfo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Save my payment information for future purchases</FormLabel>
              </div>
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
