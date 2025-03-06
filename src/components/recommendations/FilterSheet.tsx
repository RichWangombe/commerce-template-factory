
import React from "react";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter, Check } from "lucide-react";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRecommendations } from "@/contexts/RecommendationContext";

export const FilterSheet: React.FC = () => {
  const { userPreferences, updateUserPreferences } = useRecommendations();
  
  const form = useForm({
    defaultValues: {
      categories: userPreferences.favoriteCategories || [],
      recommendationTypes: []
    }
  });

  // Save category preferences
  const savePreferences = (data: { categories: string[], recommendationTypes: string[] }) => {
    updateUserPreferences({
      favoriteCategories: data.categories
    });
  };

  return (
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
  );
};
