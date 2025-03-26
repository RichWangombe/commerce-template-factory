
import { MockProduct } from "../types/productTypes";

// Smart Home products
export const homeProducts: MockProduct[] = [
  {
    id: 19,
    name: "Smart TV",
    price: 999,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    discount: 15,
    rating: 4.6
  },
  {
    id: 20,
    name: "Air Purifier",
    price: 249,
    image: "https://images.unsplash.com/photo-1585771362212-e3f6e61668f4?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    rating: 4.3
  },
  {
    id: 21,
    name: "Smart Lighting Kit",
    price: 189,
    image: "https://images.unsplash.com/photo-1565538420870-da08ff96a207?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    isNew: true,
    rating: 4.4
  },
  {
    id: 22,
    name: "Voice Assistant",
    price: 129,
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    rating: 4.2
  }
];
