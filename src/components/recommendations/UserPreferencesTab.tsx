
import React from "react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Layers, Sparkles, Clock, TrendingUp, Users, CalendarDays } from "lucide-react";

const UserPreferencesTab = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handleSwitchChange = (key: string) => (checked: boolean) => {
    updatePreferences({ [key]: checked });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Personalization Preferences
          </CardTitle>
          <CardDescription>
            Customize your recommendation experience by adjusting these settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Recommendation Types</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="showRecentlyViewed" className="font-normal">Recently Viewed</Label>
                </div>
                <Switch 
                  id="showRecentlyViewed"
                  checked={preferences.showRecentlyViewed}
                  onCheckedChange={handleSwitchChange('showRecentlyViewed')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="showTrending" className="font-normal">Trending Products</Label>
                </div>
                <Switch 
                  id="showTrending"
                  checked={preferences.showTrending}
                  onCheckedChange={handleSwitchChange('showTrending')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="showSimilar" className="font-normal">Similar Products</Label>
                </div>
                <Switch 
                  id="showSimilar"
                  checked={preferences.showSimilar}
                  onCheckedChange={handleSwitchChange('showSimilar')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="showCollaborative" className="font-normal">Collaborative Recommendations</Label>
                </div>
                <Switch 
                  id="showCollaborative"
                  checked={preferences.showCollaborative}
                  onCheckedChange={handleSwitchChange('showCollaborative')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="showSeasonalOffers" className="font-normal">Seasonal Offers</Label>
                </div>
                <Switch 
                  id="showSeasonalOffers"
                  checked={preferences.showSeasonalOffers}
                  onCheckedChange={handleSwitchChange('showSeasonalOffers')}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Display Settings</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="recommendationCount">Recommendations to show</Label>
                  <span className="text-sm text-muted-foreground">{preferences.recommendationCount || 4}</span>
                </div>
                <Slider 
                  id="recommendationCount"
                  min={2}
                  max={12}
                  step={2}
                  value={[preferences.recommendationCount || 4]}
                  onValueChange={(values) => updatePreferences({ recommendationCount: values[0] })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Controls how many recommendations to display at once
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Favorite Categories</CardTitle>
          <CardDescription>
            Select your favorite product categories to receive more relevant recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {['Smartphones', 'Laptops', 'Audio', 'Wearables', 'Tablets', 'Accessories', 'Gaming'].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Switch 
                  id={`category-${category}`}
                  checked={(preferences.favoriteCategories || []).includes(category)}
                  onCheckedChange={(checked) => {
                    const currentFavorites = [...(preferences.favoriteCategories || [])];
                    const newFavorites = checked 
                      ? [...currentFavorites, category]
                      : currentFavorites.filter(c => c !== category);
                    
                    updatePreferences({ favoriteCategories: newFavorites });
                  }}
                />
                <Label htmlFor={`category-${category}`} className="font-normal">{category}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferencesTab;
