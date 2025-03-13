
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductGrid } from '@/components/ProductGrid';

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
      
      {results.length > 0 || loading ? (
        <ProductGrid 
          products={results} 
          loading={loading} 
          columns={3}
          skeletonCount={6}
        />
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
