
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Wallet, CheckCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { usePesapalPayment } from "@/hooks/usePesapalPayment";
import { useIsMobile } from "@/hooks/use-mobile";
import { PaymentStatus } from "./pesapal/PaymentStatus";
import { PaymentAnalytics } from "./pesapal/PaymentAnalytics";
import { PaymentIframe } from "./pesapal/PaymentIframe";
import { InitiatePaymentButton } from "./pesapal/InitiatePaymentButton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const PesapalPaymentForm: React.FC = () => {
  const { setValue, watch, getValues } = useFormContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const isMobile = useIsMobile();
  
  const { 
    initiatePesapalPayment, 
    isLoading, 
    iframeUrl, 
    paymentReference,
    checkPaymentStatus,
    paymentStatus,
    errorMessage,
    loadingState,
    resetPaymentState,
    getAnalyticsSummary
  } = usePesapalPayment();
  
  // Watch for payment validation status
  const paymentValid = watch("paymentValid");
  const orderTotal = watch("orderTotal") || 0;

  // Pesapal iframe state
  const [showIframe, setShowIframe] = useState(false);

  // Analytics data
  const analyticsSummary = getAnalyticsSummary();

  useEffect(() => {
    // Reset payment validation when the component mounts
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
      toast.success("Payment completed successfully!");
      
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

  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    setRetryCount(0);
    
    try {
      // Get shipping address from form
      const shippingAddress = getValues("shippingAddress");
      
      const result = await initiatePesapalPayment({
        amount: orderTotal,
        currency: "USD", // Can be changed to KES for Kenyan Shillings
        description: "Payment for your order",
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        email: shippingAddress.email || "customer@example.com", // You may need to add email to your form
        phone: shippingAddress.phone || ""
      });

      if (result.success) {
        setShowIframe(true);
        
        // Start polling for payment status
        const interval = setInterval(async () => {
          const statusResult = await checkPaymentStatus({ 
            reference: paymentReference,
            transactionId 
          });
          
          // If we've been checking for a while with no success, slow down polling
          setRetryCount(prev => prev + 1);
          if (retryCount > 10 && statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(
              setInterval(async () => {
                await checkPaymentStatus({ 
                  reference: paymentReference,
                  transactionId 
                });
              }, 10000) // Check every 10 seconds after multiple retries
            );
          }
          
          // If there's an error in status check, show it but don't stop polling
          if (!statusResult.success) {
            toast.error("Having trouble checking payment status. We'll keep trying.");
          }
        }, 5000); // Check every 5 seconds initially
        
        setStatusCheckInterval(interval);
      } else {
        toast.error(result.error || "Payment initialization failed");
      }
    } catch (error) {
      toast.error("Payment initialization failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for iframe postMessage events - for sandbox testing
  const handleIframeMessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data && data.pesapal_transaction_tracking_id) {
        setTransactionId(data.pesapal_transaction_tracking_id);
      }
    } catch (e) {
      // Not a JSON message, ignore
    }
  };

  // Add event listener for postMessage
  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  // Simulated payment completion for testing
  const handleSimulateCompletion = () => {
    setValue("paymentValid", true);
    setShowIframe(false);
    toast.success("Payment completed successfully!");
    
    // Clear interval if running
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  // Handle retry after failure
  const handleRetryPayment = () => {
    resetPaymentState();
    setShowIframe(false);
    setIsProcessing(false);
  };

  // Calculate iframe height based on viewport
  const iframeHeight = isMobile ? "350px" : "450px";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Pesapal Payment</h3>
      <Separator className="my-4" />
      
      <div className="space-y-6">
        <div className="rounded-md border border-input p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-colors">
          <div className="mb-3 text-sm font-medium flex items-center gap-2">
            <Wallet size={16} />
            Pesapal Secure Payment
          </div>
          
          {/* Display error alert if there's an error message */}
          {paymentStatus === 'error' && errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage}
                {paymentStatus === 'error' && (
                  <button 
                    onClick={handleRetryPayment}
                    className="ml-2 underline text-sm hover:text-primary"
                  >
                    Retry
                  </button>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {paymentStatus && (
            <div className="mb-4">
              <PaymentStatus status={paymentStatus} errorMessage={errorMessage} />
            </div>
          )}
          
          {!showIframe && !paymentValid && paymentStatus !== 'error' && (
            <InitiatePaymentButton 
              isProcessing={isProcessing}
              isLoading={isLoading}
              onClick={handleInitiatePayment}
              loadingState={loadingState}
            />
          )}
          
          {showIframe && iframeUrl && (
            <PaymentIframe 
              iframeUrl={iframeUrl}
              iframeHeight={iframeHeight}
              onSimulateCompletion={handleSimulateCompletion}
              isMobile={isMobile}
              isLoading={isLoading}
            />
          )}
          
          {paymentValid && (
            <div className="mt-3 text-sm text-green-600 flex items-center">
              <CheckCircle size={16} className="mr-2" />
              Payment completed successfully!
            </div>
          )}
        </div>
        
        {/* Analytics Section (for admins or testing) */}
        <PaymentAnalytics 
          show={showAnalytics}
          onToggle={() => setShowAnalytics(!showAnalytics)}
          analytics={analyticsSummary}
        />
        
        <FormField
          control={watch("control")}
          name="savePaymentInfo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Save my payment information for future purchases</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
