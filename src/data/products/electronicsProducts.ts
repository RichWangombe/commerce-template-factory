
import { MockProduct } from "../types/productTypes";

// Electronics products: Smartphones, Tablets, Laptops
export const smartphoneProducts: MockProduct[] = [
  {
    id: 1,
    name: "Smartphone X",
    price: 799,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
    category: "Smartphone",
    isNew: true,
    rating: 4.5
  },
  {
    id: 24,
    name: "Smartphone Y",
    price: 649,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop",
    category: "Smartphone",
    discount: 12,
    rating: 4.3
  }
];

export const tabletProducts: MockProduct[] = [
  {
    id: 4,
    name: "Tablet Ultra",
    price: 499,
    image: "https://images.unsplash.com/photo-1589739900875-8453b348aa0e?q=80&w=800&auto=format&fit=crop",
    category: "Tablet",
    isNew: true,
    rating: 4.0
  }
];

export const laptopProducts: MockProduct[] = [
  {
    id: 5,
    name: "Laptop Pro",
    price: 1299,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
    category: "Laptop",
    rating: 4.8
  },
  {
    id: 11,
    name: "Gaming Laptop",
    price: 1599,
    image: "https://images.unsplash.com/photo-1593642702821-c8e775f4e811?q=80&w=800&auto=format&fit=crop",
    category: "Gaming",
    isNew: true,
    rating: 4.9
  }
];
