
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCarousel } from "@/components/ui/carousel/useCarousel";

export interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  productCount?: number;
  index?: number;
  backgroundImages?: string[];
}

export const CategoryCard = ({
  id,
  name,
  icon,
  productCount,
  index = 0,
  backgroundImages = [],
}: CategoryCardProps) => {
  // Convert name to kebab-case for URL
  const categorySlug = id.toLowerCase();
  
  // State for controlling background image animation
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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

  // Animate background images
  useEffect(() => {
    if (backgroundImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [backgroundImages]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover="hover"
      variants={cardVariants}
      className="relative"
    >
      <Link 
        to={`/category/${categorySlug}`}
        className={cn(
          "group flex flex-col items-center justify-center rounded-xl overflow-hidden p-6 text-center",
          "border border-white/40 backdrop-blur-sm",
          "transition-all duration-300 h-full",
          "relative z-10 product-card"
        )}
      >
        {/* Background images carousel */}
        <div className="absolute inset-0 overflow-hidden">
          {backgroundImages.length > 0 ? (
            <AnimatePresence mode="sync">
              {backgroundImages.map((img, imgIndex) => (
                imgIndex === currentImageIndex && (
                  <motion.div
                    key={imgIndex}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br bg-opacity-90 z-0"
                      style={{
                        backgroundImage: `linear-gradient(to bottom right, rgba(255,255,255,0.92), rgba(255,255,255,0.85))`,
                      }}
                    />
                    <img 
                      src={img} 
                      alt={name}
                      className="h-full w-full object-cover object-center opacity-40 scale-110 filter blur-[1px]"
                    />
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          ) : (
            // Fallback gradient if no images
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br",
              getBgColor()
            )} />
          )}
        </div>
        
        <motion.div 
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-sm z-10"
          variants={iconVariants}
        >
          <img 
            src={icon} 
            alt={name} 
            className="h-8 w-8" 
          />
        </motion.div>
        <h3 className="text-base font-medium relative z-10">{name}</h3>
        {productCount !== undefined && (
          <p className="mt-1 text-xs text-neutral-600 relative z-10">{productCount} products</p>
        )}
      </Link>
    </motion.div>
  );
};
