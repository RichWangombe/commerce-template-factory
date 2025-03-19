
import React from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaymentStatus as PaymentStatusType } from "@/hooks/payment/types";

interface PaymentStatusProps {
  status: PaymentStatusType;
  errorMessage?: string;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, errorMessage }) => {
  if (!status) return null;
  
  switch(status) {
    case 'completed':
      return <div className="flex items-center text-green-600"><CheckCircle size={16} className="mr-2" /> Payment Completed</div>;
    case 'failed':
      return <div className="flex items-center text-red-600"><XCircle size={16} className="mr-2" /> Payment Failed</div>;
    case 'pending':
      return <div className="flex items-center text-amber-600"><Clock size={16} className="mr-2" /> Payment Pending</div>;
    case 'processing':
      return <div className="flex items-center text-blue-600"><Clock size={16} className="mr-2" /> Payment Processing</div>;
    case 'cancelled':
      return <div className="flex items-center text-gray-600"><XCircle size={16} className="mr-2" /> Payment Cancelled</div>;
    case 'refunded':
      return <div className="flex items-center text-purple-600"><CheckCircle size={16} className="mr-2" /> Payment Refunded</div>;
    case 'error':
      return (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {errorMessage || "An error occurred during payment processing"}
          </AlertDescription>
        </Alert>
      );
    default:
      return null;
  }
};
