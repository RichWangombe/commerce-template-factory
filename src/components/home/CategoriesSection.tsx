
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { motion } from "framer-motion";

interface CategoriesSectionProps {
  categories: {
    id: string;
    name: string;
    icon: string;
    productCount: number;
    backgroundImages?: string[];
  }[];
}

export const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Elegant background elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-purple-300 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-blue-300 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-teal-300 blur-[100px] opacity-20"></div>
      </div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-5 bg-[radial-gradient(circle,_transparent_20%,_#f0f0f0_20%,_#f0f0f0_calc(20%_+_1px),_transparent_calc(20%_+_2px))] dark:bg-[radial-gradient(circle,_transparent_20%,_#111_20%,_#111_calc(20%_+_1px),_transparent_calc(20%_+_2px))] bg-[length:24px_24px]"></div>
      
      <div className="container relative z-10 mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-center justify-between"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Browse Categories</h2>
            <p className="text-sm text-muted-foreground">Explore our wide range of products by category</p>
          </div>
          <Link 
            to="/categories" 
            className="group flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all 
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-5">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              icon={category.icon}
              productCount={category.productCount}
              backgroundImages={category.backgroundImages}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
