
import React, { useState, useEffect } from "react";
import RecommendationContext from "./RecommendationContext";
import { ProductRecommendation, RecommendationFilter, UserPreferences, RecommendationClickEvent } from "@/types/recommendation";
import { useCart } from "@/contexts/CartContext";
import { mockProducts } from "@/data/mockProducts";
import { 
  VIEWED_PRODUCTS_KEY,
  getSimilarProductRecommendations,
  getViewedBasedRecommendations,
  getTrendingRecommendations,
  getRandomRecommendations,
  getCollaborativeRecommendations
} from "@/utils/recommendationAlgorithms";
import { useRecommendationAnalytics } from "@/hooks/useRecommendationAnalytics";
import { 
  applyRecommendationFilters, 
  applyUserPreferences,
  simulateRecommendationApiCall,
  logRecommendationViewEvent
} from "@/utils/recommendationUtils";

export const RecommendationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewedProducts, setViewedProducts] = useState<number[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductRecommendation[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const { state: cartState } = useCart();
  const { trackRecommendationClick } = useRecommendationAnalytics();

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
    
    // Load user preferences
    const storedPreferences = localStorage.getItem('recommendation_preferences');
    if (storedPreferences) {
      try {
        setUserPreferences(JSON.parse(storedPreferences));
      } catch (error) {
        console.error('Failed to parse user preferences from localStorage:', error);
      }
    }
  }, []);

  // Save viewed products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(viewedProducts));
  }, [viewedProducts]);
  
  // Save user preferences whenever they change
  useEffect(() => {
    localStorage.setItem('recommendation_preferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Update recommendations whenever viewed products or cart changes
  useEffect(() => {
    setRecommendedProducts(getPersonalizedRecommendations());
  }, [viewedProducts, cartState.items, userPreferences]);

  // Record when a user views a product
  const recordProductView = (productId: number) => {
    setViewedProducts(prev => {
      // Move viewed product to the front of the list or add it if not present
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 20); // Keep only the last 20 viewed products
    });
  };

  // Update user preferences
  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({
      ...prev,
      ...preferences
    }));
  };

  // Generate product recommendations based on a specific product
  const getRecommendationsForProduct = (productId: number): ProductRecommendation[] => {
    return getSimilarProductRecommendations(productId);
  };

  // Generate personalized recommendations based on viewed products, purchase history, and preferences
  const getPersonalizedRecommendations = (filter?: RecommendationFilter): ProductRecommendation[] => {
    const purchasedIds = cartState.items.map(item => item.id);
    let recommendations: ProductRecommendation[] = [];
    
    // Get recommendations based on viewed products
    const viewedRecommendations = getViewedBasedRecommendations(viewedProducts, purchasedIds);
    recommendations = [...recommendations, ...viewedRecommendations];
    
    // Add collaborative filtering recommendations based on purchase history
    if (cartState.items.length > 0) {
      const collaborativeRecommendations = getCollaborativeRecommendations(
        cartState.items, 
        viewedProducts
      );
      recommendations = [...recommendations, ...collaborativeRecommendations];
    }
    
    // Add trending products if we don't have enough recommendations
    if (recommendations.length < 4) {
      const trendingRecommendations = getTrendingRecommendations(
        viewedProducts,
        recommendations,
        purchasedIds,
        4 - recommendations.length
      );
      recommendations = [...recommendations, ...trendingRecommendations];
    }
    
    // If we still need more recommendations, add random products
    if (recommendations.length < 4) {
      const randomRecommendations = getRandomRecommendations(
        viewedProducts,
        recommendations,
        purchasedIds,
        4 - recommendations.length
      );
      recommendations = [...recommendations, ...randomRecommendations];
    }
    
    // Apply filters if provided
    if (filter) {
      recommendations = applyRecommendationFilters(recommendations, filter);
    }
    
    // Apply user preferences
    recommendations = applyUserPreferences(
      recommendations, 
      userPreferences.favoriteCategories,
      userPreferences.dislikedProductIds
    );
    
    return recommendations.slice(0, 8); // Limit to 8 recommendations
  };

  // Implementation of getRecommendations method (to match what components are using)
  const getRecommendations = async (limit: number, filter?: RecommendationFilter): Promise<ProductRecommendation[]> => {
    // Get personalized recommendations with filters
    const recommendations = getPersonalizedRecommendations(filter);
    
    // Simulate API call with delay
    return simulateRecommendationApiCall(recommendations, limit);
  };

  // Implementation of trackView method (to match what components are using)
  const trackView = (event: RecommendationClickEvent) => {
    logRecommendationViewEvent(event);
  };

  return (
    <RecommendationContext.Provider
      value={{
        viewedProducts,
        recommendedProducts,
        recordProductView,
        getRecommendationsForProduct,
        getPersonalizedRecommendations,
        userPreferences,
        updateUserPreferences,
        trackRecommendationClick,
        // Add new methods to the context value
        getRecommendations,
        trackView
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};
