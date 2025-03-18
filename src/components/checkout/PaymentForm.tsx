
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { CardElement } from "@stripe/react-stripe-js";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { Phone, CreditCard } from "lucide-react";
import { usePaymentServices } from "@/hooks/usePaymentServices";
import { PaymentProviderName, PaymentInitiateRequest } from "@/hooks/payment/types";
import { PaymentStatusMessage } from "./pesapal/PaymentStatusMessage";
import { PaymentIframe } from "./pesapal/PaymentIframe";
import { PaymentAnalytics } from "./pesapal/PaymentAnalytics";
import { CompletedPaymentMessage } from "./pesapal/CompletedPaymentMessage";
import { useIsMobile } from "@/hooks/use-mobile";

export const PaymentForm: React.FC = () => {
  const { control, setValue, watch, getValues } = useFormContext();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const isMobile = useIsMobile();
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Get payment services
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
  
  // Watch for payment validation status and selected payment method
  const paymentValid = watch("paymentValid");
  const orderTotal = watch("orderTotal") || 0;
  const selectedPaymentMethod = watch("paymentMethod") as PaymentProviderName || 'stripe';
  const [showCardForm, setShowCardForm] = useState(false);
  const [showMobileForm, setShowMobileForm] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Analytics data
  const analyticsSummary = getAnalyticsSummary();
  
  // Get available payment providers
  const availableProviders = getAvailableProviders();

  // Handle provider changes
  useEffect(() => {
    // Don't change provider if payment is in progress
    if (isLoading) return;
    
    // Update provider based on selected method
    setProvider(selectedPaymentMethod);
    
    // Reset form state when changing providers
    resetUIState();
    
    // Update form methods visibility based on provider
    setShowCardForm(selectedPaymentMethod === 'stripe');
    setShowMobileForm(selectedPaymentMethod === 'mpesa');
    setShowIframe(false);
    
  }, [selectedPaymentMethod, isLoading, setProvider]);

  // Reset payment validation when the component mounts
  useEffect(() => {
    setValue("paymentValid", false);
    
    // Clean up interval when component unmounts
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [setValue, statusCheckInterval]);
  
  // Effect to watch payment status changes
  useEffect(() => {
    if (paymentStatus === 'completed') {
      setValue("paymentValid", true);
      setShowIframe(false);
      
      // Clear any existing interval
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
        setStatusCheckInterval(null);
      }
    } else if (paymentStatus === 'failed' || paymentStatus === 'error') {
      setValue("paymentValid", false);
      // Don't hide iframe on failure to allow retry
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
      // Get customer details from form
      const shippingAddress = getValues("shippingAddress");
      
      const paymentRequest: PaymentInitiateRequest = {
        amount: orderTotal,
        currency: "USD", // Can be adjusted based on locale
        description: "Payment for your order",
        orderId: `ORDER-${Date.now()}`,
        customer: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          email: shippingAddress.email || "customer@example.com", // You may need to add email to your form
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
      
      // Validate mobile payments require phone number
      if (selectedPaymentMethod === 'mpesa' && !phoneNumber) {
        setValue("paymentValid", false);
        return;
      }

      const result = await initiatePayment(paymentRequest);

      if (result.success) {
        if (selectedPaymentMethod === 'pesapal' && iframeUrl) {
          setShowIframe(true);
          
          // Start polling for payment status
          const interval = setInterval(async () => {
            await checkPaymentStatus({ 
              reference: result.reference,
              transactionId: result.transactionId 
            });
            
            // If we've been checking for a while with no success, slow down polling
            setRetryCount(prev => prev + 1);
            if (retryCount > 10 && statusCheckInterval) {
              clearInterval(statusCheckInterval);
              setStatusCheckInterval(
                setInterval(async () => {
                  await checkPaymentStatus({ 
                    reference: result.reference,
                    transactionId: result.transactionId 
                  });
                }, 10000) // Check every 10 seconds after multiple retries
              );
            }
          }, 5000); // Check every 5 seconds initially
          
          setStatusCheckInterval(interval);
        } else if (selectedPaymentMethod === 'mpesa') {
          // For M-Pesa, we need to wait for the user to complete the transaction on their phone
          setValue("paymentValid", true);
        }
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      setValue("paymentValid", false);
    }
  };

  // Calculate iframe height based on viewport
  const iframeHeight = isMobile ? "350px" : "450px";

  // This will render the appropriate payment form based on the selected provider
  const renderPaymentForm = () => {
    // Common payment button
    const PaymentButton = (
      <Button 
        type="button" 
        onClick={handleInitiatePayment}
        disabled={isLoading || 
          (selectedPaymentMethod === 'mpesa' && !phoneNumber) ||
          paymentValid
        }
        className="w-full mt-4"
      >
        {isLoading ? (
          <>
            <LoadingIndicator size="sm" />
            <span className="ml-2">Processing...</span>
          </>
        ) : (
          `Pay ${orderTotal ? `$${orderTotal.toFixed(2)}` : ''}`
        )}
      </Button>
    );
    
    // Payment provider specific forms
    switch (selectedPaymentMethod) {
      case 'stripe':
        return (
          <StripeProvider>
            <div className="rounded-md border border-input p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-colors">
              <div className="mb-3 text-sm font-medium flex items-center gap-2">
                <CreditCard size={16} />
                Credit Card Details
              </div>
              
              <CardElement 
                onChange={(e) => setValue("paymentValid", e.complete)}
                className="p-3 border border-input rounded-md"
                options={{
                  style: {
                    base: {
                      color: "#32325d",
                      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                      fontSmoothing: "antialiased",
                      fontSize: "16px",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                      padding: "16px 0",
                    },
                    invalid: {
                      color: "#fa755a",
                      iconColor: "#fa755a",
                    },
                  }
                }}
              />
              
              {PaymentButton}
              
              {paymentValid && (
                <div className="mt-3 text-sm text-green-600 flex items-center">
                  Payment completed successfully!
                </div>
              )}
            </div>
          </StripeProvider>
        );
        
      case 'mpesa':
        return (
          <div className="rounded-md border border-input p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-colors">
            <div className="mb-3 text-sm font-medium flex items-center gap-2">
              <Phone size={16} />
              Mobile Payment
            </div>
            
            <FormField
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your mobile number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="py-3"
                      disabled={isLoading || paymentValid}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {PaymentButton}
            
            {paymentValid && (
              <CompletedPaymentMessage />
            )}
          </div>
        );
        
      case 'pesapal':
        return (
          <div className="space-y-4">
            {paymentStatus && (
              <PaymentStatusMessage 
                paymentStatus={paymentStatus} 
                errorMessage={errorMessage}
                onRetry={() => resetUIState()}
              />
            )}
            
            {!showIframe && !paymentValid && paymentStatus !== 'error' && (
              <div className="text-center py-4">
                <p className="mb-4 text-sm text-gray-600">
                  Click below to proceed to the secure Pesapal payment page
                </p>
                {PaymentButton}
              </div>
            )}
            
            {showIframe && iframeUrl && (
              <PaymentIframe 
                iframeUrl={iframeUrl}
                iframeHeight={iframeHeight}
                onSimulateCompletion={() => setValue("paymentValid", true)}
                isMobile={isMobile}
                isLoading={isLoading}
              />
            )}
            
            {paymentValid && (
              <CompletedPaymentMessage />
            )}
          </div>
        );
        
      default:
        return <p>Please select a payment method.</p>;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Payment Method</h3>
      <Separator className="my-4" />
      
      <div className="space-y-4">
        {/* Payment Method Selection */}
        <div className="grid grid-cols-1 gap-4">
          {availableProviders.map(provider => (
            <div key={provider.name} className="flex items-center space-x-3">
              <input
                id={`${provider.name}-payment`}
                name="paymentMethod"
                type="radio"
                value={provider.name}
                className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary"
                checked={selectedPaymentMethod === provider.name}
                onChange={() => setValue("paymentMethod", provider.name)}
                disabled={isLoading || paymentValid}
              />
              <label htmlFor={`${provider.name}-payment`} className="block text-sm font-medium text-neutral-700">
                {provider.displayName}
              </label>
            </div>
          ))}
        </div>
        
        {/* Selected Payment Method Form */}
        <div className="mt-6">
          {renderPaymentForm()}
        </div>
        
        {/* Save Payment Info Option */}
        <FormField
          control={control}
          name="savePaymentInfo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={!currentProviderConfig.supportsSavedCards}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Save my payment information for future purchases</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        {/* Analytics Section (for admins or testing) */}
        <PaymentAnalytics 
          show={showAnalytics}
          onToggle={() => setShowAnalytics(!showAnalytics)}
          analytics={analyticsSummary}
        />
      </div>
    </div>
  );
};
