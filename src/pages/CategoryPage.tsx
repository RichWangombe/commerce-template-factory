
import React from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { ProductGrid } from "@/components/ProductGrid";
import { mockProducts } from "@/data/mockProducts";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  
  // Normalize the category name (convert to title case for display)
  const formattedCategoryName = categoryName
    ? categoryName
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";
  
  // Case-insensitive and fuzzy matching for better category matching
  const products = mockProducts.filter(product => {
    if (!product.category) return false;
    
    // Try different matching strategies
    const exactMatch = product.category.toLowerCase() === formattedCategoryName.toLowerCase();
    const containsMatch = product.category.toLowerCase().includes(formattedCategoryName.toLowerCase()) || 
                         formattedCategoryName.toLowerCase().includes(product.category.toLowerCase());
    
    // Handle specific category mappings
    if (categoryName === "smartphones" && product.category === "Smartphone") return true;
    if (categoryName === "wearables" && product.category === "Wearable") return true;
    if (categoryName === "accessories" && product.category === "Audio") return true;
    if (categoryName === "laptops" && product.category === "Laptop") return true;
    if (categoryName === "gaming" && product.category === "Gaming") return true;
    
    return exactMatch || containsMatch;
  });

  // Make sure all products have the required category field set
  const productsWithRequiredCategory = products.map(product => ({
    ...product,
    category: product.category || formattedCategoryName // Ensure category is not undefined
  }));

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{formattedCategoryName}</h1>
          <Link to="/products">
            <Button variant="outline">View All Products</Button>
          </Link>
        </div>
        
        {products.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-6">
              Showing {products.length} products in {formattedCategoryName}
            </p>
            <ProductGrid products={productsWithRequiredCategory} />
          </>
        ) : (
          <div className="py-12">
            <Alert variant="info">
              <Info className="h-4 w-4" />
              <AlertTitle>No products found</AlertTitle>
              <AlertDescription>
                We couldn't find any products in the {formattedCategoryName} category.
                <div className="mt-4">
                  <Link to="/products">
                    <Button>Browse All Products</Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CategoryPage;
