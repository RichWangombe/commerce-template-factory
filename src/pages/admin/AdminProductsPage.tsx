import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminWrapper } from "@/components/AdminWrapper";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: string;
  featured: boolean;
  image: string;
  original_price: number | null;
  description: string;
};

const AdminProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { count, error: countError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        
        setTotalProducts(count || 0);
        
        const from = (currentPage - 1) * productsPerPage;
        const to = from + productsPerPage - 1;
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false })
          .range(from, to);
          
        if (error) throw error;
        
        const formattedProducts = data.map(product => ({
          ...product,
          status: determineStatus(product.stock)
        }));
        
        setProducts(formattedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage]);

  const determineStatus = (stock: number): string => {
    if (stock <= 0) return "out-of-stock";
    if (stock < 10) return "low-stock";
    return "in-stock";
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const openDeleteDialog = (id: number) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (productToDelete === null) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete);
        
      if (error) throw error;
      
      setProducts(prevProducts => 
        prevProducts.filter(product => product.id !== productToDelete)
      );
      
      setSelectedProducts(prevSelected => 
        prevSelected.filter(id => id !== productToDelete)
      );
      
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">In Stock</Badge>;
      case "low-stock":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low Stock</Badge>;
      case "out-of-stock":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  return (
    <AdminWrapper>
      <AdminLayout title="Products">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="hidden h-9 md:flex">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <Button asChild>
            <Link to="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
        
        <Card className="mt-6">
          <CardHeader className="p-4">
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>
              Manage your product catalog, update inventory, and edit product details.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingIndicator />
              </div>
            ) : error ? (
              <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0} 
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all products"
                        />
                      </TableHead>
                      <TableHead className="w-16">
                        Image
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Product</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedProducts.includes(product.id)} 
                              onCheckedChange={() => handleSelectProduct(product.id)}
                              aria-label={`Select ${product.name}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="h-12 w-12 overflow-hidden rounded-md border bg-gray-100">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-right">
                            ${product.price.toFixed(2)}
                            {product.original_price && (
                              <div className="text-xs text-muted-foreground line-through">
                                ${product.original_price.toFixed(2)}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-center">{product.stock}</TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(product.status)}
                          </TableCell>
                          <TableCell>{product.featured ? "Yes" : "No"}</TableCell>
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
                                  <Link to={`/admin/products/edit/${product.id}`} className="cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600 cursor-pointer"
                                  onClick={() => openDeleteDialog(product.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
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
            )}
            
            {!isLoading && !error && (
              <div className="flex items-center justify-between px-4 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>{filteredProducts.length}</strong> of <strong>{totalProducts}</strong> products
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  
                  {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                    let pageNum = currentPage;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage === 1) {
                      pageNum = i + 1;
                    } else if (currentPage === totalPages) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }
                    
                    return (
                      <Button 
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"} 
                        size="sm" 
                        className="h-8 w-8"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteProduct}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AdminWrapper>
  );
};

export default AdminProductsPage;
