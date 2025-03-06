
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export const StripePaymentForm = () => {
  const { control, setValue } = useFormContext();
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
      // Setting a hidden field to indicate card is valid
      setValue("paymentValid", event.complete);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Payment Details</h3>
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <div className="rounded-md border border-input p-4">
          <div className="mb-2 text-sm font-medium">Credit Card</div>
          <CardElement 
            options={cardStyle} 
            onChange={handleCardChange} 
            className="py-2"
          />
          {cardError && (
            <div className="mt-2 text-sm text-destructive">{cardError}</div>
          )}
        </div>
        
        <FormField
          control={control}
          name="savePaymentInfo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
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
      </div>
    </div>
  );
};
