
export const categories = [
  { 
    id: "smartphones", 
    name: "Smartphones", 
    icon: "https://api.iconify.design/lucide:smartphone.svg?color=%233b82f6", 
    productCount: 24,
    backgroundImages: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop"
    ]
  },
  { 
    id: "laptops", 
    name: "Laptops", 
    icon: "https://api.iconify.design/lucide:laptop.svg?color=%23059669", 
    productCount: 18,
    backgroundImages: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541807360746-039080941306?q=80&w=800&auto=format&fit=crop"
    ]
  },
  { 
    id: "wearables", 
    name: "Wearables", 
    icon: "https://api.iconify.design/lucide:watch.svg?color=%23d946ef", 
    productCount: 12,
    backgroundImages: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617043983671-adaadcaa2460?q=80&w=800&auto=format&fit=crop"
    ]
  },
  { 
    id: "accessories", 
    name: "Accessories", 
    icon: "https://api.iconify.design/lucide:headphones.svg?color=%23ec4899", 
    productCount: 30,
    backgroundImages: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?q=80&w=800&auto=format&fit=crop"
    ]
  },
  { 
    id: "photography", 
    name: "Photography", 
    icon: "https://api.iconify.design/lucide:camera.svg?color=%23f97316", 
    productCount: 8,
    backgroundImages: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542567455-cd733f23fbb1?q=80&w=800&auto=format&fit=crop"
    ]
  },
  { 
    id: "gaming", 
    name: "Gaming", 
    icon: "https://api.iconify.design/lucide:gamepad-2.svg?color=%238b5cf6", 
    productCount: 15,
    backgroundImages: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591105575639-a334978de1a3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605979257913-1704eb7b6246?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800&auto=format&fit=crop"
    ]
  },
  { 
    id: "home", 
    name: "Smart Home", 
    icon: "https://api.iconify.design/lucide:home.svg?color=%2306b6d4", 
    productCount: 20,
    backgroundImages: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585771362212-e3f6e61668f4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558002038-1055953a7b91?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop"
    ]
  },
];

export const featuredProducts = [
  {
    id: 17,
    name: "Camera Drone",
    price: 799,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=300&auto=format&fit=crop",
    category: "Photography",
    isNew: true,
  },
  {
    id: 14,
    name: "Ultrawide Monitor",
    price: 549,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=300&auto=format&fit=crop",
    category: "Accessories",
  },
  {
    id: 23,
    name: "Premium Headphones",
    price: 349,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300&auto=format&fit=crop",
    category: "Audio",
    discount: 15,
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 79,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=300&auto=format&fit=crop",
    category: "Audio",
    discount: 10,
  },
];

export const promotions = [
  {
    id: "promo-1",
    title: "20% off on all gadgets",
    subtitle: "Limited time offer.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=300&auto=format&fit=crop",
    backgroundColor: "bg-gradient-to-br from-rose-50 to-rose-100",
  },
  {
    id: "promo-2",
    title: "New Arrival",
    subtitle: "The Latest Tech",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=300&auto=format&fit=crop",
    backgroundColor: "bg-gradient-to-br from-blue-50 to-indigo-100",
    ctaText: "Explore now",
  },
];
