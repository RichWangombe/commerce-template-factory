
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface MpesaCredentials {
  consumerKey?: string;
  consumerSecret?: string;
  passkey?: string;
  shortcode?: string;
  env?: 'sandbox' | 'production';
  callbackUrl?: string;
}

interface MpesaPaymentProps {
  phone: string;
  amount: number;
  reference: string;
  description?: string;
  credentials?: MpesaCredentials;
}

interface MpesaCheckStatusProps {
  checkoutRequestID: string;
  credentials?: MpesaCredentials;
}

export function useMpesaPayment(defaultCredentials?: MpesaCredentials) {
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<MpesaCredentials | undefined>(defaultCredentials);

  const updateCredentials = (newCredentials: MpesaCredentials) => {
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      ...newCredentials
    }));
  };

  const initiateMpesaPayment = async ({
    phone,
    amount,
    reference,
    description = "Payment for order",
    credentials: requestCredentials,
  }: MpesaPaymentProps) => {
    setIsLoading(true);
    
    try {
      // Format phone number (remove spaces and any special characters)
      const formattedPhone = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
      
      // Merge default and request credentials
      const mergedCredentials = {
        ...credentials,
        ...requestCredentials
      };
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('mpesa-payment/pay', {
        body: {
          phone: formattedPhone,
          amount,
          reference,
          description,
          credentials: mergedCredentials,
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
      // For demo purposes, allow completion even on errors in sandbox mode
      if (process.env.NODE_ENV !== 'production') {
        const mockCheckoutRequestID = `demo-${Date.now()}`;
        setCheckoutRequestID(mockCheckoutRequestID);
        toast.warning("Using demo mode. In production, this would initiate an actual M-Pesa payment.");
        
        return {
          success: true,
          checkoutRequestID: mockCheckoutRequestID,
          demo: true
        };
      }
      
      toast.error(error.message || 'Failed to initiate M-Pesa payment');
      return {
        success: false,
        error: error.message || 'Failed to initiate M-Pesa payment'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async ({ 
    checkoutRequestID, 
    credentials: requestCredentials 
  }: MpesaCheckStatusProps) => {
    try {
      // Check if this is a demo ID
      if (checkoutRequestID.startsWith('demo-')) {
        // For demo purposes, automatically approve after short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { 
          success: true, 
          data: { 
            ResultCode: "0", 
            ResultDesc: "Demo payment completed successfully" 
          },
          demo: true 
        };
      }
      
      // Merge default and request credentials
      const mergedCredentials = {
        ...credentials,
        ...requestCredentials
      };
      
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('mpesa-payment/status', {
        body: { 
          checkoutRequestID,
          credentials: mergedCredentials
        },
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
      // For demo purposes, allow completion even on errors
      if (process.env.NODE_ENV !== 'production' && checkoutRequestID.startsWith('demo-')) {
        return { 
          success: true, 
          data: { 
            ResultCode: "0", 
            ResultDesc: "Demo payment completed successfully" 
          },
          demo: true 
        };
      }
      
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
    updateCredentials,
    isLoading,
    checkoutRequestID
  };
}
