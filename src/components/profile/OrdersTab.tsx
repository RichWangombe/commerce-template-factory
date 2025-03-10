import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader, Package } from "lucide-react";
import { apiService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/types/checkout";

type OrderStatusBadgeProps = {
  status: string;
};

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
    case "shipped":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Shipped</Badge>;
    case "processing":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Processing</Badge>;
    case "cancelled":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Pending</Badge>;
  }
};

type OrdersTabProps = {
  orders?: Order[];
};

export const OrdersTab = ({ orders: propOrders }: OrdersTabProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // If orders are provided as props, use them
    if (propOrders) {
      setOrders(propOrders);
      setIsLoading(false);
      return;
    }
    
    // Otherwise fetch from API
    const fetchOrders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const fetchedOrders = await apiService.getUserOrders(user.id);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, propOrders]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>
            View and track your recent orders.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-12 text-center">
          <Package className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Button asChild>
            <Link to="/">Shop Now</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>
          View and track your recent orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">Order #{order.id}</h3>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="font-medium">${order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Items</span>
                  <span>{order.items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/order/${order.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
