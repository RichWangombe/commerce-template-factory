
import { useAuth } from "@clerk/clerk-react";
import { mockProducts } from "@/data/mockProducts";
import { ProductCardProps } from "@/components/ProductCard";
import { Order } from "@/types/checkout";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Product } from "@/utils/dataFetchers";

// Base URL for API calls - replace with your actual API URL when available
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

// Helper function to get auth token
const getAuthHeaders = async () => {
  // This would be replaced with actual auth logic
  try {
    // This is a placeholder and won't work directly
    // You'll need to use Clerk's useAuth hook in a component
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error("Error getting auth token:", error);
    return {
      'Content-Type': 'application/json'
    };
  }
};

// Convert Supabase product to our Product interface
const mapSupabaseProduct = (product: any): Product => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    brand: product.brand,
    originalPrice: product.original_price,
    rating: product.rating,
    reviewCount: product.review_count,
    stock: product.stock,
    colors: product.colors,
    description: product.description,
    features: product.features,
    specifications: product.specifications,
  };
};

// API service functions
export const apiService = {
  // Products
  async getProducts(): Promise<ProductCardProps[]> {
    // Try to use Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        console.log("Fetching products from Supabase");
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          console.error("Supabase error:", error);
          return mockProducts;
        }
        
        return data.map(mapSupabaseProduct);
      } catch (error) {
        console.error("Error fetching from Supabase:", error);
        return mockProducts;
      }
    }
    
    // Fallback to mock data
    console.log("Fetching products from mock data");
    return Promise.resolve(mockProducts);
  },
  
  async getProductById(id: number): Promise<Product | null> {
    // Try to use Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        console.log(`Fetching product ${id} from Supabase`);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error("Supabase error:", error);
          const mockProduct = mockProducts.find(p => p.id === id);
          return mockProduct ? mapSupabaseProduct(mockProduct) : null;
        }
        
        return mapSupabaseProduct(data);
      } catch (error) {
        console.error("Error fetching from Supabase:", error);
        const mockProduct = mockProducts.find(p => p.id === id);
        return mockProduct ? mapSupabaseProduct(mockProduct) : null;
      }
    }
    
    // Fallback to mock data
    console.log(`Fetching product ${id} from mock data`);
    const product = mockProducts.find(p => p.id === id);
    return Promise.resolve(product ? mapSupabaseProduct(product) : null);
  },
  
  // Orders
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    // Try to use Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        console.log("Creating order in Supabase");
        
        // Prep the order data for Supabase
        const newOrder = {
          id: `ORD-${Date.now()}`,
          user_id: orderData.userId || 'anonymous',
          items: orderData.items || [],
          shipping_address: orderData.shippingAddress,
          billing_address: orderData.billingAddress,
          shipping_method: orderData.shippingMethod,
          payment_method: orderData.paymentMethod || 'card',
          subtotal: orderData.subtotal || 0,
          tax: orderData.tax || 0,
          shipping: orderData.shipping || 0,
          total: orderData.total || 0,
          status: 'pending',
          created_at: new Date().toISOString(),
        };
        
        const { data, error } = await supabase
          .from('orders')
          .insert(newOrder)
          .select()
          .single();
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        // Map back to our Order type
        return {
          id: data.id,
          userId: data.user_id,
          items: data.items,
          shippingAddress: data.shipping_address,
          billingAddress: data.billing_address,
          shippingMethod: data.shipping_method,
          paymentMethod: data.payment_method,
          subtotal: data.subtotal,
          tax: data.tax,
          shipping: data.shipping,
          total: data.total,
          status: data.status,
          createdAt: data.created_at,
        } as Order;
      } catch (error) {
        console.error("Error creating order in Supabase:", error);
        // Fall back to mock implementation
      }
    }
    
    // Fallback to mock implementation
    console.log("Creating order with mock data:", orderData);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `ORD-${Date.now()}`,
          userId: "user123",
          items: orderData.items || [],
          shippingAddress: orderData.shippingAddress!,
          billingAddress: orderData.billingAddress!,
          shippingMethod: orderData.shippingMethod!,
          paymentMethod: orderData.paymentMethod || "card",
          subtotal: orderData.subtotal || 0,
          tax: orderData.tax || 0,
          shipping: orderData.shipping || 0,
          total: orderData.total || 0,
          status: "pending",
          createdAt: new Date().toISOString(),
        } as Order);
      }, 1000);
    });
  },
  
  async getOrderById(orderId: string): Promise<Order | null> {
    // Placeholder - would be an actual API call
    console.log(`Fetching order ${orderId}`);
    
    // Return a mock order for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: orderId,
          userId: "user123",
          items: [
            {
              id: 1,
              name: "Wireless Headphones",
              price: 79.99,
              quantity: 1,
              image: "/placeholder.svg",
            },
          ],
          shippingAddress: {
            firstName: "John",
            lastName: "Doe",
            address1: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            country: "United States",
          },
          billingAddress: {
            firstName: "John",
            lastName: "Doe",
            address1: "123 Main St",
            city: "Anytown",
            state: "CA",
            zipCode: "12345",
            country: "United States",
          },
          shippingMethod: {
            id: "standard",
            name: "Standard Shipping",
            description: "Delivered in 5-7 business days",
            price: 5.99,
            estimatedDays: "5-7 business days",
          },
          paymentMethod: "card",
          subtotal: 79.99,
          tax: 6.40,
          shipping: 5.99,
          total: 92.38,
          status: "pending",
          createdAt: new Date().toISOString(),
        } as Order);
      }, 500);
    });
  },
  
  async getUserOrders(): Promise<Order[]> {
    // Placeholder - would be an actual API call
    console.log("Fetching user orders");
    
    // Return mock orders for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "ORD-12345",
            userId: "user123",
            items: [],
            shippingAddress: {
              firstName: "John",
              lastName: "Doe",
              address1: "123 Main St",
              city: "Anytown",
              state: "CA",
              zipCode: "12345",
              country: "United States",
            },
            billingAddress: {
              firstName: "John",
              lastName: "Doe",
              address1: "123 Main St",
              city: "Anytown",
              state: "CA",
              zipCode: "12345",
              country: "United States",
            },
            shippingMethod: {
              id: "standard",
              name: "Standard Shipping",
              description: "Delivered in 5-7 business days",
              price: 5.99,
              estimatedDays: "5-7 business days",
            },
            paymentMethod: "card",
            subtotal: 299.99,
            tax: 24.00,
            shipping: 5.99,
            total: 329.98,
            status: "delivered",
            createdAt: "2023-05-15T10:30:00Z",
          } as Order,
          {
            id: "ORD-12346",
            userId: "user123",
            items: [],
            shippingAddress: {
              firstName: "John",
              lastName: "Doe",
              address1: "123 Main St",
              city: "Anytown",
              state: "CA",
              zipCode: "12345",
              country: "United States",
            },
            billingAddress: {
              firstName: "John",
              lastName: "Doe",
              address1: "123 Main St",
              city: "Anytown",
              state: "CA",
              zipCode: "12345",
              country: "United States",
            },
            shippingMethod: {
              id: "express",
              name: "Express Shipping",
              description: "Delivered in 1-2 business days",
              price: 12.99,
              estimatedDays: "1-2 business days",
            },
            paymentMethod: "card",
            subtotal: 149.50,
            tax: 11.96,
            shipping: 12.99,
            total: 174.45,
            status: "shipped",
            createdAt: "2023-06-20T14:45:00Z",
          } as Order,
        ]);
      }, 500);
    });
  },
};

// Custom hook for using the API with authentication
export function useAuthenticatedApi() {
  const { getToken, isSignedIn } = useAuth();
  
  return {
    async fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
      if (!isSignedIn) {
        throw new Error("User is not authenticated");
      }
      
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error("API request failed:", error);
        throw error;
      }
    },
    
    // New method to get Supabase with auth
    async getSupabaseWithAuth() {
      if (!isSignedIn) {
        throw new Error("User is not authenticated");
      }
      
      try {
        const token = await getToken();
        // Set the auth token for Supabase
        return supabase.auth.setSession({
          access_token: token as string,
          refresh_token: '',
        });
      } catch (error) {
        console.error("Failed to set Supabase auth:", error);
        throw error;
      }
    }
  };
}
