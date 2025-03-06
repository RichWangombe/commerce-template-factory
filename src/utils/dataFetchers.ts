
import { apiService } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductCardProps } from "@/components/ProductCard";
import { Order } from "@/types/checkout";

// Product queries
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => apiService.getProducts(),
  });
};

export const useProduct = (productId: number) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => apiService.getProductById(productId),
    enabled: !!productId, // Only run the query if productId is provided
  });
};

// Order queries
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => apiService.getUserOrders(),
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
  
  return useMutation({
    mutationFn: (orderData: Partial<Order>) => apiService.createOrder(orderData),
    onSuccess: () => {
      // Invalidate and refetch orders queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
