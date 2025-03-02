
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  Heart, 
  Share, 
  ShoppingCart, 
  Star, 
  Truck,
  Shield,
  RotateCcw
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";

export const ProductDetailPage = () => {
  const { id } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  // In a real application, you would fetch product data based on the ID
  // For this demo, we'll use hard-coded data
  const product = {
    id: Number(id) || 2,
    name: "Smartwatch Pro",
    price: 299,
    discount: 0,
    rating: 4.8,
    reviewCount: 124,
    description: "The Smartwatch Pro is the perfect companion for your active lifestyle. With advanced health tracking, customizable watch faces, and up to 7 days of battery life, it's designed to keep up with you wherever you go.",
    features: [
      "Advanced health monitoring",
      "Water-resistant up to 50 meters",
      "Customizable watch faces",
      "7-day battery life",
      "Voice assistant integration",
      "Notification support for all apps",
    ],
    colors: [
      { name: "Black", value: "#000000" },
      { name: "Silver", value: "#C0C0C0" },
      { name: "Blue", value: "#0066CC" },
    ],
    sizes: ["Small", "Medium", "Large"],
    images: [
      "/lovable-uploads/f306dd50-931c-4e73-b66d-61b3383f1151.png",
      "https://images.unsplash.com/photo-1549482199-bc1ca6f58502?q=80&w=500",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=500",
    ],
    stock: 15,
    freeShipping: true,
    warranty: "2-year manufacturer warranty",
    returnPolicy: "30-day money-back guarantee",
  };

  const relatedProducts = [
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
    {
      id: 1,
      name: "Smartphone X",
      price: 799,
      image: "/lovable-uploads/6b752309-063d-437b-b887-e07e2232e3ba.png",
      category: "Smartphone",
      isNew: true,
    },
  ];

  // For animations
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 200);
  }, []);

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  const discountedPrice = product.discount > 0 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(product.price * (1 - product.discount / 100))
    : null;

  return (
    <div className={`flex min-h-screen flex-col bg-white ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <Navbar />
      <main className="flex-1 pt-6 pb-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <ol className="flex flex-wrap items-center text-sm text-neutral-500">
              <li className="flex items-center">
                <Link to="/" className="hover:text-neutral-900">Home</Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <Link to="/products" className="hover:text-neutral-900">Products</Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <Link to="/category/wearables" className="hover:text-neutral-900">Wearables</Link>
                <span className="mx-2">/</span>
              </li>
              <li className="text-neutral-900 font-medium">{product.name}</li>
            </ol>
          </nav>

          {/* Product Details */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Product Images */}
            <div className="w-full lg:w-1/2 fade-in-group">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-50 mb-4">
                <img
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-contain p-12 transition-transform duration-500 animate-scale-in"
                />
              </div>
              <div className="flex gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-square w-24 overflow-hidden rounded-lg border-2 transition-all ${
                      index === activeImage ? "border-black" : "border-transparent hover:border-neutral-200"
                    }`}
                  >
                    <img src={image} alt={`Product view ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-1/2 fade-in-group">
              <div className="flex flex-col">
                <div className="mb-2 flex items-center gap-4">
                  <div className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                    In Stock ({product.stock})
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4" fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                      ))}
                    </div>
                    <span className="ml-2 text-neutral-500">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold">{product.name}</h1>
                
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-2xl font-medium">
                    {discountedPrice || formattedPrice}
                  </span>
                  {discountedPrice && (
                    <span className="text-xl text-neutral-500 line-through">
                      {formattedPrice}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                
                <p className="mt-6 text-neutral-600">
                  {product.description}
                </p>
                
                {/* Colors */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium">Color</h3>
                  <div className="mt-3 flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`relative h-10 w-10 rounded-full transition-transform ${
                          selectedColor.name === color.name ? "ring-2 ring-black ring-offset-2 scale-110" : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                        aria-label={`Color: ${color.name}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Selected: <span className="font-medium">{selectedColor.name}</span>
                  </p>
                </div>
                
                {/* Sizes */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium">Size</h3>
                  <div className="mt-3 flex gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-16 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quantity */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium">Quantity</h3>
                  <div className="mt-3 flex items-center">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="mx-4 w-12 text-center text-lg font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                      disabled={quantity >= product.stock}
                      aria-label="Increase quantity"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-8 flex flex-wrap gap-4">
                  <button 
                    className="button-press flex-1 rounded-full bg-black px-8 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </button>
                  <button 
                    className="button-press rounded-full border border-neutral-200 p-3 text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                    onClick={() => setIsFavorite(!isFavorite)}
                    aria-label="Add to favorites"
                  >
                    <Heart 
                      className="h-5 w-5" 
                      fill={isFavorite ? "currentColor" : "none"} 
                    />
                  </button>
                  <button 
                    className="button-press rounded-full border border-neutral-200 p-3 text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                    aria-label="Share product"
                  >
                    <Share className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Features */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-lg border border-neutral-100 p-3">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="text-sm">
                      {product.freeShipping ? "Free shipping" : "Standard shipping"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-neutral-100 p-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">{product.warranty}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-neutral-100 p-3">
                    <RotateCcw className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">{product.returnPolicy}</span>
                  </div>
                </div>
                
                {/* Key Features List */}
                <div className="mt-8">
                  <h3 className="font-medium">Key Features</h3>
                  <ul className="mt-3 space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="mt-1 h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-neutral-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section className="mt-24">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Link 
                to="/products" 
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all <ChevronLeft className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-in-group">
              {relatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                  isNew={product.isNew}
                  discount={product.discount}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
