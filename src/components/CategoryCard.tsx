
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  productCount?: number;
  index?: number;
}

export const CategoryCard = ({
  id,
  name,
  icon,
  productCount,
  index = 0,
}: CategoryCardProps) => {
  // Convert name to kebab-case for URL
  const categorySlug = id.toLowerCase();
  
  // Generate a pastel background color based on the category name
  const getBgColor = () => {
    const colors = [
      "from-blue-50 to-blue-100",
      "from-green-50 to-green-100",
      "from-purple-50 to-purple-100",
      "from-amber-50 to-amber-100",
      "from-rose-50 to-rose-100",
      "from-teal-50 to-teal-100",
      "from-indigo-50 to-indigo-100",
    ];
    
    return colors[index % colors.length];
  };
  
  return (
    <Link 
      to={`/category/${categorySlug}`}
      className={cn(
        "group flex flex-col items-center justify-center rounded-xl bg-gradient-to-br p-6 text-center",
        getBgColor(),
        "transition-all duration-300 hover:shadow-md hover:scale-105 hover:translate-y-[-5px]",
        "animate-fade-in",
        "product-card"
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 group-hover:shadow-md">
        <img 
          src={icon} 
          alt={name} 
          className="h-8 w-8 transition-transform group-hover:rotate-3" 
        />
      </div>
      <h3 className="text-base font-medium">{name}</h3>
      {productCount !== undefined && (
        <p className="mt-1 text-xs text-neutral-600">{productCount} products</p>
      )}
    </Link>
  );
};
