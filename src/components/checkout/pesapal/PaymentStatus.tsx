
import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface PaymentStatusProps {
  status: 'completed' | 'failed' | 'pending' | null;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ status }) => {
  if (!status) return null;
  
  switch(status) {
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
