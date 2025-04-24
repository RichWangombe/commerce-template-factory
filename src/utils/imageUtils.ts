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
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop", // Laptop primary image
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop", // Laptop side view
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1600&auto=format&fit=crop", // Laptop with code
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",  // Laptop on desk
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",  // Closeup of laptop keyboard
      "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=1600&auto=format&fit=crop"   // Laptop with coffee
    ],
    // Smartphone X (ID: 1)
    1: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop", // Smartphone front
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1600&auto=format&fit=crop", // Phone with apps
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1600&auto=format&fit=crop", // Phone on table
      "https://images.unsplash.com/photo-1550367083-9fa5bee3b3c7?q=80&w=1600&auto=format&fit=crop",    // Phone in hand
      "https://images.unsplash.com/photo-1570101945621-461a3b082ba2?q=80&w=1600&auto=format&fit=crop", // Hand holding smartphone
      "https://images.unsplash.com/photo-1616410011236-7a42121dd981?q=80&w=1600&auto=format&fit=crop"  // Smartphone against colored background
    ],
    // Digital Camera (ID: 18)
    18: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop", // Camera front
      "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=1600&auto=format&fit=crop", // Camera back
      "https://images.unsplash.com/photo-1579535984712-901e7892ee30?q=80&w=1600&auto=format&fit=crop", // Camera detail
      "https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=1600&auto=format&fit=crop",    // Camera in use
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1600&auto=format&fit=crop", // Camera lens closeup
      "https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=1600&auto=format&fit=crop"  // Camera on tripod
    ],
    // Camera Drone (ID: 17)
    17: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1600&auto=format&fit=crop", // Drone flying
      "https://images.unsplash.com/photo-1580637250481-b78db3e4f235?q=80&w=1600&auto=format&fit=crop", // Drone close-up
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1600&auto=format&fit=crop", // Drone controller
      "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=1600&auto=format&fit=crop", // Drone POV
      "https://images.unsplash.com/photo-1508444845599-5c89863b1c90?q=80&w=1600&auto=format&fit=crop", // Drone in flight over landscape
      "https://images.unsplash.com/photo-1524143986875-3b098d911b72?q=80&w=1600&auto=format&fit=crop"  // Person holding drone
    ],
    // Gaming Laptop (ID: 11)
    11: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1600&auto=format&fit=crop", // Gaming laptop front
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1600&auto=format&fit=crop", // RGB keyboard
      "https://images.unsplash.com/photo-1593642702821-c8e775f4e811?q=80&w=1600&auto=format&fit=crop", // Gaming laptop side
      "https://images.unsplash.com/photo-1526657782461-9fe13402a841?q=80&w=1600&auto=format&fit=crop", // Gaming laptop with game
      "https://images.unsplash.com/photo-1593642634524-b40b5baae6bb?q=80&w=1600&auto=format&fit=crop", // Laptop with vibrant lighting
      "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=1600&auto=format&fit=crop"  // Gaming setup with RGB
    ],
    // Smart TV (ID: 19)
    19: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1600&auto=format&fit=crop", // TV front view
      "https://images.unsplash.com/photo-1539786174672-1517a7141a3e?q=80&w=1600&auto=format&fit=crop", // TV in living room
      "https://images.unsplash.com/photo-1558126319-c9feecbf57ee?q=80&w=1600&auto=format&fit=crop", // TV close-up
      "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?q=80&w=1600&auto=format&fit=crop", // Remote control
      "https://images.unsplash.com/photo-1600877977739-c514abceb4cc?q=80&w=1600&auto=format&fit=crop", // TV in modern living room
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1600&auto=format&fit=crop"  // TV on wall
    ],
    // Premium Headphones (ID: 23)
    23: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1600&auto=format&fit=crop", // Headphones front
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop", // Headphones side
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1600&auto=format&fit=crop", // Headphones detail
      "https://images.unsplash.com/photo-1520170350707-b2c36f0412e4?q=80&w=1600&auto=format&fit=crop", // Headphones in use
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1600&auto=format&fit=crop", // Wireless headphones
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1600&auto=format&fit=crop"  // Headphones on wooden surface
    ],
    // Bluetooth Speaker (ID: 6)
    6: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1600&auto=format&fit=crop", // Front view
      "https://images.unsplash.com/photo-1589491106922-a8c2ca727f3c?q=80&w=1600&auto=format&fit=crop", // Side view
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?q=80&w=1600&auto=format&fit=crop", // In use
      "https://images.unsplash.com/photo-1563330232-57114bb0823c?q=80&w=1600&auto=format&fit=crop", // Detail
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1600&auto=format&fit=crop", // Outdoor speaker use
      "https://images.unsplash.com/photo-1504903271097-d7e7c7f5f7ad?q=80&w=1600&auto=format&fit=crop"  // Portable speaker
    ],
    // Gaming Headset (ID: 12)
    12: [
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1600&auto=format&fit=crop", // Headset front
      "https://images.unsplash.com/photo-1615582631056-a2ed95fadcd5?q=80&w=1600&auto=format&fit=crop", // Headset side
      "https://images.unsplash.com/photo-1579435728642-22e31ba4953d?q=80&w=1600&auto=format&fit=crop", // Headset close-up
      "https://images.unsplash.com/photo-1627331540354-98844162ab70?q=80&w=1600&auto=format&fit=crop", // Headset in use
      "https://images.unsplash.com/photo-1618329340733-5b29bd530d37?q=80&w=1600&auto=format&fit=crop", // Gaming headset on desk
      "https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=1600&auto=format&fit=crop"  // RGB gaming headset
    ],
    // Gaming Mouse (ID: 25)
    25: [
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?q=80&w=1600&auto=format&fit=crop", // Mouse top view
      "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?q=80&w=1600&auto=format&fit=crop", // Mouse side
      "https://images.unsplash.com/photo-1586349906319-8d0595d033e4?q=80&w=1600&auto=format&fit=crop", // Mouse in use
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1600&auto=format&fit=crop", // Mouse detail
      "https://images.unsplash.com/photo-1613141736279-418d3500463f?q=80&w=1600&auto=format&fit=crop", // RGB gaming mouse
      "https://images.unsplash.com/photo-1603045836310-2c91d87909df?q=80&w=1600&auto=format&fit=crop"  // Gaming mouse pad and mouse
    ],
    // Gaming Keyboard (ID: 26)
    26: [
      "https://images.unsplash.com/photo-1595044426077-d36d9236d067?q=80&w=1600&auto=format&fit=crop", // Keyboard top view
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1600&auto=format&fit=crop", // RGB lighting
      "https://images.unsplash.com/photo-1576521096592-f8dd7cfbcf7e?q=80&w=1600&auto=format&fit=crop", // Keyboard side
      "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=1600&auto=format&fit=crop", // Keys detail
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1600&auto=format&fit=crop", // Close-up of mechanical keys
      "https://images.unsplash.com/photo-1588495752527-77d65c21f7cd?q=80&w=1600&auto=format&fit=crop"  // RGB keyboard from angle
    ],
    // Gaming Chair (ID: 27)
    27: [
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1600&auto=format&fit=crop", // Chair front
      "https://images.unsplash.com/photo-1603101267760-c68cc7680f44?q=80&w=1600&auto=format&fit=crop", // Chair side
      "https://images.unsplash.com/photo-1636099926134-28a906e5e5f5?q=80&w=1600&auto=format&fit=crop", // Detail
      "https://images.unsplash.com/photo-1572545884955-6acdcf5ed887?q=80&w=1600&auto=format&fit=crop", // In gaming setup
      "https://images.unsplash.com/photo-1626217477618-204329492b8f?q=80&w=1600&auto=format&fit=crop", // Gaming chair in room
      "https://images.unsplash.com/photo-1603075433767-e8848dd31951?q=80&w=1600&auto=format&fit=crop"  // Gaming chair with lighting
    ],
    // Gaming Console (ID: 28)
    28: [
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1600&auto=format&fit=crop", // Console front
      "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=1600&auto=format&fit=crop", // Console setup
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=1600&auto=format&fit=crop", // Controller
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop", // Gaming session
      "https://images.unsplash.com/photo-1580327344541-d81dc8010462?q=80&w=1600&auto=format&fit=crop", // Console on TV stand
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1600&auto=format&fit=crop"  // Gaming setup in dark room
    ],
    // Tablet Pro (ID: 29)
    29: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589739900875-8453b348aa0e?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1537434096881-d4c1d0f778fc?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1623749549650-4531585e8ffc?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1569770218135-bea267ed7e84?q=80&w=1600&auto=format&fit=crop"
    ],
    // Wireless Earbuds (ID: 30)
    30: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590658099299-a0e8c81bd0b6?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631435382959-3a3d0e41d331?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1623998021446-45cd9b269c95?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600375226700-5c934bca4e4f?q=80&w=1600&auto=format&fit=crop"
    ],
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

  // Fallback to category-based images based on the updated categories
  if (category) {
    if (category.toLowerCase().includes('smartphone')) {
      return sampleProductImages.smartphones;
    } else if (category.toLowerCase().includes('laptop')) {
      return sampleProductImages.laptops;
    } else if (category.toLowerCase().includes('wearable')) {
      return sampleProductImages.wearables;
    } else if (category.toLowerCase().includes('audio')) {
      return sampleProductImages.audio;
    } else if (category.toLowerCase().includes('tablet')) {
      return sampleProductImages.tablets;
    } else if (category.toLowerCase().includes('gaming')) {
      return sampleProductImages.gaming;
    } else if (category.toLowerCase().includes('photo')) {
      return sampleProductImages.photography;
    } else if (
      category.toLowerCase().includes('accessory') ||
      category.toLowerCase().includes('accessories')
    ) {
      return sampleProductImages.accessories;
    } else if (
      category.toLowerCase().includes('home') ||
      category.toLowerCase().includes('smart')
    ) {
      return sampleProductImages.home;
    }
  }

  // Final fallback to default images
  return sampleProductImages.default;
};

/**
 * Get images based on product category
 * @param category The product category
 * @returns Array of image URLs for the category
 */
export const getImagesByCategory = (category?: string): string[] => {
  if (!category) return [DEFAULT_IMAGE];

  return sampleProductImages[category.toLowerCase()] || [DEFAULT_IMAGE];
};


// Higher quality sample product images for fallback by category
export const sampleProductImages = {
  smartphones: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550367083-9fa5bee3b3c7?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570101945621-461a3b082ba2?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598327105854-2cd5459bce82?q=80&w=1600&auto=format&fit=crop"
  ],
  laptops: [
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1602080858428-57174f9431cf?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?q=80&w=1600&auto=format&fit=crop"
  ],
  wearables: [
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617043786394-ae546b682959?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1575311373937-040b8e1fd1fe?q=80&w=1600&auto=format&fit=crop`
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617043786394-ae546b682959?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop"
  ],
  audio: [
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589491106922-a8c2ca727f3c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584670747497-9ecfa6b95221?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1600&auto=format&fit=crop"
  ],
  tablets: [
    "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1632882399289-34fbbb064125?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589739900875-8453b348aa0e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561565331-fa89226a747f?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590005024862-6b67679a29fb?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1623126908029-58cb08a2b272?q=80&w=1600&auto=format&fit=crop"
  ],
  gaming: [
    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591105575639-a334978de1a3?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1591839237052-d5b557a8010f?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616876195047-522508341e27?q=80&w=1600&auto=format&fit=crop"
  ],
  photography: [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1617005082133-5c61c31d949b?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564466809058-bf4114d55352?q=80&w=1600&auto=format&fit=crop"
  ],
  accessories: [
    "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1601593346740-925612772163?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618760439047-796adbd32877?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1627831790908-22753cea183e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618330834871-dd22e2c23f39?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1625378778132-f7d487aa5354?q=80&w=1600&auto=format&fit=crop"
  ],
  home: [
    "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585771362212-e3f6e61668f4?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556156653-e5a7674c6d05?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556227702-d1e4e7e5c5eb?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600877977739-c514abceb4cc?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop"
  ],
  default: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533022139389-e3c0313cdbf1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1600&auto=format&fit=crop"
  ]
};

import { sampleProductImages } from '@/data/mockProducts';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=800&auto=format&fit=crop";

export const getImageFallback = (category?: string): string => {
  if (!category) return DEFAULT_IMAGE;

  const categoryImages = sampleProductImages[category.toLowerCase()] || [];
  return categoryImages[0] || DEFAULT_IMAGE;
};

export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

export const getProductImage = async (productUrl: string, category?: string): Promise<string> => {
  if (!productUrl || !(await validateImageUrl(productUrl))) {
    return getImageFallback(category);
  }
  return productUrl;
};

export const getImagesByCategory = (category?: string): string[] => {
  if (!category) return [DEFAULT_IMAGE];
  return sampleProductImages[category.toLowerCase()] || [DEFAULT_IMAGE];
};