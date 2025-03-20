
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { supabase } from "@/integrations/supabase/client";

// Define the product schema with zod
const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  original_price: z.coerce.number().positive({ message: "Original price must be a positive number" }).optional().nullable(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string().min(2, { message: "Category is required" }),
  brand: z.string().optional(),
  stock: z.coerce.number().int().min(0, { message: "Stock must be a non-negative integer" }),
  image: z.string().url({ message: "Please provide a valid image URL" }),
  featured: z.boolean().default(false),
  colors: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.string()).optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

const AdminProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = id !== undefined && id !== "new";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      original_price: null,
      description: "",
      category: "",
      brand: "",
      stock: 0,
      image: "/placeholder.svg",
      featured: false,
      colors: [],
      features: [],
      specifications: {}
    }
  });
  
  // Fetch product data if in edit mode
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditMode) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Transform data to match form fields
          form.reset({
            ...data,
            featured: data.stock > 0 && data.category === "Electronics" // Example logic for featured flag
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, isEditMode]);
  
  const onSubmit = async (values: ProductFormValues) => {
    setIsSaving(true);
    
    try {
      if (isEditMode) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: values.name,
            price: values.price,
            original_price: values.original_price || null,
            description: values.description,
            category: values.category,
            brand: values.brand || null,
            stock: values.stock,
            image: values.image,
            colors: values.colors || [],
            features: values.features || [],
            specifications: values.specifications || {},
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (error) throw error;
        
        toast.success("Product updated successfully");
      } else {
        // Insert new product
        const { error } = await supabase
          .from('products')
          .insert({
            name: values.name,
            price: values.price,
            original_price: values.original_price || null,
            description: values.description,
            category: values.category,
            brand: values.brand || null,
            stock: values.stock,
            image: values.image,
            colors: values.colors || [],
            features: values.features || [],
            specifications: values.specifications || {}
          });
          
        if (error) throw error;
        
        toast.success("Product created successfully");
      }
      
      // Redirect back to products page
      navigate("/admin/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(isEditMode ? "Failed to update product" : "Failed to create product");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout title={isEditMode ? "Edit Product" : "Add New Product"}>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingIndicator />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout title={isEditMode ? "Edit Product" : "Add New Product"}>
      <div className="mx-auto max-w-4xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details for this product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter brand name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Electronics" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Electronics
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Clothing" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Clothing
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Home & Kitchen" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Home & Kitchen
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Books" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Books
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Accessories" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Accessories
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Other" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Other
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="original_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Original Price ($) (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              placeholder="Leave empty for no discount"
                              value={field.value ?? ""} 
                              onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Set this higher than the price to show a discount
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the product..." 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>
                  Manage stock and product availability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Featured Product
                        </FormLabel>
                        <FormDescription>
                          Featured products appear on the homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
                <CardDescription>
                  Add images and media for the product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a URL for the product's main image
                      </FormDescription>
                      <FormMessage />
                      {field.value && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                          <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                            <img 
                              src={field.value} 
                              alt="Product preview" 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default AdminProductFormPage;
