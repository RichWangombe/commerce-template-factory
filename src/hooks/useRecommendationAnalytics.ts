
import { useCallback } from "react";
import { ProductRecommendation, RecommendationAnalytics } from "@/types/recommendation";

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
  const trackRecommendationConversion = useCallback((recommendation: ProductRecommendation, orderValue?: number) => {
    console.log("Recommendation converted to purchase:", {
      productId: recommendation.id,
      productName: recommendation.name,
      recommendationType: recommendation.source.type,
      confidence: recommendation.source.confidence,
      orderValue,
      timestamp: new Date().toISOString()
    });
    
    // This would typically send data to a backend analytics service
    const analyticsData = JSON.parse(localStorage.getItem('recommendation_conversions') || '[]');
    analyticsData.push({
      productId: recommendation.id,
      productName: recommendation.name,
      recommendationType: recommendation.source.type,
      confidence: recommendation.source.confidence,
      orderValue,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('recommendation_conversions', JSON.stringify(analyticsData));
  }, []);

  // Get analytics data for the admin dashboard
  const getAnalyticsData = useCallback((): RecommendationAnalytics => {
    // In a real app, this would fetch from an API
    const clicks = JSON.parse(localStorage.getItem('recommendation_clicks') || '[]');
    const conversions = JSON.parse(localStorage.getItem('recommendation_conversions') || '[]');
    
    // Calculate conversion rate
    const conversionRate = clicks.length > 0 
      ? (conversions.length / clicks.length) * 100 
      : 0;
    
    // Find most effective recommendation type
    const clicksByType: Record<string, number> = {};
    const conversionsByType: Record<string, number> = {};
    
    clicks.forEach((click: any) => {
      const type = click.recommendationType;
      if (!clicksByType[type]) clicksByType[type] = 0;
      clicksByType[type]++;
    });
    
    conversions.forEach((conversion: any) => {
      const type = conversion.recommendationType;
      if (!conversionsByType[type]) conversionsByType[type] = 0;
      conversionsByType[type]++;
    });
    
    let mostEffectiveType = 'none';
    let highestConversionRate = 0;
    
    Object.keys(clicksByType).forEach(type => {
      const typeConversions = conversionsByType[type] || 0;
      const typeConversionRate = typeConversions / clicksByType[type];
      
      if (typeConversionRate > highestConversionRate) {
        highestConversionRate = typeConversionRate;
        mostEffectiveType = type;
      }
    });
    
    return {
      clicks,
      conversions,
      conversionRate,
      mostEffectiveType
    };
  }, []);

  // Clear analytics data (for testing/demo purposes)
  const clearAnalyticsData = useCallback(() => {
    localStorage.removeItem('recommendation_clicks');
    localStorage.removeItem('recommendation_conversions');
  }, []);

  return {
    trackRecommendationClick,
    trackRecommendationConversion,
    getAnalyticsData,
    clearAnalyticsData
  };
};
