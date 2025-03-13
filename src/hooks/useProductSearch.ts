
import { useState, useEffect } from 'react';
import { mockProducts } from '@/data/mockProducts';

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

export const useProductSearch = (query: string) => {
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    category: 'all',
    sort: 'relevance'
  });

  // Extract unique categories from mock products
  const categories = ['all', ...Array.from(new Set(mockProducts.map(product => product.category)))];

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = mockProducts.filter(product => {
        const matchesSearch = 
          product.name.toLowerCase().includes(query.toLowerCase()) || 
          (product.description && product.description.toLowerCase().includes(query.toLowerCase())) ||
          product.category.toLowerCase().includes(query.toLowerCase());
          
        const matchesCategory = filters.category === 'all' || product.category === filters.category;
        const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        
        return matchesSearch && matchesCategory && matchesPrice;
      });
      
      let sortedResults = [...filtered];
      switch(filters.sort) {
        case 'price-low':
          sortedResults.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          sortedResults.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sortedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        default:
          break;
      }
      
      setResults(sortedResults);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query, filters]);

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

  return {
    results,
    loading,
    filters,
    setFilters,
    categories,
    handleSortChange,
    resetFilters
  };
};
