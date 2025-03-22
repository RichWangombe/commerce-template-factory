
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { ProductGrid } from '@/components/ProductGrid';
import { useProducts } from '@/utils/dataFetchers';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const NewArrivalsPage = () => {
  const { data: products, isLoading, error } = useProducts();
  const [newProducts, setNewProducts] = useState<any[]>([]);

  useEffect(() => {
    if (products) {
      // Filter products that are marked as new or were recently added
      // For now, we'll just filter by the isNew flag, but in a real app
      // you might want to filter by createdAt date
      const filtered = products.filter(product => 
        product.isNew === true || 
        // As a fallback, take some products from the top of the list
        // This is just to ensure we have some products to display in our demo
        (newProducts.length < 3 && products.indexOf(product) < 8)
      );
      setNewProducts(filtered);
    }
  }, [products]);

  return (
    <MainLayout>
      <div className="container px-4 py-8 mx-auto">
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'New Arrivals', href: '/new-arrivals' }
          ]} 
        />
        
        <h1 className="text-3xl font-bold mt-8 mb-6">New Arrivals</h1>
        
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
        ) : newProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No new arrivals yet</h3>
            <p className="text-muted-foreground mt-2">
              Check back soon for new products!
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Check out our latest products and be the first to shop these new arrivals!
            </p>
            <ProductGrid 
              products={newProducts.map(product => ({
                ...product,
                // Ensure category is always provided
                category: product.category || 'Uncategorized',
                // Mark all products in this view as new
                isNew: true
              }))} 
              columns={4} 
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default NewArrivalsPage;
