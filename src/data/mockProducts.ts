
import { ProductCardProps } from "@/components/ProductCard";

// Mock database of products (would come from a real API)
export const mockProducts: ProductCardProps[] = [
  {
    id: 1,
    name: "Smartphone X",
    price: 799,
    image: "/lovable-uploads/6b752309-063d-437b-b887-e07e2232e3ba.png",
    category: "Smartphone",
    isNew: true,
    rating: 4.5
  },
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 299,
    image: "/lovable-uploads/f306dd50-931c-4e73-b66d-61b3383f1151.png",
    category: "Wearable",
    rating: 4.2
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    price: 149,
    image: "/lovable-uploads/5724322a-7599-465b-8abc-a56c59781885.png",
    category: "Audio",
    discount: 15,
    rating: 4.7
  },
  {
    id: 4,
    name: "Tablet Ultra",
    price: 499,
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=300",
    category: "Tablet",
    isNew: true,
    rating: 4.0
  },
  {
    id: 5,
    name: "Laptop Pro",
    price: 1299,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=300",
    category: "Laptop",
    rating: 4.8
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 79,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=300",
    category: "Audio",
    discount: 10,
    rating: 3.9
  },
  {
    id: 7,
    name: "Fitness Tracker",
    price: 129,
    image: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?q=80&w=300",
    category: "Wearable",
    isNew: true,
    rating: 4.3
  },
  {
    id: 8,
    name: "Home Speaker System",
    price: 349,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=300",
    category: "Audio",
    rating: 4.6
  },
];

// Product categories for better organization of recommendations
export const productCategories: Record<string, number[]> = {
  "Smartphone": [1],
  "Wearable": [2, 7],
  "Audio": [3, 6, 8],
  "Tablet": [4],
  "Laptop": [5],
};
