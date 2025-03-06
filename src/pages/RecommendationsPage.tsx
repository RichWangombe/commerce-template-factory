
import React, { useState } from "react";
import { useRecommendations } from "@/contexts/RecommendationContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { RecommendationFilter } from "@/types/recommendation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, Filter, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const RecommendationsPage = () => {
  const { 
    recommendedProducts, 
    getPersonalizedRecommendations, 
    trackRecommendationClick,
    userPreferences,
    updateUserPreferences
  } = useRecommendations();

  const [activeFilter, setActiveFilter] = useState<RecommendationFilter>({});
  const [filteredProducts, setFilteredProducts] = useState(recommendedProducts);
  
  const form = useForm({
    defaultValues: {
      categories: userPreferences.favoriteCategories || [],
      recommendationTypes: []
    }
  });

  // Apply filters when they change
  const applyFilters = (filter: RecommendationFilter) => {
    setActiveFilter(filter);
    setFilteredProducts(getPersonalizedRecommendations(filter));
  };

  // Save category preferences
  const savePreferences = (data: { categories: string[], recommendationTypes: string[] }) => {
    updateUserPreferences({
      favoriteCategories: data.categories
    });
  };

  // Get explanation text for recommendation
  const getRecommendationExplanation = (type: string): string => {
    switch (type) {
      case 'viewed':
        return 'Based on products you viewed';
      case 'purchased':
        return 'Based on your purchase history';
      case 'similar':
        return 'Similar to products you like';
      case 'trending':
        return 'Popular right now';
      case 'collaborative':
        return 'Other customers also bought';
      case 'seasonal':
        return 'Seasonal recommendation';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 py-12 container mx-auto px-4 md:px-6">
        <div className="flex flex-col space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Personalized Recommendations</h1>
            <p className="text-muted-foreground">
              Discover products tailored just for you based on your browsing history and preferences.
            </p>
          </div>
          
          {/* Tabs and Filters */}
          <div className="flex items-center justify-between">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => applyFilters({})}>All Recommendations</TabsTrigger>
                  <TabsTrigger value="trending" onClick={() => applyFilters({ types: ['trending'] })}>Trending</TabsTrigger>
                  <TabsTrigger value="similar" onClick={() => applyFilters({ types: ['similar'] })}>Similar Products</TabsTrigger>
                  <TabsTrigger value="viewed" onClick={() => applyFilters({ types: ['viewed'] })}>Based on Views</TabsTrigger>
                </TabsList>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filter Recommendations</SheetTitle>
                      <SheetDescription>
                        Customize your recommendations based on your preferences.
                      </SheetDescription>
                    </SheetHeader>
                    <Separator className="my-4" />
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(savePreferences)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="categories"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Favorite Categories</FormLabel>
                              <div className="space-y-2">
                                {['Smartphone', 'Wearable', 'Audio', 'Tablet', 'Laptop'].map((category) => (
                                  <div className="flex items-center space-x-2" key={category}>
                                    <Checkbox 
                                      id={`category-${category}`} 
                                      checked={field.value?.includes(category)}
                                      onCheckedChange={(checked) => {
                                        const values = field.value || [];
                                        return checked 
                                          ? field.onChange([...values, category])
                                          : field.onChange(values.filter(v => v !== category));
                                      }}
                                    />
                                    <Label htmlFor={`category-${category}`}>{category}</Label>
                                  </div>
                                ))}
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full">
                          <Check className="h-4 w-4 mr-2" />
                          Save Preferences
                        </Button>
                      </form>
                    </Form>
                  </SheetContent>
                </Sheet>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="relative">
                        <div className="absolute right-2 top-2 z-10 bg-white/90 backdrop-blur-sm text-black text-xs rounded-full px-2 py-1 shadow-sm border">
                          {getRecommendationExplanation(product.source.type)}
                        </div>
                        <div 
                          onClick={() => trackRecommendationClick(product)}
                          className="h-full"
                        >
                          <ProductCard
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            category={product.category}
                            isNew={product.isNew}
                            discount={product.discount}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">No recommendations found with the current filters.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => applyFilters({})}
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="trending" className="mt-0">
                {/* Same grid layout as "all" but with filtered products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="relative">
                        <div className="absolute right-2 top-2 z-10 bg-white/90 backdrop-blur-sm text-black text-xs rounded-full px-2 py-1 shadow-sm border">
                          {getRecommendationExplanation(product.source.type)}
                        </div>
                        <div 
                          onClick={() => trackRecommendationClick(product)}
                          className="h-full"
                        >
                          <ProductCard
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            category={product.category}
                            isNew={product.isNew}
                            discount={product.discount}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">No trending products found.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => applyFilters({})}
                      >
                        Show All Recommendations
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Similar pattern for other tabs */}
              <TabsContent value="similar" className="mt-0">
                {/* Similar content structure */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="relative">
                        <div className="absolute right-2 top-2 z-10 bg-white/90 backdrop-blur-sm text-black text-xs rounded-full px-2 py-1 shadow-sm border">
                          {getRecommendationExplanation(product.source.type)}
                        </div>
                        <div 
                          onClick={() => trackRecommendationClick(product)}
                          className="h-full"
                        >
                          <ProductCard
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            category={product.category}
                            isNew={product.isNew}
                            discount={product.discount}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">No similar products found.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => applyFilters({})}
                      >
                        Show All Recommendations
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="viewed" className="mt-0">
                {/* Similar content structure */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="relative">
                        <div className="absolute right-2 top-2 z-10 bg-white/90 backdrop-blur-sm text-black text-xs rounded-full px-2 py-1 shadow-sm border">
                          {getRecommendationExplanation(product.source.type)}
                        </div>
                        <div 
                          onClick={() => trackRecommendationClick(product)}
                          className="h-full"
                        >
                          <ProductCard
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            category={product.category}
                            isNew={product.isNew}
                            discount={product.discount}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">No recommendations based on viewed products.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => applyFilters({})}
                      >
                        Show All Recommendations
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RecommendationsPage;
