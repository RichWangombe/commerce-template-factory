
import { MainLayout } from "@/components/layouts/MainLayout";
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

  return (
    <MainLayout className="p-0">
      <Hero />
      
      <div className="space-y-16 mb-16">
        <CategoriesSection categories={categories} />
        <RecommendationSection />
        
        {preferences.showRecentlyViewed && (
          <PersonalizedSection
            title="Recently Viewed"
            subtitle="Products you've checked out recently"
            recommendationType="viewed"
            limit={4}
          />
        )}
        
        <FeaturedProductsSection products={featuredProducts} />
        
        <PersonalizedSection
          title="Customers Also Bought"
          subtitle="Products popular with customers like you"
          recommendationType="collaborative"
          limit={4}
        />
        
        {preferences.showTrending && (
          <PersonalizedSection
            title="Trending Now"
            subtitle="What's popular right now"
            recommendationType="trending"
            limit={4}
          />
        )}
        
        {preferences.showSeasonalOffers && (
          <PersonalizedSection
            title="Seasonal Picks"
            subtitle="Perfect for this time of year"
            recommendationType="seasonal"
            limit={4}
          />
        )}
        
        <PromotionsSection promotions={promotions} />
        <NewsletterSection />
      </div>
    </MainLayout>
  );
};

export default HomePage;
