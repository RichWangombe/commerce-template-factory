
import { useLocalStorage } from "../useLocalStorage";

export interface PaymentAnalytics {
  completed: number;
  failed: number;
  pending: number;
  abandoned: number;
  errors: number;
  attempts: number;
}

export function usePaymentAnalytics() {
  // Use localStorage to persist analytics data
  const [analytics, setAnalytics] = useLocalStorage<PaymentAnalytics>("pesapal_payment_analytics", {
    completed: 0,
    failed: 0,
    pending: 0,
    abandoned: 0,
    errors: 0,
    attempts: 0
  });

  const updateAnalytics = (status: 'completed' | 'failed' | 'pending' | 'abandoned' | 'error') => {
    setAnalytics({
      ...analytics,
      [status]: analytics[status] + 1,
      attempts: analytics.attempts + (status === 'pending' ? 1 : 0)
    });
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
