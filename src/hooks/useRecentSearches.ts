
import { useState, useEffect } from 'react';

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load saved searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Add a search to recent searches
  const addRecentSearch = (query: string) => {
    if (query && query.trim() !== '') {
      // Skip if the query is already the most recent search
      if (recentSearches[0] !== query) {
        const updatedSearches = [query, ...recentSearches.filter(search => search !== query)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      }
    }
  };

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return { recentSearches, addRecentSearch, clearRecentSearches };
};
