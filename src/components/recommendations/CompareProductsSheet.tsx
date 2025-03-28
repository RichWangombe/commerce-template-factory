
import React, { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProductRecommendation } from "@/types/recommendation";
import { Check, ArrowLeftRight, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useRecommendations } from "@/contexts/recommendation";

interface CompareProductsSheetProps {
  products: ProductRecommendation[];
}

const CompareProductsSheet: React.FC<CompareProductsSheetProps> = ({ products }) => {
  const [selectedProducts, setSelectedProducts] = useState<ProductRecommendation[]>([]);
  const [open, setOpen] = useState(false);
  const { trackRecommendationClick } = useRecommendations();

  const handleToggleProduct = (product: ProductRecommendation) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      
      if (isSelected) {
        return prev.filter(p => p.id !== product.id);
      } else {
        // Limit to 3 products for comparison
        if (prev.length >= 3) {
          return [...prev.slice(1), product];
        }
        return [...prev, product];
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ArrowLeftRight className="h-4 w-4" />
          Compare Products
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Compare Products</SheetTitle>
          <SheetDescription>
            Select up to 3 products to compare their features side by side.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Product selection section */}
          <div className="space-y-4">
            <h3 className="font-medium">Select Products (Max 3)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(product => (
                <div 
                  key={product.id} 
                  className={`flex items-center space-x-3 p-3 border rounded-md ${
                    selectedProducts.some(p => p.id === product.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  }`}
                >
                  <Checkbox 
                    checked={selectedProducts.some(p => p.id === product.id)}
                    onCheckedChange={() => handleToggleProduct(product)}
                    id={`product-${product.id}`}
                  />
                  <div className="flex items-center flex-1 min-w-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded-md mr-3"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop";
                      }}
                    />
                    <div className="min-w-0">
                      <label 
                        htmlFor={`product-${product.id}`}
                        className="font-medium text-sm truncate block"
                      >
                        {product.name}
                      </label>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>${product.price.toFixed(2)}</span>
                        {product.category && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{product.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          {selectedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-4">Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-3 border-b">Feature</th>
                      {selectedProducts.map(product => (
                        <th key={product.id} className="text-left py-2 px-3 border-b">
                          <div className="flex items-center justify-between">
                            <span className="truncate max-w-[120px]">{product.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => setSelectedProducts(prev => prev.filter(p => p.id !== product.id))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-3 border-b">Price</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="py-2 px-3 border-b">
                          ${product.price.toFixed(2)}
                          {product.discount && product.discount > 0 && (
                            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                              {product.discount}% off
                            </Badge>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b">Category</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="py-2 px-3 border-b">
                          {product.category || "N/A"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b">New Release</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="py-2 px-3 border-b">
                          {product.isNew ? (
                            <Check className="h-5 w-5 text-green-600" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground" />
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b">Recommendation Type</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="py-2 px-3 border-b">
                          <Badge variant="secondary">
                            {product.source.type.charAt(0).toUpperCase() + product.source.type.slice(1)}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-2 px-3 border-b">Confidence</td>
                      {selectedProducts.map(product => (
                        <td key={product.id} className="py-2 px-3 border-b">
                          {Math.round(product.source.confidence * 100)}%
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => {
                    // Track clicks for all selected products
                    selectedProducts.forEach(product => {
                      trackRecommendationClick(product);
                    });
                    
                    // Open the first product in a new tab
                    if (selectedProducts.length > 0) {
                      window.open(`/product/${selectedProducts[0].id}`, '_blank');
                      setOpen(false);
                    }
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CompareProductsSheet;
