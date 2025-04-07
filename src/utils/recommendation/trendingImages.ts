/**
 * This file contains trending and additional high-quality images
 * Separated from main imageUtils.ts for better organization
 */

// Helper function to get trending images for the app
export const getTrendingImages = (): string[] => [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1600&auto=format&fit=crop",
];

// Additional HD images for fallback and variety
export const getAdditionalHdImages = (): string[] => {
  return [
    "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop"
  ];
};