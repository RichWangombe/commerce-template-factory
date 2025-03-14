
export interface SearchProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
}

export interface FilterState {
  priceRange: [number, number];
  category: string;
  sort: string;
  rating: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface SearchAnalytics {
  query: string;
  timestamp: string;
  resultsCount: number;
  filters: FilterState;
}
