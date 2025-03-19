
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { CompletedPaymentMessage } from "../pesapal/CompletedPaymentMessage";

interface MpesaPaymentComponentProps {
  isLoading: boolean;
  paymentValid: boolean;
  orderTotal: number;
  handleInitiatePayment: () => Promise<void>;
}

export const MpesaPaymentComponent: React.FC<MpesaPaymentComponentProps> = ({
  isLoading,
  paymentValid,
  orderTotal,
  handleInitiatePayment
}) => {
  const { control } = useFormContext();
  const [phoneNumber, setPhoneNumber] = useState("");
  
  return (
    <div className="rounded-md border border-input p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-colors">
      <div className="mb-3 text-sm font-medium flex items-center gap-2">
        <Phone size={16} />
        Mobile Payment
      </div>
      
      <FormField
        control={control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your mobile number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="py-3"
                disabled={isLoading || paymentValid}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <Button 
        type="button" 
        onClick={handleInitiatePayment}
        disabled={isLoading || 
          (!phoneNumber) ||
          paymentValid
        }
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
    </div>
  );
};
