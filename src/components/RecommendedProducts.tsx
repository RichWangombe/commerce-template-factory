
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
    getPersonalizedRecommendations,
    trackRecommendationClick 
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

  // Generate a descriptive explanation for each recommendation type
  const getRecommendationLabel = (type: string): string => {
    switch (type) {
      case 'viewed':
        return 'Based on your history';
      case 'purchased':
        return 'Based on purchases';
      case 'similar':
        return 'Similar product';
      case 'trending':
        return 'Trending';
      case 'collaborative':
        return 'Others also bought';
      default:
        return '';
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showViewAll && (
            <Link 
              to="/recommendations" 
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 fade-in-group">
          {products.map((product) => (
            <div key={product.id} className="relative">
              {/* Enhanced labels for recommendation types */}
              <div className="absolute right-2 top-2 z-10 bg-white/90 backdrop-blur-sm text-black text-xs rounded-full px-2 py-1 shadow-sm border">
                {getRecommendationLabel(product.source.type)}
              </div>
              <div onClick={() => trackRecommendationClick(product)}>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
