export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          name: string;
          description: string;
          price: number;
          original_price: number | null;
          image: string;
          category: string;
          brand: string | null;
          rating: number | null;
          review_count: number | null;
          stock: number | null;
          colors: string[] | null;
          features: string[] | null;
          specifications: Json | null;
          featured: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description: string;
          price: number;
          original_price?: number | null;
          image: string;
          category: string;
          brand?: string | null;
          rating?: number | null;
          review_count?: number | null;
          stock?: number | null;
          colors?: string[] | null;
          features?: string[] | null;
          specifications?: Json | null;
          featured?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          price?: number;
          original_price?: number | null;
          image?: string;
          category?: string;
          brand?: string | null;
          rating?: number | null;
          review_count?: number | null;
          stock?: number | null;
          colors?: string[] | null;
          features?: string[] | null;
          specifications?: Json | null;
          featured?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          items: Json;
          shipping_address: Json;
          billing_address: Json;
          shipping_method: Json;
          payment_method: string;
          subtotal: number;
          tax: number;
          shipping: number;
          total: number;
          status: string;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          items: Json;
          shipping_address: Json;
          billing_address: Json;
          shipping_method: Json;
          payment_method: string;
          subtotal: number;
          tax: number;
          shipping: number;
          total: number;
          status?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          items?: Json;
          shipping_address?: Json;
          billing_address?: Json;
          shipping_method?: Json;
          payment_method?: string;
          subtotal?: number;
          tax?: number;
          shipping?: number;
          total?: number;
          status?: string;
          created_at?: string;
          updated_at?: string | null;
        };
      };
      product_reviews: {
        Row: {
          id: number;
          product_id: number;
          user_id: string;
          rating: number;
          review_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          user_id: string;
          rating: number;
          review_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          product_id?: number;
          user_id?: string;
          rating?: number;
          review_text?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
