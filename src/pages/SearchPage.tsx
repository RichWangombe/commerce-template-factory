
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchInput } from '@/components/SearchInput';
import { ProductCard } from '@/components/ProductCard';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Mock data - this would be replaced with actual API calls in a real implementation
const mockProducts = [
  {
    id: 1,
    name: "Wireless Noise-Canceling Headphones",
    price: 129.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000",
    category: "Audio",
    description: "Experience premium sound quality with these wireless noise-canceling headphones.",
    rating: 4.7
  },
  {
    id: 2,
    name: "Smart Fitness Tracker Watch",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000",
    category: "Wearables",
    description: "Monitor your health and fitness goals with this advanced smart fitness tracker.",
    rating: 4.5
  },
  {
    id: 3,
    name: "Ultra HD Smart TV 55-inch",
    price: 499.99,
    originalPrice: 649.99,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1000",
    category: "Home Entertainment",
    description: "Crystal clear 4K resolution with smart features and streaming capabilities.",
    rating: 4.3
  },
  {
    id: 4,
    name: "Professional Digital Camera",
    price: 899.99,
    originalPrice: 1099.99,
    image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=1000",
    category: "Photography",
    description: "Capture stunning photos and videos with this high-quality digital camera.",
    rating: 4.8
  },
  {
    id: 5,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000",
    category: "Audio",
    description: "Powerful sound in a compact, waterproof design for music on the go.",
    rating: 4.6
  }
];

interface FilterState {
  priceRange: [number, number];
  category: string;
  sort: string;
}

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [results, setResults] = useState<typeof mockProducts>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    category: 'all',
    sort: 'relevance'
  });

  // Categories derived from the products
  const categories = ['all', ...Array.from(new Set(mockProducts.map(product => product.category)))];

  useEffect(() => {
    // Simulate API call with delay
    setLoading(true);
    const timer = setTimeout(() => {
      const filtered = mockProducts.filter(product => {
        const matchesSearch = 
          product.name.toLowerCase().includes(query.toLowerCase()) || 
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase());
          
        const matchesCategory = filters.category === 'all' || product.category === filters.category;
        const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
        
        return matchesSearch && matchesCategory && matchesPrice;
      });
      
      // Apply sorting
      let sortedResults = [...filtered];
      switch(filters.sort) {
        case 'price-low':
          sortedResults.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          sortedResults.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sortedResults.sort((a, b) => b.rating - a.rating);
          break;
        // Default is relevance, which is the order returned from the search
        default:
          break;
      }
      
      setResults(sortedResults);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query, filters]);

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
  };

  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sort: value }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000],
      category: 'all',
      sort: 'relevance'
    });
  };

  const FiltersContent = () => (
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
      
      <div className="pt-2">
        <Button variant="outline" size="sm" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8 container px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Results</h1>
          <SearchInput className="max-w-xl" />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <FiltersContent />
            </div>
          </div>
          
          {/* Mobile Filters */}
          <div className="lg:hidden mb-4">
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
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                {loading ? 'Searching...' : `${results.length} results for "${query}"`}
              </p>
              
              <div className="flex items-center gap-2">
                <Select value={filters.sort} onValueChange={handleSortChange}>
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
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {results.map(product => (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.image}
                    rating={product.rating}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                <Button variant="outline" onClick={resetFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
