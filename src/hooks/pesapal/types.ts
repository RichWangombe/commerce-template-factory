
export interface PaymentInitiateParams {
  amount: number;
  currency?: string;
  description?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PaymentStatusParams {
  reference: string;
  transactionId: string | null;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'error' | null;
export type LoadingState = 'initializing' | 'processing' | 'verifying';
