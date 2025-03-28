
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecommendationFilter, ProductRecommendation } from "@/types/recommendation";
import { Badge } from "@/components/ui/badge";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import RecommendationGrid from "./RecommendationGrid";
import UserPreferencesTab from "./UserPreferencesTab";

interface RecommendationTabsProps {
  applyFilters: (filter: RecommendationFilter) => void;
  filteredProducts: ProductRecommendation[];
}

export const RecommendationTabs: React.FC<RecommendationTabsProps> = ({
  applyFilters,
  filteredProducts
}) => {
  const { preferences } = useUserPreferences();
  const [activeTab, setActiveTab] = useState("all");
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Apply filters based on selected tab
    switch(value) {
      case "all":
        applyFilters({});
        break;
      case "viewed":
        applyFilters({ types: ["viewed"] });
        break;
      case "trending":
        applyFilters({ types: ["trending"] });
        break;
      case "similar":
        applyFilters({ types: ["similar"] });
        break;
      case "collaborative":
        applyFilters({ types: ["collaborative", "purchased"] });
        break;
      case "seasonal":
        applyFilters({ types: ["seasonal"] });
        break;
      case "preferences":
        // No filter change for preferences tab
        break;
      default:
        applyFilters({});
    }
  };
  
  // Count recommendations by type
  const getCountByType = (type: string) => {
    return filteredProducts.filter(p => p.source.type === type).length;
  };

  return (
    <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full">
      <div className="border-b">
        <TabsList className="h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="all" 
            className="rounded-none py-2.5 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            All
          </TabsTrigger>
          
          {preferences.showRecentlyViewed && (
            <TabsTrigger 
              value="viewed" 
              className="rounded-none py-2.5 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Recently Viewed
              {getCountByType("viewed") > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2">
                  {getCountByType("viewed")}
                </Badge>
              )}
            </TabsTrigger>
          )}
          
          {preferences.showTrending && (
            <TabsTrigger 
              value="trending" 
              className="rounded-none py-2.5 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Trending
              {getCountByType("trending") > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2">
                  {getCountByType("trending")}
                </Badge>
              )}
            </TabsTrigger>
          )}
          
          {preferences.showSimilar && (
            <TabsTrigger 
              value="similar" 
              className="rounded-none py-2.5 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Similar Products
              {getCountByType("similar") > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2">
                  {getCountByType("similar")}
                </Badge>
              )}
            </TabsTrigger>
          )}
          
          {preferences.showCollaborative && (
            <TabsTrigger 
              value="collaborative" 
              className="rounded-none py-2.5 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              For You
              {(getCountByType("collaborative") + getCountByType("purchased")) > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2">
                  {getCountByType("collaborative") + getCountByType("purchased")}
                </Badge>
              )}
            </TabsTrigger>
          )}
          
          {preferences.showSeasonalOffers && (
            <TabsTrigger 
              value="seasonal" 
              className="rounded-none py-2.5 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Seasonal
              {getCountByType("seasonal") > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-2">
                  {getCountByType("seasonal")}
                </Badge>
              )}
            </TabsTrigger>
          )}
          
          <TabsTrigger 
            value="preferences" 
            className="rounded-none py-2.5 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            My Preferences
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all" className="pt-6">
        <RecommendationGrid filteredProducts={filteredProducts} applyFilters={applyFilters} />
      </TabsContent>
      
      <TabsContent value="viewed" className="pt-6">
        <RecommendationGrid filteredProducts={filteredProducts} applyFilters={applyFilters} />
      </TabsContent>
      
      <TabsContent value="trending" className="pt-6">
        <RecommendationGrid filteredProducts={filteredProducts} applyFilters={applyFilters} />
      </TabsContent>
      
      <TabsContent value="similar" className="pt-6">
        <RecommendationGrid filteredProducts={filteredProducts} applyFilters={applyFilters} />
      </TabsContent>
      
      <TabsContent value="collaborative" className="pt-6">
        <RecommendationGrid filteredProducts={filteredProducts} applyFilters={applyFilters} />
      </TabsContent>
      
      <TabsContent value="seasonal" className="pt-6">
        <RecommendationGrid filteredProducts={filteredProducts} applyFilters={applyFilters} />
      </TabsContent>
      
      <TabsContent value="preferences" className="pt-6">
        <UserPreferencesTab />
      </TabsContent>
    </Tabs>
  );
};

export default RecommendationTabs;
