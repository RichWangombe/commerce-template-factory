
import React from 'react';
import { Sparkles } from 'lucide-react';
import { ProductInterface, ProductGridItem } from '@/components/new-arrivals/types';
import { ProductGrid } from '@/components/ProductGrid';

interface AllProductsSectionProps {
  products: ProductInterface[];
  mapToGridItem: (product: ProductInterface) => ProductGridItem;
}

export const AllProductsSection = ({ products, mapToGridItem }: AllProductsSectionProps) => {
  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">All New Arrivals</h2>
      </div>
      <ProductGrid 
        products={products.map(mapToGridItem)}
        columns={4} 
      />
    </div>
  );
};
