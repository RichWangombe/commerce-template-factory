
import React, { useState, useEffect } from "react";
import { useRecommendations } from "@/contexts/recommendation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RecommendationFilter } from "@/types/recommendation";
import { PageHeader } from "@/components/recommendations/PageHeader";
import { RecommendationTabs } from "@/components/recommendations/RecommendationTabs";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { enhanceRecommendationImages } from "@/utils/recommendation";

const RecommendationsPage = () => {
  const { 
    recommendedProducts, 
    getPersonalizedRecommendations
  } = useRecommendations();
  const { toast } = useToast();

  const [activeFilter, setActiveFilter] = useState<RecommendationFilter>({});
  const [filteredProducts, setFilteredProducts] = useState(recommendedProducts);
  const [loading, setLoading] = useState(true);
  
  // Load recommendations when component mounts
  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        // Small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 300));
        const recommendations = getPersonalizedRecommendations();
        
        // Enhance recommendations with high-quality images
        const enhancedRecommendations = enhanceRecommendationImages(recommendations);
        setFilteredProducts(enhancedRecommendations);
      } catch (error) {
        console.error("Error loading recommendations:", error);
        toast({
          title: "Error loading recommendations",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, [getPersonalizedRecommendations, toast]);
  
  // Apply filters when they change
  const applyFilters = (filter: RecommendationFilter) => {
    setActiveFilter(filter);
    const recommendations = getPersonalizedRecommendations(filter);
    // Enhance with HD images after filtering
    const enhancedRecommendations = enhanceRecommendationImages(recommendations);
    setFilteredProducts(enhancedRecommendations);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12 container mx-auto px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <PageHeader 
            title="Personalized Recommendations" 
            description="Discover products tailored just for you based on your browsing history and preferences."
          />
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="h-8 w-8 animate-spin text-primary mr-3" />
              <span className="text-lg">Loading your personalized recommendations...</span>
            </div>
          ) : (
            <RecommendationTabs 
              applyFilters={applyFilters} 
              filteredProducts={filteredProducts} 
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecommendationsPage;
