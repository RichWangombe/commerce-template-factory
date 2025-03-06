
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrdersList } from "@/components/order/OrdersList";
import { OrderDetail } from "@/components/order/OrderDetail";
import { Order } from "@/types/checkout";
import { Search, FilterIcon } from "lucide-react";

interface OrdersTabProps {
  orders: Order[];
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  
  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        searchTerm === "" || 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesFilter = 
        filterStatus === "all" || 
        order.status === filterStatus;
        
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchTerm, filterStatus]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>
          View and track all your past orders.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedOrder ? (
          <div>
            <Button 
              variant="ghost" 
              className="mb-4" 
              onClick={() => setSelectedOrder(null)}
            >
              ← Back to all orders
            </Button>
            <OrderDetail order={selectedOrder} />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="outline" size="icon">
                  <FilterIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="rounded-md">
              <OrdersList 
                orders={filteredOrders} 
                onViewDetails={(order) => setSelectedOrder(order)}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
