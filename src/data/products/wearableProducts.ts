
import { MockProduct } from "../types/productTypes";

// Wearable products: Smartwatches, Fitness Trackers
export const wearableProducts: MockProduct[] = [
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 299,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop",
    category: "Wearable",
    rating: 4.2
  },
  {
    id: 7,
    name: "Fitness Tracker",
    price: 129,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd1fe?q=80&w=800&auto=format&fit=crop",
    category: "Wearable",
    isNew: true,
    rating: 4.3
  }
];
