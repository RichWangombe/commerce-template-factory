
import { useCallback } from "react";
import { ProductRecommendation } from "@/types/recommendation";

// In a real application, this would send data to an analytics service
export const useRecommendationAnalytics = () => {
  // Track when a recommendation is clicked
  const trackRecommendationClick = useCallback((recommendation: ProductRecommendation) => {
    console.log("Recommendation clicked:", {
      productId: recommendation.id,
      productName: recommendation.name,
      recommendationType: recommendation.source.type,
      confidence: recommendation.source.confidence,
      timestamp: new Date().toISOString()
    });
    
    // This would typically send data to a backend analytics service
    // For now, we'll just log to console and store in localStorage for demo purposes
    const analyticsData = JSON.parse(localStorage.getItem('recommendation_clicks') || '[]');
    analyticsData.push({
      productId: recommendation.id,
      productName: recommendation.name,
      recommendationType: recommendation.source.type,
      confidence: recommendation.source.confidence,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('recommendation_clicks', JSON.stringify(analyticsData));
  }, []);

  // Track when a recommendation leads to a purchase (conversion)
  const trackRecommendationConversion = useCallback((recommendation: ProductRecommendation) => {
    console.log("Recommendation converted to purchase:", {
      productId: recommendation.id,
      productName: recommendation.name,
      recommendationType: recommendation.source.type,
      confidence: recommendation.source.confidence,
      timestamp: new Date().toISOString()
    });
    
    // This would typically send data to a backend analytics service
    const analyticsData = JSON.parse(localStorage.getItem('recommendation_conversions') || '[]');
    analyticsData.push({
      productId: recommendation.id,
      productName: recommendation.name,
      recommendationType: recommendation.source.type,
      confidence: recommendation.source.confidence,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('recommendation_conversions', JSON.stringify(analyticsData));
  }, []);

  return {
    trackRecommendationClick,
    trackRecommendationConversion
  };
};
