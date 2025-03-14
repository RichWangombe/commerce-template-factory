
import { ProductGrid } from '@/components/ProductGrid';
import { ResultsHeader } from './ResultsHeader';
import { NoResultsMessage } from './NoResultsMessage';
import { PaginationControls } from './PaginationControls';

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
  return (
    <div className="flex-1">
      <ResultsHeader
        loading={loading}
        resultsCount={allResults.length}
        query={query}
        filters={filters}
        onSortChange={onSortChange}
      />
      
      {results.length > 0 || loading ? (
        <>
          <ProductGrid 
            products={results} 
            loading={loading} 
            columns={3}
            skeletonCount={pagination.pageSize}
          />
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </>
      ) : (
        <NoResultsMessage resetFilters={resetFilters} />
      )}
    </div>
  );
};
