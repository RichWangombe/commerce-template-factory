
export const categories = [
  { id: "smartphones", name: "Smartphones", icon: "https://api.iconify.design/lucide:smartphone.svg?color=%23000000", productCount: 24 },
  { id: "laptops", name: "Laptops", icon: "https://api.iconify.design/lucide:laptop.svg?color=%23000000", productCount: 18 },
  { id: "wearables", name: "Wearables", icon: "https://api.iconify.design/lucide:watch.svg?color=%23000000", productCount: 12 },
  { id: "accessories", name: "Accessories", icon: "https://api.iconify.design/lucide:headphones.svg?color=%23000000", productCount: 30 },
  { id: "support", name: "Support & Service", icon: "https://api.iconify.design/lucide:help-circle.svg?color=%23000000", productCount: 5 },
  { id: "gaming", name: "Gaming", icon: "https://api.iconify.design/lucide:gamepad-2.svg?color=%23000000", productCount: 15 },
];

export const featuredProducts = [
  {
    id: 1,
    name: "Smartphone X",
    price: 799,
    image: "/lovable-uploads/6b752309-063d-437b-b887-e07e2232e3ba.png",
    category: "Smartphone",
    isNew: true,
  },
  {
    id: 2,
    name: "Smartwatch Pro",
    price: 299,
    image: "/lovable-uploads/f306dd50-931c-4e73-b66d-61b3383f1151.png",
    category: "Wearable",
  },
  {
    id: 3,
    name: "Wireless Earbuds",
    price: 149,
    image: "/lovable-uploads/5724322a-7599-465b-8abc-a56c59781885.png",
    category: "Audio",
    discount: 15,
  },
  {
    id: 4,
    name: "Tablet Ultra",
    price: 499,
    image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=300",
    category: "Tablet",
  },
];

export const promotions = [
  {
    id: "promo-1",
    title: "20% off on all gadgets",
    subtitle: "Limited time offer.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300",
    backgroundColor: "bg-gradient-to-br from-rose-50 to-rose-100",
  },
  {
    id: "promo-2",
    title: "New Arrival",
    subtitle: "The Latest Tech",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=300",
    backgroundColor: "bg-gradient-to-br from-blue-50 to-indigo-100",
    ctaText: "Explore now",
  },
];
