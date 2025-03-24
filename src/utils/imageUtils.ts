
/**
 * Image utility functions for validating and processing images across the application
 */

/**
 * Validates if a URL is a valid image URL
 * @param url The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidImageUrl = (url?: string): boolean => {
  if (!url) return false;
  if (url.trim() === '') return false;
  if (url.includes('undefined')) return false;
  if (url === '/placeholder.svg') return false;
  
  // Check if image URL has valid format
  return (
    url.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i) !== null || 
    url.startsWith('data:image/') ||
    url.startsWith('http')
  );
};

/**
 * Get a default fallback image URL
 * @returns A reliable fallback image URL
 */
export const getDefaultProductImage = (): string => {
  return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop";
};

/**
 * Get product-specific images based on product ID
 * @param productId The product ID
 * @returns Array of appropriate image URLs for the product
 */
export const getProductSpecificImages = (productId: number): string[] => {
  // Product-specific image mappings
  const productImages: Record<number, string[]> = {
    // Laptop Pro (ID: 5)
    5: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1600&auto=format&fit=crop", // Laptop primary image
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop", // Laptop side view
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1600&auto=format&fit=crop", // Laptop with code
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop"  // Laptop on desk
    ],
    // Smartphone X (ID: 1)
    1: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1600&auto=format&fit=crop", // Smartphone front
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1600&auto=format&fit=crop", // Phone with apps
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1600&auto=format&fit=crop", // Phone on table
      "https://images.unsplash.com/photo-1550367083-9fa5bee3b3c7?q=80&w=1600&auto=format&fit=crop"     // Phone in hand
    ],
    // Smartwatch Pro (ID: 2)
    2: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1600&auto=format&fit=crop", // Smartwatch
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1600&auto=format&fit=crop", // Watch on wrist
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=1600&auto=format&fit=crop", // Watch display
      "https://images.unsplash.com/photo-1617043786394-ae546b682959?q=80&w=1600&auto=format&fit=crop"  // Watch functions
    ],
    // Wireless Earbuds (ID: 3)
    3: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=1600&auto=format&fit=crop", // Earbuds in case
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1600&auto=format&fit=crop", // Single earbud
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1600&auto=format&fit=crop", // Earbuds case
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1600&auto=format&fit=crop"  // Earbuds with phone
    ],
    // Tablet Ultra (ID: 4)
    4: [
      "https://images.unsplash.com/photo-1589739900875-8453b348aa0e?q=80&w=1600&auto=format&fit=crop", // Tablet on stand
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=1600&auto=format&fit=crop", // Tablet closeup
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600&auto=format&fit=crop", // Using tablet
      "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?q=80&w=1600&auto=format&fit=crop"  // Tablet flat
    ],
    // Bluetooth Speaker (ID: 6)
    6: [
      "https://images.unsplash.com/photo-1547393947-e8d9f26a39f4?q=80&w=1600&auto=format&fit=crop", // Bluetooth speaker
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1600&auto=format&fit=crop", // Speaker with phone
      "https://images.unsplash.com/photo-1589491106922-a8c2ca727f3c?q=80&w=1600&auto=format&fit=crop", // Portable speaker
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1600&auto=format&fit=crop"     // Speaker detail
    ],
    // Fitness Tracker (ID: 7)
    7: [
      "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=1600&auto=format&fit=crop", // Fitness tracker
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?q=80&w=1600&auto=format&fit=crop", // Tracker on wrist
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop", // Activity tracking
      "https://images.unsplash.com/photo-1510771463146-e89e6e86560e?q=80&w=1600&auto=format&fit=crop"  // Workout with tracker
    ],
    // Home Speaker System (ID: 8)
    8: [
      "https://images.unsplash.com/photo-1603057002111-906f49ebbd48?q=80&w=1600&auto=format&fit=crop", // Speaker system
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1600&auto=format&fit=crop", // Home audio
      "https://images.unsplash.com/photo-1593055454527-731c70783826?q=80&w=1600&auto=format&fit=crop", // Living room speakers
      "https://images.unsplash.com/photo-1558537348-c0f8e733989d?q=80&w=1600&auto=format&fit=crop"     // Audio setup
    ]
  };
  
  return productImages[productId] || [];
};

/**
 * Process an array of images to ensure it has valid images
 * @param images Array of image URLs to process
 * @param productId Optional product ID for product-specific images
 * @param category Optional product category for category-specific fallbacks
 * @returns Array of valid image URLs
 */
export const processProductImages = (
  images: string[], 
  productId?: number,
  category?: string
): string[] => {
  // Filter valid images from the provided array
  const validImages = images.filter(img => isValidImageUrl(img));
  
  // If we have valid images, return them
  if (validImages.length > 0) {
    return validImages;
  }
  
  // If product ID is provided, try to get product-specific images
  if (productId) {
    const specificImages = getProductSpecificImages(productId);
    if (specificImages.length > 0) {
      return specificImages;
    }
  }
  
  // Fallback to category-based images
  if (category) {
    if (category.toLowerCase().includes('electronics')) {
      return sampleProductImages.electronics;
    } else if (
      category.toLowerCase().includes('clothing') || 
      category.toLowerCase().includes('fashion')
    ) {
      return sampleProductImages.clothing;
    } else if (
      category.toLowerCase().includes('furniture') || 
      category.toLowerCase().includes('home')
    ) {
      return sampleProductImages.furniture;
    }
  }
  
  // Final fallback to default images
  return sampleProductImages.default;
};

// Higher quality sample product images for fallback by category
export const sampleProductImages = {
  electronics: [
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1600&auto=format&fit=crop"
  ],
  clothing: [
    "https://images.unsplash.com/photo-1578632767657-b96c3106ffad?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=1600&auto=format&fit=crop"
  ],
  furniture: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1600&auto=format&fit=crop"
  ],
  default: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1600&auto=format&fit=crop"
  ]
};
