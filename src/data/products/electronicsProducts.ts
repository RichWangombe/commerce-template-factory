
import { MockProduct } from "../types/productTypes";

// Electronics products: Smartphones, Tablets, Laptops
export const smartphoneProducts: MockProduct[] = [
  {
    id: 1,
    name: "Smartphone X",
    price: 799,
    image: "https://images.unsplash.com/photo-1592750975210-9a4662add34b?q=80&w=800&auto=format&fit=crop",
    category: "Smartphone",
    isNew: true,
    rating: 4.5
  },
  {
    id: 24,
    name: "Smartphone Y",
    price: 649,
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
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
