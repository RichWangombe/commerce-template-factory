
export interface RecommendationSource {
  type: 'viewed' | 'purchased' | 'similar' | 'trending';
  confidence: number;
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
