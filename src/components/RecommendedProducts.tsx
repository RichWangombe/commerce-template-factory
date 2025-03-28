
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";
import { useRecommendations } from "@/contexts/recommendation";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { RecommendationFilter, ProductRecommendation } from "@/types/recommendation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { enhanceRecommendationImages } from "@/utils/recommendationUtils";

interface RecommendedProductsProps {
  productId?: number;
}

export const RecommendedProducts = ({ productId }: RecommendedProductsProps) => {
  const recommendations = useRecommendations();
  const { preferences } = useUserPreferences();
  const [products, setProducts] = useState<ProductRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      
      // Build filter based on user preferences
      const filter: RecommendationFilter = {
        categories: preferences.favoriteCategories?.length 
          ? preferences.favoriteCategories 
          : undefined,
      };
      
      // Filter recommendation types based on preferences
      const enabledTypes: string[] = [];
      if (preferences.showRecentlyViewed) enabledTypes.push('viewed');
      if (preferences.showSimilar) enabledTypes.push('similar');
      if (preferences.showTrending) enabledTypes.push('trending');
      if (preferences.showSeasonalOffers) enabledTypes.push('seasonal');
      if (enabledTypes.length === 0) {
        // Ensure at least one type is enabled by default
        enabledTypes.push('trending', 'similar');
      }
      
      filter.types = enabledTypes;
      
      try {
        let recommendedProducts: ProductRecommendation[] = [];
        
        // If productId is provided, get recommendations for that product
        if (productId) {
          recommendedProducts = recommendations.getRecommendationsForProduct(productId);
        } else {
          // Otherwise get personalized recommendations
          const count = preferences.recommendationCount || 4;
          recommendedProducts = await recommendations.getRecommendations(count, filter);
        }
        
        // Enhance products with high-quality HD images - ensure we get different images
        const enhancedProducts = enhanceRecommendationImages(recommendedProducts);
        
        setProducts(enhancedProducts);
        
        // Track that these recommendations were viewed
        enhancedProducts.forEach(product => {
          recommendations.trackView({
            productId: product.id,
            productName: product.name,
            recommendationType: product.source.type,
            confidence: product.source.confidence,
            timestamp: new Date().toISOString()
          });
        });
      } catch (error) {
        console.error("Failed to load recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [recommendations, preferences, productId]);

  // Helper function to get badge color based on recommendation type
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'viewed':
        return 'bg-blue-100 text-blue-800';
      case 'purchased':
        return 'bg-green-100 text-green-800';
      case 'similar':
        return 'bg-purple-100 text-purple-800';
      case 'trending':
        return 'bg-amber-100 text-amber-800';
      case 'collaborative':
        return 'bg-indigo-100 text-indigo-800';
      case 'seasonal':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationLabel = (type: string) => {
    switch (type) {
      case 'viewed':
        return 'Recently Viewed';
      case 'purchased':
        return 'Based on Purchase History';
      case 'similar':
        return 'Similar to Viewed Items';
      case 'trending':
        return 'Trending Now';
      case 'collaborative':
        return 'Others Also Bought';
      case 'seasonal':
        return 'Seasonal Recommendation';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="mt-4 h-4 w-2/3" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center">
        <p className="text-neutral-500">No recommendations available. Continue browsing to get personalized recommendations.</p>
        <Link to="/products" className="mt-4 inline-block rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 fade-in-group">
      {products.map((product) => (
        <div key={product.id} className="relative">
          <Badge 
            variant="outline" 
            className={`absolute left-2 top-2 z-10 ${getBadgeStyle(product.source.type)}`}
          >
            {getRecommendationLabel(product.source.type)}
          </Badge>
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
  );
};

export default RecommendedProducts;
