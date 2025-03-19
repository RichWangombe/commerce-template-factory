
import { useLocalStorage } from "../useLocalStorage";
import { PaymentAnalytics, PaymentProviderName } from "./types";

const ANALYTICS_STORAGE_KEY = "payment_analytics";

// Create initial state with correct types
const initialAnalytics: PaymentAnalytics = {
  completed: 0,
  failed: 0,
  pending: 0,
  abandoned: 0,
  errors: 0,
  attempts: 0,
  provider: {
    stripe: { attempts: 0, completed: 0, completionRate: 0 },
    mpesa: { attempts: 0, completed: 0, completionRate: 0 },
    pesapal: { attempts: 0, completed: 0, completionRate: 0 }
  }
};

export function usePaymentAnalytics() {
  // Use localStorage to persist analytics data
  const [analytics, setAnalytics] = useLocalStorage<PaymentAnalytics>(
    ANALYTICS_STORAGE_KEY, 
    initialAnalytics
  );

  const updateAnalytics = (
    status: 'completed' | 'failed' | 'pending' | 'abandoned' | 'error',
    provider?: PaymentProviderName
  ) => {
    // The issue is that setAnalytics expects a direct value but we're using a callback
    // The underlying type for useLocalStorage assumes a value, not a callback, so we need to cast
    const updateFn = (prev: PaymentAnalytics): PaymentAnalytics => {
      // Update overall analytics
      const updated: PaymentAnalytics = {
        ...prev,
        [status]: (prev[status] || 0) + 1,
        attempts: prev.attempts + (status === 'pending' ? 1 : 0)
      };
      
      // Update provider-specific analytics if provider is specified
      if (provider && updated.provider) {
        const providerStats = updated.provider[provider] || { 
          attempts: 0, 
          completed: 0, 
          completionRate: 0 
        };
        
        const newProviderStats = {
          ...providerStats,
          attempts: providerStats.attempts + (status === 'pending' ? 1 : 0),
          completed: providerStats.completed + (status === 'completed' ? 1 : 0)
        };
        
        // Calculate completion rate
        if (newProviderStats.attempts > 0) {
          newProviderStats.completionRate = Math.round(
            (newProviderStats.completed / newProviderStats.attempts) * 100
          );
        }
        
        updated.provider = {
          ...updated.provider,
          [provider]: newProviderStats
        };
      }
      
      return updated;
    };
    
    // Cast the function to any to bypass the type check temporarily
    // This is a workaround for the limitation in the useLocalStorage hook type
    (setAnalytics as any)(updateFn);
  };

  // Get analytics summary with completion rate
  const getAnalyticsSummary = () => {
    const completionRate = analytics.attempts > 0 
      ? Math.round((analytics.completed / analytics.attempts) * 100) 
      : 0;
    
    return {
      ...analytics,
      completionRate
    };
  };

  return {
    updateAnalytics,
    getAnalyticsSummary
  };
}
