
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface MpesaPaymentProps {
  phone: string;
  amount: number;
  reference: string;
  description?: string;
}

interface MpesaCheckStatusProps {
  checkoutRequestID: string;
}

export function useMpesaPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(null);

  const initiateMpesaPayment = async ({
    phone,
    amount,
    reference,
    description = "Payment for order",
  }: MpesaPaymentProps) => {
    setIsLoading(true);
    
    try {
      // Format phone number (remove spaces and any special characters)
      const formattedPhone = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('mpesa-payment/pay', {
        body: {
          phone: formattedPhone,
          amount,
          reference,
          description,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.errorCode) {
        throw new Error(data.errorMessage || 'Failed to initiate M-Pesa payment');
      }

      // Store the CheckoutRequestID for status checking
      if (data?.CheckoutRequestID) {
        setCheckoutRequestID(data.CheckoutRequestID);
        
        // Show success toast
        toast.success("M-Pesa payment initiated. Check your phone to complete payment.");
        
        return {
          success: true,
          checkoutRequestID: data.CheckoutRequestID,
          data
        };
      } else {
        throw new Error('Invalid response from M-Pesa');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to initiate M-Pesa payment');
      return {
        success: false,
        error: error.message || 'Failed to initiate M-Pesa payment'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async ({ checkoutRequestID }: MpesaCheckStatusProps) => {
    try {
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('mpesa-payment/status', {
        body: { checkoutRequestID },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.errorCode) {
        throw new Error(data.errorMessage || 'Failed to check M-Pesa payment status');
      }

      // Check if payment was successful
      if (data?.ResultCode === "0") {
        toast.success("Payment completed successfully!");
        return { success: true, data };
      } else {
        // Payment might be pending or failed
        return { success: false, pending: true, data };
      }
    } catch (error) {
      toast.error(error.message || 'Failed to check payment status');
      return { 
        success: false, 
        error: error.message || 'Failed to check payment status'
      };
    }
  };

  return {
    initiateMpesaPayment,
    checkPaymentStatus,
    isLoading,
    checkoutRequestID
  };
}
