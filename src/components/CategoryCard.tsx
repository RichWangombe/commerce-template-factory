
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const nextImageIndexRef = useRef(0);
  const imagesLoadedRef = useRef<boolean[]>([]);
  
  // Preload images to prevent blank frames
  useEffect(() => {
    if (backgroundImages.length <= 1) return;
    
    // Initialize array to track which images are loaded
    imagesLoadedRef.current = new Array(backgroundImages.length).fill(false);
    
    // Preload all images
    backgroundImages.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imagesLoadedRef.current[idx] = true;
      };
    });
  }, [backgroundImages]);
  
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

  // Improved background image rotation logic with better transition handling
  useEffect(() => {
    if (backgroundImages.length <= 1) return;
    
    const interval = setInterval(() => {
      // Calculate next image index, ensuring it's different from current
      nextImageIndexRef.current = (currentImageIndex + 1) % backgroundImages.length;
      
      // Only transition if the next image is loaded
      if (imagesLoadedRef.current[nextImageIndexRef.current]) {
        setIsTransitioning(true);
        
        // After transition completes, update current image
        setTimeout(() => {
          setCurrentImageIndex(nextImageIndexRef.current);
          setIsTransitioning(false);
        }, 800); // Slightly shorter than animation duration for smooth transition
      } else {
        // If next image isn't loaded, try to find one that is
        let attempts = 0;
        while (!imagesLoadedRef.current[nextImageIndexRef.current] && attempts < backgroundImages.length) {
          nextImageIndexRef.current = (nextImageIndexRef.current + 1) % backgroundImages.length;
          attempts++;
        }
        
        // If we found a loaded image, use it
        if (imagesLoadedRef.current[nextImageIndexRef.current]) {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentImageIndex(nextImageIndexRef.current);
            setIsTransitioning(false);
          }, 800);
        }
      }
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, [backgroundImages, currentImageIndex]);
  
  // Get current and next image URLs, with fallbacks
  const getCurrentImage = () => {
    if (backgroundImages.length === 0) return "";
    return backgroundImages[currentImageIndex];
  };
  
  const getNextImage = () => {
    if (backgroundImages.length === 0) return "";
    return backgroundImages[nextImageIndexRef.current];
  };
  
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
          "relative z-10 product-card text-white"
        )}
      >
        {/* Background images with improved transition */}
        <div className="absolute inset-0 overflow-hidden">
          {backgroundImages.length > 0 ? (
            <div className="absolute inset-0">
              {/* Current image always visible */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br z-0"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0.7))`,
                  }}
                />
                {getCurrentImage() && (
                  <img 
                    src={getCurrentImage()} 
                    alt={name}
                    className="h-full w-full object-cover object-center opacity-80"
                  />
                )}
              </div>
              
              {/* Next image fades in during transition */}
              {isTransitioning && getNextImage() && (
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br z-0"
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.5), rgba(0,0,0,0.7))`,
                    }}
                  />
                  <img 
                    src={getNextImage()} 
                    alt={name}
                    className="h-full w-full object-cover object-center opacity-80"
                  />
                </motion.div>
              )}
            </div>
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
        <h3 className="text-base font-medium relative z-10 text-white">{name}</h3>
        {productCount !== undefined && (
          <p className="mt-1 text-xs text-white/90 relative z-10">{productCount} products</p>
        )}
      </Link>
    </motion.div>
  );
};
