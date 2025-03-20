
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Payment method type
export type PaymentMethod = {
  id: string;
  cardNumber: string; // last 4 digits
  nameOnCard: string;
  expiryDate: string;
  cardType: string;
};

export const usePaymentMethodManager = () => {
  const { user } = useAuth();
  const userId = user?.id || "guest";
  
  // Use local storage to persist payment methods between sessions
  const [storedPaymentMethods, setStoredPaymentMethods] = useLocalStorage<Record<string, PaymentMethod[]>>(
    "user-payment-methods", 
    {}
  );
  
  const [defaultPaymentMethodId, setDefaultPaymentMethodId] = useLocalStorage<Record<string, string>>(
    "user-default-payment", 
    {}
  );
  
  // Local state for the current user's payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  // Initialize payment methods from storage when user changes
  useEffect(() => {
    if (userId) {
      setPaymentMethods(storedPaymentMethods[userId] || []);
    }
  }, [userId, storedPaymentMethods]);
  
  const addPaymentMethod = (paymentDetails: Omit<PaymentMethod, "id">) => {
    const newPaymentMethod: PaymentMethod = {
      ...paymentDetails,
      id: `pm_${Date.now()}`
    };
    
    const updatedPaymentMethods = [...paymentMethods, newPaymentMethod];
    setPaymentMethods(updatedPaymentMethods);
    
    // Update storage
    setStoredPaymentMethods({
      ...storedPaymentMethods,
      [userId]: updatedPaymentMethods
    });
    
    // If this is the first payment method, make it the default
    if (updatedPaymentMethods.length === 1) {
      setDefaultPaymentMethodId({
        ...defaultPaymentMethodId,
        [userId]: newPaymentMethod.id
      });
    }
    
    return newPaymentMethod.id;
  };
  
  const deletePaymentMethod = (id: string) => {
    const updatedPaymentMethods = paymentMethods.filter(pm => pm.id !== id);
    setPaymentMethods(updatedPaymentMethods);
    
    // Update storage
    setStoredPaymentMethods({
      ...storedPaymentMethods,
      [userId]: updatedPaymentMethods
    });
    
    // If deleted payment method was the default, update default
    if (defaultPaymentMethodId[userId] === id) {
      const newDefault = updatedPaymentMethods.length > 0 ? updatedPaymentMethods[0].id : "";
      
      setDefaultPaymentMethodId({
        ...defaultPaymentMethodId,
        [userId]: newDefault
      });
    }
  };
  
  const setDefaultPaymentMethod = (id: string) => {
    setDefaultPaymentMethodId({
      ...defaultPaymentMethodId,
      [userId]: id
    });
  };
  
  const getDefaultPaymentMethod = (): PaymentMethod | null => {
    const defaultId = defaultPaymentMethodId[userId];
    if (!defaultId) return null;
    
    return paymentMethods.find(pm => pm.id === defaultId) || null;
  };
  
  return {
    paymentMethods,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    getDefaultPaymentMethod,
    defaultPaymentMethodId: defaultPaymentMethodId[userId] || ""
  };
};
