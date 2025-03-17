
import { useState } from 'react';
import { toast } from 'sonner';

export function useMpesaPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const initiatePayment = async ({
    phone,
    amount,
    reference,
    description = "Payment for order"
  }) => {
    setIsLoading(true);
    
    try {
      // Generate a mock transaction ID
      const mockTransactionId = `txn-${Date.now()}`;
      setTransactionId(mockTransactionId);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Payment initiated successfully");
      
      return {
        success: true,
        transactionId: mockTransactionId
      };
    } catch (error) {
      toast.error(error.message || 'Failed to initiate payment');
      return {
        success: false,
        error: error.message || 'Failed to initiate payment'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async ({ transactionId }) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always return success for the simplified implementation
      return { 
        success: true, 
        data: { 
          resultCode: "0", 
          resultDesc: "Payment completed successfully" 
        }
      };
    } catch (error) {
      toast.error(error.message || 'Failed to check payment status');
      return { 
        success: false, 
        error: error.message || 'Failed to check payment status'
      };
    }
  };

  return {
    initiateMpesaPayment: initiatePayment,
    checkPaymentStatus,
    isLoading,
    checkoutRequestID: transactionId
  };
}
