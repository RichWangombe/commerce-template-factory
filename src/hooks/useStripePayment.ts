
import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export function useStripePayment() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const initiatePayment = async ({
    amount,
    currency = "usd",
    description = "Payment for order"
  }) => {
    if (!stripe || !elements) {
      toast.error("Stripe has not been properly initialized");
      return { success: false, error: "Stripe not initialized" };
    }

    setIsLoading(true);
    
    try {
      // Create payment intent via our Supabase function
      const { data: paymentIntentData, error: intentError } = await supabase.functions.invoke(
        'stripe-payment',
        {
          body: { 
            amount: Math.round(amount * 100), // Stripe uses cents
            currency,
            description
          }
        }
      );

      if (intentError || !paymentIntentData?.clientSecret) {
        throw new Error(intentError?.message || "Failed to create payment intent");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Confirm the payment with Stripe.js
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (paymentError) {
        throw new Error(paymentError.message || "Payment failed");
      }

      if (paymentIntent.status === "succeeded") {
        setPaymentId(paymentIntent.id);
        toast.success("Payment completed successfully");
        return {
          success: true,
          paymentId: paymentIntent.id
        };
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }
    } catch (error) {
      toast.error(error.message || "Payment failed");
      return {
        success: false,
        error: error.message || "Payment failed"
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async ({ paymentId }) => {
    if (!paymentId) {
      return { success: false, error: "No payment ID provided" };
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        'stripe-payment',
        {
          body: { 
            action: 'check',
            paymentId
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
    initiateStripePayment: initiatePayment,
    checkPaymentStatus,
    isLoading,
    paymentId
  };
}
