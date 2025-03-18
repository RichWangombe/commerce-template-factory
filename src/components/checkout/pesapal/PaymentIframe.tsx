
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface PaymentIframeProps {
  iframeUrl: string | null;
  iframeHeight: string;
  onSimulateCompletion: () => void;
  isMobile: boolean;
  isLoading?: boolean;
}

export const PaymentIframe: React.FC<PaymentIframeProps> = ({
  iframeUrl,
  iframeHeight,
  onSimulateCompletion,
  isMobile,
  isLoading = false
}) => {
  const [iframeLoading, setIframeLoading] = useState(true);

  if (!iframeUrl) return null;
  
  return (
    <div className="space-y-4">
      <div 
        className="border rounded-md overflow-hidden mx-auto w-full relative" 
        style={{ height: iframeHeight, maxWidth: "100%" }}
      >
        {(isLoading || iframeLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-center">
              <Spinner size="lg" className="mb-2" />
              <p className="text-sm text-muted-foreground">Loading payment gateway...</p>
            </div>
          </div>
        )}
        <iframe 
          src={iframeUrl} 
          width="100%" 
          height="100%" 
          seamless 
          frameBorder="0"
          title="Pesapal Payment"
          className="w-full h-full"
          onLoad={() => setIframeLoading(false)}
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
