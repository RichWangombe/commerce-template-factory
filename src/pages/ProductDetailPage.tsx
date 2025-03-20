
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ProductImages } from "@/components/product/ProductImages";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RecommendationSection } from "@/components/home/RecommendationSection";
import { ProductTabs } from "@/components/product/ProductTabs";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { useRecommendations } from "@/contexts/recommendation";
import { ProductViewTracker } from "@/components/ProductViewTracker";
import { useProduct, useProductReviews } from "@/utils/dataFetchers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { recordProductView } = useRecommendations();
  const productId = parseInt(id || "0");
  
  const { data: product, isLoading, error } = useProduct(productId);
  const { data: reviews, isLoading: isLoadingReviews } = useProductReviews(productId);
  
  useEffect(() => {
    if (product && recordProductView) {
      recordProductView(product.id);
    }
  }, [product, recordProductView]);

  if (error || (!isLoading && !product)) {
    return (
      <MainLayout>
        <ProductNotFound 
          title="Product Not Found" 
          message={`Sorry, we couldn't find the product you're looking for. ${error?.message ?? ''}`}
        />
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-8">
          <Skeleton className="h-8 w-2/3" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Skeleton className="aspect-square" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <Breadcrumbs 
          items={[
            { label: "Products", href: "/products" },
            { label: product.category, href: `/category/${product.category.toLowerCase()}` },
            { label: product.name }
          ]}
        />
        
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ErrorBoundary fallback={<div>Error loading product images</div>}>
            <ProductImages images={[product.image]} />
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<div>Error loading product information</div>}>
            <ProductInfo 
              product={{
                id: product.id.toString(),
                name: product.name,
                brand: product.brand || "Brand",
                price: product.price,
                originalPrice: product.originalPrice,
                rating: product.rating || 4.5,
                reviewCount: product.reviewCount || 0,
                stock: product.stock || 10,
                colors: product.colors || ["Default"]
              }}
            />
          </ErrorBoundary>
        </div>
        
        <ErrorBoundary fallback={<div>Error loading product details</div>}>
          <ProductTabs 
            product={{
              id: product.id.toString(),
              brand: product.brand || "Brand",
              sku: `SKU-${product.id}`,
              category: product.category || "Uncategorized",
              description: product.description || "No description available.",
              features: product.features || [],
              colors: product.colors || ["Default"]
            }}
            reviews={reviews || []}
            productId={product.id.toString()}
            specifications={product.specifications}
          />
        </ErrorBoundary>
        
        <ErrorBoundary fallback={<div>Error loading recommendations</div>}>
          <RecommendationSection 
            title="You Might Also Like" 
            productId={product.id}
            showViewAll={false}
          />
        </ErrorBoundary>
      </div>
      <ProductViewTracker productId={product.id} />
    </MainLayout>
  );
};

export default ProductDetailPage;
