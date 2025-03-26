
// Main export file that combines all product data
import { MockProduct } from "./types/productTypes";
import { smartphoneProducts, tabletProducts, laptopProducts } from "./products/electronicsProducts";
import { audioProducts } from "./products/audioProducts";
import { wearableProducts } from "./products/wearableProducts";
import { accessoriesProducts } from "./products/accessoriesProducts";
import { gamingProducts } from "./products/gamingProducts";
import { photographyProducts } from "./products/photographyProducts";
import { homeProducts } from "./products/homeProducts";
import { productCategories } from "./categoryMappings";

// Combine all product arrays into one
export const mockProducts: MockProduct[] = [
  ...smartphoneProducts,
  ...tabletProducts,
  ...laptopProducts,
  ...audioProducts,
  ...wearableProducts,
  ...accessoriesProducts,
  ...gamingProducts,
  ...photographyProducts,
  ...homeProducts
];

// Re-export the category mappings
export { productCategories };
