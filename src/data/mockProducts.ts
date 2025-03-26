
import { ProductCardProps } from "@/components/ProductCard";

// Mock database of products (would come from a real API)
export const mockProducts: ProductCardProps[] = [
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
    id: 2,
    name: "Smartwatch Pro",
    price: 299,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop",
    category: "Wearable",
    rating: 4.2
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    price: 149,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    discount: 15,
    rating: 4.7
  },
  {
    id: 4,
    name: "Tablet Ultra",
    price: 499,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=800&auto=format&fit=crop",
    category: "Tablet",
    isNew: true,
    rating: 4.0
  },
  {
    id: 5,
    name: "Laptop Pro",
    price: 1299,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop",
    category: "Laptop",
    rating: 4.8
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 79,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    discount: 10,
    rating: 3.9
  },
  {
    id: 7,
    name: "Fitness Tracker",
    price: 129,
    image: "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?q=80&w=800&auto=format&fit=crop",
    category: "Wearable",
    isNew: true,
    rating: 4.3
  },
  {
    id: 8,
    name: "Home Speaker System",
    price: 349,
    image: "https://images.unsplash.com/photo-1593055454527-731c70783826?q=80&w=800&auto=format&fit=crop",
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
  },
  // New products with more varied images
  {
    id: 13,
    name: "Mechanical Keyboard",
    price: 159,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    rating: 4.7
  },
  {
    id: 14,
    name: "Ultrawide Monitor",
    price: 549,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    isNew: true,
    rating: 4.6
  },
  {
    id: 15,
    name: "Wireless Mouse",
    price: 69,
    image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    discount: 10,
    rating: 4.2
  },
  {
    id: 16,
    name: "Portable SSD",
    price: 129,
    image: "https://images.unsplash.com/photo-1541807360746-039080941306?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    rating: 4.4
  },
  {
    id: 17,
    name: "Camera Drone",
    price: 799,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop",
    category: "Photography",
    isNew: true,
    rating: 4.8
  },
  {
    id: 18,
    name: "Digital Camera",
    price: 699,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    category: "Photography",
    rating: 4.5
  },
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
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    isNew: true,
    rating: 4.4
  },
  {
    id: 22,
    name: "Voice Assistant",
    price: 129,
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=800&auto=format&fit=crop",
    category: "Home",
    rating: 4.2
  },
  {
    id: 23,
    name: "Premium Headphones",
    price: 349,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    rating: 4.9
  },
  {
    id: 24,
    name: "Smartphone Y",
    price: 649,
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800&auto=format&fit=crop",
    category: "Smartphone",
    discount: 12,
    rating: 4.3
  }
];

// Product categories for better organization of recommendations
export const productCategories: Record<string, number[]> = {
  "Smartphone": [1, 24],
  "Wearable": [2, 7],
  "Audio": [3, 6, 8, 23],
  "Tablet": [4],
  "Laptop": [5],
  "Accessories": [9, 10, 13, 14, 15, 16],
  "Gaming": [11, 12],
  "Photography": [17, 18],
  "Home": [19, 20, 21, 22]
};
