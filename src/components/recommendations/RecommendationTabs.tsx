
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { RecommendationFilter } from "@/types/recommendation";
import { RecommendationGrid } from "./RecommendationGrid";
import { FilterSheet } from "./FilterSheet";

interface RecommendationTabsProps {
  applyFilters: (filter: RecommendationFilter) => void;
  filteredProducts: any[];
}

export const RecommendationTabs: React.FC<RecommendationTabsProps> = ({
  applyFilters,
  filteredProducts,
}) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => applyFilters({})}>All Recommendations</TabsTrigger>
          <TabsTrigger value="trending" onClick={() => applyFilters({ types: ['trending'] })}>Trending</TabsTrigger>
          <TabsTrigger value="similar" onClick={() => applyFilters({ types: ['similar'] })}>Similar Products</TabsTrigger>
          <TabsTrigger value="viewed" onClick={() => applyFilters({ types: ['viewed'] })}>Based on Views</TabsTrigger>
        </TabsList>
        
        <FilterSheet />
      </div>
      
      <TabsContent value="all" className="mt-0">
        <RecommendationGrid 
          filteredProducts={filteredProducts} 
          applyFilters={applyFilters} 
        />
      </TabsContent>
      
      <TabsContent value="trending" className="mt-0">
        <RecommendationGrid 
          filteredProducts={filteredProducts} 
          applyFilters={applyFilters} 
        />
      </TabsContent>
      
      <TabsContent value="similar" className="mt-0">
        <RecommendationGrid 
          filteredProducts={filteredProducts} 
          applyFilters={applyFilters} 
        />
      </TabsContent>
      
      <TabsContent value="viewed" className="mt-0">
        <RecommendationGrid 
          filteredProducts={filteredProducts} 
          applyFilters={applyFilters} 
        />
      </TabsContent>
    </Tabs>
  );
};
