
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewsList } from "@/components/ReviewsList";
import { ReviewForm } from "@/components/ReviewForm";
import { Review } from "@/types/review";

interface ProductSpecificationsProps {
  product: {
    id: string;
    brand: string;
    sku: string;
    category: string;
    description: string;
    features: string[];
    colors: string[];
  };
  specs?: Record<string, string>;
}

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
  productId: string;
  specifications?: Record<string, string>;
}

export const ProductTabs = ({ 
  product, 
  reviews, 
  productId,
  specifications
}: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-16">
      <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <div className="prose max-w-none">
            <p className="text-md text-gray-600">{product.description}</p>
            
            {product.features.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium">Key Features</h3>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-600">{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          <div className="bg-white rounded-lg divide-y">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4">
                <p className="text-sm font-medium">Brand</p>
                <p className="text-gray-600">{product.brand}</p>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium">SKU</p>
                <p className="text-gray-600">{product.sku}</p>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium">Category</p>
                <p className="text-gray-600">{product.category}</p>
              </div>
              
              {specifications && Object.entries(specifications).map(([key, value]) => (
                <div key={key} className="p-4">
                  <p className="text-sm font-medium">{key}</p>
                  <p className="text-gray-600">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <ReviewsList reviews={reviews} productId={productId} />
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Write a Review</h3>
            <ReviewForm productId={productId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
