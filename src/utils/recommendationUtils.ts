
import { mockProducts } from "@/data/mockProducts";
import { ProductRecommendation, RecommendationFilter, RecommendationClickEvent } from "@/types/recommendation";

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

/**
 * Simulate an API call to get recommendations
 * This adds a small delay to simulate a network request
 */
export const simulateRecommendationApiCall = async (
  recommendations: ProductRecommendation[],
  limit: number
): Promise<ProductRecommendation[]> => {
  // Add a small delay to simulate an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return a limited number of recommendations
  return recommendations.slice(0, limit);
};

/**
 * Log recommendation view events for analytics
 */
export const logRecommendationViewEvent = (event: RecommendationClickEvent): void => {
  console.log('Recommendation viewed:', event);
  
  // In a real app, this would send data to an analytics service
  // For now, we'll just log to console and local storage
  const viewEvents = JSON.parse(localStorage.getItem('recommendation_views') || '[]');
  viewEvents.push(event);
  localStorage.setItem('recommendation_views', JSON.stringify(viewEvents));
};

/**
 * Get high-quality product images for recommendations
 * This ensures we display beautiful HD images in recommendation sections
 */
export const getHighQualityProductImages = (productId: number, category?: string): string[] => {
  // Collection of high-quality HD images for recommendations
  const hdImages = {
    laptops: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop"
    ],
    smartphones: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1600&auto=format&fit=crop"
    ],
    headphones: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1600&auto=format&fit=crop"
    ],
    cameras: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=1600&auto=format&fit=crop"
    ],
    default: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1600&auto=format&fit=crop"
    ]
  };
  
  // Map product categories to image collections
  const getImagesByCategory = (category?: string) => {
    if (!category) return hdImages.default;
    
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('laptop')) return hdImages.laptops;
    if (lowerCategory.includes('phone')) return hdImages.smartphones;
    if (lowerCategory.includes('headphone') || lowerCategory.includes('audio')) return hdImages.headphones;
    if (lowerCategory.includes('camera') || lowerCategory.includes('photo')) return hdImages.cameras;
    
    return hdImages.default;
  };
  
  // Return appropriate HD images based on product category
  return getImagesByCategory(category);
};

/**
 * Enhance recommendation products with high-quality images
 */
export const enhanceRecommendationImages = (recommendations: ProductRecommendation[]): ProductRecommendation[] => {
  return recommendations.map(product => {
    const hdImages = getHighQualityProductImages(product.id, product.category);
    
    // Use the first HD image or fallback to the existing one
    const enhancedImage = hdImages.length > 0 ? hdImages[0] : product.image;
    
    return {
      ...product,
      image: enhancedImage
    };
  });
};
