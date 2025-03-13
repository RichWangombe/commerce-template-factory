
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchInput } from '@/components/SearchInput';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { useProductSearch } from '@/hooks/useProductSearch';
import { RecentSearches } from '@/components/search/RecentSearches';

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const {
    results,
    allResults,
    loading,
    filters,
    setFilters,
    categories,
    handleSortChange,
    resetFilters,
    pagination,
    handlePageChange,
    recentSearches,
    clearRecentSearches
  } = useProductSearch(query);

  // Track search analytics
  useEffect(() => {
    if (query) {
      // In a real application, you would send this to your analytics service
      console.log('Search analytics:', {
        query,
        timestamp: new Date().toISOString(),
        resultsCount: allResults.length,
        filters
      });
    }
  }, [query, allResults.length, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8 container px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Results</h1>
          <div className="flex flex-col gap-4">
            <SearchInput className="max-w-xl" />
            {recentSearches.length > 0 && (
              <RecentSearches 
                searches={recentSearches} 
                onClearAll={clearRecentSearches} 
              />
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <SearchFilters 
            filters={filters}
            categories={categories}
            setFilters={setFilters}
            isMobile={false}
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
          />
          
          <div className="lg:hidden mb-4">
            <SearchFilters 
              filters={filters}
              categories={categories}
              setFilters={setFilters}
              isMobile={true}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />
          </div>
          
          <SearchResults 
            loading={loading}
            results={results}
            allResults={allResults}
            query={query}
            filters={filters}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
            resetFilters={resetFilters}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
