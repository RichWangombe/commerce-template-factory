
import React from "react";
import { Order, OrderStatusHistory } from "@/types/checkout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Package, TruckIcon, CheckCircle, AlertCircle } from "lucide-react";

interface OrderHistoryProps {
  order: Order;
}

const getStatusIcon = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return <FileText className="h-5 w-5 text-yellow-600" />;
    case "processing":
      return <Package className="h-5 w-5 text-blue-600" />;
    case "shipped":
      return <TruckIcon className="h-5 w-5 text-purple-600" />;
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "cancelled":
      return <AlertCircle className="h-5 w-5 text-red-600" />;
    default:
      return <FileText className="h-5 w-5 text-gray-600" />;
  }
};

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const OrderHistory: React.FC<OrderHistoryProps> = ({ order }) => {
  // Create dummy status history if not provided
  const statusHistory = order.statusHistory || generateDummyStatusHistory(order);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Order Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="relative pl-6 pb-2">
            <div className="absolute top-0 bottom-0 left-2 border-l-2 border-gray-200"></div>
            {statusHistory.map((event, index) => (
              <div key={index} className="mb-4 relative">
                <div className="absolute -left-4 mt-1 rounded-full bg-white">
                  {getStatusIcon(event.status)}
                </div>
                <div className="pl-6">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={cn("px-2 py-0.5 text-xs capitalize", getStatusColor(event.status))}
                    >
                      {event.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {event.location && (
                    <p className="text-sm font-medium">{event.location}</p>
                  )}
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Helper function to generate dummy status history based on the current order status
function generateDummyStatusHistory(order: Order): OrderStatusHistory[] {
  const now = new Date();
  const createdDate = new Date(order.createdAt);
  
  const history: OrderStatusHistory[] = [
    {
      status: 'pending',
      timestamp: createdDate.toISOString(),
      description: 'Order received',
    }
  ];

  // Add processing status if order status is beyond pending
  if (['processing', 'shipped', 'delivered'].includes(order.status)) {
    const processingDate = new Date(createdDate);
    processingDate.setHours(processingDate.getHours() + 2);
    history.push({
      status: 'processing',
      timestamp: processingDate.toISOString(),
      description: 'Order confirmed and processing started',
    });
  }

  // Add shipped status if order status is beyond processing
  if (['shipped', 'delivered'].includes(order.status)) {
    const shippedDate = new Date(createdDate);
    shippedDate.setHours(shippedDate.getHours() + 24);
    history.push({
      status: 'shipped',
      timestamp: shippedDate.toISOString(),
      location: order.trackingNumber ? 'Shipping Facility' : undefined,
      description: order.trackingNumber
        ? `Package shipped via carrier. Tracking number: ${order.trackingNumber}`
        : 'Package shipped via carrier',
    });
  }

  // Add delivered status if order is delivered
  if (order.status === 'delivered') {
    const deliveredDate = new Date(createdDate);
    deliveredDate.setDate(deliveredDate.getDate() + 3);
    history.push({
      status: 'delivered',
      timestamp: deliveredDate.toISOString(),
      location: 'Delivery Address',
      description: 'Package delivered successfully',
    });
  }

  // Add cancelled status if order is cancelled
  if (order.status === 'cancelled') {
    const cancelledDate = new Date(createdDate);
    cancelledDate.setHours(cancelledDate.getHours() + 4);
    history.push({
      status: 'cancelled',
      timestamp: cancelledDate.toISOString(),
      description: 'Order cancelled',
    });
  }

  return history;
}
