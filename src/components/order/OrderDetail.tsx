
import React, { useState } from "react";
import { Order } from "@/types/checkout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Printer, RefreshCw } from "lucide-react";
import { OrderHistory } from "./OrderHistory";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface OrderDetailProps {
  order: Order;
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

export const OrderDetail: React.FC<OrderDetailProps> = ({ order }) => {
  const [activeTab, setActiveTab] = useState("summary");
  
  const handlePrintInvoice = () => {
    if (order.invoiceUrl) {
      window.open(order.invoiceUrl, '_blank');
    } else {
      toast.info("Invoice is not available for this order yet.");
    }
  };
  
  const handleOrderReturn = () => {
    // In a real app, this would open a return request flow
    toast.info("Return functionality would be implemented here.");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-y-3">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">Order #{order.id.slice(-6)}</CardTitle>
              <Badge
                variant="outline"
                className={cn("px-2 py-0.5 text-xs capitalize", getStatusColor(order.status))}
              >
                {order.status}
              </Badge>
            </div>
            <CardDescription>
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
              <Printer className="mr-2 h-4 w-4" />
              Invoice
            </Button>
            {order.status !== 'cancelled' && order.status !== 'pending' && (
              <Button variant="outline" size="sm" onClick={handleOrderReturn}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Return
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Shipping Address</h4>
                <div className="text-sm">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                </div>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Shipping Method</h4>
                <div className="text-sm">
                  <p>{order.shippingMethod.name} - ${order.shippingMethod.price.toFixed(2)}</p>
                  <p className="text-muted-foreground">{order.shippingMethod.description}</p>
                </div>
                
                {order.trackingNumber && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium">Tracking</h4>
                    <p className="text-sm">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Payment Info</h4>
              <div className="text-sm">
                <p>Method: {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod}</p>
                {order.refundStatus && order.refundStatus !== 'none' && (
                  <p className="text-muted-foreground">
                    Refund status: {order.refundStatus} 
                    {order.refundAmount && ` ($${order.refundAmount.toFixed(2)})`}
                  </p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="items" className="mt-4">
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start space-x-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium">
                      <h3>{item.name}</h3>
                      <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    {item.variant && (
                      <p className="mt-1 text-sm text-gray-500">Variant: {item.variant}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="mt-1 text-sm text-gray-500">Price: ${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <OrderHistory order={order} />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {order.notes && (
        <CardFooter className="flex flex-col items-start border-t">
          <h4 className="text-sm font-medium mb-1">Order Notes</h4>
          <p className="text-sm text-muted-foreground">{order.notes}</p>
        </CardFooter>
      )}
    </Card>
  );
};
