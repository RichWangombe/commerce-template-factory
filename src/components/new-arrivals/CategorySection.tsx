
import React from 'react';
import { Rocket } from 'lucide-react';
import { ProductInterface, ProductGridItem } from '@/components/new-arrivals/types';
import { ProductGrid } from '@/components/ProductGrid';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface CategorySectionProps {
  category: string;
  products: ProductInterface[];
  mapToGridItem: (product: ProductInterface) => ProductGridItem;
}

export const CategorySection = ({ category, products, mapToGridItem }: CategorySectionProps) => {
  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">New in {category}</h2>
      </div>
      
      {products.length > 2 ? (
        <Carousel className="w-full">
          <CarouselContent>
            {products.map(product => (
              <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-0">
                    <div className="p-1">
                      <ProductGrid 
                        products={[mapToGridItem(product)]}
                        columns={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0 translate-x-0 ml-auto" />
            <CarouselNext className="static translate-y-0 translate-x-0" />
          </div>
        </Carousel>
      ) : (
        <ProductGrid 
          products={products.map(mapToGridItem)}
          columns={products.length < 3 ? products.length as 1 | 2 : 3} 
        />
      )}
    </div>
  );
};
