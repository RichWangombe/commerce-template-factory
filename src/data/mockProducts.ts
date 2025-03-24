
import { ProductCardProps } from "@/components/ProductCard";

// Mock database of products (would come from a real API)
export const mockProducts: ProductCardProps[] = [
  {
    id: 1,
    name: "Smartphone X",
    price: 799,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop",
    category: "Smartphone",
    isNew: true,
    rating: 4.5
  },
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 299,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop",
    category: "Wearable",
    rating: 4.2
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    price: 149,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    discount: 15,
    rating: 4.7
  },
  {
    id: 4,
    name: "Tablet Ultra",
    price: 499,
    image: "https://images.unsplash.com/photo-1589739900875-8453b348aa0e?q=80&w=800&auto=format&fit=crop",
    category: "Tablet",
    isNew: true,
    rating: 4.0
  },
  {
    id: 5,
    name: "Laptop Pro",
    price: 1299,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop",
    category: "Laptop",
    rating: 4.8
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 79,
    image: "https://images.unsplash.com/photo-1547393947-e8d9f26a39f4?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    discount: 10,
    rating: 3.9
  },
  {
    id: 7,
    name: "Fitness Tracker",
    price: 129,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=800&auto=format&fit=crop",
    category: "Wearable",
    isNew: true,
    rating: 4.3
  },
  {
    id: 8,
    name: "Home Speaker System",
    price: 349,
    image: "https://images.unsplash.com/photo-1603057002111-906f49ebbd48?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    rating: 4.6
  },
  // Additional products for more category coverage
  {
    id: 9,
    name: "Phone Case",
    price: 29,
    image: "https://images.unsplash.com/photo-1601593346740-925612772163?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    rating: 4.1
  },
  {
    id: 10,
    name: "Wireless Charger",
    price: 49,
    image: "https://images.unsplash.com/photo-1618760439047-796adbd32877?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    rating: 4.4
  },
  {
    id: 11,
    name: "Gaming Laptop",
    price: 1599,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop",
    category: "Gaming",
    isNew: true,
    rating: 4.9
  },
  {
    id: 12,
    name: "Gaming Headset",
    price: 129,
    image: "https://images.unsplash.com/photo-1591105575639-a334978de1a3?q=80&w=800&auto=format&fit=crop",
    category: "Gaming",
    rating: 4.5
  }
];

// Product categories for better organization of recommendations
export const productCategories: Record<string, number[]> = {
  "Smartphone": [1],
  "Wearable": [2, 7],
  "Audio": [3, 6, 8],
  "Tablet": [4],
  "Laptop": [5],
  "Accessories": [9, 10],
  "Gaming": [11, 12]
};
