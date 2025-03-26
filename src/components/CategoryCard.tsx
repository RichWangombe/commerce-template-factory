
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  
  // Generate an elegant background gradient based on the category index
  const getBgColor = () => {
    const colors = [
      "from-blue-50/80 to-sky-100/80",
      "from-emerald-50/80 to-teal-100/80",
      "from-violet-50/80 to-purple-100/80",
      "from-amber-50/80 to-yellow-100/80", 
      "from-rose-50/80 to-pink-100/80",
      "from-teal-50/80 to-cyan-100/80",
      "from-indigo-50/80 to-blue-100/80",
    ];
    
    return colors[index % colors.length];
  };

  // Animation variants for hover state
  const cardVariants = {
    initial: { y: 0, boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },
    hover: { 
      y: -5, 
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };
  
  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: { 
      rotate: 3, 
      scale: 1.1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover="hover"
      initial="initial"
      variants={cardVariants}
    >
      <Link 
        to={`/category/${categorySlug}`}
        className={cn(
          "group flex flex-col items-center justify-center rounded-xl bg-gradient-to-br p-6 text-center",
          getBgColor(),
          "border border-white/40 backdrop-blur-sm",
          "transition-all duration-300",
          "product-card"
        )}
      >
        <motion.div 
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-sm"
          variants={iconVariants}
        >
          <img 
            src={icon} 
            alt={name} 
            className="h-8 w-8" 
          />
        </motion.div>
        <h3 className="text-base font-medium">{name}</h3>
        {productCount !== undefined && (
          <p className="mt-1 text-xs text-neutral-600">{productCount} products</p>
        )}
      </Link>
    </motion.div>
  );
};
