
export interface RecommendationSource {
  type: 'viewed' | 'purchased' | 'similar' | 'trending' | 'collaborative' | 'seasonal';
  confidence: number;
  timestamp?: string; // When the recommendation was generated
}

export interface ProductRecommendation {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  discount?: number;
  isNew?: boolean;
  source: RecommendationSource;
}

export type RecommendationClickEvent = {
  productId: number;
  productName?: string;
  recommendationType: string;
  confidence?: number;
  timestamp: string;
};

export type RecommendationConversionEvent = {
  productId: number;
  productName?: string;
  recommendationType: string;
  confidence?: number;
  timestamp: string;
  orderValue?: number;
};

export type RecommendationFilter = {
  types?: string[];
  categories?: string[];
  minConfidence?: number;
};

export interface UserPreferences {
  favoriteCategories?: string[];
  preferredPriceRange?: [number, number];
  dislikedProductIds?: number[];
  showRecentlyViewed?: boolean;
  showTrending?: boolean;
  showSimilar?: boolean;
  showSeasonalOffers?: boolean;
  recommendationCount?: number;
}

export interface RecommendationAnalytics {
  clicks: RecommendationClickEvent[];
  conversions: RecommendationConversionEvent[];
  conversionRate: number;
  mostEffectiveType: string;
}
