
export interface PaymentProviderConfig {
  name: string;
  displayName: string;
  logo?: string;
  description?: string;
  availableCountries?: string[];
  supports3DS?: boolean;
  supportsSavedCards?: boolean;
}

export interface PaymentInitiateRequest {
  amount: number;
  currency?: string;
  description?: string;
  orderId?: string;
  metadata?: Record<string, any>;
  
  // Customer details
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  
  // Optional billing details
  billingAddress?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface PaymentInitiateResponse {
  success: boolean;
  paymentId?: string;
  reference?: string;
  transactionId?: string;
  iframeUrl?: string;
  redirectUrl?: string;
  error?: string;
  providerResponse?: any;
}

export interface PaymentStatusRequest {
  paymentId?: string;
  reference?: string;
  transactionId?: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  status: PaymentStatus;
  amount?: number;
  currency?: string;
  transactionId?: string;
  reference?: string;
  timestamp?: string;
  error?: string;
  providerResponse?: any;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'error' | null;
export type PaymentProviderName = 'stripe' | 'mpesa' | 'pesapal';
export type PaymentLoadingState = 'initializing' | 'processing' | 'verifying' | 'completed' | 'idle';

export interface PaymentProvider {
  name: PaymentProviderName;
  config: PaymentProviderConfig;
  initiatePayment: (request: PaymentInitiateRequest) => Promise<PaymentInitiateResponse>;
  checkPaymentStatus: (request: PaymentStatusRequest) => Promise<PaymentStatusResponse>;
  cancelPayment?: (request: PaymentStatusRequest) => Promise<{ success: boolean; error?: string }>;
  savePaymentMethod?: (tokenOrData: any) => Promise<{ success: boolean; error?: string }>;
}

export interface PaymentState {
  isLoading: boolean;
  loadingState: PaymentLoadingState;
  currentProvider: PaymentProviderName | null;
  paymentId: string | null;
  paymentReference: string | null;
  iframeUrl: string | null;
  redirectUrl: string | null;
  transactionId: string | null;
  paymentStatus: PaymentStatus;
  errorMessage: string | null;
}

export interface PaymentAnalytics {
  completed: number;
  failed: number;
  pending: number;
  abandoned: number;
  errors: number;
  attempts: number;
  completionRate?: number;
  provider?: Record<PaymentProviderName, {
    attempts: number;
    completed: number;
    completionRate: number;
  }>;
}
