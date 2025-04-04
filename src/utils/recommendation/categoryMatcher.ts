
/**
 * This file contains logic to match products to appropriate image categories
 * Separated from main imageUtils.ts for better organization
 */

import { categoryImages } from './imageCategories';

/**
 * Match a product category string to the appropriate image collection
 * Uses fuzzy matching to handle various category names and formats
 */
export const getImagesByCategory = (category?: string): string[] => {
  if (!category) return categoryImages.default;
  
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes('laptop') || lowerCategory.includes('computer')) return categoryImages.laptops;
  if (lowerCategory.includes('phone') || lowerCategory.includes('smartphone')) return categoryImages.smartphones;
  if (lowerCategory.includes('headphone') || lowerCategory.includes('earphone') || lowerCategory.includes('headset')) return categoryImages.headphones;
  if (lowerCategory.includes('camera') || lowerCategory.includes('photo')) return categoryImages.cameras;
  if (lowerCategory.includes('watch') || lowerCategory.includes('wearable') || lowerCategory.includes('tracker')) return categoryImages.wearables;
  if (lowerCategory.includes('speaker') || lowerCategory.includes('sound')) return categoryImages.speakers;
  if (lowerCategory.includes('tv') || lowerCategory.includes('television')) return categoryImages.televisions;
  if (lowerCategory.includes('tablet') || lowerCategory.includes('ipad')) return categoryImages.tablets;
  if (lowerCategory.includes('gaming') || lowerCategory.includes('game')) return categoryImages.gaming;
  if (lowerCategory.includes('accessory') || lowerCategory.includes('accessories')) return categoryImages.accessories;
  
  return categoryImages.default;
};
