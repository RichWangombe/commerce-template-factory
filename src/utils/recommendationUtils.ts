
import { ProductRecommendation, RecommendationFilter, RecommendationClickEvent } from "@/types/recommendation";
import { mockProducts } from "@/data/mockProducts";

// Helper function to filter recommendations based on filter criteria
export const applyRecommendationFilters = (
  recommendations: ProductRecommendation[], 
  filter?: RecommendationFilter
): ProductRecommendation[] => {
  if (!filter) return recommendations;
  
  let filteredRecommendations = [...recommendations];
  
  // Apply type filters if provided
  if (filter.types && filter.types.length > 0) {
    filteredRecommendations = filteredRecommendations.filter(r => 
      filter.types?.includes(r.source.type)
    );
  }
  
  // Apply category filters if provided
  if (filter.categories && filter.categories.length > 0) {
    filteredRecommendations = filteredRecommendations.filter(r => 
      r.category && filter.categories?.includes(r.category)
    );
  }
  
  // Apply confidence threshold if provided
  if (filter.minConfidence) {
    filteredRecommendations = filteredRecommendations.filter(r => 
      r.source.confidence >= (filter.minConfidence || 0)
    );
  }
  
  return filteredRecommendations;
};

// Helper to apply user preferences to recommendations
export const applyUserPreferences = (
  recommendations: ProductRecommendation[],
  favoriteCategories?: string[],
  dislikedProductIds?: number[]
): ProductRecommendation[] => {
  let result = [...recommendations];
  
  // Boost products in favorite categories
  if (favoriteCategories && favoriteCategories.length > 0) {
    result.sort((a, b) => {
      const aInFavorite = a.category && favoriteCategories.includes(a.category);
      const bInFavorite = b.category && favoriteCategories.includes(b.category);
      
      if (aInFavorite && !bInFavorite) return -1;
      if (!aInFavorite && bInFavorite) return 1;
      return 0;
    });
  }
  
  // Filter out disliked products
  if (dislikedProductIds && dislikedProductIds.length > 0) {
    result = result.filter(r => !dislikedProductIds.includes(r.id));
  }
  
  return result;
};

// Helper to simulate an API call for recommendations
export const simulateRecommendationApiCall = (
  recommendations: ProductRecommendation[],
  limit: number
): Promise<ProductRecommendation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recommendations.slice(0, limit));
    }, 300); // Add a small delay to simulate an API call
  });
};

// Helper to log view events to localStorage
export const logRecommendationViewEvent = (event: RecommendationClickEvent) => {
  // Log the view event
  console.log("Recommendation viewed:", event);
  
  // Store view event in localStorage for analytics
  const viewEvents = JSON.parse(localStorage.getItem('recommendation_views') || '[]');
  viewEvents.push(event);
  localStorage.setItem('recommendation_views', JSON.stringify(viewEvents));
};
