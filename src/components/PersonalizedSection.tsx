
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useRecommendations } from "@/contexts/RecommendationContext";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useUser } from "@clerk/clerk-react";
import { ProductRecommendation } from "@/types/recommendation";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface PersonalizedSectionProps {
  title: string;
  subtitle?: string;
  recommendationType: 'viewed' | 'purchased' | 'similar' | 'trending' | 'collaborative' | 'seasonal';
  limit?: number;
}

export const PersonalizedSection = ({
  title,
  subtitle,
  recommendationType,
  limit = 4
}: PersonalizedSectionProps) => {
  const { getRecommendedProducts, trackRecommendationView } = useRecommendations();
  const { preferences } = useUserPreferences();
  const { isSignedIn } = useUser();
  const [products, setProducts] = useState<ProductRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      setIsLoading(true);
      
      try {
        // Get recommendations filtered by type
        const recommendations = await getRecommendedProducts(limit, {
          types: [recommendationType],
          categories: preferences.favoriteCategories?.length 
            ? preferences.favoriteCategories 
            : undefined,
        });
        
        setProducts(recommendations);
        
        // Track that these recommendations were viewed
        recommendations.forEach(product => {
          trackRecommendationView({
            productId: product.id,
            productName: product.name,
            recommendationType: product.source.type,
            confidence: product.source.confidence,
            timestamp: new Date().toISOString()
          });
        });
      } catch (error) {
        console.error(`Failed to load ${recommendationType} recommendations:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [getRecommendedProducts, trackRecommendationView, preferences, recommendationType, limit]);

  // Don't show section if no products and user has disabled this recommendation type
  const shouldShowType = () => {
    switch (recommendationType) {
      case 'viewed': return preferences.showRecentlyViewed;
      case 'similar': return preferences.showSimilar;
      case 'trending': return preferences.showTrending;
      case 'seasonal': return preferences.showSeasonalOffers;
      default: return true;
    }
  };

  if (!shouldShowType() || (products.length === 0 && !isLoading)) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && <p className="mt-1 text-neutral-500">{subtitle}</p>}
          </div>
          <Link 
            to={`/recommendations?type=${recommendationType}`}
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="mt-4 h-4 w-2/3" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 fade-in-group">
            {products.map((product) => (
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
        )}
        
        {!isSignedIn && recommendationType !== 'trending' && (
          <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">
            <p className="text-blue-800">
              Sign in to get personalized {recommendationType} recommendations
            </p>
            <Link 
              to="/sign-in" 
              className="mt-2 inline-block rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
