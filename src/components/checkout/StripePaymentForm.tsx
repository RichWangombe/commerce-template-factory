
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Info } from "lucide-react";
import { toast } from "sonner";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useStripePayment } from "@/hooks/useStripePayment";

export const StripePaymentForm: React.FC = () => {
  const { control, setValue, watch } = useFormContext();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { initiateStripePayment } = useStripePayment();
  
  // Watch for payment validation status
  const paymentValid = watch("paymentValid");
  const orderTotal = watch("orderTotal") || 0;

  useEffect(() => {
    // Reset payment validation when the component mounts
    setValue("paymentValid", false);
  }, [setValue]);

  const handleCardChange = (event: any) => {
    if (event.error) {
      toast.error(event.error.message);
      setValue("paymentValid", false);
    } else {
      // This doesn't validate the card, just checks if all fields are filled
      setValue("paymentValid", event.complete);
    }
  };

  const handleProcessPayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe not available");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Card element not found");
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await initiateStripePayment({
        amount: orderTotal,
        currency: "usd",
        description: "Payment for your order"
      });

      if (result.success) {
        setValue("paymentValid", true);
        toast.success("Payment processed successfully");
      } else {
        setValue("paymentValid", false);
        toast.error(result.error || "Payment failed");
      }
    } catch (error) {
      setValue("paymentValid", false);
      toast.error("Payment processing failed");
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
      <h3 className="text-lg font-medium">Credit Card Payment</h3>
      <Separator className="my-4" />
      
      <div className="space-y-6">
        <div className="rounded-md border border-input p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-colors">
          <div className="mb-3 text-sm font-medium flex items-center gap-2">
            <CreditCard size={16} />
            Credit Card Details
          </div>
          
          <div className="space-y-4">
            <CardElement 
              options={cardStyle} 
              onChange={handleCardChange}
              className="p-3 border border-input rounded-md"
            />
            
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Info size={14} />
              Your card information is secure and encrypted
            </div>
            
            {!paymentValid && (
              <Button 
                type="button" 
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <LoadingIndicator size="sm" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  "Complete Payment"
                )}
              </Button>
            )}
            
            {paymentValid && (
              <div className="mt-3 text-sm text-green-600 flex items-center">
                Payment completed successfully!
              </div>
            )}
          </div>
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
