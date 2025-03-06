
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  Mail, 
  Shield, 
  UserX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock users data
const mockUsers = [
  {
    id: "user123",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "customer",
    status: "active",
    created: "2023-05-12T14:30:00Z",
    orders: 8,
    totalSpent: 523.45,
    avatar: "",
  },
  {
    id: "user456",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "customer",
    status: "active",
    created: "2023-06-24T09:15:00Z",
    orders: 3,
    totalSpent: 189.99,
    avatar: "",
  },
  {
    id: "user789",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "customer",
    status: "inactive",
    created: "2023-04-18T11:45:00Z",
    orders: 5,
    totalSpent: 312.50,
    avatar: "",
  },
  {
    id: "admin001",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    created: "2023-01-10T08:00:00Z",
    orders: 0,
    totalSpent: 0,
    avatar: "",
  },
  {
    id: "user101",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "customer",
    status: "pending",
    created: "2023-09-05T16:20:00Z",
    orders: 1,
    totalSpent: 79.99,
    avatar: "",
  }
];

type UserRole = "admin" | "customer" | "editor";
type UserStatus = "active" | "inactive" | "pending" | "suspended";

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Admin</Badge>;
      case "editor":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Editor</Badge>;
      case "customer":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Customer</Badge>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleSendEmail = (userId: string, userName: string) => {
    console.log(`Sending email to user: ${userId}`);
    toast.success(`Email sent to ${userName}`);
  };
  
  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    console.log(`Updating user ${userId} role to ${newRole}`);
    toast.success(`User role updated to ${newRole}`);
  };
  
  const handleSuspendUser = (userId: string, userName: string) => {
    console.log(`Suspending user: ${userId}`);
    toast.success(`${userName} has been suspended`);
  };
  
  return (
    <AdminLayout title="Users">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="role-filter" className="text-sm whitespace-nowrap">
                Role:
              </Label>
              <Select
                value={roleFilter}
                onValueChange={(value) => setRoleFilter(value as UserRole | "all")}
              >
                <SelectTrigger id="role-filter" className="w-[130px]">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="status-filter" className="text-sm whitespace-nowrap">
                Status:
              </Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as UserStatus | "all")}
              >
                <SelectTrigger id="status-filter" className="w-[130px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <Card className="mt-6">
        <CardHeader className="p-4">
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage users, update roles, and handle user account issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={user.role}
                          onValueChange={(value) => handleUpdateRole(user.id, value as UserRole)}
                        >
                          <SelectTrigger className="h-8 w-[110px]">
                            <SelectValue>
                              {getRoleBadge(user.role)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">
                              <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                            </SelectItem>
                            <SelectItem value="editor">
                              <Badge className="bg-blue-100 text-blue-800">Editor</Badge>
                            </SelectItem>
                            <SelectItem value="customer">
                              <Badge className="bg-green-100 text-green-800">Customer</Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        {formatDate(user.created)}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.orders}
                      </TableCell>
                      <TableCell className="text-right">
                        ${user.totalSpent.toFixed(2)}
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
                            <DropdownMenuItem onClick={() => handleSendEmail(user.id, user.name)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Email User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleSuspendUser(user.id, user.name)}
                              disabled={user.status === "suspended"}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend User
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
              Showing <strong>1-{filteredUsers.length}</strong> of <strong>{mockUsers.length}</strong> users
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

export default AdminUsersPage;
