
import { ProductRecommendation, RecommendationFilter } from "@/types/recommendation";

/**
 * Apply filters to a list of recommendations
 */
export const applyRecommendationFilters = (
  recommendations: ProductRecommendation[],
  filter: RecommendationFilter
): ProductRecommendation[] => {
  let filtered = [...recommendations];
  
  // Filter by recommendation type if specified
  if (filter.types && filter.types.length > 0) {
    filtered = filtered.filter(rec => filter.types!.includes(rec.source.type));
  }
  
  // Filter by category if specified
  if (filter.categories && filter.categories.length > 0) {
    filtered = filtered.filter(rec => 
      rec.category && filter.categories!.includes(rec.category)
    );
  }
  
  // Filter by confidence level if specified
  if (filter.minConfidence) {
    filtered = filtered.filter(rec => rec.source.confidence >= filter.minConfidence!);
  }
  
  return filtered;
};

/**
 * Apply user preferences to recommendations
 */
export const applyUserPreferences = (
  recommendations: ProductRecommendation[],
  favoriteCategories?: string[],
  dislikedProductIds?: number[]
): ProductRecommendation[] => {
  let filtered = [...recommendations];
  
  // Remove disliked products
  if (dislikedProductIds && dislikedProductIds.length > 0) {
    filtered = filtered.filter(rec => !dislikedProductIds.includes(rec.id));
  }
  
  // Sort by favorite categories (if any are specified)
  if (favoriteCategories && favoriteCategories.length > 0) {
    filtered.sort((a, b) => {
      const aInFavorites = a.category && favoriteCategories.includes(a.category) ? 1 : 0;
      const bInFavorites = b.category && favoriteCategories.includes(b.category) ? 1 : 0;
      return bInFavorites - aInFavorites;
    });
  }
  
  return filtered;
};
