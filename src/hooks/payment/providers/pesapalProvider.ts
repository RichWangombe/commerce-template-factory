
import { supabase } from "@/lib/supabase";
import {
  PaymentProvider,
  PaymentInitiateRequest,
  PaymentInitiateResponse,
  PaymentStatusRequest,
  PaymentStatusResponse,
  PaymentProviderConfig
} from "../types";

export function usePesapalProvider(): PaymentProvider {
  const config: PaymentProviderConfig = {
    name: "Pesapal",
    displayName: "Pesapal",
    description: "Pay with cards, mobile money, and bank transfers via Pesapal",
    availableCountries: ["Kenya", "Tanzania", "Uganda", "Rwanda"],
    supports3DS: true,
    supportsSavedCards: false
  };

  const initiatePayment = async (request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> => {
    try {
      // Call the Supabase Pesapal function
      const { data, error } = await supabase.functions.invoke(
        'pesapal-payment',
        {
          body: {
            amount: request.amount,
            currency: request.currency || "USD",
            description: request.description || "Payment for order",
            firstName: request.customer.firstName,
            lastName: request.customer.lastName,
            email: request.customer.email,
            phone: request.customer.phone || "",
            reference: request.orderId
          }
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to create payment request");
      }

      if (!data?.iframeUrl) {
        throw new Error("No payment URL received from payment provider");
      }

      return {
        success: true,
        reference: data.reference,
        iframeUrl: data.iframeUrl,
        providerResponse: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Payment initialization failed",
        providerResponse: error
      };
    }
  };

  const checkPaymentStatus = async (request: PaymentStatusRequest): Promise<PaymentStatusResponse> => {
    if (!request.reference) {
      return {
        success: false,
        status: 'error',
        error: "No payment reference provided"
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        'pesapal-payment',
        {
          body: {
            action: 'check',
            reference: request.reference,
            transaction_id: request.transactionId || null
          }
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to check payment status");
      }

      // Map Pesapal statuses to our unified statuses
      let status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'error';
      
      if (data.status === "COMPLETED") {
        status = 'completed';
      } else if (data.status === "FAILED") {
        status = 'failed';
      } else if (data.status === "INVALID") {
        status = 'error';
      } else {
        status = 'pending';
      }

      return {
        success: true,
        status,
        reference: request.reference,
        transactionId: request.transactionId || data.transaction_id,
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
    name: 'pesapal',
    config,
    initiatePayment,
    checkPaymentStatus
  };
}
