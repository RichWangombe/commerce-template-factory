
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
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export const useProductSearch = (query: string) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Load saved filters from user preferences if available
  const [filters, setFilters] = useState<FilterState>({
    priceRange: preferences.preferredPriceRange || [0, 1000],
    category: 'all',
    sort: 'relevance'
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
  }, []);

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

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = mockProducts.filter(product => {
        const matchesSearch = 
          product.name.toLowerCase().includes(query.toLowerCase()) || 
          (product.category && product.category.toLowerCase().includes(query.toLowerCase()));
          
        const matchesCategory = filters.category === 'all' || product.category === filters.category;
        const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        
        return matchesSearch && matchesCategory && matchesPrice;
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
        rating: 0 // Default rating
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
      sort: 'relevance'
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
    clearRecentSearches
  };
};
