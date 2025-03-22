
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { ProductGrid } from '@/components/ProductGrid';
import { useProducts } from '@/utils/dataFetchers';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Sparkles, TrendingUp, Star, Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

// Define types for our products and grouped products
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
  rating?: number;
  discount?: number;
  originalPrice?: number;
}

type GroupedProducts = Record<string, Product[]>;

const NewArrivalsPage = () => {
  const { data: products, isLoading, error } = useProducts();
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products) {
      // Find products marked as new
      const filtered = products.filter(product => 
        product.isNew === true || 
        // As a fallback, take some products from the top of the list
        (products.indexOf(product) < 8)
      );
      
      // Set the first product as featured if available
      if (filtered.length > 0) {
        setFeaturedProduct(filtered[0]);
        // Remove the featured product from the regular grid
        setNewProducts(filtered.slice(1));
      } else {
        setNewProducts(filtered);
      }
    }
  }, [products]);

  // Group products by category for better organization
  const groupedProducts = newProducts.reduce<GroupedProducts>((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <MainLayout>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
          </div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
              New Arrivals <Sparkles className="h-8 w-8" />
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Discover our latest products, hot off the shelves and ready to elevate your tech experience.
            </p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'New Arrivals', href: '/new-arrivals' }
          ]} 
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingIndicator size="lg" text="Loading new arrivals..." />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="my-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error loading the new arrivals. Please try again later.
            </AlertDescription>
          </Alert>
        ) : newProducts.length === 0 && !featuredProduct ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No new arrivals yet</h3>
            <p className="text-muted-foreground mt-2">
              Check back soon for new products!
            </p>
          </div>
        ) : (
          <>
            {/* Featured Product Spotlight */}
            {featuredProduct && (
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
                          src={featuredProduct.image} 
                          alt={featuredProduct.name}
                          className="object-contain w-full h-full transition-all duration-300 hover:scale-105"
                        />
                        <div className="absolute top-0 right-0 bg-primary text-white text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                          <Sparkles className="h-3.5 w-3.5" />
                          New
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{featuredProduct.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-muted-foreground">{featuredProduct.category}</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(featuredProduct.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="ml-1 text-sm text-muted-foreground">
                            {featuredProduct.rating}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-2xl font-bold mb-4">
                        ${featuredProduct.price.toFixed(2)}
                      </div>
                      
                      <p className="text-muted-foreground mb-6">
                        Be the first to experience our latest innovation. This product has just arrived and is ready to revolutionize your tech collection.
                      </p>
                      
                      <div className="flex gap-3">
                        <a 
                          href={`/product/${featuredProduct.id}`}
                          className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Category Carousels */}
            {Object.entries(groupedProducts).length > 0 && (
              <div className="mt-12 space-y-12">
                {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                  categoryProducts.length > 0 && (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-4">
                        <Rocket className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold">New in {category}</h2>
                      </div>
                      
                      {categoryProducts.length > 2 ? (
                        <Carousel className="w-full">
                          <CarouselContent>
                            {categoryProducts.map(product => (
                              <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
                                <Card className="border-0 shadow-sm">
                                  <CardContent className="p-0">
                                    <div className="p-1">
                                      <ProductGrid 
                                        products={[{
                                          ...product,
                                          category: product.category || 'Uncategorized',
                                          isNew: true
                                        }]} 
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
                          products={categoryProducts.map(product => ({
                            ...product,
                            category: product.category || 'Uncategorized',
                            isNew: true
                          }))} 
                          columns={categoryProducts.length < 3 ? categoryProducts.length as 1 | 2 : 3} 
                        />
                      )}
                    </div>
                  )
                ))}
              </div>
            )}
            
            {/* More New Arrivals */}
            {newProducts.length > 0 && Object.keys(groupedProducts).length === 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">All New Arrivals</h2>
                </div>
                <ProductGrid 
                  products={newProducts.map(product => ({
                    ...product,
                    category: product.category || 'Uncategorized',
                    isNew: true
                  }))} 
                  columns={4} 
                />
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default NewArrivalsPage;
