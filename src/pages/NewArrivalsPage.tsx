
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { useProducts } from '@/utils/dataFetchers';
import { 
  ProductInterface, 
  ProductGridItem, 
  GroupedProducts 
} from '@/components/new-arrivals/types';
import { HeroBanner } from '@/components/new-arrivals/HeroBanner';
import { FeaturedProduct } from '@/components/new-arrivals/FeaturedProduct';
import { CategorySection } from '@/components/new-arrivals/CategorySection';
import { AllProductsSection } from '@/components/new-arrivals/AllProductsSection';
import { 
  LoadingState, 
  ErrorState, 
  EmptyState 
} from '@/components/new-arrivals/LoadingAndErrorStates';

const NewArrivalsPage = () => {
  const { data: products, isLoading, error } = useProducts();
  const [newProducts, setNewProducts] = useState<ProductInterface[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<ProductInterface | null>(null);

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

  // Helper function to map our Product type to ProductGridItem
  const mapToGridItem = (product: ProductInterface): ProductGridItem => ({
    ...product,
    category: product.category || 'Uncategorized'
  });

  return (
    <MainLayout>
      <HeroBanner />

      <div className="container px-4 py-8 mx-auto">
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'New Arrivals', href: '/new-arrivals' }
          ]} 
        />
        
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : newProducts.length === 0 && !featuredProduct ? (
          <EmptyState />
        ) : (
          <>
            {/* Featured Product Spotlight */}
            {featuredProduct && <FeaturedProduct product={featuredProduct} />}
            
            {/* Category Carousels */}
            {Object.entries(groupedProducts).length > 0 && (
              <div className="mt-12 space-y-12">
                {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                  categoryProducts.length > 0 && (
                    <CategorySection 
                      key={category}
                      category={category}
                      products={categoryProducts}
                      mapToGridItem={mapToGridItem}
                    />
                  )
                ))}
              </div>
            )}
            
            {/* More New Arrivals */}
            {newProducts.length > 0 && Object.keys(groupedProducts).length === 0 && (
              <AllProductsSection 
                products={newProducts}
                mapToGridItem={mapToGridItem}
              />
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default NewArrivalsPage;
