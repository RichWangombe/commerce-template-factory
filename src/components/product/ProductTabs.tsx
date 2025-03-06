
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductDetails } from "./ProductDetails";
import { ProductSpecifications } from "./ProductSpecifications";
import { ReviewsList } from "@/components/ReviewsList";
import { ReviewForm } from "@/components/ReviewForm";
import { Review } from "@/types/review";

interface ProductTabsProps {
  product: {
    id: string;
    brand: string;
    sku: string;
    category: string;
    description: string;
    features: string[];
    colors: string[];
  };
  reviews: Review[];
}

export const ProductTabs = ({ product, reviews }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");
  
  return (
    <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full justify-start border-b pb-0 mb-6">
        <TabsTrigger value="description" className="pb-3 rounded-none">Description & Features</TabsTrigger>
        <TabsTrigger value="specs" className="pb-3 rounded-none">Specifications</TabsTrigger>
        <TabsTrigger value="reviews" className="pb-3 rounded-none">
          Reviews ({reviews.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="pt-4">
        <ProductDetails product={product} />
      </TabsContent>
      
      <TabsContent value="specs" className="pt-4">
        <ProductSpecifications product={product} />
      </TabsContent>
      
      <TabsContent value="reviews" className="pt-4">
        <div className="space-y-12">
          <ReviewsList reviews={reviews} productId={product.id} />
          <ReviewForm productId={product.id} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
