
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { PaymentInitiateRequest, PaymentProviderName, PaymentStatus } from "@/hooks/payment/types";
import { usePaymentServices } from "@/hooks/usePaymentServices";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Address } from "@/types/checkout";

export const usePaymentFormState = () => {
  const { control, setValue, watch, getValues } = useFormContext();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const isMobile = useIsMobile();
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showIframe, setShowIframe] = useState(false);
  const { state: cartState, clearCart, subtotal } = useCart(); // Fixed: Get subtotal directly from useCart
  const { user } = useAuth();
  const navigate = useNavigate();
  
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
  const availableProviders = getAvailableProviders().map(provider => ({
    name: provider.name as PaymentProviderName,
    displayName: provider.displayName
  }));

  useEffect(() => {
    if (isLoading) return;
    
    setProvider(selectedPaymentMethod);
    resetUIState();
    setShowCardForm(selectedPaymentMethod === 'stripe');
    setShowMobileForm(selectedPaymentMethod === 'mpesa');
    setShowIframe(false);
  }, [selectedPaymentMethod, isLoading, setProvider]);

  useEffect(() => {
    setValue("paymentValid", false);
    
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [setValue, statusCheckInterval]);
  
  useEffect(() => {
    if (paymentStatus === 'completed') {
      setValue("paymentValid", true);
      setShowIframe(false);
      
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      }
      
      // Process completed payment and create order
      processCompletedPayment();
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
  
  const processCompletedPayment = async () => {
    try {
      const shippingAddress = getValues("shippingAddress") as Address;
      const billingAddress = getValues("sameAsBilling") 
        ? shippingAddress
        : getValues("billingAddress") as Address;
      const shippingMethod = getValues("shippingMethod");
      
      // Create order from cart and form data
      const orderData = {
        userId: user?.id || "guest-user",
        items: cartState.items,
        shippingAddress,
        billingAddress,
        shippingMethod,
        paymentMethod: selectedPaymentMethod,
        subtotal: subtotal, // Use subtotal from useCart hook
        tax: orderTotal * 0.08, // Example tax calculation
        shipping: shippingMethod.price,
        total: orderTotal
      };
      
      const createdOrder = await apiService.createOrder(orderData);
      
      // Navigate to confirmation page
      navigate(`/order-confirmation?orderId=${createdOrder.id}`);
      
      // Clear cart
      clearCart();
    } catch (error) {
      console.error("Error processing order:", error);
    }
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
          
          // Add type assertion to ensure TypeScript knows these properties exist when success is true
          const successResult = result as { reference: string; transactionId: string; success: boolean };
          const reference = successResult.reference || "";
          const transactionId = successResult.transactionId || "";
          
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
          processCompletedPayment();
        }
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      setValue("paymentValid", false);
    }
  };

  const handleSimulateCompletion = () => {
    setValue("paymentValid", true);
    processCompletedPayment();
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
