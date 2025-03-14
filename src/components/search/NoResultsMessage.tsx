
import { Button } from '@/components/ui/button';

interface NoResultsMessageProps {
  resetFilters: () => void;
}

export const NoResultsMessage = ({ resetFilters }: NoResultsMessageProps) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium mb-2">No results found</h3>
      <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
      <Button variant="outline" onClick={resetFilters}>Clear Filters</Button>
    </div>
  );
};
