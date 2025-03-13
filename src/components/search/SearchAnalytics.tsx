
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterState } from '@/hooks/useProductSearch';

interface SearchAnalyticsProps {
  analytics: {
    query: string;
    timestamp: string;
    resultsCount: number;
    filters: FilterState;
  }[];
}

export const SearchAnalytics = ({ analytics }: SearchAnalyticsProps) => {
  // Process the analytics data for the charts
  const queryFrequency = analytics.reduce((acc, curr) => {
    const query = curr.query.toLowerCase();
    acc[query] = (acc[query] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(queryFrequency)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Get most recent 10 searches for the table
  const recentSearches = [...analytics]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Analytics</CardTitle>
        <CardDescription>
          Insights from your recent searches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="popular">
          <TabsList className="mb-4">
            <TabsTrigger value="popular">Popular Searches</TabsTrigger>
            <TabsTrigger value="recent">Recent Searches</TabsTrigger>
          </TabsList>
          
          <TabsContent value="popular">
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="query" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No search data available yet
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recent">
            <ScrollArea className="h-64">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Query</th>
                    <th className="text-left py-2 font-medium">Results</th>
                    <th className="text-left py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSearches.map((search, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{search.query}</td>
                      <td className="py-2">{search.resultsCount}</td>
                      <td className="py-2">{new Date(search.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
