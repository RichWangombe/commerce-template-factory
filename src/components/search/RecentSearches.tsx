
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { History, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RecentSearchesProps {
  searches: string[];
  onClearAll: () => void;
}

export const RecentSearches = ({ searches, onClearAll }: RecentSearchesProps) => {
  const navigate = useNavigate();
  
  const handleSearchClick = (search: string) => {
    navigate(`/search?q=${encodeURIComponent(search)}`);
  };
  
  if (searches.length === 0) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center text-sm text-muted-foreground">
        <History className="h-4 w-4 mr-1" />
        Recent:
      </div>
      
      {searches.map((search, index) => (
        <Badge 
          key={`${search}-${index}`}
          variant="outline"
          className="cursor-pointer hover:bg-secondary transition-colors"
          onClick={() => handleSearchClick(search)}
        >
          {search}
        </Badge>
      ))}
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 px-2"
        onClick={onClearAll}
      >
        <X className="h-3 w-3 mr-1" />
        Clear
      </Button>
    </div>
  );
};
