
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { usePaymentFormState } from "./payment/usePaymentFormState";
import { PaymentFormWrapper } from "./payment/PaymentFormWrapper";
import { StripePaymentComponent } from "./payment/StripePaymentComponent";
import { MpesaPaymentComponent } from "./payment/MpesaPaymentComponent";
import { PesapalPaymentComponent } from "./payment/PesapalPaymentComponent";

export const PaymentForm: React.FC = () => {
  const {
    StripeProvider,
    isLoading,
    paymentValid,
    orderTotal,
    selectedPaymentMethod,
    showCardForm,
    showMobileForm,
    showIframe,
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
    iframeHeight
  } = usePaymentFormState();

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case 'stripe':
        return (
          <StripeProvider>
            <StripePaymentComponent
              isLoading={isLoading}
              paymentValid={paymentValid}
              orderTotal={orderTotal}
              handleInitiatePayment={handleInitiatePayment}
              currentProviderConfig={currentProviderConfig}
            />
          </StripeProvider>
        );
        
      case 'mpesa':
        return (
          <MpesaPaymentComponent
            isLoading={isLoading}
            paymentValid={paymentValid}
            orderTotal={orderTotal}
            handleInitiatePayment={handleInitiatePayment}
          />
        );
        
      case 'pesapal':
        return (
          <PesapalPaymentComponent
            isLoading={isLoading}
            paymentValid={paymentValid}
            paymentStatus={paymentStatus}
            errorMessage={errorMessage}
            showIframe={showIframe}
            iframeUrl={iframeUrl}
            iframeHeight={iframeHeight}
            orderTotal={orderTotal}
            handleInitiatePayment={handleInitiatePayment}
            onSimulateCompletion={handleSimulateCompletion}
            onRetry={() => resetUIState()}
            isMobile={isMobile}
          />
        );
        
      default:
        return <p>Please select a payment method.</p>;
    }
  };

  return (
    <PaymentFormWrapper
      availableProviders={availableProviders}
      selectedPaymentMethod={selectedPaymentMethod}
      isLoading={isLoading}
      paymentValid={paymentValid}
      showAnalytics={showAnalytics}
      analyticsSummary={analyticsSummary}
      onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
    >
      {renderPaymentForm()}
    </PaymentFormWrapper>
  );
};
