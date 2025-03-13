
import { Dispatch, SetStateAction } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, Star } from 'lucide-react';

interface FilterState {
  priceRange: [number, number];
  category: string;
  sort: string;
  rating: number;
}

interface SearchFiltersProps {
  filters: FilterState;
  categories: string[];
  setFilters: Dispatch<SetStateAction<FilterState>>;
  isMobile?: boolean;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

const FiltersContent = ({ filters, categories, setFilters, resetFilters }: {
  filters: FilterState;
  categories: string[];
  setFilters: Dispatch<SetStateAction<FilterState>>;
  resetFilters: () => void;
}) => {
  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
  };
  
  const handleRatingChange = (value: string) => {
    setFilters(prev => ({ ...prev, rating: parseInt(value) }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Price Range</h3>
          <span className="text-xs text-gray-500">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={[0, 1000]}
          min={0}
          max={1000}
          step={10}
          value={[filters.priceRange[0], filters.priceRange[1]]}
          onValueChange={handlePriceChange}
          className="mt-2"
        />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Category</h3>
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Minimum Rating</h3>
        <Select value={filters.rating.toString()} onValueChange={handleRatingChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select minimum rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any Rating</SelectItem>
            <SelectItem value="1">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="ml-1">& up</span>
              </div>
            </SelectItem>
            <SelectItem value="2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="ml-1">& up</span>
              </div>
            </SelectItem>
            <SelectItem value="3">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="ml-1">& up</span>
              </div>
            </SelectItem>
            <SelectItem value="4">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="ml-1">& up</span>
              </div>
            </SelectItem>
            <SelectItem value="5">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="ml-1">Only</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-2">
        <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export const SearchFilters = ({ 
  filters, 
  categories, 
  setFilters, 
  isMobile = false,
  mobileFiltersOpen,
  setMobileFiltersOpen
}: SearchFiltersProps) => {
  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      category: 'all',
      sort: 'relevance',
      rating: 0
    });
  };

  if (isMobile) {
    return (
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Narrow down your search results</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FiltersContent 
              filters={filters} 
              categories={categories} 
              setFilters={setFilters} 
              resetFilters={resetFilters}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <FiltersContent 
          filters={filters} 
          categories={categories} 
          setFilters={setFilters} 
          resetFilters={resetFilters}
        />
      </div>
    </div>
  );
};
