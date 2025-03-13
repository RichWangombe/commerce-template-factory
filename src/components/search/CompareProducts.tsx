
import React, { useState } from 'react';
import { Scale, XCircle, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SearchProduct } from '@/hooks/useProductSearch';

interface CompareProductsProps {
  products: SearchProduct[];
}

export const CompareProducts = ({ products }: CompareProductsProps) => {
  const [selectedProducts, setSelectedProducts] = useState<SearchProduct[]>([]);
  const [open, setOpen] = useState(false);

  const toggleProduct = (product: SearchProduct) => {
    if (selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      // Limit to comparing maximum 3 products at once
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, product]);
      }
    }
  };

  const isSelected = (product: SearchProduct) => {
    return selectedProducts.some(p => p.id === product.id);
  };

  // Render stars for ratings
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={products.length < 2}
        >
          <Scale className="h-4 w-4" />
          Compare Products
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-3xl">
        <SheetHeader className="mb-6">
          <SheetTitle>Compare Products</SheetTitle>
          <SheetDescription>
            Select up to 3 products to compare features and specifications.
          </SheetDescription>
        </SheetHeader>

        {selectedProducts.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedProducts.map(product => (
                <div key={product.id} className="border rounded-md p-4 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => toggleProduct(product)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex flex-col items-center mt-4">
                    <div className="h-32 w-32 flex items-center justify-center">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <h3 className="mt-4 font-medium text-center">{product.name}</h3>
                    <p className="mt-1 text-lg font-bold">${product.price.toFixed(2)}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h3 className="font-semibold">Comparison</h3>
              <div className="border rounded-md">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <th className="text-left p-3 bg-muted/50 font-medium">Feature</th>
                      {selectedProducts.map(product => (
                        <th key={`header-${product.id}`} className="p-3 bg-muted/50 font-medium">
                          {product.name}
                        </th>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Price</td>
                      {selectedProducts.map(product => (
                        <td key={`price-${product.id}`} className="p-3">
                          ${product.price.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Category</td>
                      {selectedProducts.map(product => (
                        <td key={`category-${product.id}`} className="p-3">
                          {product.category || 'N/A'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Rating</td>
                      {selectedProducts.map(product => (
                        <td key={`rating-${product.id}`} className="p-3">
                          {renderRating(product.rating)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">No products selected for comparison</p>
            <p className="text-sm text-muted-foreground">Select products from the list below</p>
          </div>
        )}
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="font-semibold mb-3">Available Products</h3>
          <ScrollArea className="h-[200px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {products.map(product => (
                <div
                  key={product.id}
                  className={`border rounded-md p-3 cursor-pointer transition ${
                    isSelected(product) ? 'border-primary bg-primary/10' : ''
                  }`}
                  onClick={() => toggleProduct(product)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                      {isSelected(product) && (
                        <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};
