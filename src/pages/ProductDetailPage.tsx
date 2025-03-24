
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ProductImageCarousel } from "@/components/product/ProductImageCarousel";
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

// Higher quality sample product images for demo purposes
const sampleProductImages = {
  electronics: [
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585155770447-2f66e2a397b5?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1600&auto=format&fit=crop"
  ],
  clothing: [
    "https://images.unsplash.com/photo-1578632767657-b96c3106ffad?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=1600&auto=format&fit=crop"
  ],
  furniture: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1600&auto=format&fit=crop"
  ],
  default: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1600&auto=format&fit=crop"
  ]
};

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

  // Generate high-quality product images based on category or main image
  const getProductImages = (mainImage: string, category?: string) => {
    if (!mainImage) return sampleProductImages.default;
    
    // Start with the main product image
    let images = [mainImage];
    
    // Determine which category images to use
    let categoryImages;
    if (category?.toLowerCase().includes('electronics')) {
      categoryImages = sampleProductImages.electronics;
    } else if (category?.toLowerCase().includes('clothing') || 
               category?.toLowerCase().includes('fashion')) {
      categoryImages = sampleProductImages.clothing;
    } else if (category?.toLowerCase().includes('furniture') || 
               category?.toLowerCase().includes('home')) {
      categoryImages = sampleProductImages.furniture;
    } else {
      categoryImages = sampleProductImages.default;
    }
    
    // Add some high-quality category-specific images
    // In a real application, these would be actual different angles/views of the same product
    images = images.concat(categoryImages.slice(0, 3));
    
    return images;
  };

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
            <ProductImageCarousel 
              images={getProductImages(product.image, product.category)} 
              productName={product.name}
            />
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
