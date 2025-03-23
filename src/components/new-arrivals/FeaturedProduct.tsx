
import React from 'react';
import { Star, Sparkles, TrendingUp } from 'lucide-react';
import { ProductInterface } from '@/components/new-arrivals/types';

interface FeaturedProductProps {
  product: ProductInterface;
}

export const FeaturedProduct = ({ product }: FeaturedProductProps) => {
  if (!product) return null;

  return (
    <div className="my-12">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Featured New Arrival</h2>
      </div>
      
      <div className="bg-muted/40 rounded-xl p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white rounded-lg p-8 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-xs mx-auto">
              <img 
                src={product.image} 
                alt={product.name}
                className="object-contain w-full h-full transition-all duration-300 hover:scale-105"
              />
              <div className="absolute top-0 right-0 bg-primary text-white text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                New
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-muted-foreground">{product.category || 'Uncategorized'}</span>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="ml-1 text-sm text-muted-foreground">
                  {product.rating}
                </span>
              </div>
            </div>
            
            <div className="text-2xl font-bold mb-4">
              ${product.price.toFixed(2)}
            </div>
            
            <p className="text-muted-foreground mb-6">
              Be the first to experience our latest innovation. This product has just arrived and is ready to revolutionize your tech collection.
            </p>
            
            <div className="flex gap-3">
              <a 
                href={`/product/${product.id}`}
                className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
