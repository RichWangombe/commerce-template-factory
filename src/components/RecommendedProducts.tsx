
import { useRecommendations } from "@/contexts/RecommendationContext";
import { ProductCard } from "@/components/ProductCard";
import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface RecommendedProductsProps {
  productId?: number;
  title?: string;
  showViewAll?: boolean;
}

export const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  productId,
  title = "Recommended For You",
  showViewAll = true,
}) => {
  const { 
    getRecommendationsForProduct, 
    recommendedProducts, 
    getPersonalizedRecommendations 
  } = useRecommendations();

  // Determine which recommendations to show based on props
  const products = productId 
    ? getRecommendationsForProduct(productId)
    : recommendedProducts;

  // If we have a specific product ID, re-run personalized recommendations
  // once when the component mounts to ensure fresh data
  useEffect(() => {
    if (!productId) {
      getPersonalizedRecommendations();
    }
  }, [productId]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showViewAll && (
            <Link 
              to="/products" 
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 fade-in-group">
          {products.map((product) => (
            <div key={product.id} className="relative">
              {product.source.type === 'trending' && (
                <div className="absolute right-2 top-2 z-10 bg-black text-white text-xs rounded-full px-2 py-1">
                  Trending
                </div>
              )}
              {product.source.type === 'similar' && product.source.confidence > 0.8 && (
                <div className="absolute right-2 top-2 z-10 bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                  Similar
                </div>
              )}
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
                isNew={product.isNew}
                discount={product.discount}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
