
// Common interfaces used across new arrivals components

export interface ProductInterface {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
  rating?: number;
  discount?: number;
  originalPrice?: number;
}

// Interface for the ProductGrid component's Product (with required category)
export interface ProductGridItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string; // Required in ProductGrid
  description?: string;
  rating?: number;
  discount?: number;
  originalPrice?: number;
}

// Grouped product data
export type GroupedProducts = Record<string, ProductInterface[]>;
