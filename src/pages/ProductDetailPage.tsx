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
import { processProductImages, getProductSpecificImages } from "@/utils/imageUtils";
import { ProductDetails } from "@/components/product/ProductDetails";
import { InventoryTracker } from "@/components/product/InventoryTracker"; // Added import
import { SizeGuide } from "@/components/product/SizeGuide"; // Added import

// Placeholder SEO component - needs further implementation for full functionality
const SEO = ({ title, description, image, product }: any) => {
  return (
    <>
      {/* Add meta tags here */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* Add other meta tags as needed */}
      {/* Add structured data here -  Schema.org JSON-LD */}
      <script type="application/ld+json">
        {`
        {
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": "${product.name}",
          "description": "${product.description}",
          "image": "${image}",
          "sku": "${product.sku}",
          "brand": "${product.brand}",
          "category": "${product.category}",
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": "${product.price}",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "${product.rating}",
            "reviewCount": "${product.reviewCount}"
          }
        }
        `}
      </script>
    </>
  );
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

  // Generate product images based on product ID, main image, and category
  const getProductImages = (mainImage: string, category?: string) => {
    // First check if we have product-specific images
    const specificImages = getProductSpecificImages(productId);
    if (specificImages.length > 0) {
      return specificImages;
    }

    // Build array starting with the main product image if valid
    const images = [];
    if (mainImage && mainImage.trim() !== '' && !mainImage.includes('undefined')) {
      images.push(mainImage);
    }

    // Process and return the images, falling back to category-based images if needed
    return processProductImages(images, productId, category);
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
      <SEO 
        title={product.name}
        description={product.description}
        image={product.image}
        product={{
          name: product.name,
          description: product.description || '',
          price: product.price,
          image: product.image,
          sku: `SKU-${product.id}`,
          brand: product.brand,
          category: product.category,
          rating: product.rating,
          reviewCount: product.reviewCount
        }}
      />
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
        <InventoryTracker productId={productId}/> {/* Added InventoryTracker */}
        <SizeGuide productId={productId}/> {/* Added SizeGuide */}
      </div>
      <ProductViewTracker productId={product.id} />
    </MainLayout>
  );
};

export default ProductDetailPage;