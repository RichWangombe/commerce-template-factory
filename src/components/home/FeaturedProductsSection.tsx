
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";

interface FeaturedProductsSectionProps {
  products: {
    id: number;
    name: string;
    price: number;
    image: string;
    category?: string;
    isNew?: boolean;
    discount?: number;
  }[];
}

export const FeaturedProductsSection = ({ products }: FeaturedProductsSectionProps) => {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-6">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link 
            to="/products" 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 fade-in-group">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              isNew={product.isNew}
              discount={product.discount}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
