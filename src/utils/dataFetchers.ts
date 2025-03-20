
import { apiService } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductCardProps } from "@/components/ProductCard";
import { Order } from "@/types/checkout";
import { useAuth } from "@/contexts/AuthContext";

// Extended Product interface with all the fields we need
export interface Product extends ProductCardProps {
  brand?: string;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  colors?: string[];
  description?: string;
  features?: string[];
  specifications?: Record<string, any>;
  featured?: boolean;
}

// Product queries
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => apiService.getProducts(),
  });
};

export const useProduct = (productId: number) => {
  return useQuery<Product, Error>({
    queryKey: ['product', productId],
    queryFn: () => apiService.getProductById(productId),
    enabled: !!productId, // Only run the query if productId is provided
  });
};

// Order queries
export const useOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await apiService.getUserOrders(user.id);
    },
    enabled: !!user,
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => apiService.getOrderById(orderId),
    enabled: !!orderId, // Only run the query if orderId is provided
  });
};

// Order mutations
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (orderData: Partial<Order>) => {
      // Ensure userId is set to the current user
      const orderWithUserId = {
        ...orderData,
        userId: user?.id
      };
      
      return apiService.createOrder(orderWithUserId);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch orders queries when a new order is created
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ['orders', user.id] });
      }
    },
  });
};

// Profile queries and mutations
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: any) => {
      const { updateProfile } = await import('@/utils/auth').then(m => m.useProfile());
      return updateProfile(profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
