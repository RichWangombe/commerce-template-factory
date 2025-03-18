
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useLocalStorage } from "./useLocalStorage";

interface PaymentAnalytics {
  completed: number;
  failed: number;
  pending: number;
  abandoned: number;
  errors: number;
  attempts: number;
}

interface PaymentInitiateParams {
  amount: number;
  currency?: string;
  description?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PaymentStatusParams {
  reference: string;
  transactionId: string | null;
}

export function usePesapalPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<'initializing' | 'processing' | 'verifying'>('initializing');
  
  // Use localStorage to persist analytics data
  const [analytics, setAnalytics] = useLocalStorage<PaymentAnalytics>("pesapal_payment_analytics", {
    completed: 0,
    failed: 0,
    pending: 0,
    abandoned: 0,
    errors: 0,
    attempts: 0
  });

  const updateAnalytics = (status: 'completed' | 'failed' | 'pending' | 'abandoned' | 'error') => {
    setAnalytics({
      ...analytics,
      [status]: analytics[status] + 1,
      attempts: analytics.attempts + (status === 'pending' ? 1 : 0)
    });
  };

  const resetPaymentState = () => {
    setPaymentStatus(null);
    setErrorMessage(null);
    setIframeUrl(null);
    setPaymentReference(null);
    setLoadingState('initializing');
  };

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

  // Get analytics summary with completion rate
  const getAnalyticsSummary = () => {
    const completionRate = analytics.attempts > 0 
      ? Math.round((analytics.completed / analytics.attempts) * 100) 
      : 0;
    
    return {
      ...analytics,
      completionRate
    };
  };

  return {
    initiatePesapalPayment: initiatePayment,
    checkPaymentStatus,
    isLoading,
    paymentReference,
    iframeUrl,
    paymentStatus,
    errorMessage,
    loadingState,
    resetPaymentState,
    getAnalyticsSummary
  };
}
