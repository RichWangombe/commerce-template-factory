
import React from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { RecommendationFilter, ProductRecommendation } from "@/types/recommendation";
import { useRecommendations } from "@/contexts/recommendation";

interface RecommendationGridProps {
  filteredProducts: ProductRecommendation[];
  applyFilters: (filter: RecommendationFilter) => void;
}

export const RecommendationGrid: React.FC<RecommendationGridProps> = ({
  filteredProducts,
  applyFilters
}) => {
  const { trackRecommendationClick } = useRecommendations();

  // Get explanation text for recommendation
  const getRecommendationExplanation = (type: string): string => {
    switch (type) {
      case 'viewed':
        return 'Based on products you viewed';
      case 'purchased':
        return 'Based on your purchase history';
      case 'similar':
        return 'Similar to products you like';
      case 'trending':
        return 'Popular right now';
      case 'collaborative':
        return 'Other customers also bought';
      case 'seasonal':
        return 'Seasonal recommendation';
      default:
        return '';
    }
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground">No recommendations found with the current filters.</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => applyFilters({})}
        >
          Reset Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <div key={product.id} className="relative">
          <div className="absolute right-2 top-2 z-10 bg-white/90 backdrop-blur-sm text-black text-xs rounded-full px-2 py-1 shadow-sm border">
            {getRecommendationExplanation(product.source.type)}
          </div>
          <div 
            onClick={() => trackRecommendationClick(product)}
            className="h-full"
          >
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
  );
};
