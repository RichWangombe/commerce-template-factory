
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function usePesapalPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  const initiatePayment = async ({
    amount,
    currency = "USD",
    description = "Payment for order",
    firstName,
    lastName,
    email,
    phone
  }) => {
    setIsLoading(true);
    
    try {
      // Create payment request via our Supabase function
      const { data, error } = await supabase.functions.invoke(
        'pesapal-payment',
        {
          body: { 
            amount, 
            currency,
            description,
            firstName,
            lastName,
            email,
            phone
          }
        }
      );

      if (error || !data?.iframeUrl) {
        throw new Error(error?.message || "Failed to create payment request");
      }

      setPaymentReference(data.reference);
      setIframeUrl(data.iframeUrl);
      
      return {
        success: true,
        reference: data.reference,
        iframeUrl: data.iframeUrl
      };
    } catch (error) {
      toast.error(error.message || "Payment initialization failed");
      return {
        success: false,
        error: error.message || "Payment initialization failed"
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async ({ reference, transactionId }) => {
    if (!reference) {
      return { success: false, error: "No payment reference provided" };
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        'pesapal-payment',
        {
          body: { 
            action: 'check',
            reference,
            transaction_id: transactionId
          }
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to check payment status");
      }

      return { 
        success: true, 
        data: data 
      };
    } catch (error) {
      toast.error(error.message || "Failed to check payment status");
      return { 
        success: false, 
        error: error.message || "Failed to check payment status"
      };
    }
  };

  return {
    initiatePesapalPayment: initiatePayment,
    checkPaymentStatus,
    isLoading,
    paymentReference,
    iframeUrl
  };
}
