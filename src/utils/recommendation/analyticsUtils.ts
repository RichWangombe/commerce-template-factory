
import { RecommendationClickEvent } from "@/types/recommendation";

/**
 * Simulate an API call to get recommendations
 * This adds a small delay to simulate a network request
 */
export const simulateRecommendationApiCall = async (
  recommendations: any[],
  limit: number
): Promise<any[]> => {
  // Add a small delay to simulate an API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return a limited number of recommendations
  return recommendations.slice(0, limit);
};

/**
 * Log recommendation view events for analytics
 */
export const logRecommendationViewEvent = (event: RecommendationClickEvent): void => {
  console.log('Recommendation viewed:', event);
  
  // In a real app, this would send data to an analytics service
  // For now, we'll just log to console and local storage
  const viewEvents = JSON.parse(localStorage.getItem('recommendation_views') || '[]');
  viewEvents.push(event);
  localStorage.setItem('recommendation_views', JSON.stringify(viewEvents));
};
