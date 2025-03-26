
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
    image: "https://images.unsplash.com/photo-1617043983671-adaadcaa2460?q=80&w=800&auto=format&fit=crop",
    category: "Wearable",
    rating: 4.2
  },
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
    image: "https://images.unsplash.com/photo-1589491106922-a8c2ca727f3c?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    rating: 4.6
  },
  // Additional products for more category coverage
  {
    id: 9,
    name: "Phone Case",
    price: 29,
    image: "https://images.unsplash.com/photo-1535157412991-2ef801c1748b?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    rating: 4.1
  },
  {
    id: 10,
    name: "Wireless Charger",
    price: 49,
    image: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    rating: 4.4
  },
  {
    id: 11,
    name: "Gaming Laptop",
    price: 1599,
    image: "https://images.unsplash.com/photo-1593642702821-c8e775f4e811?q=80&w=800&auto=format&fit=crop",
    category: "Gaming",
    isNew: true,
    rating: 4.9
  },
  {
    id: 12,
    name: "Gaming Headset",
    price: 129,
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800&auto=format&fit=crop",
    category: "Gaming",
    rating: 4.5
  },
  // New products with more varied images
  {
    id: 13,
    name: "Mechanical Keyboard",
    price: 159,
    image: "https://images.unsplash.com/photo-1595044426077-d36d9236d067?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    rating: 4.7
  },
  {
    id: 14,
    name: "Ultrawide Monitor",
    price: 549,
    image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    isNew: true,
    rating: 4.6
  },
  {
    id: 15,
    name: "Wireless Mouse",
    price: 69,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    discount: 10,
    rating: 4.2
  },
  {
    id: 16,
    name: "Portable SSD",
    price: 129,
    image: "https://images.unsplash.com/photo-1563064670-15d21a26ced8?q=80&w=800&auto=format&fit=crop",
    category: "Accessories",
    rating: 4.4
  },
  {
    id: 17,
    name: "Camera Drone",
    price: 799,
    image: "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=800&auto=format&fit=crop",
    category: "Photography",
    isNew: true,
    rating: 4.8
  },
  {
    id: 18,
    name: "Digital Camera",
    price: 699,
    image: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=800&auto=format&fit=crop",
    category: "Photography",
    rating: 4.5
  },
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
  },
  {
    id: 23,
    name: "Premium Headphones",
    price: 349,
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=800&auto=format&fit=crop",
    category: "Audio",
    rating: 4.9
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
