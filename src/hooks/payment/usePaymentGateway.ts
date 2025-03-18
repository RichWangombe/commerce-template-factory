
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  PaymentProvider, 
  PaymentProviderName,
  PaymentInitiateRequest, 
  PaymentStatusRequest,
  PaymentState,
  PaymentLoadingState,
  PaymentStatus
} from './types';
import { usePaymentAnalytics } from './usePaymentAnalytics';

interface UsePaymentGatewayProps {
  defaultProvider?: PaymentProviderName;
  providers: Record<PaymentProviderName, PaymentProvider>;
}

export function usePaymentGateway({ 
  defaultProvider = 'stripe', 
  providers 
}: UsePaymentGatewayProps) {
  const [state, setState] = useState<PaymentState>({
    isLoading: false,
    loadingState: 'idle',
    currentProvider: defaultProvider,
    paymentId: null,
    paymentReference: null,
    iframeUrl: null,
    redirectUrl: null,
    transactionId: null,
    paymentStatus: null,
    errorMessage: null
  });

  const { updateAnalytics, getAnalyticsSummary } = usePaymentAnalytics();

  const getProvider = useCallback(
    (providerName?: PaymentProviderName): PaymentProvider => {
      const name = providerName || state.currentProvider || defaultProvider;
      const provider = providers[name];
      
      if (!provider) {
        throw new Error(`Payment provider '${name}' not configured`);
      }
      
      return provider;
    },
    [state.currentProvider, defaultProvider, providers]
  );

  const setProvider = useCallback((providerName: PaymentProviderName) => {
    if (!providers[providerName]) {
      throw new Error(`Payment provider '${providerName}' not configured`);
    }
    setState(prev => ({ ...prev, currentProvider: providerName }));
  }, [providers]);

  const resetPaymentState = useCallback(() => {
    setState(prev => ({
      ...prev,
      paymentId: null,
      paymentReference: null,
      iframeUrl: null,
      redirectUrl: null,
      transactionId: null,
      paymentStatus: null,
      errorMessage: null,
      loadingState: 'idle'
    }));
  }, []);

  const updatePaymentState = useCallback((updates: Partial<PaymentState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const initiatePayment = useCallback(
    async (request: PaymentInitiateRequest, providerName?: PaymentProviderName) => {
      updatePaymentState({ 
        isLoading: true, 
        loadingState: 'initializing',
        errorMessage: null,
        paymentStatus: null
      });
      
      try {
        // Reset any previous payment state
        resetPaymentState();
        
        const provider = getProvider(providerName);
        
        // Update current provider if explicitly specified
        if (providerName) {
          updatePaymentState({ currentProvider: providerName });
        }
        
        updatePaymentState({ loadingState: 'processing' });
        
        const response = await provider.initiatePayment(request);
        
        if (!response.success) {
          throw new Error(response.error || `Payment initialization failed with ${provider.name}`);
        }
        
        // Update state with provider response
        updatePaymentState({
          paymentId: response.paymentId || null,
          paymentReference: response.reference || null,
          iframeUrl: response.iframeUrl || null,
          redirectUrl: response.redirectUrl || null,
          transactionId: response.transactionId || null,
          paymentStatus: 'pending',
          loadingState: 'processing'
        });
        
        // Update analytics
        updateAnalytics('pending', provider.name);
        
        return response;
      } catch (error) {
        console.error(`Payment initialization error with ${providerName || state.currentProvider}:`, error);
        
        const errorMessage = error.message || "Payment initialization failed";
        
        updatePaymentState({
          paymentStatus: 'error',
          errorMessage,
          loadingState: 'idle'
        });
        
        updateAnalytics('error', providerName || state.currentProvider || defaultProvider);
        toast.error(errorMessage);
        
        return {
          success: false,
          error: errorMessage
        };
      } finally {
        updatePaymentState({ isLoading: false });
      }
    },
    [
      defaultProvider, 
      getProvider, 
      resetPaymentState, 
      state.currentProvider, 
      updateAnalytics, 
      updatePaymentState
    ]
  );

  const checkPaymentStatus = useCallback(
    async (request: PaymentStatusRequest, providerName?: PaymentProviderName) => {
      // Build request based on current state if not provided
      const statusRequest: PaymentStatusRequest = {
        paymentId: request.paymentId || state.paymentId || undefined,
        reference: request.reference || state.paymentReference || undefined,
        transactionId: request.transactionId || state.transactionId || undefined
      };
      
      // Validate we have enough information to check status
      if (!statusRequest.paymentId && !statusRequest.reference && !statusRequest.transactionId) {
        const error = "No payment identifier provided to check status";
        toast.error(error);
        return { success: false, error };
      }
      
      updatePaymentState({ 
        isLoading: true, 
        loadingState: 'verifying' 
      });
      
      try {
        const provider = getProvider(providerName);
        
        const response = await provider.checkPaymentStatus(statusRequest);
        
        if (!response.success) {
          throw new Error(response.error || "Failed to check payment status");
        }
        
        // Update state based on payment status
        updatePaymentState({
          paymentStatus: response.status,
          transactionId: response.transactionId || state.transactionId,
          loadingState: response.status === 'completed' ? 'completed' : state.loadingState
        });
        
        // Update analytics and show appropriate notifications
        if (response.status === 'completed') {
          updateAnalytics('completed', provider.name);
          toast.success("Payment completed successfully!");
        } else if (response.status === 'failed') {
          updateAnalytics('failed', provider.name);
          toast.error("Payment failed. Please try again.");
        } else if (response.status === 'cancelled') {
          updateAnalytics('abandoned', provider.name);
          toast.info("Payment was cancelled.");
        } else if (response.status === 'error') {
          updatePaymentState({ errorMessage: "Invalid payment request" });
          updateAnalytics('error', provider.name);
          toast.error("Invalid payment request");
        }
        
        return response;
      } catch (error) {
        console.error("Payment status check error:", error);
        
        const errorMessage = error.message || "Failed to check payment status";
        
        updatePaymentState({
          paymentStatus: 'error',
          errorMessage,
          loadingState: 'idle'
        });
        
        updateAnalytics('error', providerName || state.currentProvider || defaultProvider);
        toast.error(errorMessage);
        
        return { 
          success: false, 
          status: 'error' as PaymentStatus,
          error: errorMessage
        };
      } finally {
        updatePaymentState({ isLoading: false });
      }
    },
    [
      defaultProvider, 
      getProvider, 
      state.loadingState, 
      state.paymentId, 
      state.paymentReference, 
      state.transactionId, 
      state.currentProvider,
      updateAnalytics, 
      updatePaymentState
    ]
  );

  const cancelPayment = useCallback(
    async (providerName?: PaymentProviderName) => {
      if (!state.paymentId && !state.paymentReference && !state.transactionId) {
        return { success: false, error: "No active payment to cancel" };
      }
      
      const provider = getProvider(providerName);
      
      if (!provider.cancelPayment) {
        return { 
          success: false, 
          error: `Payment cancellation not supported by ${provider.name}` 
        };
      }
      
      try {
        const result = await provider.cancelPayment({
          paymentId: state.paymentId || undefined,
          reference: state.paymentReference || undefined,
          transactionId: state.transactionId || undefined
        });
        
        if (result.success) {
          updatePaymentState({ 
            paymentStatus: 'cancelled',
            loadingState: 'idle'
          });
          
          updateAnalytics('abandoned', provider.name);
          toast.success("Payment cancelled successfully");
        }
        
        return result;
      } catch (error) {
        const errorMessage = error.message || "Failed to cancel payment";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [
      getProvider, 
      state.paymentId, 
      state.paymentReference, 
      state.transactionId, 
      updateAnalytics, 
      updatePaymentState
    ]
  );

  const getAvailableProviders = useCallback(() => {
    return Object.values(providers).map(provider => ({
      name: provider.name,
      ...provider.config
    }));
  }, [providers]);

  return {
    // State
    ...state,
    
    // Methods
    setProvider,
    initiatePayment,
    checkPaymentStatus,
    cancelPayment,
    resetPaymentState,
    getAvailableProviders,
    getAnalyticsSummary,
    
    // Provider-specific information
    currentProviderConfig: getProvider().config
  };
}
