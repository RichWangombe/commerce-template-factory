
import { MockProduct } from "../types/productTypes";

// Wearable products: Smartwatches, Fitness Trackers
export const wearableProducts: MockProduct[] = [
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 299,
    image: "https://images.unsplash.com/photo-1617043983671-adaadcaa2460?q=80&w=800&auto=format&fit=crop",
    category: "Wearable",
    rating: 4.2
  },
  {
    id: 7,
    name: "Fitness Tracker",
    price: 129,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=800&auto=format&fit=crop",
    category: "Wearable",
    isNew: true,
    rating: 4.3
  }
];
