
import { mockProducts, productCategories } from "@/data/mockProducts";
import { ProductRecommendation, RecommendationSource } from "@/types/recommendation";
import { CartItem } from "@/types/cart";

// Key for storing viewed products in localStorage
export const VIEWED_PRODUCTS_KEY = 'viewed_products';

/**
 * Generates product recommendations based on a specific product
 */
export const getSimilarProductRecommendations = (productId: number): ProductRecommendation[] => {
  const product = mockProducts.find(p => p.id === productId);
  if (!product || !product.category) return [];

  // Find products in the same category
  const similarCategoryIds = productCategories[product.category] || [];
  
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

/**
 * Generates recommendations based on viewed products
 */
export const getViewedBasedRecommendations = (
  viewedProducts: number[], 
  purchasedIds: number[]
): ProductRecommendation[] => {
  const recommendations: ProductRecommendation[] = [];
  
  if (viewedProducts.length > 0) {
    const recentViewedIds = viewedProducts.slice(0, 3); // Get the 3 most recently viewed products
    
    for (const viewedId of recentViewedIds) {
      const viewedProduct = mockProducts.find(p => p.id === viewedId);
      if (!viewedProduct || !viewedProduct.category) continue;
      
      // Find products in the same category as viewed products
      const categoryIds = productCategories[viewedProduct.category] || [];
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
            confidence: calculateSimilarityConfidence(p, viewedProduct),
          }
        }))
        .slice(0, 2); // Limit to 2 recommendations per viewed product
      
      recommendations.push(...similarProducts);
    }
  }
  
  return recommendations;
};

/**
 * Calculates similarity confidence between two products
 * This is a more sophisticated algorithm that takes into account
 * category, price range, and other factors
 */
const calculateSimilarityConfidence = (product1: any, product2: any): number => {
  let score = 0.75; // Base confidence
  
  // Boost score if same category
  if (product1.category === product2.category) {
    score += 0.1;
  }
  
  // Adjust based on price similarity (products with similar prices get higher confidence)
  const priceDiff = Math.abs(product1.price - product2.price);
  const priceRange = Math.max(product1.price, product2.price) * 0.2; // 20% of the higher price
  
  if (priceDiff < priceRange) {
    score += 0.05;
  }
  
  // Cap at 0.95 maximum
  return Math.min(score, 0.95);
};

/**
 * Gets trending product recommendations
 */
export const getTrendingRecommendations = (
  viewedProducts: number[],
  existingRecommendations: ProductRecommendation[],
  purchasedIds: number[],
  limit: number
): ProductRecommendation[] => {
  const existingIds = existingRecommendations.map(r => r.id);
  const usedIds = [...viewedProducts, ...purchasedIds, ...existingIds];
  
  return mockProducts
    .filter(p => p.isNew && !usedIds.includes(p.id))
    .map(p => ({
      ...p,
      source: {
        type: 'trending' as const,
        confidence: 0.65,
      }
    }))
    .slice(0, limit);
};

/**
 * Gets random product recommendations to fill out any remaining slots
 */
export const getRandomRecommendations = (
  viewedProducts: number[],
  existingRecommendations: ProductRecommendation[],
  purchasedIds: number[],
  limit: number
): ProductRecommendation[] => {
  const existingIds = existingRecommendations.map(r => r.id);
  const usedIds = [...viewedProducts, ...purchasedIds, ...existingIds];
  
  return mockProducts
    .filter(p => !usedIds.includes(p.id))
    .sort(() => Math.random() - 0.5) // Shuffle
    .map(p => ({
      ...p,
      source: {
        type: 'similar' as const,
        confidence: 0.5,
      }
    }))
    .slice(0, limit);
};

/**
 * Collaborative filtering based on user purchase history
 * Enhanced version with more sophisticated matching
 */
export const getCollaborativeRecommendations = (
  purchasedItems: CartItem[],
  viewedProducts: number[]
): ProductRecommendation[] => {
  // In a real app, this would use actual collaborative filtering algorithms
  // For now, we'll use a more sophisticated approach based on purchase patterns
  
  const purchasedIds = purchasedItems.map(item => item.id);
  
  // No purchase history
  if (purchasedIds.length === 0) {
    return [];
  }
  
  // Find categories of purchased items
  const purchasedCategories = new Set<string>();
  
  // Find categories of purchased items
  purchasedItems.forEach(item => {
    const product = mockProducts.find(p => p.id === item.id);
    if (product?.category) {
      purchasedCategories.add(product.category);
    }
  });
  
  // Find products in the same categories that haven't been purchased or viewed
  const recommendations: ProductRecommendation[] = [];
  
  Array.from(purchasedCategories).forEach(category => {
    const categoryIds = productCategories[category] || [];
    const categoryProducts = mockProducts
      .filter(p => 
        categoryIds.includes(p.id) && 
        !purchasedIds.includes(p.id) &&
        !viewedProducts.includes(p.id) &&
        !recommendations.some(r => r.id === p.id)
      )
      .map(p => ({
        ...p,
        source: {
          type: 'collaborative' as const,
          confidence: 0.8,
        }
      }))
      .slice(0, 2); // Limit to 2 recommendations per category
    
    recommendations.push(...categoryProducts);
  });
  
  // Add "purchased together" recommendations
  const purchasedTogetherRecommendations = mockProducts
    .filter(p => 
      !purchasedIds.includes(p.id) &&
      !viewedProducts.includes(p.id) &&
      !recommendations.some(r => r.id === p.id) &&
      // Simple algorithm to determine "purchased together" - in a real app this would be more sophisticated
      Math.random() > 0.7 // Randomly select some products for demo purposes
    )
    .map(p => ({
      ...p,
      source: {
        type: 'purchased' as const,
        confidence: 0.75,
      }
    }))
    .slice(0, 2);
  
  recommendations.push(...purchasedTogetherRecommendations);
  
  return recommendations.slice(0, 4); // Limit to 4 total
};

/**
 * Gets seasonal recommendations
 */
export const getSeasonalRecommendations = (
  viewedProducts: number[],
  existingRecommendations: ProductRecommendation[],
  purchasedIds: number[],
  limit: number
): ProductRecommendation[] => {
  const existingIds = existingRecommendations.map(r => r.id);
  const usedIds = [...viewedProducts, ...purchasedIds, ...existingIds];
  
  // Determine current season
  const now = new Date();
  const month = now.getMonth(); // 0-11
  
  let seasonalCategory: string;
  
  // Simple season detection
  if (month >= 2 && month <= 4) {
    seasonalCategory = "Spring"; // Spring
  } else if (month >= 5 && month <= 7) {
    seasonalCategory = "Summer"; // Summer
  } else if (month >= 8 && month <= 10) {
    seasonalCategory = "Fall"; // Fall/Autumn
  } else {
    seasonalCategory = "Winter"; // Winter
  }
  
  // For demo purposes, just return some products and label them as seasonal
  return mockProducts
    .filter(p => !usedIds.includes(p.id))
    .sort(() => Math.random() - 0.5) // Shuffle
    .map(p => ({
      ...p,
      source: {
        type: 'seasonal' as const,
        confidence: 0.7,
      }
    }))
    .slice(0, limit);
};
