
import { MockProduct } from "../types/productTypes";

// Smart Home products
export const homeProducts: MockProduct[] = [
  {
    id: 19,
    name: "Smart TV",
    price: 999,
    image: "https://images.unsplash.com/photo-1461151304267-38535e780c79?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    discount: 15,
    rating: 4.6
  },
  {
    id: 20,
    name: "Air Purifier",
    price: 249,
    image: "https://images.unsplash.com/photo-1626436819821-d2facab33b13?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    rating: 4.3
  },
  {
    id: 21,
    name: "Smart Lighting Kit",
    price: 189,
    image: "https://images.unsplash.com/photo-1567515004624-219c11d31f2e?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    isNew: true,
    rating: 4.4
  },
  {
    id: 22,
    name: "Voice Assistant",
    price: 129,
    image: "https://images.unsplash.com/photo-1588476904062-8ce5a9da5828?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    rating: 4.2
  }
];
