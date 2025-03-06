import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PromotionCard } from "@/components/PromotionCard";
import { RecommendedProducts } from "@/components/RecommendedProducts";

export const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setIsLoaded(true);
    }, 200);
  }, []);

  // Sample data for the homepage
  const featuredProducts = [
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

  const categories = [
    { id: "smartphones", name: "Smartphones", icon: "https://api.iconify.design/lucide:smartphone.svg?color=%23000000", productCount: 24 },
    { id: "laptops", name: "Laptops", icon: "https://api.iconify.design/lucide:laptop.svg?color=%23000000", productCount: 18 },
    { id: "wearables", name: "Wearables", icon: "https://api.iconify.design/lucide:watch.svg?color=%23000000", productCount: 12 },
    { id: "accessories", name: "Accessories", icon: "https://api.iconify.design/lucide:headphones.svg?color=%23000000", productCount: 30 },
    { id: "support", name: "Support & Service", icon: "https://api.iconify.design/lucide:help-circle.svg?color=%23000000", productCount: 5 },
    { id: "gaming", name: "Gaming", icon: "https://api.iconify.design/lucide:gamepad-2.svg?color=%23000000", productCount: 15 },
  ];

  const promotions = [
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

  return (
    <div className={`flex min-h-screen flex-col bg-white ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <Navbar />
      <main className="flex-1">
        <Hero />

        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Categories</h2>
              <Link 
                to="/categories" 
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 fade-in-group">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  icon={category.icon}
                  productCount={category.productCount}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Personalized Recommendations */}
        <RecommendedProducts />

        {/* Featured Products */}
        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-6">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Link 
                to="/products" 
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 fade-in-group">
              {featuredProducts.map((product) => (
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
          </div>
        </section>

        {/* Promotions */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="mb-10">
              <h2 className="text-2xl font-bold">Promotions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in-group">
              {promotions.map((promo) => (
                <PromotionCard
                  key={promo.id}
                  id={promo.id}
                  title={promo.title}
                  subtitle={promo.subtitle}
                  image={promo.image}
                  backgroundColor={promo.backgroundColor}
                  ctaText={promo.ctaText}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-neutral-900 py-16 text-white">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold">Stay in the loop</h2>
              <p className="mt-4 text-neutral-300">
                Subscribe to our newsletter for the latest product releases and updates.
              </p>
              <form className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-full border-0 bg-white/10 px-4 py-3 text-white placeholder-neutral-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="button-press rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
