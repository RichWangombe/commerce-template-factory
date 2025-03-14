
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { toast } from 'sonner';

interface ResultsHeaderProps {
  loading: boolean;
  resultsCount: number;
  query: string;
  filters: {
    sort: string;
    priceRange: [number, number];
  };
  onSortChange: (value: string) => void;
}

export const ResultsHeader = ({
  loading,
  resultsCount,
  query,
  filters,
  onSortChange,
}: ResultsHeaderProps) => {
  const { updatePreferences } = useUserPreferences();
  
  const savePreferences = () => {
    updatePreferences({
      preferredPriceRange: filters.priceRange
    });
    toast.success('Search preferences saved');
  };
  
  return (
    <div className="flex justify-between items-center mb-6">
      <p className="text-sm text-muted-foreground">
        {loading ? 'Searching...' : `${resultsCount} results for "${query}"`}
      </p>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={savePreferences}
        >
          <Save className="h-4 w-4" />
          <span className="hidden sm:inline">Save Preferences</span>
        </Button>
        
        <Select value={filters.sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
