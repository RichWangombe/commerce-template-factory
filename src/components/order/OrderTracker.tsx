
import React from "react";
import { Order, OrderStatus } from "@/types/checkout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, CheckCircle, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTrackerProps {
  order: Order;
}

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "processing":
      return <Package className="h-5 w-5 text-blue-500" />;
    case "shipped":
      return <Truck className="h-5 w-5 text-purple-500" />;
    case "delivered":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "cancelled":
      return <X className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5" />;
  }
};

const getStatusColor = (status: OrderStatus) => {
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

export const OrderTracker: React.FC<OrderTrackerProps> = ({ order }) => {
  const orderStatusSteps: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];
  const currentStatusIndex = orderStatusSteps.indexOf(order.status);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Order #{order.id.slice(-6)}
          </CardTitle>
          <Badge
            variant="outline"
            className={cn("px-3 py-1 font-medium capitalize", getStatusColor(order.status))}
          >
            {order.status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Placed on {formatDate(order.createdAt)}
        </div>
        {order.estimatedDelivery && (
          <div className="text-sm font-medium">
            Estimated delivery: {order.estimatedDelivery}
          </div>
        )}
        {order.trackingNumber && (
          <div className="text-sm">
            Tracking #: <span className="font-medium">{order.trackingNumber}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="mt-2">
          {/* Order Status Timeline */}
          <div className="relative mt-6 py-2">
            <div className="absolute left-[15px] top-0 h-full w-0.5 bg-gray-200" />
            
            {order.statusHistory ? (
              // If we have detailed status history, show it
              order.statusHistory.map((statusEvent, index) => (
                <div key={index} className="relative mb-8 flex items-start pl-8">
                  <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-white">
                    {getStatusIcon(statusEvent.status)}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center font-medium capitalize">
                      {statusEvent.status}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {new Date(statusEvent.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {statusEvent.location && (
                      <div className="text-sm text-muted-foreground">
                        {statusEvent.location}
                      </div>
                    )}
                    {statusEvent.description && (
                      <div className="text-sm">{statusEvent.description}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Default status steps if no detailed history
              orderStatusSteps.map((status, index) => {
                const isActive = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div 
                    key={status} 
                    className={cn(
                      "relative mb-8 flex items-start pl-8",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <div 
                      className={cn(
                        "absolute left-0 flex h-8 w-8 items-center justify-center rounded-full",
                        isActive 
                          ? isCurrent 
                            ? "bg-primary text-white" 
                            : "bg-primary/20 text-primary" 
                          : "bg-gray-200 text-gray-400"
                      )}
                    >
                      {getStatusIcon(status)}
                    </div>
                    <div className="ml-4">
                      <div className={cn(
                        "capitalize font-medium",
                        isActive ? "" : "text-muted-foreground"
                      )}>
                        {status}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {status === "pending" && "Order received"}
                        {status === "processing" && "Preparing your order"}
                        {status === "shipped" && "Your order is on the way"}
                        {status === "delivered" && "Order delivered successfully"}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <Separator className="my-4" />
          
          {/* Order Items Summary */}
          <div className="space-y-3">
            <h4 className="font-medium">Order Items</h4>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium">{item.name}</h5>
                  {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
