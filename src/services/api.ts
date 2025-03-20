import { useAuthFunctions } from "@/utils/auth";
import { mockProducts } from "@/data/mockProducts";
import { ProductCardProps } from "@/components/ProductCard";
import { Order } from "@/types/checkout";
import { supabase } from "@/lib/supabase";
import { Product } from "@/utils/dataFetchers";

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
    stock: product.stock || 0,
    colors: product.colors || [],
    description: product.description,
    features: product.features || [],
    specifications: product.specifications || {},
    featured: product.featured === true, // Handle the featured property
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
          user_id: orderData.userId,
          items: orderData.items,
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
          userId: orderData.userId || "guest-user",
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
  
  async getUserOrders(userId: string): Promise<Order[]> {
    if (isSupabaseConfigured() && userId) {
      try {
        console.log(`Fetching orders for user ${userId}`);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        // Map the orders to our Order type
        return data.map(order => ({
          id: order.id,
          userId: order.user_id,
          items: order.items,
          shippingAddress: order.shipping_address,
          billingAddress: order.billing_address,
          shippingMethod: order.shipping_method,
          paymentMethod: order.payment_method,
          subtotal: order.subtotal,
          tax: order.tax,
          shipping: order.shipping,
          total: order.total,
          status: order.status,
          createdAt: order.created_at,
        }));
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    }
    
    // Fallback to mock data
    return Promise.resolve([
      {
        id: "ORD-12345",
        userId: userId || "user123",
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
        userId: userId || "user123",
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
  },
  
  async getOrderById(orderId: string): Promise<Order | null> {
    if (isSupabaseConfigured()) {
      try {
        console.log(`Fetching order ${orderId} from Supabase`);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        
        if (error) {
          console.error("Supabase error:", error);
          // Fallback to mock data
        } else {
          // Map to our Order type
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
            trackingNumber: data.tracking_number,
            estimatedDelivery: data.estimated_delivery,
            statusHistory: data.status_history,
          } as Order;
        }
      } catch (error) {
        console.error(`Error fetching order ${orderId}:`, error);
      }
    }
    
    // Fallback to mock order
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
};

// Custom hook for using the API with authentication
export function useAuthenticatedApi() {
  const { getToken } = useAuthFunctions();
  
  return {
    async fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      try {
        const token = await getToken();
        
        // Set up headers with authentication
        const headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };
        
        // Make the authenticated request
        const response = await fetch(endpoint, {
          ...options,
          headers,
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    
    // Supabase-specific authenticated functions
    supabase: {
      async getOrders() {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session) throw new Error('Not authenticated');
        
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.session.user.id);
          
        if (error) throw error;
        return data;
      },
      
      async createOrder(orderData: any) {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session) throw new Error('Not authenticated');
        
        // Add user_id to order data
        const orderWithUserId = {
          ...orderData,
          user_id: session.session.user.id
        };
        
        const { data, error } = await supabase
          .from('orders')
          .insert(orderWithUserId)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      },
      
      async updateProfile(profileData: any) {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session) throw new Error('Not authenticated');
        
        const { data, error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', session.session.user.id)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      }
    }
  };
}
