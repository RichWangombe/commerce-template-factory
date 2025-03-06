
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductImages } from "@/components/product/ProductImages";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RecommendationSection } from "@/components/home/RecommendationSection";
import { ProductTabs } from "@/components/product/ProductTabs";
import { Breadcrumb } from "@/components/product/Breadcrumb";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { useRecommendations } from "@/contexts/recommendation";
import { ProductViewTracker } from "@/components/ProductViewTracker";
import { useToast } from "@/hooks/use-toast";
import { useProduct, Product } from "@/utils/dataFetchers";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { recordProductView } = useRecommendations();
  const productId = parseInt(id || "0");
  const { toast } = useToast();
  
  // Use React Query to fetch product data
  const { data: product, isLoading, error } = useProduct(productId);
  
  useEffect(() => {
    // Track product view for recommendation engine when product data is available
    if (product && recordProductView) {
      recordProductView(product.id);
    }
  }, [product, recordProductView]);

  // Handle adding product to cart or wishlist
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product?.name} has been added to your cart.`,
    });
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <ProductNotFound 
          title="Product Not Found" 
          message="Sorry, we couldn't find the product you're looking for."
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <Breadcrumb 
            category={product.category} 
            productName={product.name}
          />
          
          <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <ProductImages 
              images={[product.image]} 
            />
            
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
          </div>
          
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
            reviews={[]}
            productId={product.id.toString()}
            specifications={product.specifications}
          />
          
          <RecommendationSection 
            title="You Might Also Like" 
            productId={product.id}
            showViewAll={false}
          />
        </div>
      </main>
      <ProductViewTracker productId={product.id} />
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
