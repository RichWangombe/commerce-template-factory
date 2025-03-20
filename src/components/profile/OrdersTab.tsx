
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersList } from "@/components/order/OrdersList";
import { Order } from "@/types/checkout";

interface OrdersTabProps {
  orders?: Order[];
}

export const OrdersTab = ({ orders }: OrdersTabProps) => {
  // Default to empty array if orders is undefined
  const ordersList = orders || [];
  
  // Filter orders by status
  const activeOrders = ordersList.filter(
    order => ["pending", "processing", "shipped"].includes(order.status)
  );
  
  const completedOrders = ordersList.filter(
    order => order.status === "delivered"
  );
  
  const cancelledOrders = ordersList.filter(
    order => order.status === "cancelled"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>
          View and track your recent orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">
              Active Orders {activeOrders.length > 0 && `(${activeOrders.length})`}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed {completedOrders.length > 0 && `(${completedOrders.length})`}
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled {cancelledOrders.length > 0 && `(${cancelledOrders.length})`}
            </TabsTrigger>
            <TabsTrigger value="all">
              All Orders {ordersList.length > 0 && `(${ordersList.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            <OrdersList orders={activeOrders} />
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            <OrdersList orders={completedOrders} />
          </TabsContent>
          
          <TabsContent value="cancelled" className="space-y-4">
            <OrdersList orders={cancelledOrders} />
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <OrdersList orders={ordersList} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
