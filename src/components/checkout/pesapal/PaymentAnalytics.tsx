
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PieChart } from "lucide-react";

interface AnalyticsSummary {
  completed: number;
  failed: number;
  pending: number;
  abandoned: number;
  completionRate: number;
}

interface PaymentAnalyticsProps {
  show: boolean;
  onToggle: () => void;
  analytics: AnalyticsSummary | null;
}

export const PaymentAnalytics: React.FC<PaymentAnalyticsProps> = ({ 
  show, 
  onToggle, 
  analytics 
}) => {
  if (!analytics) return null;
  
  return (
    <div>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onToggle}
        size="sm"
        className="flex items-center"
      >
        <PieChart size={16} className="mr-2" />
        {show ? "Hide" : "Show"} Payment Analytics
      </Button>
      
      {show && (
        <div className="mt-4 p-4 border rounded-md bg-slate-50 space-y-3">
          <h4 className="text-sm font-medium">Payment Analytics</h4>
          
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="p-2 bg-white rounded border">
              <div className="text-xs text-muted-foreground">Completed</div>
              <div className="text-sm font-medium">{analytics.completed}</div>
            </div>
            <div className="p-2 bg-white rounded border">
              <div className="text-xs text-muted-foreground">Failed</div>
              <div className="text-sm font-medium">{analytics.failed}</div>
            </div>
            <div className="p-2 bg-white rounded border">
              <div className="text-xs text-muted-foreground">Abandoned</div>
              <div className="text-sm font-medium">{analytics.abandoned}</div>
            </div>
            <div className="p-2 bg-white rounded border">
              <div className="text-xs text-muted-foreground">Pending</div>
              <div className="text-sm font-medium">{analytics.pending}</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Completion Rate</span>
              <span>{analytics.completionRate}%</span>
            </div>
            <Progress value={analytics.completionRate} className="h-2" />
          </div>
        </div>
      )}
    </div>
  );
};
