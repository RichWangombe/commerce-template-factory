
import React from "react";
import { Button } from "@/components/ui/button";

interface PaymentIframeProps {
  iframeUrl: string | null;
  iframeHeight: string;
  onSimulateCompletion: () => void;
  isMobile: boolean;
}

export const PaymentIframe: React.FC<PaymentIframeProps> = ({
  iframeUrl,
  iframeHeight,
  onSimulateCompletion,
  isMobile
}) => {
  if (!iframeUrl) return null;
  
  return (
    <div className="space-y-4">
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
      
      <Button
        type="button"
        variant="outline"
        onClick={onSimulateCompletion}
        className="w-full sm:w-auto"
        size={isMobile ? "sm" : "default"}
      >
        {isMobile ? "Simulate Payment" : "Simulate Payment Completion (Sandbox Testing)"}
      </Button>
    </div>
  );
};
