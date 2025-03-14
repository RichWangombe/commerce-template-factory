
import { useState, useEffect } from 'react';
import { SearchAnalytics, FilterState } from '@/types/search';

export const useSearchAnalytics = () => {
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalytics[]>([]);

  // Load search analytics from localStorage
  useEffect(() => {
    const savedAnalytics = localStorage.getItem('searchAnalytics');
    if (savedAnalytics) {
      setSearchAnalytics(JSON.parse(savedAnalytics));
    }
  }, []);

  // Track a new search
  const trackSearch = (query: string, resultsCount: number, filters: FilterState) => {
    if (query) {
      const analytics: SearchAnalytics = {
        query,
        timestamp: new Date().toISOString(),
        resultsCount,
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
  };

  return { searchAnalytics, trackSearch };
};
