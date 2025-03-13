
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, History } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SearchInputProps {
  className?: string;
  minimal?: boolean;
  suggestions?: string[];
  recentSearches?: string[];
}

export const SearchInput = ({ 
  className = '', 
  minimal = false,
  suggestions = [],
  recentSearches = []
}: SearchInputProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const showSuggestions = isFocused && (suggestions.length > 0 || recentSearches.length > 0);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsPopoverOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle keyboard navigation for suggestions
    const combinedSuggestions = [...recentSearches, ...suggestions].filter((item, index, self) => 
      self.indexOf(item) === index
    );
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev < combinedSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => 
        prev > 0 ? prev - 1 : combinedSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (activeSuggestion >= 0 && activeSuggestion < combinedSuggestions.length) {
        e.preventDefault();
        handleSearch(combinedSuggestions[activeSuggestion]);
      } else if (query.trim()) {
        e.preventDefault();
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsPopoverOpen(false);
      inputRef.current?.blur();
    } else if (e.key === '/' && e.metaKey) {
      // Command/Ctrl + / to focus search (keyboard shortcut)
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    // Reset active suggestion when query changes
    setActiveSuggestion(-1);
  }, [query]);

  useEffect(() => {
    // Add touch-friendly keyboard behavior for mobile
    const handleKeyboardOpen = () => {
      // Scroll to make input visible when keyboard opens on mobile
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    };

    inputRef.current?.addEventListener('focus', handleKeyboardOpen);
    
    return () => {
      inputRef.current?.removeEventListener('focus', handleKeyboardOpen);
    };
  }, []);

  useEffect(() => {
    // Add keyboard shortcut listener to document
    const handleKeyPress = (e: KeyboardEvent) => {
      // '/' to focus search (if not already in an input field)
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress as unknown as EventListener);
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress as unknown as EventListener);
    };
  }, []);

  // Filter out duplicates between suggestions and recent searches
  const filteredSuggestions = suggestions.filter(
    suggestion => !recentSearches.includes(suggestion)
  );

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Popover open={showSuggestions && isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search products... (Press / to focus)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { setIsFocused(true); setIsPopoverOpen(true); }}
              onBlur={() => { setIsFocused(false); }}
              onKeyDown={handleKeyDown}
              className={`pr-16 transition-all ${minimal ? 'h-9' : 'h-10'} ${isFocused ? 'ring-2 ring-ring ring-offset-1' : ''}`}
            />
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto" align="start">
            <Command>
              <CommandList>
                {recentSearches.length > 0 && (
                  <CommandGroup heading="Recent Searches">
                    {recentSearches.map((search, index) => (
                      <CommandItem
                        key={`recent-${index}`}
                        onSelect={() => handleSearch(search)}
                        className={`flex items-center ${index === activeSuggestion ? 'bg-accent' : ''}`}
                      >
                        <History className="h-4 w-4 mr-2 text-muted-foreground" />
                        {search}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {filteredSuggestions.length > 0 && (
                  <CommandGroup heading="Suggestions">
                    {filteredSuggestions.map((suggestion, index) => (
                      <CommandItem
                        key={`suggestion-${index}`}
                        onSelect={() => handleSearch(suggestion)}
                        className={`flex items-center ${recentSearches.length + index === activeSuggestion ? 'bg-accent' : ''}`}
                      >
                        <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                <CommandEmpty>No matching suggestions</CommandEmpty>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {query && (
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            onClick={clearSearch}
            className="absolute right-8 h-full aspect-square"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost" 
          className="absolute right-0 h-full aspect-square"
          disabled={!query.trim()}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      
      {minimal && (
        <div className="absolute right-12 -top-1 text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
          /
        </div>
      )}
    </form>
  );
};
