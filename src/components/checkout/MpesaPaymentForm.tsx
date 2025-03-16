
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useMpesaPayment } from "@/hooks/useMpesaPayment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export const MpesaPaymentForm: React.FC = () => {
  const { control, setValue, getValues, watch } = useFormContext();
  const [phoneNumber, setPhoneNumber] = useState("");
  const { initiateMpesaPayment, checkPaymentStatus, isLoading, checkoutRequestID } = useMpesaPayment();
  
  // Watch for payment validation status
  const paymentValid = watch("paymentValid");

  // Format phone number to standard format
  const formatPhone = (input: string) => {
    // Remove non-numeric characters
    let cleaned = input.replace(/\D/g, '');
    
    // Format as 07XX XXX XXX or add country code if needed
    if (cleaned.startsWith('0') && cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    } else if (cleaned.startsWith('254') && cleaned.length === 12) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
    } else if (cleaned.length === 9) {
      // Add 0 prefix if user entered number without prefix
      return '0' + cleaned.replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    return input;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleInitiatePayment = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Get total amount from form or calculate
    const subtotal = getValues("subtotal") || 0;
    const shipping = getValues("shipping") || 0;
    const tax = getValues("tax") || 0;
    const total = subtotal + shipping + tax;

    // Get order reference
    const reference = `ORDER-${Date.now()}`;

    try {
      const result = await initiateMpesaPayment({
        phone: phoneNumber,
        amount: Math.round(total), // M-Pesa requires whole numbers
        reference,
        description: `Payment for order ${reference}`
      });

      if (result.success) {
        // Set hidden field to indicate payment is initiated
        setValue("mpesaCheckoutRequestID", result.checkoutRequestID);
        
        // Start polling for payment status
        startPaymentStatusPolling(result.checkoutRequestID);
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
    }
  };

  const startPaymentStatusPolling = async (requestId: string) => {
    // Poll for payment status every 5 seconds for up to 2 minutes
    let attempts = 0;
    const maxAttempts = 24; // 2 minutes (24 * 5 seconds)
    
    const pollInterval = setInterval(async () => {
      attempts++;
      
      if (attempts > maxAttempts) {
        clearInterval(pollInterval);
        toast.error("Payment verification timed out. Please check your M-Pesa and try again if needed.");
        return;
      }
      
      const statusResult = await checkPaymentStatus({ checkoutRequestID: requestId });
      
      if (statusResult.success) {
        clearInterval(pollInterval);
        setValue("paymentValid", true);
        toast.success("Payment verified successfully!");
      } else if (!statusResult.pending) {
        // Payment failed
        clearInterval(pollInterval);
        toast.error("Payment failed or was cancelled. Please try again.");
      }
      // If pending, continue polling
      
    }, 5000); // Check every 5 seconds
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">M-Pesa Payment</h3>
      <Separator className="my-4" />
      
      <div className="space-y-6">
        <div className="rounded-md border border-input p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-colors">
          <div className="mb-3 text-sm font-medium flex items-center gap-2">
            <Phone size={16} />
            M-Pesa Payment
          </div>
          
          <div className="space-y-4">
            <FormField
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>M-Pesa Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="07XX XXX XXX"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="py-3"
                      disabled={isLoading || paymentValid}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-sm text-muted-foreground">
              Enter the phone number linked to your M-Pesa account. You will receive an STK push prompt to confirm payment.
            </div>
            
            {!paymentValid && (
              <Button 
                type="button" 
                onClick={handleInitiatePayment}
                disabled={isLoading || !phoneNumber || phoneNumber.length < 10}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <LoadingIndicator size="sm" />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : checkoutRequestID ? (
                  "Waiting for Payment Confirmation..."
                ) : (
                  "Pay with M-Pesa"
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
      </div>
      
      {/* Hidden field to store checkout request ID */}
      <input type="hidden" name="mpesaCheckoutRequestID" />
    </div>
  );
};
