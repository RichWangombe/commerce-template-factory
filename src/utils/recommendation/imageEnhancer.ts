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
    // Get product-specific HD images
    const hdImages = getHighQualityProductImages(product.id, product.category);

    // If we have HD images for this specific product, use the first one
    if (hdImages && hdImages.length > 0) {
      return {
        ...product,
        image: hdImages[0]
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