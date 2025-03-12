
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { RecommendationFilter, ProductRecommendation } from "@/types/recommendation";
import { useRecommendations } from "@/contexts/recommendation";
import CompareProductsSheet from "./CompareProductsSheet";
import { Users } from "lucide-react";

interface RecommendationGridProps {
  filteredProducts: ProductRecommendation[];
  applyFilters: (filter: RecommendationFilter) => void;
}

export const RecommendationGrid: React.FC<RecommendationGridProps> = ({
  filteredProducts,
  applyFilters
}) => {
  const { trackRecommendationClick } = useRecommendations();
  const [showSimilar, setShowSimilar] = useState(false);

  // Group recommendations by type
  const collaborativeRecommendations = filteredProducts.filter(
    product => product.source.type === 'collaborative' || product.source.type === 'purchased'
  );

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
    <div className="space-y-8">
      {/* Controls section */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </h2>
        <div className="flex gap-2">
          <CompareProductsSheet products={filteredProducts} />
        </div>
      </div>
      
      {/* Main recommendation grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="relative">
            <div className="absolute right-2 top-2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-black dark:text-white text-xs rounded-full px-2 py-1 shadow-sm border dark:border-gray-700">
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
      
      {/* Customers also bought section - only show when there are collaborative recommendations */}
      {collaborativeRecommendations.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-medium">Customers Also Bought</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collaborativeRecommendations.map((product) => (
              <div key={`collab-${product.id}`} className="relative">
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
        </div>
      )}
    </div>
  );
};

export default RecommendationGrid;
