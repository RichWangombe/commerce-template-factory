
import React from "react";
import { Link } from "react-router-dom";
import { Order } from "@/types/checkout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrdersListProps {
  orders: Order[];
}

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

export const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          When you place orders, they will appear here.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b p-4">
              <div className="flex flex-wrap items-start justify-between gap-y-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">Order #{order.id.slice(-6)}</h3>
                    <Badge
                      variant="outline"
                      className={cn("px-2 py-0.5 text-xs capitalize", getStatusColor(order.status))}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap gap-4">
                {order.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-sm text-muted-foreground">
                    +{order.items.length - 3} more
                  </div>
                )}
              </div>
              
              {order.trackingNumber && (
                <div className="mt-4 text-sm">
                  <span className="font-medium">Tracking:</span> {order.trackingNumber}
                </div>
              )}
              
              {order.estimatedDelivery && order.status !== "delivered" && order.status !== "cancelled" && (
                <div className="mt-1 text-sm">
                  <span className="font-medium">Estimated delivery:</span> {order.estimatedDelivery}
                </div>
              )}
              
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link to={`/order/${order.id}`}>
                    View Order Details
                  </Link>
                </Button>
                
                {order.status === "shipped" && (
                  <Button
                    size="sm"
                    asChild
                  >
                    <Link to={`/order/${order.id}`}>
                      Track Order
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
