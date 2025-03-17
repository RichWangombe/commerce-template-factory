
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Wallet, Info } from "lucide-react";
import { toast } from "sonner";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { usePesapalPayment } from "@/hooks/usePesapalPayment";

export const PesapalPaymentForm: React.FC = () => {
  const { control, setValue, watch, getValues } = useFormContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const { initiatePesapalPayment, isLoading, iframeUrl } = usePesapalPayment();
  
  // Watch for payment validation status
  const paymentValid = watch("paymentValid");
  const orderTotal = watch("orderTotal") || 0;

  // Pesapal iframe state
  const [showIframe, setShowIframe] = useState(false);

  useEffect(() => {
    // Reset payment validation when the component mounts
    setValue("paymentValid", false);
  }, [setValue]);

  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Get shipping address from form
      const shippingAddress = getValues("shippingAddress");
      
      const result = await initiatePesapalPayment({
        amount: orderTotal,
        currency: "USD", // Can be changed to KES for Kenyan Shillings
        description: "Payment for your order",
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        email: shippingAddress.email || "customer@example.com", // You may need to add email to your form
        phone: shippingAddress.phone || ""
      });

      if (result.success) {
        setShowIframe(true);
        // The payment is not yet validated - it will be validated after the customer completes payment in the iframe
      } else {
        toast.error(result.error || "Payment initialization failed");
      }
    } catch (error) {
      toast.error("Payment initialization failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulated payment completion for testing
  const handleSimulateCompletion = () => {
    setValue("paymentValid", true);
    setShowIframe(false);
    toast.success("Payment completed successfully!");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Pesapal Payment</h3>
      <Separator className="my-4" />
      
      <div className="space-y-6">
        <div className="rounded-md border border-input p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-colors">
          <div className="mb-3 text-sm font-medium flex items-center gap-2">
            <Wallet size={16} />
            Pesapal Secure Payment
          </div>
          
          {!showIframe && !paymentValid && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Info size={14} />
                Pay securely using Pesapal - supports M-Pesa, cards, and more
              </div>
              
              <Button 
                type="button" 
                onClick={handleInitiatePayment}
                disabled={isProcessing || isLoading}
                className="w-full"
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
          )}
          
          {showIframe && iframeUrl && (
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden" style={{ height: "450px" }}>
                <iframe 
                  src={iframeUrl} 
                  width="100%" 
                  height="100%" 
                  seamless 
                  frameBorder="0"
                  title="Pesapal Payment"
                />
              </div>
              
              {/* This button is just for sandbox testing */}
              <Button
                type="button"
                variant="outline"
                onClick={handleSimulateCompletion}
                className="w-full"
              >
                Simulate Payment Completion (Sandbox Testing)
              </Button>
            </div>
          )}
          
          {paymentValid && (
            <div className="mt-3 text-sm text-green-600 flex items-center">
              Payment completed successfully!
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
                <FormLabel>Save my payment information for future purchases</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
