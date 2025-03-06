
import React, { useState } from "react";
import { useRecommendations } from "@/contexts/RecommendationContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RecommendationFilter } from "@/types/recommendation";
import { PageHeader } from "@/components/recommendations/PageHeader";
import { RecommendationTabs } from "@/components/recommendations/RecommendationTabs";

const RecommendationsPage = () => {
  const { 
    recommendedProducts, 
    getPersonalizedRecommendations
  } = useRecommendations();

  const [activeFilter, setActiveFilter] = useState<RecommendationFilter>({});
  const [filteredProducts, setFilteredProducts] = useState(recommendedProducts);
  
  // Apply filters when they change
  const applyFilters = (filter: RecommendationFilter) => {
    setActiveFilter(filter);
    setFilteredProducts(getPersonalizedRecommendations(filter));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 py-12 container mx-auto px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          <PageHeader 
            title="Personalized Recommendations" 
            description="Discover products tailored just for you based on your browsing history and preferences."
          />
          
          <RecommendationTabs 
            applyFilters={applyFilters} 
            filteredProducts={filteredProducts} 
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecommendationsPage;
