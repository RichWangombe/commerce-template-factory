
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";

interface CategoriesSectionProps {
  categories: {
    id: string;
    name: string;
    icon: string;
    productCount: number;
  }[];
}

export const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background patterns - subtle circles */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-purple-300 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-blue-300 blur-3xl"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-6">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Link 
            to="/categories" 
            className="group flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all 
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 fade-in-group">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              icon={category.icon}
              productCount={category.productCount}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
