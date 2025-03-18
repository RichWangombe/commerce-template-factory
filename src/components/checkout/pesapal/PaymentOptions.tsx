
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Wallet } from "lucide-react";

interface PaymentOptionsProps {
  children: React.ReactNode;
}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({ children }) => {
  return (
    <div className="rounded-md border border-input p-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-colors">
      <div className="mb-3 text-sm font-medium flex items-center gap-2">
        <Wallet size={16} />
        Pesapal Secure Payment
      </div>
      
      {children}
    </div>
  );
};
