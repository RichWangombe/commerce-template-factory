
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { usePaymentGateway } from "./payment/usePaymentGateway";
import { usePesapalProvider } from "./payment/providers/pesapalProvider";
import { useMpesaProvider } from "./payment/providers/mpesaProvider";
import { useStripeProvider } from "./payment/providers/stripeProvider";
import { PaymentProviderName } from "./payment/types";
import { ReactNode } from "react";

// Initialize Stripe outside of components
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

export function usePaymentServices(defaultProvider: PaymentProviderName = 'stripe') {
  // Initialize providers
  const pesapalProvider = usePesapalProvider();
  const mpesaProvider = useMpesaProvider();
  const stripeProvider = useStripeProvider();
  
  // Create providers map
  const providers = {
    pesapal: pesapalProvider,
    mpesa: mpesaProvider,
    stripe: stripeProvider
  };
  
  // Get unified payment gateway
  const paymentGateway = usePaymentGateway({
    defaultProvider,
    providers
  });
  
  return {
    ...paymentGateway,
    
    // Provide the Stripe wrapper component for consumers that need it
    StripeProvider: ({ children }: { children: ReactNode }) => (
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    )
  };
}
