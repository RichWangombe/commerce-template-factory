import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronRight, 
  Truck, 
  ArrowLeft, 
  Plus, 
  Minus 
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useReviews } from "@/contexts/ReviewContext";
import { ReviewsList } from "@/components/ReviewsList";
import { ReviewForm } from "@/components/ReviewForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecommendedProducts } from "@/components/RecommendedProducts";
import { ProductViewTracker } from "@/components/ProductViewTracker";

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
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { getProductReviews } = useReviews();
  
  const product = mockProducts.find(product => product.id === id);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link to="/" className="text-blue-500 hover:underline">Return to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const reviews = getProductReviews(id || "");
  
  if (selectedColor === "" && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }
  
  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    });
  };
  
  const handleToggleWishlist = () => {
    const productId = Number(product.id);
    
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
      });
    }
  };
  
  const isFavorite = isInWishlist(Number(product.id));
  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ProductViewTracker />
      
      <main className="flex-1 py-8 md:py-12 animate-fade-in">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <div className="flex items-center text-sm text-neutral-500">
              <Link to="/" className="hover:text-neutral-900">Home</Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-neutral-900">
                {product.category}
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="text-neutral-900 font-medium">
                {product.name}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 relative">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div className="flex gap-3 overflow-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden w-20 h-20 flex-shrink-0 ${
                      selectedImage === index 
                        ? 'ring-2 ring-offset-2 ring-black' 
                        : 'border border-neutral-200'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`}
                      className="object-cover w-full h-full" 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
                <p className="text-neutral-500 mt-1">{product.brand}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : i < product.rating
                          ? 'fill-yellow-400 text-yellow-400 opacity-50'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-neutral-500 text-sm">({product.reviewCount} reviews)</span>
              </div>
              
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-neutral-500 line-through">${product.originalPrice.toFixed(2)}</span>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                
                <p className="text-sm text-green-600 mt-1">
                  In stock ({product.stock} available)
                </p>
              </div>
              
              <div className="border-t border-b border-neutral-200 py-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-3">Color</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-full text-sm ${
                          selectedColor === color
                            ? 'bg-black text-white'
                            : 'bg-neutral-100 hover:bg-neutral-200'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Quantity</h3>
                  <div className="flex items-center">
                    <button
                      onClick={handleDecreaseQuantity}
                      className="w-10 h-10 rounded-l-md border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      readOnly
                      className="w-14 h-10 border-t border-b border-neutral-300 text-center text-sm [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      onClick={handleIncreaseQuantity}
                      className="w-10 h-10 rounded-r-md border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 button-press gap-2 bg-black hover:bg-neutral-800"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button 
                  onClick={handleToggleWishlist}
                  variant="outline"
                  className={`button-press ${isFavorite ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button 
                  variant="outline"
                  className="button-press"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-neutral-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Free shipping</p>
                  <p className="text-xs text-neutral-500">Free standard shipping on orders over $35</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start border-b pb-0 mb-6">
                <TabsTrigger value="description" className="pb-3 rounded-none">Description & Features</TabsTrigger>
                <TabsTrigger value="specs" className="pb-3 rounded-none">Specifications</TabsTrigger>
                <TabsTrigger value="reviews" className="pb-3 rounded-none">
                  Reviews ({reviews.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-xl font-bold mb-4">Description</h2>
                      <p className="text-neutral-600">{product.description}</p>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-bold mb-4">Features</h2>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-neutral-300"></div>
                            <span className="text-neutral-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border rounded-xl p-6">
                      <h3 className="text-lg font-medium mb-4">Product Details</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Brand</span>
                          <span className="font-medium">{product.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">SKU</span>
                          <span className="font-medium">{product.sku}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Category</span>
                          <Link 
                            to={`/category/${product.category.toLowerCase()}`}
                            className="font-medium hover:underline"
                          >
                            {product.category}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="specs" className="pt-4">
                <div className="max-w-3xl">
                  <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium bg-neutral-50">Brand</td>
                          <td className="py-3 px-4">{product.brand}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium bg-neutral-50">Model</td>
                          <td className="py-3 px-4">{product.sku}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium bg-neutral-50">Color Options</td>
                          <td className="py-3 px-4">{product.colors.join(", ")}</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium bg-neutral-50">Weight</td>
                          <td className="py-3 px-4">Approx. 300g</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4 font-medium bg-neutral-50">Warranty</td>
                          <td className="py-3 px-4">1 Year Manufacturer Warranty</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium bg-neutral-50">Package Contents</td>
                          <td className="py-3 px-4">Main Product, User Manual, Warranty Card</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="pt-4">
                <div className="space-y-12">
                  <ReviewsList reviews={reviews} productId={id || ""} />
                  <ReviewForm productId={id || ""} />
                </div>
              </TabsContent>
            </Tabs>
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
