
import { useState } from "react";
import { PaymentStatus, LoadingState } from "./types";

export function usePaymentState() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('initializing');
  
  const resetPaymentState = () => {
    setPaymentStatus(null);
    setErrorMessage(null);
    setIframeUrl(null);
    setPaymentReference(null);
    setLoadingState('initializing');
  };

  return {
    isLoading,
    setIsLoading,
    paymentReference,
    setPaymentReference,
    iframeUrl,
    setIframeUrl,
    paymentStatus,
    setPaymentStatus,
    errorMessage,
    setErrorMessage,
    loadingState,
    setLoadingState,
    resetPaymentState
  };
}
