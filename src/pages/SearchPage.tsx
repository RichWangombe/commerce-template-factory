import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchInput } from '@/components/SearchInput';
import { SearchFilters } from '@/components/search/SearchFilters';
import { SearchResults } from '@/components/search/SearchResults';

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

  const categories = ['all', ...Array.from(new Set(mockProducts.map(product => product.category)))];

  useEffect(() => {
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
        default:
          break;
      }
      
      setResults(sortedResults);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query, filters]);

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8 container px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Results</h1>
          <SearchInput className="max-w-xl" />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <SearchFilters 
            filters={filters}
            categories={categories}
            setFilters={setFilters}
            isMobile={true}
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
          />
          
          <div className="lg:hidden mb-4">
            <SearchFilters 
              filters={filters}
              categories={categories}
              setFilters={setFilters}
              isMobile={true}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />
          </div>
          
          <SearchResults 
            loading={loading}
            results={results}
            query={query}
            filters={filters}
            onSortChange={handleSortChange}
            resetFilters={resetFilters}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
