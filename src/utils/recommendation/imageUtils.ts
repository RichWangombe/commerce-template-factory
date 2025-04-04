import { ProductRecommendation } from "@/types/recommendation";

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
      "https://images.unsplash.com/photo-1575311373937-040b8e1fd1fe?q=80&w=1600&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=1600&auto=format&fit=crop",
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
      "https://images.unsplash.com/photo-1593642634524-b40b5
