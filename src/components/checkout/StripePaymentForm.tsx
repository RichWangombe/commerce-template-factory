
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export const StripePaymentForm = () => {
  const { control, setValue, watch } = useFormContext();
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cardValid = watch("paymentValid");

  useEffect(() => {
    // When the component mounts, ensure the payment is marked as invalid
    setValue("paymentValid", false);
  }, [setValue]);

  const handleCardChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
      setValue("paymentValid", false);
    } else {
      setCardError(null);
      // Setting a hidden field to indicate card is valid
      setValue("paymentValid", event.complete);
    }
  };

  // Test card validation
  const validateCard = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe not loaded");
      return;
    }

    setIsProcessing(true);
    
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }
      
      // This doesn't charge the card, just validates it
      const result = await stripe.createToken(cardElement);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      toast.success("Card validated successfully");
      setValue("paymentValid", true);
    } catch (error: any) {
      toast.error(error.message || "Failed to validate card");
      setValue("paymentValid", false);
    } finally {
      setIsProcessing(false);
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
        padding: "16px 0",
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
      
      <div className="space-y-6">
        <div className="rounded-md border border-input p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-colors">
          <div className="mb-3 text-sm font-medium">Credit Card</div>
          <CardElement 
            options={cardStyle} 
            onChange={handleCardChange} 
            className="py-3"
          />
          {cardError && (
            <div className="mt-3 text-sm text-destructive">{cardError}</div>
          )}
          {cardValid && (
            <div className="mt-3 text-sm text-green-600 flex items-center">
              Card information is valid
            </div>
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
                <FormLabel className="text-sm">Save my payment information for future purchases</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
