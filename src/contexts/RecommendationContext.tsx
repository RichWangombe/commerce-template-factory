
import React, { createContext, useContext, useEffect, useState } from "react";
import { ProductCardProps } from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { ProductRecommendation, RecommendationSource } from "@/types/recommendation";

// Mock database of products (would come from a real API)
const mockProducts: ProductCardProps[] = [
  {
    id: 1,
    name: "Smartphone X",
    price: 799,
    image: "/lovable-uploads/6b752309-063d-437b-b887-e07e2232e3ba.png",
    category: "Smartphone",
    isNew: true,
  },
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 299,
    image: "/lovable-uploads/f306dd50-931c-4e73-b66d-61b3383f1151.png",
    category: "Wearable",
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    price: 149,
    image: "/lovable-uploads/5724322a-7599-465b-8abc-a56c59781885.png",
    category: "Audio",
    discount: 15,
  },
  {
    id: 4,
    name: "Tablet Ultra",
    price: 499,
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=300",
    category: "Tablet",
  },
  {
    id: 5,
    name: "Laptop Pro",
    price: 1299,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=300",
    category: "Laptop",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 79,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=300",
    category: "Audio",
    discount: 10,
  },
  {
    id: 7,
    name: "Fitness Tracker",
    price: 129,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=300",
    category: "Wearable",
    isNew: true,
  },
  {
    id: 8,
    name: "Home Speaker System",
    price: 349,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=300",
    category: "Audio",
  },
];

// Product categories for better organization of recommendations
const productCategories = {
  "Smartphone": [1],
  "Wearable": [2, 7],
  "Audio": [3, 6, 8],
  "Tablet": [4],
  "Laptop": [5],
};

interface RecommendationContextType {
  viewedProducts: number[];
  recommendedProducts: ProductRecommendation[];
  recordProductView: (productId: number) => void;
  getRecommendationsForProduct: (productId: number) => ProductRecommendation[];
  getPersonalizedRecommendations: () => ProductRecommendation[];
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

const VIEWED_PRODUCTS_KEY = 'viewed_products';

export const RecommendationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewedProducts, setViewedProducts] = useState<number[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductRecommendation[]>([]);
  const { state: cartState } = useCart();

  // Load viewed products from localStorage on mount
  useEffect(() => {
    const storedViewedProducts = localStorage.getItem(VIEWED_PRODUCTS_KEY);
    if (storedViewedProducts) {
      try {
        setViewedProducts(JSON.parse(storedViewedProducts));
      } catch (error) {
        console.error('Failed to parse viewed products from localStorage:', error);
      }
    }
  }, []);

  // Save viewed products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(viewedProducts));
  }, [viewedProducts]);

  // Update recommendations whenever viewed products or cart changes
  useEffect(() => {
    setRecommendedProducts(getPersonalizedRecommendations());
  }, [viewedProducts, cartState.items]);

  // Record when a user views a product
  const recordProductView = (productId: number) => {
    setViewedProducts(prev => {
      // Move viewed product to the front of the list or add it if not present
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 20); // Keep only the last 20 viewed products
    });
  };

  // Generate product recommendations based on a specific product
  const getRecommendationsForProduct = (productId: number): ProductRecommendation[] => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product || !product.category) return [];

    // Find products in the same category
    const similarCategoryIds = productCategories[product.category as keyof typeof productCategories] || [];
    
    // Filter out the current product and transform to recommendation format
    return mockProducts
      .filter(p => p.id !== productId && similarCategoryIds.includes(p.id))
      .map(p => ({
        ...p,
        source: {
          type: 'similar' as const,
          confidence: 0.85,
        }
      }))
      .slice(0, 4); // Limit to 4 recommendations
  };

  // Generate personalized recommendations based on viewed products and purchase history
  const getPersonalizedRecommendations = (): ProductRecommendation[] => {
    const recommendations: ProductRecommendation[] = [];
    const purchasedIds = cartState.items.map(item => item.id);
    
    // Recommendations based on viewed products
    if (viewedProducts.length > 0) {
      const recentViewedIds = viewedProducts.slice(0, 3); // Get the 3 most recently viewed products
      
      for (const viewedId of recentViewedIds) {
        const viewedProduct = mockProducts.find(p => p.id === viewedId);
        if (!viewedProduct || !viewedProduct.category) continue;
        
        // Find products in the same category as viewed products
        const categoryIds = productCategories[viewedProduct.category as keyof typeof productCategories] || [];
        const similarProducts = mockProducts
          .filter(p => 
            p.id !== viewedId && 
            !viewedProducts.includes(p.id) && 
            !purchasedIds.includes(p.id) &&
            categoryIds.includes(p.id)
          )
          .map(p => ({
            ...p,
            source: {
              type: 'viewed' as const,
              confidence: 0.75,
            }
          }))
          .slice(0, 2); // Limit to 2 recommendations per viewed product
        
        recommendations.push(...similarProducts);
      }
    }
    
    // Add some trending products if we don't have enough recommendations
    if (recommendations.length < 4) {
      const trendingProducts = mockProducts
        .filter(p => 
          p.isNew && 
          !viewedProducts.includes(p.id) && 
          !recommendations.some(r => r.id === p.id) &&
          !purchasedIds.includes(p.id)
        )
        .map(p => ({
          ...p,
          source: {
            type: 'trending' as const,
            confidence: 0.65,
          }
        }))
        .slice(0, 4 - recommendations.length);
      
      recommendations.push(...trendingProducts);
    }
    
    // If we still need more recommendations, add random products
    if (recommendations.length < 4) {
      const usedIds = [...viewedProducts, ...purchasedIds, ...recommendations.map(r => r.id)];
      const randomProducts = mockProducts
        .filter(p => !usedIds.includes(p.id))
        .sort(() => Math.random() - 0.5) // Shuffle
        .map(p => ({
          ...p,
          source: {
            type: 'similar' as const,
            confidence: 0.5,
          }
        }))
        .slice(0, 4 - recommendations.length);
      
      recommendations.push(...randomProducts);
    }
    
    return recommendations;
  };

  return (
    <RecommendationContext.Provider
      value={{
        viewedProducts,
        recommendedProducts,
        recordProductView,
        getRecommendationsForProduct,
        getPersonalizedRecommendations,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendations = (): RecommendationContextType => {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
};
