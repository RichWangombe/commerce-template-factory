
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const SearchInput = ({ className = '', minimal = false }: { className?: string, minimal?: boolean }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

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

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`pr-16 transition-all ${minimal ? 'h-9' : 'h-10'} ${isFocused ? 'ring-2 ring-ring ring-offset-1' : ''}`}
        />
        
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
    </form>
  );
};
