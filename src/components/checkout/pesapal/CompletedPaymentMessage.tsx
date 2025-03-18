
import React from "react";
import { CheckCircle } from "lucide-react";

export const CompletedPaymentMessage: React.FC = () => {
  return (
    <div className="mt-3 text-sm text-green-600 flex items-center">
      <CheckCircle size={16} className="mr-2" />
      Payment completed successfully!
    </div>
  );
};
