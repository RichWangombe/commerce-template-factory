
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RecommendationClickEvent } from "@/types/recommendation";
import { DataTable } from "@/components/admin/DataTable";
import { recommendationColumns } from "@/components/admin/columns/recommendationColumns";

const AdminRecommendationsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<RecommendationClickEvent[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState("7days");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch analytics data from localStorage (in a real app, this would be an API call)
  useEffect(() => {
    setIsLoading(true);
    
    try {
      // Get recommendation click data
      const clickData = JSON.parse(localStorage.getItem('recommendation_clicks') || '[]');
      setAnalyticsData(clickData);
      
      // Get conversion data
      const conversions = JSON.parse(localStorage.getItem('recommendation_conversions') || '[]');
      setConversionData(conversions);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter data based on selected time range
  const filterDataByTimeRange = (data: any[]) => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case "24hours":
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "7days":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case "90days":
        cutoffDate.setDate(now.getDate() - 90);
        break;
      default:
        cutoffDate.setDate(now.getDate() - 7);
    }
    
    return data.filter(item => new Date(item.timestamp) >= cutoffDate);
  };

  // Prepare data for charts
  const prepareChartData = () => {
    const filteredData = filterDataByTimeRange(analyticsData);
    
    // Group by recommendation type
    const typeData = filteredData.reduce((acc: any, item: any) => {
      const type = item.recommendationType;
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type]++;
      return acc;
    }, {});
    
    // Convert to chart format
    return Object.keys(typeData).map(type => ({
      name: type,
      value: typeData[type]
    }));
  };
  
  // Calculate conversion rate by recommendation type
  const prepareConversionData = () => {
    const clicksByType: Record<string, number> = {};
    const conversionsByType: Record<string, number> = {};
    
    // Count clicks by type
    analyticsData.forEach(item => {
      const type = item.recommendationType;
      if (!clicksByType[type]) {
        clicksByType[type] = 0;
      }
      clicksByType[type]++;
    });
    
    // Count conversions by type
    conversionData.forEach(item => {
      const type = item.recommendationType;
      if (!conversionsByType[type]) {
        conversionsByType[type] = 0;
      }
      conversionsByType[type]++;
    });
    
    // Calculate conversion rates
    return Object.keys(clicksByType).map(type => ({
      name: type,
      rate: conversionsByType[type] 
        ? Math.round((conversionsByType[type] / clicksByType[type]) * 100) 
        : 0
    }));
  };
  
  // Calculate trend data over time
  const prepareTrendData = () => {
    const filteredData = filterDataByTimeRange(analyticsData);
    const dateMap: Record<string, number> = {};
    
    // Group by date
    filteredData.forEach(item => {
      const date = new Date(item.timestamp).toLocaleDateString();
      if (!dateMap[date]) {
        dateMap[date] = 0;
      }
      dateMap[date]++;
    });
    
    // Convert to chart format and sort by date
    return Object.keys(dateMap)
      .map(date => ({
        date,
        clicks: dateMap[date]
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = prepareChartData();
  const conversionRates = prepareConversionData();
  const trendData = prepareTrendData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  return (
    <AdminLayout 
      title="Recommendation Analytics" 
      subtitle="Track and analyze the performance of product recommendations"
      isLoading={isLoading}
      breadcrumbs={[
        { label: "Dashboard", href: "/admin" },
        { label: "Recommendation Analytics" }
      ]}
      action={
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24hours">Last 24 Hours</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      }
    >
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="details">Raw Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recommendations by Type</CardTitle>
                <CardDescription>Distribution of recommendation clicks by recommendation type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate by Recommendation Type</CardTitle>
                <CardDescription>Percentage of recommendations that led to purchases</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {conversionRates.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionRates}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="%" />
                      <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                      <Legend />
                      <Bar dataKey="rate" fill="#8884d8" name="Conversion Rate" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No conversion data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recommendation Clicks Over Time</CardTitle>
              <CardDescription>Number of recommendation clicks over the selected time period</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="#8884d8" 
                      name="Clicks" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No trend data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement with Recommendations</CardTitle>
              <CardDescription>Detailed metrics on how users interact with recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section will show detailed engagement metrics for recommendations including
                click-through rates, time spent viewing recommended products, and user segments
                that engage most with recommendations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Analysis</CardTitle>
              <CardDescription>Analyzing how recommendations convert to purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section will provide in-depth analysis of how recommendations lead to 
                conversions, including average order value from recommendations, conversion
                funnels, and revenue attribution.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Raw Recommendation Data</CardTitle>
              <CardDescription>Detailed records of recommendation clicks and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.length > 0 ? (
                <DataTable columns={recommendationColumns} data={analyticsData} />
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No recommendation data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminRecommendationsPage;
