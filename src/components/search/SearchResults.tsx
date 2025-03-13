
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductGrid } from '@/components/ProductGrid';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Save } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { toast } from 'sonner';

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

interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

interface SearchResultsProps {
  loading: boolean;
  results: Product[];
  allResults: Product[];
  query: string;
  filters: {
    sort: string;
    priceRange: [number, number];
  };
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onSortChange: (value: string) => void;
  resetFilters: () => void;
}

export const SearchResults = ({
  loading,
  results,
  allResults,
  query,
  filters,
  pagination,
  onPageChange,
  onSortChange,
  resetFilters
}: SearchResultsProps) => {
  const { updatePreferences } = useUserPreferences();
  
  const savePreferences = () => {
    updatePreferences({
      preferredPriceRange: filters.priceRange
    });
    toast.success('Search preferences saved');
  };
  
  const renderPagination = () => {
    const { currentPage, totalPages } = pagination;
    
    if (totalPages <= 1) return null;
    
    const pageItems = [];
    // Always show first page
    pageItems.push(
      <PaginationItem key="page-1">
        <PaginationLink 
          isActive={currentPage === 1} 
          onClick={() => onPageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Show ellipsis if needed
    if (currentPage > 3) {
      pageItems.push(
        <PaginationItem key="ellipsis-1">
          <PaginationLink className="cursor-default">...</PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last as they're always shown
      pageItems.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pageItems.push(
        <PaginationItem key="ellipsis-2">
          <PaginationLink className="cursor-default">...</PaginationLink>
        </PaginationItem>
      );
    }
    
    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageItems.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink 
            isActive={currentPage === totalPages} 
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {pageItems}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          {loading ? 'Searching...' : `${allResults.length} results for "${query}"`}
        </p>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={savePreferences}
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Preferences</span>
          </Button>
          
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
        <>
          <ProductGrid 
            products={results} 
            loading={loading} 
            columns={3}
            skeletonCount={pagination.pageSize}
          />
          {renderPagination()}
        </>
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
