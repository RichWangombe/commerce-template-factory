
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { PaymentInitiateRequest, PaymentProviderName, PaymentStatus } from "@/hooks/payment/types";
import { usePaymentServices } from "@/hooks/usePaymentServices";
import { useIsMobile } from "@/hooks/use-mobile";

export const usePaymentFormState = () => {
  const { control, setValue, watch, getValues } = useFormContext();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const isMobile = useIsMobile();
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showIframe, setShowIframe] = useState(false);
  
  const {
    StripeProvider,
    setProvider,
    initiatePayment,
    checkPaymentStatus,
    resetPaymentState,
    isLoading,
    paymentStatus,
    iframeUrl,
    errorMessage,
    loadingState,
    getAnalyticsSummary,
    getAvailableProviders,
    currentProviderConfig
  } = usePaymentServices();
  
  const paymentValid = watch("paymentValid");
  const orderTotal = watch("orderTotal") || 0;
  const selectedPaymentMethod = watch("paymentMethod") as PaymentProviderName || 'stripe';
  const [showCardForm, setShowCardForm] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);
  
  const analyticsSummary = getAnalyticsSummary();
  const availableProviders = getAvailableProviders();

  // Effect to update provider when payment method changes
  useEffect(() => {
    if (isLoading) return;
    
    setProvider(selectedPaymentMethod);
    resetUIState();
    setShowCardForm(selectedPaymentMethod === 'stripe');
    setShowMobileForm(selectedPaymentMethod === 'mpesa');
    setShowIframe(false);
  }, [selectedPaymentMethod, isLoading, setProvider]);

  // Effect to initialize payment valid state
  useEffect(() => {
    setValue("paymentValid", false);
    
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [setValue, statusCheckInterval]);
  
  // Effect to update payment valid state based on payment status
  useEffect(() => {
    if (paymentStatus === 'completed') {
      setValue("paymentValid", true);
      setShowIframe(false);
      
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      }
    } else if (paymentStatus === 'failed' || paymentStatus === 'error') {
      setValue("paymentValid", false);
    }
  }, [paymentStatus, setValue, statusCheckInterval]);

  const resetUIState = () => {
    setShowCardForm(selectedPaymentMethod === 'stripe');
    setShowMobileForm(selectedPaymentMethod === 'mpesa');
    setShowIframe(false);
    setPhoneNumber("");
    resetPaymentState();
  };

  const handleInitiatePayment = async () => {
    setRetryCount(0);
    
    try {
      const shippingAddress = getValues("shippingAddress");
      
      const paymentRequest: PaymentInitiateRequest = {
        amount: orderTotal,
        currency: "USD",
        description: "Payment for your order",
        orderId: `ORDER-${Date.now()}`,
        customer: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          email: shippingAddress.email || "customer@example.com",
          phone: selectedPaymentMethod === 'mpesa' ? phoneNumber : shippingAddress.phone || ""
        },
        billingAddress: getValues("sameAsBilling") 
          ? {
              address1: shippingAddress.address1,
              address2: shippingAddress.address2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              zipCode: shippingAddress.zipCode,
              country: shippingAddress.country
            }
          : getValues("billingAddress")
      };
      
      if (selectedPaymentMethod === 'mpesa' && !phoneNumber) {
        setValue("paymentValid", false);
        return;
      }

      const result = await initiatePayment(paymentRequest);

      if (result.success) {
        if (selectedPaymentMethod === 'pesapal' && iframeUrl) {
          setShowIframe(true);
          
          // Type assertion to help TypeScript understand this is a PaymentInitiateResponse
          // We've already checked result.success is true, so it's safe to assume these properties exist
          const paymentResult = result as { reference: string; transactionId: string };
          const reference = paymentResult.reference || "";
          const transactionId = paymentResult.transactionId || "";
          
          const interval = setInterval(async () => {
            await checkPaymentStatus({ 
              reference,
              transactionId
            });
            
            setRetryCount(prev => prev + 1);
            if (retryCount > 10 && statusCheckInterval) {
              clearInterval(statusCheckInterval);
              setStatusCheckInterval(
                setInterval(async () => {
                  await checkPaymentStatus({ 
                    reference,
                    transactionId
                  });
                }, 10000)
              );
            }
          }, 5000);
          
          setStatusCheckInterval(interval);
        } else if (selectedPaymentMethod === 'mpesa') {
          setValue("paymentValid", true);
        }
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      setValue("paymentValid", false);
    }
  };

  const handleSimulateCompletion = () => {
    setValue("paymentValid", true);
  };

  return {
    StripeProvider,
    isLoading,
    paymentValid,
    orderTotal,
    selectedPaymentMethod,
    showCardForm,
    showMobileForm,
    showIframe,
    setShowIframe,
    phoneNumber,
    setPhoneNumber,
    paymentStatus,
    iframeUrl,
    errorMessage,
    availableProviders,
    analyticsSummary,
    showAnalytics,
    setShowAnalytics,
    currentProviderConfig,
    isMobile,
    handleInitiatePayment,
    handleSimulateCompletion,
    resetUIState,
    iframeHeight: isMobile ? "350px" : "450px"
  };
};
