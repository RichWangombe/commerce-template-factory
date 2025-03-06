
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useReviews } from "@/contexts/ReviewContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { ProductViewTracker } from "@/components/ProductViewTracker";
import { RecommendedProducts } from "@/components/RecommendedProducts";
import { ProductImages } from "@/components/product/ProductImages";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductTabs } from "@/components/product/ProductTabs";
import { Breadcrumb } from "@/components/product/Breadcrumb";
import { ProductNotFound } from "@/components/product/ProductNotFound";

const mockProducts = [
  {
    id: "1",
    name: "Wireless Noise-Canceling Headphones",
    brand: "SoundScape",
    price: 129.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviewCount: 856,
    description: "Experience premium sound quality with these wireless noise-canceling headphones. Perfect for travel, work, or relaxation, these headphones deliver up to 30 hours of battery life and exceptional comfort for all-day wear.",
    features: [
      "Active noise cancellation technology",
      "30-hour battery life",
      "Quick charge: 5 minutes for 3 hours of playback",
      "Bluetooth 5.0 with multipoint connection",
      "Built-in microphone for calls",
      "Comfortable over-ear design with memory foam"
    ],
    colors: ["Black", "Silver", "Navy Blue", "Rose Gold"],
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000",
      "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=1000",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000"
    ],
    stock: 45,
    sku: "WH-NC-1000X",
    category: "Audio",
    relatedProducts: ["2", "5", "9"]
  },
  {
    id: "2",
    name: "Smart Fitness Tracker Watch",
    brand: "PulseTrack",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.5,
    reviewCount: 1203,
    description: "Monitor your health and fitness goals with this advanced smart fitness tracker. Track your steps, heart rate, sleep patterns, and more with this waterproof and stylish wearable device.",
    features: [
      "24/7 heart rate monitoring",
      "Sleep tracking",
      "Water resistant up to 50m",
      "7-day battery life",
      "Compatible with iOS and Android",
      "15+ exercise modes"
    ],
    colors: ["Black", "Blue", "Pink"],
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000",
      "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=1000"
    ],
    stock: 78,
    sku: "FT-SMART-200",
    category: "Wearables",
    relatedProducts: ["3", "6", "8"]
  }
];

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductReviews } = useReviews();
  const { isInWishlist } = useWishlist();
  
  const product = mockProducts.find(product => product.id === id);
  
  if (!product) {
    return <ProductNotFound />;
  }
  
  const reviews = getProductReviews(id || "");
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ProductViewTracker />
      
      <main className="flex-1 py-8 md:py-12 animate-fade-in">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Breadcrumb category={product.category} productName={product.name} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <ProductImages images={product.images} name={product.name} />
            
            <ProductInfo 
              product={{
                ...product,
                id: product.id
              }}
            />
          </div>
          
          <div className="mt-12">
            <ProductTabs product={product} reviews={reviews} />
          </div>
          
          <div className="mt-16">
            <RecommendedProducts 
              productId={Number(id)} 
              title="You May Also Like" 
              showViewAll={false} 
            />
          </div>
          
          <div className="mt-12">
            <Link
              to={`/category/${product?.category.toLowerCase()}`}
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-neutral-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {product?.category}
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
