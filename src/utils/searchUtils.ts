
import { mockProducts } from '@/data/mockProducts';
import { SearchProduct, FilterState } from '@/types/search';

// Extract unique categories from mock products
export const getUniqueCategories = (): string[] => {
  return ['all', ...Array.from(new Set(mockProducts.map(product => product.category || '')))];
};

// Filter products based on search query and filters
export const filterProducts = (query: string, filters: FilterState): SearchProduct[] => {
  const filtered = mockProducts.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(query.toLowerCase()) || 
      (product.category && product.category.toLowerCase().includes(query.toLowerCase()));
      
    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    
    // Add rating filter
    const productRating = product.rating !== undefined ? product.rating : Math.floor(Math.random() * 5) + 1;
    const matchesRating = productRating >= filters.rating;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });
  
  // Convert to SearchProduct with default values for missing fields
  return filtered.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.discount ? product.price * (1 + product.discount / 100) : undefined,
    image: product.image,
    category: product.category || '',
    description: '', // Default empty description
    rating: product.rating !== undefined ? product.rating : Math.floor(Math.random() * 5) + 1
  }));
};

// Sort products based on sort option
export const sortProducts = (products: SearchProduct[], sortOption: string): SearchProduct[] => {
  const sortedResults = [...products];
  
  switch(sortOption) {
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
  
  return sortedResults;
};

// Generate autocomplete suggestions based on query
export const generateAutocompleteSuggestions = (
  query: string, 
  categories: string[]
): string[] => {
  if (query && query.length > 1) {
    const productNames = mockProducts.map(product => product.name);
    const productCategories = categories.filter(cat => cat !== 'all');
    
    const allTerms = [...productNames, ...productCategories];
    return allTerms
      .filter(term => term.toLowerCase().includes(query.toLowerCase()))
      .filter((term, index, self) => self.indexOf(term) === index) // Remove duplicates
      .slice(0, 5); // Limit to 5 suggestions
  }
  
  return [];
};

// Paginate products
export const paginateProducts = (
  products: SearchProduct[],
  currentPage: number,
  pageSize: number
): SearchProduct[] => {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return products.slice(startIndex, endIndex);
};

// Calculate total pages
export const calculateTotalPages = (totalItems: number, pageSize: number): number => {
  return Math.max(1, Math.ceil(totalItems / pageSize));
};
