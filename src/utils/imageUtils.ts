
import { getHighQualityProductImages } from '@/utils/recommendation/imageUtils';

// Validation function to check if an image URL is valid
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  // Check if it's a valid URL format
  try {
    new URL(url);
    return true;
  } catch {
    // If not a valid URL, check if it's a relative path
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
};

// Default product image for fallback
export const getDefaultProductImage = (): string => {
  return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center";
};

// Get product-specific images
export const getProductSpecificImages = (productId: number): string[] => {
  // Use the recommendation utils for getting product-specific images
  return getHighQualityProductImages(productId);
};

// Process product images with fallbacks
export const processProductImages = (images: string[], productId?: number, category?: string): string[] => {
  const validImages = images.filter(isValidImageUrl);
  
  if (validImages.length > 0) {
    return validImages;
  }
  
  // Try to get product-specific images
  if (productId) {
    const specificImages = getProductSpecificImages(productId);
    if (specificImages.length > 0) {
      return specificImages;
    }
  }
  
  // Return category-based images or default
  return getHighQualityProductImages(productId || 1, category);
};
