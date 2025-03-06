
import React, { createContext } from "react";
import { ProductRecommendation, RecommendationFilter, UserPreferences, RecommendationClickEvent } from "@/types/recommendation";

export interface RecommendationContextType {
  viewedProducts: number[];
  recommendedProducts: ProductRecommendation[];
  recordProductView: (productId: number) => void;
  getRecommendationsForProduct: (productId: number) => ProductRecommendation[];
  getPersonalizedRecommendations: (filter?: RecommendationFilter) => ProductRecommendation[];
  userPreferences: UserPreferences;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  trackRecommendationClick: (recommendation: ProductRecommendation) => void;
  // Add these methods to match what components are using
  getRecommendations: (limit: number, filter?: RecommendationFilter) => Promise<ProductRecommendation[]>;
  trackView: (event: RecommendationClickEvent) => void;
}

// Create the context with undefined as default value
const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export default RecommendationContext;
