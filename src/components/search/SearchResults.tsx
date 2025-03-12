
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
}

interface SearchResultsProps {
  loading: boolean;
  results: Product[];
  query: string;
  filters: {
    sort: string;
  };
  onSortChange: (value: string) => void;
  resetFilters: () => void;
}

export const SearchResults = ({
  loading,
  results,
  query,
  filters,
  onSortChange,
  resetFilters
}: SearchResultsProps) => {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          {loading ? 'Searching...' : `${results.length} results for "${query}"`}
        </p>
        
        <div className="flex items-center gap-2">
          <Select value={filters.sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px] text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map(product => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              discount={product.originalPrice ? Math.round((1 - (product.price / product.originalPrice)) * 100) : 0}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={resetFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};
