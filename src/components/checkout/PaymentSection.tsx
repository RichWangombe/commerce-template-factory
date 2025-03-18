
import React from 'react';
import { PaymentForm } from './PaymentForm';
import { usePaymentServices } from '@/hooks/usePaymentServices';

export const PaymentSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <PaymentForm />
    </div>
  );
};
