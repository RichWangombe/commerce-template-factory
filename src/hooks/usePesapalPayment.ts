
import { usePaymentOperations } from "./pesapal/usePaymentOperations";
import { usePaymentState } from "./pesapal/usePaymentState";
import { usePaymentAnalytics } from "./pesapal/usePaymentAnalytics";
import { PaymentInitiateParams, PaymentStatusParams } from "./pesapal/types";

export function usePesapalPayment() {
  const {
    initiatePayment,
    checkPaymentStatus,
    isLoading,
    paymentReference,
    paymentStatus,
    errorMessage,
    loadingState,
    resetPaymentState
  } = usePaymentOperations();

  const { getAnalyticsSummary } = usePaymentAnalytics();

  // Re-export with better naming
  return {
    initiatePesapalPayment: initiatePayment,
    checkPaymentStatus,
    isLoading,
    paymentReference,
    iframeUrl: usePaymentState().iframeUrl,
    paymentStatus,
    errorMessage,
    loadingState,
    resetPaymentState,
    getAnalyticsSummary
  };
}
