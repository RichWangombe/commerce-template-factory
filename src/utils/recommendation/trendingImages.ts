
/**
 * This file contains trending and additional high-quality images
 * Separated from main imageUtils.ts for better organization
 */

// Helper function to get trending images for the app
export const getTrendingImages = (): string[] => {
  return [
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522273500616-6b4757e4c184?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570101945621-945409a6370f?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519834995681-a87f80e96da3?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541807360746-039080941306?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599423423923-43884a1d4783?q=80&w=1600&auto=format&fit=crop"
  ];
};

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
