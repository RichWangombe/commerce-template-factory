
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { PersonalizedSection } from "@/components/PersonalizedSection";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { PromotionsSection } from "@/components/home/PromotionsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { RecommendationSection } from "@/components/home/RecommendationSection";
import { categories, featuredProducts, promotions } from "@/data/homePageData";

export const HomePage = () => {
  const { preferences } = useUserPreferences();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setIsLoaded(true);
    }, 200);
  }, []);

  return (
    <div className={`flex min-h-screen flex-col bg-white ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        {/* Categories */}
        <CategoriesSection categories={categories} />
        
        {/* Personalized Recommendations with link to full page */}
        <RecommendationSection />
        
        {/* Recently Viewed */}
        {preferences.showRecentlyViewed && (
          <PersonalizedSection
            title="Recently Viewed"
            subtitle="Products you've checked out recently"
            recommendationType="viewed"
            limit={4}
          />
        )}
        
        {/* Featured Products */}
        <FeaturedProductsSection products={featuredProducts} />
        
        {/* Collaborative Recommendations */}
        <PersonalizedSection
          title="Customers Also Bought"
          subtitle="Products popular with customers like you"
          recommendationType="collaborative"
          limit={4}
        />
        
        {/* Trending Products */}
        {preferences.showTrending && (
          <PersonalizedSection
            title="Trending Now"
            subtitle="What's popular right now"
            recommendationType="trending"
            limit={4}
          />
        )}
        
        {/* Seasonal Recommendations */}
        {preferences.showSeasonalOffers && (
          <PersonalizedSection
            title="Seasonal Picks"
            subtitle="Perfect for this time of year"
            recommendationType="seasonal"
            limit={4}
          />
        )}
        
        {/* Promotions */}
        <PromotionsSection promotions={promotions} />
        
        {/* Newsletter */}
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
