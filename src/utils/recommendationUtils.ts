
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
  // Enhanced collection of high-quality HD images for recommendations, with more diversity
  const hdImages = {
    laptops: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1600&auto=format&fit=crop"
    ],
    smartphones: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1600&auto=format&fit=crop"
    ],
    headphones: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618329340733-5b29bd530d37?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=1600&auto=format&fit=crop"
    ],
    cameras: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617005082133-5c61c31d949b?q=80&w=1600&auto=format&fit=crop"
    ],
    wearables: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617043786394-ae546b682959?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd1fe?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1600&auto=format&fit=crop" 
    ],
    speakers: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589491106922-a8c2ca727f3c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563330232-57114bb0823c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1600&auto=format&fit=crop"
    ],
    televisions: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539786174672-1517a7141a3e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558126319-c9feecbf57ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611846199341-db8be085191e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494173853739-c21f58b16055?q=80&w=1600&auto=format&fit=crop"
    ],
    tablets: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589739900875-8453b348aa0e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527698266440-12104e498b76?q=80&w=1600&auto=format&fit=crop"
    ],
    gaming: [
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop"
    ],
    accessories: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600084893234-6674bf0b9809?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563208985-2c5fa2939622?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625378778132-f7d487aa5354?q=80&w=1600&auto=format&fit=crop"
    ],
    default: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1600&auto=format&fit=crop"
    ]
  };
  
  // Map product categories to image collections - Enhanced with more category detection
  const getImagesByCategory = (category?: string) => {
    if (!category) return hdImages.default;
    
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('laptop') || lowerCategory.includes('computer')) return hdImages.laptops;
    if (lowerCategory.includes('phone') || lowerCategory.includes('smartphone')) return hdImages.smartphones;
    if (lowerCategory.includes('headphone') || lowerCategory.includes('earphone') || lowerCategory.includes('headset')) return hdImages.headphones;
    if (lowerCategory.includes('camera') || lowerCategory.includes('photo')) return hdImages.cameras;
    if (lowerCategory.includes('watch') || lowerCategory.includes('wearable') || lowerCategory.includes('tracker')) return hdImages.wearables;
    if (lowerCategory.includes('speaker') || lowerCategory.includes('sound')) return hdImages.speakers;
    if (lowerCategory.includes('tv') || lowerCategory.includes('television')) return hdImages.televisions;
    if (lowerCategory.includes('tablet') || lowerCategory.includes('ipad')) return hdImages.tablets;
    if (lowerCategory.includes('gaming') || lowerCategory.includes('game')) return hdImages.gaming;
    if (lowerCategory.includes('accessory') || lowerCategory.includes('accessories')) return hdImages.accessories;
    
    return hdImages.default;
  };
  
  // Get product-specific images if available
  const productSpecificImages = getProductSpecificImages(productId);
  if (productSpecificImages.length > 0) {
    return productSpecificImages;
  }
  
  // Return appropriate HD images based on product category
  return getImagesByCategory(category);
};

/**
 * Get product-specific images for important products
 */
const getProductSpecificImages = (productId: number): string[] => {
  // Product-specific image mappings for popular products
  const productImages: Record<number, string[]> = {
    // Premium Smartphone (ID: 1)
    1: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1600&auto=format&fit=crop"
    ],
    // Smartwatch (ID: 2) 
    2: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=1600&auto=format&fit=crop"
    ],
    // Laptop (ID: 5)
    5: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1600&auto=format&fit=crop"
    ],
    // Bluetooth Speaker (ID: 6)
    6: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589491106922-a8c2ca727f3c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=1600&auto=format&fit=crop"
    ],
    // Fitness Tracker (ID: 7)
    7: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd1fe?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617043786394-ae546b682959?q=80&w=1600&auto=format&fit=crop"
    ],
    // High-end Tablet (ID: 10)
    10: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589739900875-8453b348aa0e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1600&auto=format&fit=crop"
    ],
    // Gaming Laptop (ID: 11)
    11: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593642702821-c8e775f4e811?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop"
    ],
    // Camera Drone (ID: 17)
    17: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580637250481-b78db3e4f235?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1600&auto=format&fit=crop"
    ],
    // Digital Camera (ID: 18)
    18: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=1600&auto=format&fit=crop"
    ],
    // Smart TV (ID: 19)
    19: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539786174672-1517a7141a3e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558126319-c9feecbf57ee?q=80&w=1600&auto=format&fit=crop"
    ],
    // Premium Headphones (ID: 23)
    23: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1600&auto=format&fit=crop"
    ]
  };
  
  return productImages[productId] || [];
};

/**
 * Enhance recommendation products with high-quality images
 */
export const enhanceRecommendationImages = (recommendations: ProductRecommendation[]): ProductRecommendation[] => {
  return recommendations.map(product => {
    const hdImages = getHighQualityProductImages(product.id, product.category);
    
    // Mix up the images for more variety - get a random HD image from the category collection
    const randomIndex = Math.floor(Math.random() * hdImages.length);
    const enhancedImage = hdImages.length > 0 ? hdImages[randomIndex] : product.image;
    
    return {
      ...product,
      image: enhancedImage
    };
  });
};
