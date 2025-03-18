
import { supabase } from "@/lib/supabase";
import {
  PaymentProvider,
  PaymentInitiateRequest,
  PaymentInitiateResponse,
  PaymentStatusRequest,
  PaymentStatusResponse,
  PaymentProviderConfig
} from "../types";

export function useMpesaProvider(): PaymentProvider {
  const config: PaymentProviderConfig = {
    name: "M-Pesa",
    displayName: "M-Pesa Mobile Money",
    description: "Pay using your M-Pesa mobile money account",
    availableCountries: ["Kenya", "Tanzania", "Ghana"],
    supports3DS: false,
    supportsSavedCards: false
  };

  const initiatePayment = async (request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> => {
    if (!request.customer.phone) {
      return {
        success: false,
        error: "Phone number is required for M-Pesa payments"
      };
    }

    try {
      // Call the Supabase M-Pesa function
      const { data, error } = await supabase.functions.invoke(
        'mpesa-payment',
        {
          body: {
            phone: request.customer.phone,
            amount: request.amount,
            reference: request.orderId || `ORDER-${Date.now()}`,
            description: request.description || "Payment for order"
          }
        }
      );

      if (error || !data?.success) {
        throw new Error(error?.message || data?.message || "Failed to initiate M-Pesa payment");
      }

      return {
        success: true,
        reference: data.reference || request.orderId,
        transactionId: data.transactionId,
        providerResponse: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to initiate M-Pesa payment",
        providerResponse: error
      };
    }
  };

  const checkPaymentStatus = async (request: PaymentStatusRequest): Promise<PaymentStatusResponse> => {
    if (!request.transactionId) {
      return {
        success: false,
        status: 'error',
        error: "Transaction ID is required to check M-Pesa payment status"
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        'mpesa-payment',
        {
          body: {
            action: 'status',
            transactionId: request.transactionId
          }
        }
      );

      if (error) {
        throw new Error(error.message || "Failed to check M-Pesa payment status");
      }

      // Map M-Pesa status codes to our unified statuses
      let status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'error';
      
      if (data.resultCode === "0") {
        status = 'completed';
      } else if (data.resultCode === "1") {
        status = 'failed';
      } else {
        status = 'pending';
      }

      return {
        success: true,
        status,
        reference: request.reference,
        transactionId: request.transactionId,
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
    name: 'mpesa',
    config,
    initiatePayment,
    checkPaymentStatus
  };
}
