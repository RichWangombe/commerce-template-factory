
import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/checkout";

interface PaymentResult {
  success: boolean;
  error?: string;
  paymentId?: string;
}

export function useStripePayment() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (
    amount: number,
    orderData: Partial<Order>
  ): Promise<PaymentResult> => {
    if (!stripe || !elements) {
      return { 
        success: false, 
        error: "Stripe has not been initialized" 
      };
    }

    setIsProcessing(true);

    try {
      // This would normally come from your backend
      const paymentIntentClientSecret = await createPaymentIntent(amount);
      
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentClientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${orderData.billingAddress?.firstName} ${orderData.billingAddress?.lastName}`,
              address: {
                line1: orderData.billingAddress?.address1,
                line2: orderData.billingAddress?.address2,
                city: orderData.billingAddress?.city,
                state: orderData.billingAddress?.state,
                postal_code: orderData.billingAddress?.zipCode,
                country: orderData.billingAddress?.country,
              },
            },
          },
        }
      );

      if (error) {
        toast({
          title: "Payment failed",
          description: error.message,
          variant: "destructive",
        });
        return {
          success: false,
          error: error.message,
        };
      }

      if (paymentIntent.status === "succeeded") {
        toast({
          title: "Payment successful",
          description: "Your payment has been processed successfully",
        });
        return {
          success: true,
          paymentId: paymentIntent.id,
        };
      } else {
        return {
          success: false,
          error: `Payment status: ${paymentIntent.status}`,
        };
      }
    } catch (error: any) {
      toast({
        title: "Payment error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return {
        success: false,
        error: error.message,
      };
    } finally {
      setIsProcessing(false);
    }
  };

  // This is a mock function - in a real app, you'd call your backend API
  // to create a payment intent and return the client secret
  const createPaymentIntent = async (amount: number): Promise<string> => {
    // Mock implementation - in reality, this would be an API call to your backend
    console.log(`Creating payment intent for amount: $${amount}`);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // This is a mock client secret - not a real one
    return "pi_mock_secret_" + Math.random().toString(36).substring(2, 15);
  };

  return {
    processPayment,
    isProcessing,
  };
}
