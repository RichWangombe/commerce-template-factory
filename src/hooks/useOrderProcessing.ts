
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order } from "@/types/checkout";
import { apiService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useOrderProcessing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch orders for the current user
  const { 
    data: orders,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return await apiService.getUserOrders(user.id);
    },
    enabled: !!user
  });

  // Create a new order
  const createOrderMutation = useMutation({
    mutationFn: (orderData: Partial<Order>) => {
      setIsProcessing(true);
      return apiService.createOrder(orderData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders", user?.id] });
      toast({
        title: "Order Created",
        description: `Your order #${data.id.slice(-6)} has been successfully created.`,
      });
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error("Order creation failed:", error);
      toast({
        title: "Order Creation Failed",
        description: "There was a problem creating your order. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  });

  // Update order status (for admin purposes or when receiving webhooks)
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: Order["status"] }) => {
      if (!user) throw new Error("User not authenticated");
      
      // Only proceed if using Supabase (more secure than our mock API)
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId);
          
        if (error) throw error;
        return { orderId, status };
      } catch (error) {
        console.error("Error updating order status:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders", user?.id] });
      toast({
        title: "Order Updated",
        description: `Order #${data.orderId.slice(-6)} status changed to ${data.status}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  });

  // Cancel an order
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return updateOrderStatusMutation.mutateAsync({ orderId, status: "cancelled" });
    },
    onSuccess: () => {
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully.",
      });
    }
  });

  return {
    orders,
    isLoading,
    isError,
    isProcessing,
    refetch,
    createOrder: createOrderMutation.mutate,
    updateOrderStatus: updateOrderStatusMutation.mutate,
    cancelOrder: cancelOrderMutation.mutate
  };
};
