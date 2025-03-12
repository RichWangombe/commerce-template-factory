
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductRecommendation } from "@/types/recommendation";
import { Check, X, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CompareProductsSheetProps {
  products: ProductRecommendation[];
}

export const CompareProductsSheet = ({ products }: CompareProductsSheetProps) => {
  const [selectedProducts, setSelectedProducts] = useState<ProductRecommendation[]>([]);
  
  const toggleProduct = (product: ProductRecommendation) => {
    if (selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      // Limit to comparing only 3 products at once
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, product]);
      }
    }
  };
  
  const isSelected = (productId: number) => {
    return selectedProducts.some(p => p.id === productId);
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <Scale className="h-4 w-4" />
          Compare Products
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>Compare Products</SheetTitle>
          <SheetDescription>
            Select up to 3 products to compare their features and specifications.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {selectedProducts.length === 0 ? (
            <div className="text-center p-6 border border-dashed rounded-md">
              <p className="text-muted-foreground">Select products to compare</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedProducts.map(product => (
                <div key={product.id} className="border rounded-md p-4 relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2"
                    onClick={() => toggleProduct(product)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex flex-col items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-contain mb-3"
                    />
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
                    {product.category && (
                      <Badge variant="secondary" className="mt-2">{product.category}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Select Products to Compare</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {products.map(product => (
                <div 
                  key={product.id} 
                  className={`border rounded-md p-3 cursor-pointer transition ${isSelected(product.id) ? 'bg-primary/10 border-primary' : ''}`}
                  onClick={() => toggleProduct(product)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                      {isSelected(product.id) && (
                        <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium truncate">{product.name}</p>
                      <p className="text-xs">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedProducts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-medium">Comparison</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-2 px-3 font-medium">Price</td>
                      {selectedProducts.map(product => (
                        <td key={`price-${product.id}`} className="py-2 px-3">
                          ${product.price.toFixed(2)}
                          {product.discount && (
                            <span className="text-green-600 ml-1">-{product.discount}%</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">Category</td>
                      {selectedProducts.map(product => (
                        <td key={`category-${product.id}`} className="py-2 px-3">
                          {product.category || "N/A"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">New Release</td>
                      {selectedProducts.map(product => (
                        <td key={`new-${product.id}`} className="py-2 px-3">
                          {product.isNew ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <X className="h-4 w-4 text-neutral-300" />
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">Recommendation Type</td>
                      {selectedProducts.map(product => (
                        <td key={`type-${product.id}`} className="py-2 px-3">
                          {product.source.type}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">Confidence Score</td>
                      {selectedProducts.map(product => (
                        <td key={`confidence-${product.id}`} className="py-2 px-3">
                          {(product.source.confidence * 100).toFixed(0)}%
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CompareProductsSheet;
