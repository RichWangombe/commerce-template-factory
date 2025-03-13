
import { useState, useEffect } from 'react';
import { mockProducts } from '@/data/mockProducts';
import { ProductCardProps } from '@/components/ProductCard';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export interface SearchProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
}

export interface FilterState {
  priceRange: [number, number];
  category: string;
  sort: string;
  rating: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface SearchAnalytics {
  query: string;
  timestamp: string;
  resultsCount: number;
  filters: FilterState;
}

export const useProductSearch = (query: string) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalytics[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  
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

  // Extract unique categories from mock products
  const categories = ['all', ...Array.from(new Set(mockProducts.map(product => product.category || '')))];

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    // Load search analytics from localStorage
    const savedAnalytics = localStorage.getItem('searchAnalytics');
    if (savedAnalytics) {
      setSearchAnalytics(JSON.parse(savedAnalytics));
    }
  }, []);

  // Generate autocomplete suggestions based on product names and categories
  useEffect(() => {
    if (query && query.length > 1) {
      const productNames = mockProducts.map(product => product.name);
      const productCategories = categories.filter(cat => cat !== 'all');
      
      const allTerms = [...productNames, ...productCategories];
      const suggestions = allTerms
        .filter(term => term.toLowerCase().includes(query.toLowerCase()))
        .filter((term, index, self) => self.indexOf(term) === index) // Remove duplicates
        .slice(0, 5); // Limit to 5 suggestions
      
      setAutocompleteSuggestions(suggestions);
    } else {
      setAutocompleteSuggestions([]);
    }
  }, [query, categories]);

  // Save the current search query to recent searches
  useEffect(() => {
    if (query && query.trim() !== '') {
      // Skip if the query is already the most recent search
      if (recentSearches[0] !== query) {
        const updatedSearches = [query, ...recentSearches.filter(search => search !== query)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      }
    }
  }, [query, recentSearches]);

  // Save filter state to user preferences
  useEffect(() => {
    updatePreferences({
      preferredPriceRange: filters.priceRange
    });
  }, [filters.priceRange, updatePreferences]);

  // Track search analytics
  useEffect(() => {
    if (query) {
      const analytics: SearchAnalytics = {
        query,
        timestamp: new Date().toISOString(),
        resultsCount: results.length,
        filters
      };
      
      // Add to analytics array
      const updatedAnalytics = [analytics, ...searchAnalytics].slice(0, 20); // Keep only 20 most recent
      setSearchAnalytics(updatedAnalytics);
      
      // Save to localStorage
      localStorage.setItem('searchAnalytics', JSON.stringify(updatedAnalytics));
      
      // In a real application, you would send this to your analytics service
      console.log('Search analytics:', analytics);
    }
  }, [query, results.length, filters]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = mockProducts.filter(product => {
        const matchesSearch = 
          product.name.toLowerCase().includes(query.toLowerCase()) || 
          (product.category && product.category.toLowerCase().includes(query.toLowerCase()));
          
        const matchesCategory = filters.category === 'all' || product.category === filters.category;
        const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        
        // Add rating filter - assume all products have a rating between 0-5
        // For mock data, generate a random rating if not present
        const productRating = product.rating !== undefined ? product.rating : Math.floor(Math.random() * 5) + 1;
        const matchesRating = productRating >= filters.rating;
        
        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
      });
      
      // Convert ProductCardProps to SearchProduct with default values for missing fields
      const searchProducts: SearchProduct[] = filtered.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.discount ? product.price * (1 + product.discount / 100) : undefined,
        image: product.image,
        category: product.category || '',
        description: '', // Default empty description
        rating: product.rating !== undefined ? product.rating : Math.floor(Math.random() * 5) + 1 // Random rating if not present
      }));
      
      let sortedResults = [...searchProducts];
      switch(filters.sort) {
        case 'price-low':
          sortedResults.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          sortedResults.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sortedResults.sort((a, b) => b.rating - a.rating);
          break;
        default:
          break;
      }
      
      setResults(sortedResults);
      
      // Calculate pagination
      const totalPages = Math.ceil(sortedResults.length / pagination.pageSize);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.max(1, totalPages),
        currentPage: prev.currentPage > totalPages ? 1 : prev.currentPage
      }));
      
      // Get paginated results
      const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
      const endIndex = startIndex + pagination.pageSize;
      setFilteredResults(sortedResults.slice(startIndex, endIndex));
      
      setLoading(false);
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
  
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
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
