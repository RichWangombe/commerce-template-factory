
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { ProductGrid } from '@/components/ProductGrid';
import { useProducts } from '@/utils/dataFetchers';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AllProductsPage = () => {
  const { data: products, isLoading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState(products || []);

  useEffect(() => {
    if (products) {
      setFilteredProducts(products);
    }
  }, [products]);

  return (
    <MainLayout>
      <div className="container px-4 py-8 mx-auto">
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'All Products', href: '#' }
          ]} 
        />
        
        <h1 className="text-3xl font-bold mt-8 mb-6">All Products</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingIndicator size="lg" text="Loading products..." />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="my-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was an error loading the products. Please try again later.
            </AlertDescription>
          </Alert>
        ) : (
          <ProductGrid 
            products={filteredProducts.map(product => ({
              ...product,
              // Ensure category is always provided
              category: product.category || 'Uncategorized'
            }))} 
            columns={4} 
          />
        )}
      </div>
    </MainLayout>
  );
};

export default AllProductsPage;
