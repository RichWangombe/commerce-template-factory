
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { usePaymentState } from "./usePaymentState";
import { usePaymentAnalytics } from "./usePaymentAnalytics";
import { PaymentInitiateParams, PaymentStatusParams } from "./types";

export function usePaymentOperations() {
  const {
    isLoading,
    setIsLoading,
    paymentReference,
    setPaymentReference,
    setIframeUrl,
    paymentStatus,
    setPaymentStatus,
    setErrorMessage,
    loadingState,
    setLoadingState,
    resetPaymentState
  } = usePaymentState();

  const { updateAnalytics } = usePaymentAnalytics();

  const initiatePayment = async ({
    amount,
    currency = "USD",
    description = "Payment for order",
    firstName,
    lastName,
    email,
    phone
  }: PaymentInitiateParams) => {
    setIsLoading(true);
    setLoadingState('initializing');
    
    try {
      // Reset any previous payment state
      resetPaymentState();

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

      if (error) {
        throw new Error(error.message || "Failed to create payment request");
      }

      if (!data?.iframeUrl) {
        throw new Error("No payment URL received from payment provider");
      }

      setPaymentReference(data.reference);
      setIframeUrl(data.iframeUrl);
      setPaymentStatus('pending');
      updateAnalytics('pending');
      setLoadingState('processing');
      
      return {
        success: true,
        reference: data.reference,
        iframeUrl: data.iframeUrl
      };
    } catch (error) {
      console.error("Payment initialization error:", error);
      setPaymentStatus('error');
      setErrorMessage(error.message || "Payment initialization failed");
      updateAnalytics('error');
      toast.error(error.message || "Payment initialization failed");
      
      return {
        success: false,
        error: error.message || "Payment initialization failed"
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async ({ reference, transactionId }: PaymentStatusParams) => {
    if (!reference) {
      return { success: false, error: "No payment reference provided" };
    }

    setLoadingState('verifying');

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

      // Update payment status based on response
      if (data.status === 'COMPLETED') {
        setPaymentStatus('completed');
        updateAnalytics('completed');
        toast.success("Payment completed successfully!");
      } else if (data.status === 'FAILED') {
        setPaymentStatus('failed');
        updateAnalytics('failed');
        toast.error("Payment failed. Please try again.");
      } else if (data.status === 'INVALID') {
        setPaymentStatus('error');
        setErrorMessage("Invalid payment request");
        updateAnalytics('error');
        toast.error("Invalid payment request");
      }

      return { 
        success: true, 
        data: data 
      };
    } catch (error) {
      console.error("Payment status check error:", error);
      setPaymentStatus('error');
      setErrorMessage(error.message || "Failed to check payment status");
      updateAnalytics('error');
      toast.error(error.message || "Failed to check payment status");
      
      return { 
        success: false, 
        error: error.message || "Failed to check payment status"
      };
    }
  };

  return {
    initiatePayment,
    checkPaymentStatus,
    isLoading,
    paymentReference,
    paymentStatus,
    errorMessage,
    loadingState,
    resetPaymentState
  };
}
