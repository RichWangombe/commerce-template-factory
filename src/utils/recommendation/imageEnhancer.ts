import { ProductRecommendation } from "@/types/recommendation";
import { 
  getHighQualityProductImages,
  getTrendingImages,
  getAdditionalHdImages
} from './imageUtils';

export const enhanceRecommendationImages = (recommendations: ProductRecommendation[]): ProductRecommendation[] => {
  const trendingImages = getTrendingImages();
  const additionalHdImages = getAdditionalHdImages();

  return recommendations.map((product) => {
    // First try product-specific images
    const specificImages = getProductSpecificImages(product.id);
    if (specificImages.length > 0) {
      return {
        ...product,
        image: specificImages[0]
      };
    }

    // Then try category-based images
    const categoryImages = getImagesByCategory(product.category);
    if (categoryImages.length > 0) {
      return {
        ...product,
        image: categoryImages[0]
      };
    }

    // For trending products, use trending images
    if (product.source?.type === 'trending') {
      const trendingIndex = product.id % trendingImages.length;
      return {
        ...product,
        image: trendingImages[trendingIndex]
      };
    }

    // Use additional HD images as fallback
    if (additionalHdImages.length > 0) {
      const fallbackIndex = product.id % additionalHdImages.length;
      return {
        ...product,
        image: additionalHdImages[fallbackIndex]
      };
    }

    // If all else fails, keep the original image
    return product;
  });
};