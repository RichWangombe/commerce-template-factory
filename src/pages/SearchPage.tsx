
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchInput } from '@/components/SearchInput';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';
import { RecentSearches } from '@/components/search/RecentSearches';
import { CompareProducts } from '@/components/search/CompareProducts';
import { SearchAnalytics } from '@/components/search/SearchAnalytics';
import { useProductSearch } from '@/hooks/useProductSearch';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts';

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
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
    clearRecentSearches,
    searchAnalytics,
    autocompleteSuggestions
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

  useEffect(() => {
    // Keyboard shortcut for analytics panel: Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'A' && e.shiftKey) {
        setShowAnalytics(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8 container px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Results</h1>
          <div className="flex flex-col gap-4">
            <SearchInput 
              className="max-w-xl" 
              suggestions={autocompleteSuggestions}
              recentSearches={recentSearches}
            />
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
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              {loading ? (
                <LoadingIndicator size="sm" text="Searching..." />
              ) : (
                <div className="flex gap-4">
                  <CompareProducts products={allResults} />
                  <button 
                    onClick={() => setShowAnalytics(prev => !prev)}
                    className="text-sm text-muted-foreground hover:text-foreground transition"
                  >
                    {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                  </button>
                </div>
              )}
            </div>
            
            {showAnalytics && searchAnalytics && searchAnalytics.length > 0 && (
              <div className="mb-8">
                <SearchAnalytics analytics={searchAnalytics} />
              </div>
            )}
            
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
        </div>
      </main>

      <KeyboardShortcuts />
      <Footer />
    </div>
  );
};

export default SearchPage;
