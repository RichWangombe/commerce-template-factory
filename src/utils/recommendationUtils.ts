
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
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593642702821-c8e775f4e811?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625058506141-83bde4b8c91a?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526657782461-9fe13402a841?q=80&w=1600&auto=format&fit=crop"
    ],
    smartphones: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605170439002-90845e8c0137?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1600&auto=format&fit=crop"
    ],
    headphones: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618329340733-5b29bd530d37?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618330834871-dd22e2c23f39?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?q=80&w=1600&auto=format&fit=crop"
    ],
    cameras: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617005082133-5c61c31d949b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579535984712-901e7892ee30?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1600&auto=format&fit=crop"
    ],
    wearables: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617043786394-ae546b682959?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd17fe?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1600&auto=format&fit=crop"
    ],
    speakers: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589491106922-a8c2ca727f3c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563330232-57114bb0823c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?q=80&w=1600&auto=format&fit=crop"
    ],
    televisions: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539786174672-1517a7141a3e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558126319-c9feecbf57ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611846199341-db8be085191e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494173853739-c21f58b16055?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601944179066-29b8f7e31d3d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521774971864-62e842046145?q=80&w=1600&auto=format&fit=crop"
    ],
    tablets: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589739900875-8453b348aa0e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527698266440-12104e498b76?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1632882399289-34fbbb064125?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1610664921890-ebad05086414?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=1600&auto=format&fit=crop"
    ],
    gaming: [
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591105575639-a334978de1a3?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1600&auto=format&fit=crop"
    ],
    accessories: [
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600084893234-6674bf0b9809?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563208985-2c5fa2939622?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625378778132-f7d487aa5354?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630480543702-f11de3e0e36b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601593346740-925612772163?q=80&w=1600&auto=format&fit=crop"
    ],
    default: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop"
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
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605170439002-90845e8c0137?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=1600&auto=format&fit=crop"
    ],
    // Smartwatch (ID: 2) 
    2: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1628281321826-6bd856ee5deb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523159839792-1996fd2b764c?q=80&w=1600&auto=format&fit=crop"
    ],
    // Laptop (ID: 5)
    5: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop"
    ],
    // Bluetooth Speaker (ID: 6)
    6: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589491106922-a8c2ca727f3c?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563330232-57114bb0823c?q=80&w=1600&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?q=80&w=1600&auto=format&fit=crop"
    ],
    // Fitness Tracker (ID: 7)
    7: [
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd1fe?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617043786394-ae546b682959?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631981542149-6dde269de00f?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576008931785-8f88da4b2d9e?q=80&w=1600&auto=format&fit=crop"
    ],
    // High-end Tablet (ID: 10)
    10: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589739900875-8453b348aa0e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1537434096881-d4c1d0f778fc?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1623126908029-58cb08a2b272?q=80&w=1600&auto=format&fit=crop"
    ],
    // Gaming Laptop (ID: 11)
    11: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593642702821-c8e775f4e811?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=1600&auto=format&fit=crop"
    ],
    // Camera Drone (ID: 17)
    17: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580637250481-b78db3e4f235?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1570646113386-43b731d4ec00?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527061011048-533e4a50df95?q=80&w=1600&auto=format&fit=crop"
    ],
    // Digital Camera (ID: 18)
    18: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617464985171-458685217e3a?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617465850446-7e0e2a6b0a08?q=80&w=1600&auto=format&fit=crop"
    ],
    // Smart TV (ID: 19)
    19: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539786174672-1517a7141a3e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558126319-c9feecbf57ee?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1601944179066-29b8f7e31d3d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512446816042-444d641267d4?q=80&w=1600&auto=format&fit=crop"
    ],
    // Premium Headphones (ID: 23)
    23: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520170350707-b2c36f0412e4?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=1600&auto=format&fit=crop"
    ],
    // Gaming Headset (ID: 12)
    12: [
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615582631056-a2ed95fadcd5?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579435728642-22e31ba4953d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1627331540354-98844162ab70?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599132778292-94038882cf01?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625082360241-5f0e43d30030?q=80&w=1600&auto=format&fit=crop"
    ],
    // Gaming Mouse (ID: 25)
    25: [
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586349906319-8d0595d033e4?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603725178625-4023664dff2d?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603045836310-2c91d87909df?q=80&w=1600&auto=format&fit=crop"
    ]
  };
  
  return productImages[productId] || [];
};

/**
 * Enhance recommendation products with high-quality images
 * Updated to ensure trending products always have HD images
 */
export const enhanceRecommendationImages = (recommendations: ProductRecommendation[]): ProductRecommendation[] => {
  // Create a map to track used images for each category to ensure variety
  const usedImagesMap: Record<string, Set<string>> = {};
  
  // Additional HD images to ensure we have plenty of options - expanded with more high quality images
  const additionalHdImages = [
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1600&auto=format&fit=crop", 
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1603145733146-ae562a55031e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1600&auto=format&fit=crop",
    // Adding more guaranteed HD images for trending products
    "https://images.unsplash.com/photo-1661961110372-8a7682543120?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?q=80&w=1600&auto=format&fit=crop"
  ];
  
  // Special HD images specifically for trending products - guaranteed to be visually appealing
  const trendingImages = [
    "https://images.unsplash.com/photo-1600186279796-720bd34978c1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580522154872-fd24ae2f9164?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593508195009-71567a7a104c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1527698266440-12104e498b76?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587033411391-5d9e51cce126?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585565804030-349e12e4f937?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618478594486-c65b899c4936?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610438250910-01cb6a214594?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop"
  ];
  
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
