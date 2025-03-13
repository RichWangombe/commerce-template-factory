
import React from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description?: string;
  rating?: number;
  discount?: number;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4;
  skeletonCount?: number;
}

export const ProductGrid = ({
  products,
  loading = false,
  columns = 3,
  skeletonCount = 6,
}: ProductGridProps) => {
  // Determine the grid columns class based on the columns prop
  const gridColumnsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  if (loading) {
    return (
      <div className={`grid ${gridColumnsClass} gap-6`}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid ${gridColumnsClass} gap-6`}>
      {products.map(product => (
        <ProductCard 
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          image={product.image}
          category={product.category}
          discount={product.originalPrice ? Math.round((1 - (product.price / product.originalPrice)) * 100) : (product.discount || 0)}
        />
      ))}
    </div>
  );
};
