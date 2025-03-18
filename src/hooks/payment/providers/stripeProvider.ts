
import { supabase } from "@/lib/supabase";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {
  PaymentProvider,
  PaymentInitiateRequest,
  PaymentInitiateResponse,
  PaymentStatusRequest,
  PaymentStatusResponse,
  PaymentProviderConfig
} from "../types";

export function useStripeProvider(): PaymentProvider {
  const stripe = useStripe();
  const elements = useElements();

  const config: PaymentProviderConfig = {
    name: "Stripe",
    displayName: "Credit/Debit Card (Stripe)",
    description: "Pay with your credit or debit card securely via Stripe",
    supports3DS: true,
    supportsSavedCards: true,
    availableCountries: ["global"]
  };

  const initiatePayment = async (request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> => {
    if (!stripe || !elements) {
      return { 
        success: false, 
        error: "Stripe has not been properly initialized" 
      };
    }

    try {
      // Create payment intent via Supabase function
      const { data: paymentIntentData, error: intentError } = await supabase.functions.invoke(
        'stripe-payment',
        {
          body: { 
            amount: Math.round(request.amount * 100), // Stripe uses cents
            currency: request.currency || "usd",
            description: request.description || "Payment for order"
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
        return {
          success: true,
          paymentId: paymentIntent.id,
          providerResponse: paymentIntent
        };
      } else {
        return {
          success: true,
          paymentId: paymentIntent.id,
          providerResponse: paymentIntent
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || "Payment failed",
        providerResponse: error
      };
    }
  };

  const checkPaymentStatus = async (request: PaymentStatusRequest): Promise<PaymentStatusResponse> => {
    if (!request.paymentId) {
      return { 
        success: false, 
        status: 'error',
        error: "No payment ID provided" 
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        'stripe-payment',
        {
          body: { 
            action: 'check',
            paymentId: request.paymentId
          }
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to check payment status");
      }

      let status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'error';
      
      // Map Stripe status to our unified status
      switch (data.status) {
        case 'succeeded':
          status = 'completed';
          break;
        case 'processing':
          status = 'processing';
          break;
        case 'requires_payment_method':
        case 'requires_confirmation':
        case 'requires_action':
          status = 'pending';
          break;
        case 'canceled':
          status = 'cancelled';
          break;
        default:
          status = 'failed';
      }

      return { 
        success: true, 
        status,
        amount: data.amount / 100, // Convert from cents
        currency: data.currency,
        providerResponse: data
      };
    } catch (error) {
      return { 
        success: false, 
        status: 'error',
        error: error.message || "Failed to check payment status",
        providerResponse: error
      };
    }
  };

  return {
    name: 'stripe',
    config,
    initiatePayment,
    checkPaymentStatus
  };
}
