
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { PriceRangeFilter } from './PriceRangeFilter';
import { CategoryFilter } from './CategoryFilter';
import { RatingFilter } from './RatingFilter';
import { FilterState } from '@/types/search';

interface FiltersContentProps {
  filters: FilterState;
  categories: string[];
  setFilters: Dispatch<SetStateAction<FilterState>>;
  resetFilters: () => void;
}

export const FiltersContent = ({ 
  filters, 
  categories, 
  setFilters, 
  resetFilters 
}: FiltersContentProps) => {
  
  const handlePriceChange = (value: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
  };
  
  const handleRatingChange = (value: number) => {
    setFilters(prev => ({ ...prev, rating: value }));
  };

  return (
    <div className="space-y-6">
      <PriceRangeFilter 
        priceRange={filters.priceRange} 
        onChange={handlePriceChange} 
      />
      
      <CategoryFilter 
        category={filters.category} 
        categories={categories} 
        onChange={handleCategoryChange} 
      />
      
      <RatingFilter 
        rating={filters.rating} 
        onChange={handleRatingChange} 
      />
      
      <div className="pt-2">
        <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
