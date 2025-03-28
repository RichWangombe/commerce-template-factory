
import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const categoryOptions = [
  { id: "smartphones", label: "Smartphones" },
  { id: "laptops", label: "Laptops" },
  { id: "wearables", label: "Wearables" },
  { id: "accessories", label: "Accessories" },
  { id: "audio", label: "Audio" },
  { id: "gaming", label: "Gaming" },
];

export const PreferencesTab = () => {
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();
  
  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = preferences.favoriteCategories || [];
    let newCategories;
    
    if (checked) {
      newCategories = [...currentCategories, category];
    } else {
      newCategories = currentCategories.filter(cat => cat !== category);
    }
    
    updatePreferences({ favoriteCategories: newCategories });
  };
  
  const handleResetPreferences = () => {
    resetPreferences();
    toast.success("Preferences have been reset to default");
  };
  
  const formatPrice = (value: number) => {
    return `$${value}`;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recommendation Preferences</CardTitle>
          <CardDescription>
            Customize what type of product recommendations you want to see
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Recommendation Types</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recentlyViewed" 
                  checked={preferences.showRecentlyViewed}
                  onCheckedChange={(checked) => 
                    updatePreferences({ showRecentlyViewed: checked as boolean })
                  }
                />
                <Label htmlFor="recentlyViewed">Recently Viewed Products</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="trending" 
                  checked={preferences.showTrending}
                  onCheckedChange={(checked) => 
                    updatePreferences({ showTrending: checked as boolean })
                  }
                />
                <Label htmlFor="trending">Trending Products</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="similar" 
                  checked={preferences.showSimilar}
                  onCheckedChange={(checked) => 
                    updatePreferences({ showSimilar: checked as boolean })
                  }
                />
                <Label htmlFor="similar">Similar Products</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="seasonal" 
                  checked={preferences.showSeasonalOffers}
                  onCheckedChange={(checked) => 
                    updatePreferences({ showSeasonalOffers: checked as boolean })
                  }
                />
                <Label htmlFor="seasonal">Seasonal Offers</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="collaborative" 
                  checked={preferences.showCollaborative}
                  onCheckedChange={(checked) => 
                    updatePreferences({ showCollaborative: checked as boolean })
                  }
                />
                <Label htmlFor="collaborative">Others Also Bought</Label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Favorite Categories</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {categoryOptions.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={category.id} 
                    checked={preferences.favoriteCategories?.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={category.id}>{category.label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Price Range</h3>
              <span className="text-sm text-gray-500">
                {formatPrice(preferences.preferredPriceRange?.[0] || 0)} - 
                {formatPrice(preferences.preferredPriceRange?.[1] || 1000)}
              </span>
            </div>
            <Slider 
              value={preferences.preferredPriceRange}
              min={0}
              max={2000}
              step={50}
              onValueChange={(values) => 
                updatePreferences({ preferredPriceRange: values as [number, number] })
              }
            />
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Number of Recommendations</h3>
            <Slider 
              value={[preferences.recommendationCount || 4]}
              min={1}
              max={12}
              step={1}
              onValueChange={(values) => 
                updatePreferences({ recommendationCount: values[0] })
              }
            />
            <span className="block text-sm text-gray-500">
              Show {preferences.recommendationCount} recommendations at a time
            </span>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleResetPreferences}>
          Reset to Defaults
        </Button>
        <Button onClick={() => toast.success("Preferences saved successfully")}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
};
