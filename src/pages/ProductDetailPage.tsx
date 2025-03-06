
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductImages } from "@/components/product/ProductImages";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RecommendationSection } from "@/components/home/RecommendationSection";
import { ProductTabs } from "@/components/product/ProductTabs";
import { Breadcrumb } from "@/components/product/Breadcrumb";
import { ProductNotFound } from "@/components/product/ProductNotFound";
import { mockProducts } from "@/data/mockProducts";
import { useRecommendations } from "@/contexts/RecommendationContext";
import { ProductViewTracker } from "@/components/ProductViewTracker";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { trackProductView } = useRecommendations();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate fetching product data
    setLoading(true);
    
    try {
      const productId = parseInt(id || "0");
      const foundProduct = mockProducts.find(p => p.id === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
        // Track product view for recommendation engine
        if (trackProductView) {
          trackProductView({
            productId: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price,
            category: foundProduct.category || "",
          });
        }
      } else {
        setError("Product not found");
      }
    } catch (err) {
      setError("Failed to load product");
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  }, [id, trackProductView]);
  
  // Show loading state
  if (loading) {
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
        <ProductNotFound message={error || "Product not found"} />
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
            categoryId={1}
          />
          
          <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <ProductImages 
              images={[product.image]} 
              productName={product.name} 
            />
            
            <ProductInfo 
              product={product}
              productId={product.id} 
              name={product.name}
              price={product.price}
              description={product.description || "No description available."}
              inStock={true}
              discountPercentage={product.discount}
              isNew={product.isNew}
              sku={`SKU-${product.id}`}
              category={product.category || "Uncategorized"}
            />
          </div>
          
          <ProductTabs 
            specifications={product.specifications || []}
            productId={product.id}
            productName={product.name}
          />
          
          <RecommendationSection 
            productId={product.id} 
            title="You Might Also Like" 
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
