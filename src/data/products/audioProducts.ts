
import { MockProduct } from "../types/productTypes";

// Audio products: Earbuds, Speakers, Headphones
export const audioProducts: MockProduct[] = [
  {
    id: 3,
    name: "Wireless Earbuds",
    price: 149,
    image: "https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    discount: 15,
    rating: 4.7
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 79,
    image: "https://images.unsplash.com/photo-1589491106922-a8c2ca727f3c?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    discount: 10,
    rating: 3.9
  },
  {
    id: 8,
    name: "Home Speaker System",
    price: 349,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    rating: 4.6
  },
  {
    id: 23,
    name: "Premium Headphones",
    price: 349,
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    rating: 4.9
  }
];
