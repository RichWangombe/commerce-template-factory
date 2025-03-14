
import { useState, useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { FilterState, PaginationState, SearchProduct } from '@/types/search';
import { useRecentSearches } from './useRecentSearches';
import { useSearchAnalytics } from './useSearchAnalytics';
import { 
  getUniqueCategories, 
  filterProducts, 
  sortProducts,
  generateAutocompleteSuggestions,
  paginateProducts,
  calculateTotalPages
} from '@/utils/searchUtils';

export const useProductSearch = (query: string) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();
  const { searchAnalytics, trackSearch } = useSearchAnalytics();
  
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  
  // Get unique categories
  const categories = getUniqueCategories();
  
  // Load saved filters from user preferences if available
  const [filters, setFilters] = useState<FilterState>({
    priceRange: preferences.preferredPriceRange || [0, 1000],
    category: 'all',
    sort: 'relevance',
    rating: 0
  });
  
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 6 // Show 6 items per page
  });

  // Add the current search to recent searches
  useEffect(() => {
    if (query) {
      addRecentSearch(query);
    }
  }, [query]);

  // Generate autocomplete suggestions
  useEffect(() => {
    const suggestions = generateAutocompleteSuggestions(query, categories);
    setAutocompleteSuggestions(suggestions);
  }, [query, categories]);

  // Save filter state to user preferences
  useEffect(() => {
    updatePreferences({
      preferredPriceRange: filters.priceRange
    });
  }, [filters.priceRange, updatePreferences]);

  // Perform search and apply filters
  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      // Filter products based on query and filters
      const filteredProducts = filterProducts(query, filters);
      
      // Sort results
      const sortedProducts = sortProducts(filteredProducts, filters.sort);
      
      setResults(sortedProducts);
      
      // Calculate pagination
      const totalPages = calculateTotalPages(sortedProducts.length, pagination.pageSize);
      setPagination(prev => ({
        ...prev,
        totalPages,
        currentPage: prev.currentPage > totalPages ? 1 : prev.currentPage
      }));
      
      // Get paginated results
      const paginatedProducts = paginateProducts(
        sortedProducts, 
        pagination.currentPage, 
        pagination.pageSize
      );
      setFilteredResults(paginatedProducts);
      
      setLoading(false);
      
      // Track search analytics
      if (query) {
        trackSearch(query, sortedProducts.length, filters);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query, filters, pagination.currentPage, pagination.pageSize]);

  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sort: value }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      category: 'all',
      sort: 'relevance',
      rating: 0
    });
  };
  
  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages))
    }));
  };

  return {
    results: filteredResults,
    allResults: results,
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
  };
};

// Re-export types for convenience
export type { SearchProduct, FilterState, PaginationState, SearchAnalytics } from '@/types/search';
