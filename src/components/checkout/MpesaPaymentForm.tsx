
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useMpesaPayment } from "@/hooks/useMpesaPayment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Phone, Info } from "lucide-react";
import { toast } from "sonner";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export const MpesaPaymentForm: React.FC = () => {
  const { control, setValue, getValues, watch } = useFormContext();
  const [phoneNumber, setPhoneNumber] = useState("");
  const { initiateMpesaPayment, checkPaymentStatus, isLoading, checkoutRequestID } = useMpesaPayment();
  
  // Watch for payment validation status
  const paymentValid = watch("paymentValid");
  const [demoMode, setDemoMode] = useState(process.env.NODE_ENV !== 'production');

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
    if (!phoneNumber && !demoMode) {
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
        phone: phoneNumber || "0722000000", // Use dummy number in demo mode if empty
        amount: Math.round(total), // M-Pesa requires whole numbers
        reference,
        description: `Payment for order ${reference}`
      });

      if (result.success) {
        // Set hidden field to indicate payment is initiated
        setValue("mpesaCheckoutRequestID", result.checkoutRequestID);
        
        // If this is a demo result, set demo mode flag
        if (result.demo) {
          setDemoMode(true);
        }
        
        // Start polling for payment status
        startPaymentStatusPolling(result.checkoutRequestID);
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
    }
  };

  const startPaymentStatusPolling = async (requestId: string) => {
    // For demo mode, simulate a successful payment after a short delay
    if (demoMode || requestId.startsWith('demo-')) {
      setTimeout(() => {
        setValue("paymentValid", true);
        toast.success("Demo payment verified successfully!");
      }, 3000);
      return;
    }
    
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
      
      {demoMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Demo Mode Active</p>
              <p>This is running in demo mode. No actual M-Pesa transactions will be made. 
              You can test the checkout flow without entering real credentials or phone numbers.</p>
            </div>
          </div>
        </div>
      )}
      
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
                  <FormLabel>M-Pesa Phone Number {demoMode && "(Optional in demo mode)"}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={demoMode ? "Demo mode - any phone number works" : "07XX XXX XXX"}
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
              {demoMode 
                ? "In demo mode, payments are automatically approved for testing purposes." 
                : "Enter the phone number linked to your M-Pesa account. You will receive an STK push prompt to confirm payment."}
            </div>
            
            {!paymentValid && (
              <Button 
                type="button" 
                onClick={handleInitiatePayment}
                disabled={isLoading || (!phoneNumber && !demoMode)}
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
                  demoMode ? "Simulate M-Pesa Payment" : "Pay with M-Pesa"
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
