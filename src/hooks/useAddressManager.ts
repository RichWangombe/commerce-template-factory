
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Address } from "@/types/checkout";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Extended address type with id
export type SavedAddress = Address & { id: string };

export const useAddressManager = () => {
  const { user } = useAuth();
  const userId = user?.id || "guest";
  
  // Use local storage to persist addresses between sessions
  const [storedAddresses, setStoredAddresses] = useLocalStorage<Record<string, SavedAddress[]>>(
    "user-saved-addresses", 
    {}
  );
  
  const [defaultAddressId, setDefaultAddressId] = useLocalStorage<Record<string, string>>(
    "user-default-address", 
    {}
  );
  
  // Local state for the current user's addresses
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  
  // Initialize addresses from storage when user changes
  useEffect(() => {
    if (userId) {
      setAddresses(storedAddresses[userId] || []);
    }
  }, [userId, storedAddresses]);
  
  const addAddress = (address: Address) => {
    const newAddress: SavedAddress = {
      ...address,
      id: `addr_${Date.now()}`
    };
    
    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    
    // Update storage
    setStoredAddresses({
      ...storedAddresses,
      [userId]: updatedAddresses
    });
    
    // If this is the first address, make it the default
    if (updatedAddresses.length === 1) {
      setDefaultAddressId({
        ...defaultAddressId,
        [userId]: newAddress.id
      });
    }
    
    return newAddress.id;
  };
  
  const updateAddress = (id: string, updatedAddress: Address) => {
    const index = addresses.findIndex(addr => addr.id === id);
    
    if (index !== -1) {
      const updatedAddresses = [...addresses];
      updatedAddresses[index] = {
        ...updatedAddress,
        id
      };
      
      setAddresses(updatedAddresses);
      setStoredAddresses({
        ...storedAddresses,
        [userId]: updatedAddresses
      });
    }
  };
  
  const deleteAddress = (id: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    
    // Update storage
    setStoredAddresses({
      ...storedAddresses,
      [userId]: updatedAddresses
    });
    
    // If deleted address was the default, update default
    if (defaultAddressId[userId] === id) {
      const newDefault = updatedAddresses.length > 0 ? updatedAddresses[0].id : "";
      
      setDefaultAddressId({
        ...defaultAddressId,
        [userId]: newDefault
      });
    }
  };
  
  const setDefaultAddress = (id: string) => {
    setDefaultAddressId({
      ...defaultAddressId,
      [userId]: id
    });
  };
  
  const getDefaultAddress = (): SavedAddress | null => {
    const defaultId = defaultAddressId[userId];
    if (!defaultId) return null;
    
    return addresses.find(addr => addr.id === defaultId) || null;
  };
  
  return {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    defaultAddressId: defaultAddressId[userId] || ""
  };
};
