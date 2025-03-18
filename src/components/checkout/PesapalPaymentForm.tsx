
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Wallet, Info, PieChart, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { usePesapalPayment } from "@/hooks/usePesapalPayment";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";

export const PesapalPaymentForm: React.FC = () => {
  const { control, setValue, watch, getValues } = useFormContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const { 
    initiatePesapalPayment, 
    isLoading, 
    iframeUrl, 
    paymentReference,
    checkPaymentStatus,
    paymentStatus,
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
    }
  }, [paymentStatus, setValue, statusCheckInterval]);

  const handleInitiatePayment = async () => {
    setIsProcessing(true);
    
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
          await checkPaymentStatus({ 
            reference: paymentReference,
            transactionId 
          });
        }, 5000); // Check every 5 seconds
        
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

  // Get status indicator based on payment status
  const getStatusIndicator = () => {
    switch(paymentStatus) {
      case 'completed':
        return <div className="flex items-center text-green-600"><CheckCircle size={16} className="mr-2" /> Payment Completed</div>;
      case 'failed':
        return <div className="flex items-center text-red-600"><XCircle size={16} className="mr-2" /> Payment Failed</div>;
      case 'pending':
        return <div className="flex items-center text-amber-600"><Clock size={16} className="mr-2" /> Payment Pending</div>;
      default:
        return null;
    }
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
          
          {paymentStatus && (
            <div className="mb-4">
              {getStatusIndicator()}
            </div>
          )}
          
          {!showIframe && !paymentValid && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Info size={14} />
                Pay securely using Pesapal - supports M-Pesa, cards, and more
              </div>
              
              <Button 
                type="button" 
                onClick={handleInitiatePayment}
                disabled={isProcessing || isLoading}
                className="w-full sm:w-auto"
              >
                {isProcessing || isLoading ? (
                  <>
                    <LoadingIndicator size="sm" />
                    <span className="ml-2">Initializing payment...</span>
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </div>
          )}
          
          {showIframe && iframeUrl && (
            <div className="space-y-4">
              {/* Responsive iframe container */}
              <div 
                className="border rounded-md overflow-hidden mx-auto w-full" 
                style={{ height: iframeHeight, maxWidth: "100%" }}
              >
                <iframe 
                  src={iframeUrl} 
                  width="100%" 
                  height="100%" 
                  seamless 
                  frameBorder="0"
                  title="Pesapal Payment"
                  className="w-full h-full"
                />
              </div>
              
              {/* This button is just for sandbox testing */}
              <Button
                type="button"
                variant="outline"
                onClick={handleSimulateCompletion}
                className="w-full sm:w-auto"
                size={isMobile ? "sm" : "default"}
              >
                {isMobile ? "Simulate Payment" : "Simulate Payment Completion (Sandbox Testing)"}
              </Button>
            </div>
          )}
          
          {paymentValid && (
            <div className="mt-3 text-sm text-green-600 flex items-center">
              <CheckCircle size={16} className="mr-2" />
              Payment completed successfully!
            </div>
          )}
        </div>
        
        {/* Analytics Section (for admins or testing) */}
        <div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setShowAnalytics(!showAnalytics)}
            size="sm"
            className="flex items-center"
          >
            <PieChart size={16} className="mr-2" />
            {showAnalytics ? "Hide" : "Show"} Payment Analytics
          </Button>
          
          {showAnalytics && analyticsSummary && (
            <div className="mt-4 p-4 border rounded-md bg-slate-50 space-y-3">
              <h4 className="text-sm font-medium">Payment Analytics</h4>
              
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="p-2 bg-white rounded border">
                  <div className="text-xs text-muted-foreground">Completed</div>
                  <div className="text-sm font-medium">{analyticsSummary.completed}</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <div className="text-xs text-muted-foreground">Failed</div>
                  <div className="text-sm font-medium">{analyticsSummary.failed}</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <div className="text-xs text-muted-foreground">Abandoned</div>
                  <div className="text-sm font-medium">{analyticsSummary.abandoned}</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <div className="text-xs text-muted-foreground">Pending</div>
                  <div className="text-sm font-medium">{analyticsSummary.pending}</div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Completion Rate</span>
                  <span>{analyticsSummary.completionRate}%</span>
                </div>
                <Progress value={analyticsSummary.completionRate} className="h-2" />
              </div>
            </div>
          )}
        </div>
        
        <FormField
          control={control}
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
}
