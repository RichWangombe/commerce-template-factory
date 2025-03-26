
export const categories = [
  { id: "smartphones", name: "Smartphones", icon: "https://api.iconify.design/lucide:smartphone.svg?color=%23000000", productCount: 24 },
  { id: "laptops", name: "Laptops", icon: "https://api.iconify.design/lucide:laptop.svg?color=%23000000", productCount: 18 },
  { id: "wearables", name: "Wearables", icon: "https://api.iconify.design/lucide:watch.svg?color=%23000000", productCount: 12 },
  { id: "accessories", name: "Accessories", icon: "https://api.iconify.design/lucide:headphones.svg?color=%23000000", productCount: 30 },
  { id: "photography", name: "Photography", icon: "https://api.iconify.design/lucide:camera.svg?color=%23000000", productCount: 8 },
  { id: "gaming", name: "Gaming", icon: "https://api.iconify.design/lucide:gamepad-2.svg?color=%23000000", productCount: 15 },
  { id: "home", name: "Smart Home", icon: "https://api.iconify.design/lucide:home.svg?color=%23000000", productCount: 20 },
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
    id: 19,
    name: "Smart TV",
    price: 999,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=300&auto=format&fit=crop",
    category: "Home",
  },
];

export const promotions = [
  {
    id: "promo-1",
    title: "20% off on all gadgets",
    subtitle: "Limited time offer.",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=300&auto=format&fit=crop",
    backgroundColor: "bg-gradient-to-br from-rose-50 to-rose-100",
  },
  {
    id: "promo-2",
    title: "New Arrival",
    subtitle: "The Latest Tech",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=300&auto=format&fit=crop",
    backgroundColor: "bg-gradient-to-br from-blue-50 to-indigo-100",
    ctaText: "Explore now",
  },
];
