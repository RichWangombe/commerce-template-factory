
import { ProductRecommendation } from "@/types/recommendation";
import { categoryImages } from './imageCategories';
import { productSpecificImages } from './productSpecificImages';
import { getTrendingImages, getAdditionalHdImages } from './trendingImages';
import { getImagesByCategory } from './categoryMatcher';

/**
 * Get high-quality product images for recommendations
 * This ensures we display beautiful HD images in recommendation sections
 */
export const getHighQualityProductImages = (productId: number, category?: string): string[] => {
  // Get product-specific images if available
  const specificImages = getProductSpecificImages(productId);
  if (specificImages.length > 0) {
    return specificImages;
  }
  
  // Return appropriate HD images based on product category
  return getImagesByCategory(category);
};

/**
 * Get product-specific images for important products
 */
export const getProductSpecificImages = (productId: number): string[] => {
  return productSpecificImages[productId] || [];
};

// Re-export all image-related utilities from this central file
export {
  getTrendingImages,
  getAdditionalHdImages,
  getImagesByCategory,
  categoryImages,
  productSpecificImages
};
