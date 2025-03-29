import React, { useState, useEffect, useCallback, useMemo } from "react";
import RecommendationContext from "./RecommendationContext";
import { ProductRecommendation, RecommendationFilter, UserPreferences, RecommendationClickEvent } from "@/types/recommendation";
import { useCart } from "@/contexts/CartContext";
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
} from "@/utils/recommendation";

export const RecommendationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewedProducts, setViewedProducts] = useState<number[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductRecommendation[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({});
  const { state: cartState } = useCart();
  const { trackRecommendationClick } = useRecommendationAnalytics();

  useEffect(() => {
    const storedViewedProducts = localStorage.getItem(VIEWED_PRODUCTS_KEY);
    if (storedViewedProducts) {
      try {
        setViewedProducts(JSON.parse(storedViewedProducts));
      } catch (error) {
        console.error('Failed to parse viewed products from localStorage:', error);
      }
    }
    
    const storedPreferences = localStorage.getItem('recommendation_preferences');
    if (storedPreferences) {
      try {
        setUserPreferences(JSON.parse(storedPreferences));
      } catch (error) {
        console.error('Failed to parse user preferences from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(viewedProducts));
  }, [viewedProducts]);
  
  useEffect(() => {
    localStorage.setItem('recommendation_preferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  const purchasedIds = useMemo(() => 
    cartState.items.map(item => item.id), 
    [cartState.items]
  );

  const getPersonalizedRecommendations = useCallback((filter?: RecommendationFilter): ProductRecommendation[] => {
    let recommendations: ProductRecommendation[] = [];
    
    const viewedRecommendations = getViewedBasedRecommendations(viewedProducts, purchasedIds);
    recommendations = [...recommendations, ...viewedRecommendations];
    
    if (cartState.items.length > 0) {
      const collaborativeRecommendations = getCollaborativeRecommendations(
        cartState.items, 
        viewedProducts
      );
      recommendations = [...recommendations, ...collaborativeRecommendations];
    }
    
    if (recommendations.length < 4) {
      const trendingRecommendations = getTrendingRecommendations(
        viewedProducts,
        recommendations,
        purchasedIds,
        4 - recommendations.length
      );
      recommendations = [...recommendations, ...trendingRecommendations];
    }
    
    if (recommendations.length < 4) {
      const randomRecommendations = getRandomRecommendations(
        viewedProducts,
        recommendations,
        purchasedIds,
        4 - recommendations.length
      );
      recommendations = [...recommendations, ...randomRecommendations];
    }
    
    if (filter) {
      recommendations = applyRecommendationFilters(recommendations, filter);
    }
    
    recommendations = applyUserPreferences(
      recommendations, 
      userPreferences.favoriteCategories,
      userPreferences.dislikedProductIds
    );
    
    return recommendations.slice(0, 8);
  }, [viewedProducts, cartState.items, purchasedIds, userPreferences]);

  useEffect(() => {
    setRecommendedProducts(getPersonalizedRecommendations());
  }, [viewedProducts, cartState.items, userPreferences, getPersonalizedRecommendations]);

  const recordProductView = useCallback((productId: number) => {
    setViewedProducts(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 20);
    });
  }, []);

  const updateUserPreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({
      ...prev,
      ...preferences
    }));
  }, []);

  const getRecommendationsForProduct = useCallback((productId: number): ProductRecommendation[] => {
    return getSimilarProductRecommendations(productId);
  }, []);

  const getRecommendations = useCallback(async (limit: number, filter?: RecommendationFilter): Promise<ProductRecommendation[]> => {
    const recommendations = getPersonalizedRecommendations(filter);
    return simulateRecommendationApiCall(recommendations, limit);
  }, [getPersonalizedRecommendations]);

  const trackView = useCallback((event: RecommendationClickEvent) => {
    logRecommendationViewEvent(event);
  }, []);

  const contextValue = useMemo(() => ({
    viewedProducts,
    recommendedProducts,
    recordProductView,
    getRecommendationsForProduct,
    getPersonalizedRecommendations,
    userPreferences,
    updateUserPreferences,
    trackRecommendationClick,
    getRecommendations,
    trackView
  }), [
    viewedProducts, 
    recommendedProducts, 
    recordProductView,
    getRecommendationsForProduct,
    getPersonalizedRecommendations,
    userPreferences,
    updateUserPreferences,
    trackRecommendationClick,
    getRecommendations,
    trackView
  ]);

  return (
    <RecommendationContext.Provider value={contextValue}>
      {children}
    </RecommendationContext.Provider>
  );
};
