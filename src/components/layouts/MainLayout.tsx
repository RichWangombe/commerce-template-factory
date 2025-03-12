
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MainLayout = ({ children, className }: MainLayoutProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate loading delay - in a real app, this would be based on data fetching
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex-1 container mx-auto px-4 md:px-6 py-6 md:py-8",
            className
          )}
        >
          {isLoading ? (
            <PageSkeleton />
          ) : (
            children
          )}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

const PageSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <Skeleton className="h-12 w-3/4 max-w-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};
