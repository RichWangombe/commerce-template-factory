
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface ProductDetailsProps {
  product: {
    brand: string;
    sku: string;
    category: string;
    description: string;
    features: string[];
  };
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <p className="text-neutral-600">{product.description}</p>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Features</h2>
          <ul className="space-y-2">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-neutral-300"></div>
                <span className="text-neutral-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="space-y-6">
        <Card className="border rounded-xl p-6">
          <CardContent className="p-0">
            <h3 className="text-lg font-medium mb-4">Product Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Brand</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">SKU</span>
                <span className="font-medium">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Category</span>
                <Link 
                  to={`/category/${product.category.toLowerCase()}`}
                  className="font-medium hover:underline"
                >
                  {product.category}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
