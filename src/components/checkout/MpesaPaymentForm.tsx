
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Phone, Info } from "lucide-react";
import { toast } from "sonner";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export const MpesaPaymentForm: React.FC = () => {
  const { control, setValue, watch } = useFormContext();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Watch for payment validation status
  const paymentValid = watch("paymentValid");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleSimulatePayment = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful payment
    setValue("paymentValid", true);
    toast.success("Payment completed successfully!");
    setIsProcessing(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Mobile Payment</h3>
      <Separator className="my-4" />
      
      <div className="space-y-6">
        <div className="rounded-md border border-input p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-colors">
          <div className="mb-3 text-sm font-medium flex items-center gap-2">
            <Phone size={16} />
            Mobile Payment
          </div>
          
          <div className="space-y-4">
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
                      onChange={handlePhoneChange}
                      className="py-3"
                      disabled={isProcessing || paymentValid}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-sm text-muted-foreground">
              Enter your phone number to complete payment.
            </div>
            
            {!paymentValid && (
              <Button 
                type="button" 
                onClick={handleSimulatePayment}
                disabled={isProcessing || !phoneNumber}
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
      </div>
      
      {/* Hidden field to store checkout request ID */}
      <input type="hidden" name="mpesaCheckoutRequestID" />
    </div>
  );
};
