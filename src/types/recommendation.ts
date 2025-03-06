
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
  recommendationType: string;
  timestamp: string;
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
}
