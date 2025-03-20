
import { apiService } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductCardProps } from "@/components/ProductCard";
import { Order } from "@/types/checkout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Review } from "@/types/review";

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

// Reviews queries and mutations
export const useProductReviews = (productId: string | number) => {
  return useQuery<Review[], Error>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      if (!productId) return [];
      
      const { data, error } = await supabase
        .from('product_reviews')
        .select(`
          id,
          rating,
          review_text,
          created_at,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      
      // Map from Supabase format to our Review type
      return data.map(item => ({
        id: item.id.toString(),
        productId: productId.toString(),
        userId: item.user_id || '',
        userName: item.profiles ? 
          `${item.profiles.first_name || ''} ${item.profiles.last_name || ''}`.trim() || 'Anonymous User' : 
          'Anonymous User',
        rating: item.rating,
        comment: item.review_text || '',
        date: item.created_at || new Date().toISOString(),
        helpful: 0, // We'll implement this later
        verified: true // Assuming all logged-in users are verified
      }));
    },
    enabled: !!productId
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (reviewData: { 
      productId: string | number; 
      rating: number; 
      title?: string;
      comment: string;
    }) => {
      if (!user) {
        throw new Error('You must be logged in to submit a review');
      }
      
      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: typeof reviewData.productId === 'string' ? parseInt(reviewData.productId) : reviewData.productId,
          user_id: user.id,
          rating: reviewData.rating,
          review_text: reviewData.comment,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error creating review:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch reviews for this product
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', variables.productId] 
      });
      
      // Also invalidate the product query to update rating
      queryClient.invalidateQueries({
        queryKey: ['product', typeof variables.productId === 'string' ? 
          parseInt(variables.productId) : variables.productId]
      });
    }
  });
};

export const useMarkReviewHelpful = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      reviewId, 
      productId 
    }: { 
      reviewId: string; 
      productId: string | number;
    }) => {
      // In a real implementation, we would increment a helpful count in the database
      // For now we'll just console log it
      console.log(`Marked review ${reviewId} as helpful`);
      return { success: true };
    },
    onSuccess: (_, variables) => {
      // Invalidate reviews for this product
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', variables.productId] 
      });
    }
  });
};
