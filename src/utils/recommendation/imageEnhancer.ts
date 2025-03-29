
import { ProductRecommendation } from "@/types/recommendation";
import { 
  getHighQualityProductImages, 
  getTrendingImages, 
  getAdditionalHdImages 
} from './imageUtils';

/**
 * Enhance recommendation products with high-quality images
 * Updated to ensure trending products always have HD images
 */
export const enhanceRecommendationImages = (recommendations: ProductRecommendation[]): ProductRecommendation[] => {
  // Create a map to track used images for each category to ensure variety
  const usedImagesMap: Record<string, Set<string>> = {};
  
  // Get trending and additional HD images
  const trendingImages = getTrendingImages();
  const additionalHdImages = getAdditionalHdImages();
  
  return recommendations.map((product, index) => {
    // For trending products, prioritize using our special trending images
    if (product.source.type === 'trending') {
      // Use modulo operation to cycle through trending images if we have more trending products than images
      const trendingImageIndex = index % trendingImages.length;
      return {
        ...product,
        image: trendingImages[trendingImageIndex]
      };
    }
    
    // For other products, continue with the existing logic but with improved fallbacks
    // Get HD images for this product's category or by product ID
    const hdImages = getHighQualityProductImages(product.id, product.category);
    
    // Add our additional HD images to ensure we always have options
    const allImages = [...hdImages, ...additionalHdImages];
    
    // Initialize category in used images map if needed
    const category = product.category?.toLowerCase() || 'default';
    if (!usedImagesMap[category]) {
      usedImagesMap[category] = new Set();
    }
    
    // Try to find an image that hasn't been used yet for this category
    const availableImages = allImages.filter(img => !usedImagesMap[category].has(img));
    
    // If we have unused images, pick one randomly
    let enhancedImage = product.image;
    if (availableImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableImages.length);
      enhancedImage = availableImages[randomIndex];
      usedImagesMap[category].add(enhancedImage);
    } else if (allImages.length > 0) {
      // If all images have been used, just pick a random one
      const randomIndex = Math.floor(Math.random() * allImages.length);
      enhancedImage = allImages[randomIndex];
    }
    
    // Ensure we don't return invalid images
    if (!enhancedImage || enhancedImage.includes('undefined') || enhancedImage === '/placeholder.svg') {
      // More robust fallback using modulo to ensure we always get a valid image
      const fallbackIndex = (product.id + index) % additionalHdImages.length;
      enhancedImage = additionalHdImages[fallbackIndex];
    }
    
    return {
      ...product,
      image: enhancedImage
    };
  });
};
