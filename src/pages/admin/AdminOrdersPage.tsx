
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  MoreHorizontal, 
  Eye,
  Printer
} from "lucide-react";
import { Link } from "react-router-dom";
import { Order, OrderStatus } from "@/types/checkout";

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD123456789",
    userId: "user123",
    items: [
      {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        quantity: 1,
        image: "/placeholder.svg",
        variant: "Black",
      },
      {
        id: 2,
        name: "Smart Watch",
        price: 129.99,
        quantity: 1,
        image: "/placeholder.svg",
      },
    ],
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      address1: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "United States",
      phone: "555-123-4567",
    },
    billingAddress: {
      firstName: "John",
      lastName: "Doe",
      address1: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "United States",
      phone: "555-123-4567",
    },
    shippingMethod: {
      id: "express",
      name: "Express Shipping",
      description: "Delivered in 2-3 business days",
      price: 12.99,
      estimatedDays: "2-3 business days",
    },
    paymentMethod: "card",
    subtotal: 209.98,
    tax: 17.85,
    shipping: 12.99,
    total: 240.82,
    status: "shipped",
    createdAt: "2023-09-15T10:30:00Z",
    trackingNumber: "TRK9876543210",
    estimatedDelivery: "September 18, 2023",
  },
  {
    id: "ORD987654321",
    userId: "user456",
    items: [
      {
        id: 3,
        name: "Bluetooth Speaker",
        price: 49.99,
        quantity: 1,
        image: "/placeholder.svg",
      },
    ],
    shippingAddress: {
      firstName: "Jane",
      lastName: "Smith",
      address1: "456 Oak St",
      city: "Somewhere",
      state: "NY",
      zipCode: "67890",
      country: "United States",
      phone: "555-987-6543",
    },
    billingAddress: {
      firstName: "Jane",
      lastName: "Smith",
      address1: "456 Oak St",
      city: "Somewhere",
      state: "NY",
      zipCode: "67890",
      country: "United States",
      phone: "555-987-6543",
    },
    shippingMethod: {
      id: "standard",
      name: "Standard Shipping",
      description: "Delivered in 5-7 business days",
      price: 4.99,
      estimatedDays: "5-7 business days",
    },
    paymentMethod: "card",
    subtotal: 49.99,
    tax: 4.25,
    shipping: 4.99,
    total: 59.23,
    status: "delivered",
    createdAt: "2023-08-20T14:45:00Z",
  },
  {
    id: "ORD456789123",
    userId: "user789",
    items: [
      {
        id: 4,
        name: "Laptop Backpack",
        price: 39.99,
        quantity: 2,
        image: "/placeholder.svg",
      },
    ],
    shippingAddress: {
      firstName: "Robert",
      lastName: "Johnson",
      address1: "789 Pine St",
      city: "Elsewhere",
      state: "TX",
      zipCode: "54321",
      country: "United States",
      phone: "555-456-7890",
    },
    billingAddress: {
      firstName: "Robert",
      lastName: "Johnson",
      address1: "789 Pine St",
      city: "Elsewhere",
      state: "TX",
      zipCode: "54321",
      country: "United States",
      phone: "555-456-7890",
    },
    shippingMethod: {
      id: "standard",
      name: "Standard Shipping",
      description: "Delivered in 5-7 business days",
      price: 4.99,
      estimatedDays: "5-7 business days",
    },
    paymentMethod: "paypal",
    subtotal: 79.98,
    tax: 6.60,
    shipping: 4.99,
    total: 91.57,
    status: "processing",
    createdAt: "2023-09-22T09:15:00Z",
  },
  {
    id: "ORD321654987",
    userId: "user101",
    items: [
      {
        id: 5,
        name: "Gaming Mouse",
        price: 59.99,
        quantity: 1,
        image: "/placeholder.svg",
      },
    ],
    shippingAddress: {
      firstName: "Michael",
      lastName: "Brown",
      address1: "101 Cedar St",
      city: "Nowhere",
      state: "CA",
      zipCode: "98765",
      country: "United States",
      phone: "555-789-1234",
    },
    billingAddress: {
      firstName: "Michael",
      lastName: "Brown",
      address1: "101 Cedar St",
      city: "Nowhere",
      state: "CA",
      zipCode: "98765",
      country: "United States",
      phone: "555-789-1234",
    },
    shippingMethod: {
      id: "express",
      name: "Express Shipping",
      description: "Delivered in 2-3 business days",
      price: 12.99,
      estimatedDays: "2-3 business days",
    },
    paymentMethod: "card",
    subtotal: 59.99,
    tax: 4.95,
    shipping: 12.99,
    total: 77.93,
    status: "pending",
    createdAt: "2023-09-25T16:20:00Z",
  },
];

const AdminOrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
    // In a real application, this would call an API to update the order status
  };
  
  return (
    <AdminLayout title="Orders">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="status-filter" className="text-sm whitespace-nowrap">
              Status:
            </Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}
            >
              <SelectTrigger id="status-filter" className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export Orders
        </Button>
      </div>
      
      <Card className="mt-6">
        <CardHeader className="p-4">
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage customer orders, update status, and process shipments.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </TableCell>
                      <TableCell>
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue>
                              {getStatusBadge(order.status)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            </SelectItem>
                            <SelectItem value="processing">
                              <Badge className="bg-blue-100 text-blue-800">Processing</Badge>
                            </SelectItem>
                            <SelectItem value="shipped">
                              <Badge className="bg-purple-100 text-purple-800">Shipped</Badge>
                            </SelectItem>
                            <SelectItem value="delivered">
                              <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                            </SelectItem>
                            <SelectItem value="cancelled">
                              <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {order.paymentMethod === "card" ? "Credit Card" : "PayPal"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link to={`/order/${order.id}`} className="cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Print Invoice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                              disabled={order.status === "cancelled" || order.status === "delivered"}
                            >
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1-{filteredOrders.length}</strong> of <strong>{mockOrders.length}</strong> orders
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8">
                1
              </Button>
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
