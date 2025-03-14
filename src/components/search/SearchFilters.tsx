
import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from 'lucide-react';
import { FilterState } from '@/types/search';
import { FiltersContent } from './filters/FiltersContent';

interface SearchFiltersProps {
  filters: FilterState;
  categories: string[];
  setFilters: Dispatch<SetStateAction<FilterState>>;
  isMobile?: boolean;
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
}

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
