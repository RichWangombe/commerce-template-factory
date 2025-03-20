
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminWrapper } from "@/components/AdminWrapper";
import { Badge } from "@/components/ui/badge";

// Define form schema with Zod
const productFormSchema = z.object({
  name: z.string().min(1, { message: "Product name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  original_price: z.coerce.number().positive().optional().nullable(),
  category: z.string().min(1, { message: "Category is required" }),
  brand: z.string().optional(),
  stock: z.coerce.number().nonnegative().default(0),
  image: z.string().url({ message: "Valid image URL is required" }),
  featured: z.boolean().default(false),
  colors: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  specifications: z.record(z.string()).default({}),
});

// Infer TypeScript type from schema
type ProductFormValues = z.infer<typeof productFormSchema>;

const AdminProductFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [newColorValue, setNewColorValue] = useState("");
  const [newFeatureValue, setNewFeatureValue] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  // Initialize form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      original_price: null,
      category: "",
      brand: "",
      stock: 0,
      image: "",
      featured: false,
      colors: [],
      features: [],
      specifications: {},
    },
  });

  // Fetch product data if in edit mode
  useEffect(() => {
    if (!isEditMode) {
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id as string)) // Convert id from string to number
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Transform data to match form fields
          // Handle specifications to ensure it's a Record<string, string>
          const formattedSpecifications = typeof data.specifications === 'object' && data.specifications !== null 
            ? data.specifications as Record<string, string>
            : {};
            
          form.reset({
            name: data.name,
            price: data.price,
            original_price: data.original_price,
            description: data.description,
            category: data.category,
            brand: data.brand || "",
            stock: data.stock || 0,
            image: data.image,
            featured: data.featured === true, // Ensure it's a boolean
            colors: data.colors || [],
            features: data.features || [],
            specifications: formattedSpecifications
          });
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setError("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, isEditMode, form]);
  
  const onSubmit = async (values: ProductFormValues) => {
    setIsSaving(true);
    setError(null);
    
    try {
      console.log("Saving product:", values);
      
      // Update existing product
      if (isEditMode && id) {
        console.log("Updating product with ID:", id);
        
        const { error } = await supabase
          .from('products')
          .update({
            name: values.name,
            description: values.description,
            price: values.price,
            original_price: values.original_price,
            category: values.category,
            brand: values.brand || null,
            stock: values.stock,
            image: values.image,
            featured: values.featured,
            colors: values.colors || [],
            features: values.features || [],
            specifications: values.specifications || {},
            updated_at: new Date().toISOString()
          })
          .eq('id', parseInt(id as string)); // Convert id from string to number
          
        if (error) throw error;
        
        toast.success("Product updated successfully");
      } 
      // Create new product
      else {
        console.log("Creating new product");
        
        const { error } = await supabase
          .from('products')
          .insert({
            name: values.name,
            description: values.description,
            price: values.price,
            original_price: values.original_price,
            category: values.category,
            brand: values.brand || null,
            stock: values.stock,
            image: values.image,
            featured: values.featured,
            colors: values.colors || [],
            features: values.features || [],
            specifications: values.specifications || {}
          });
          
        if (error) throw error;
        
        toast.success("Product created successfully");
      }
      
      // Navigate back to products page
      navigate("/admin/products");
      
    } catch (error: any) {
      console.error("Error saving product:", error);
      setError(error.message || "Failed to save product");
      toast.error("Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  // Handler for adding colors
  const addColor = () => {
    if (newColorValue.trim()) {
      const currentColors = form.getValues("colors") || [];
      form.setValue("colors", [...currentColors, newColorValue.trim()]);
      setNewColorValue("");
    }
  };

  // Handler for removing colors
  const removeColor = (index: number) => {
    const currentColors = form.getValues("colors") || [];
    form.setValue("colors", currentColors.filter((_, i) => i !== index));
  };

  // Handler for adding features
  const addFeature = () => {
    if (newFeatureValue.trim()) {
      const currentFeatures = form.getValues("features") || [];
      form.setValue("features", [...currentFeatures, newFeatureValue.trim()]);
      setNewFeatureValue("");
    }
  };

  // Handler for removing features
  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue("features", currentFeatures.filter((_, i) => i !== index));
  };

  // Handler for adding specifications
  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      const currentSpecs = form.getValues("specifications") || {};
      form.setValue("specifications", {
        ...currentSpecs,
        [newSpecKey.trim()]: newSpecValue.trim(),
      });
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  // Handler for removing specifications
  const removeSpecification = (key: string) => {
    const currentSpecs = form.getValues("specifications") || {};
    const { [key]: removedSpec, ...rest } = currentSpecs;
    form.setValue("specifications", rest);
  };

  return (
    <AdminWrapper>
      <AdminLayout title={isEditMode ? "Edit Product" : "Add Product"}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingIndicator />
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                  <CardDescription>
                    Enter the basic details about the product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Basic Information */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
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
                          <FormLabel>Original Price (optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              {...field} 
                              value={field.value === null ? "" : field.value}
                              onChange={e => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Original price before discount
                          </FormDescription>
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
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Electronics">Electronics</SelectItem>
                              <SelectItem value="Clothing">Clothing</SelectItem>
                              <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                              <SelectItem value="Beauty">Beauty</SelectItem>
                              <SelectItem value="Books">Books</SelectItem>
                              <SelectItem value="Sports">Sports</SelectItem>
                              <SelectItem value="Toys">Toys</SelectItem>
                              <SelectItem value="Automotive">Automotive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Brand name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
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
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Product</FormLabel>
                            <FormDescription>
                              Display this product in featured sections
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Product description"
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Product Details & Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Details</CardTitle>
                  <CardDescription>
                    Add colors, features, and specifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Colors */}
                  <div>
                    <Label>Colors</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.getValues("colors")?.map((color, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {color}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-muted-foreground"
                            onClick={() => removeColor(index)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Input
                        placeholder="Add color"
                        value={newColorValue}
                        onChange={(e) => setNewColorValue(e.target.value)}
                        className="max-w-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addColor}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <Label>Features</Label>
                    <div className="mt-2 flex flex-col gap-2">
                      {form.getValues("features")?.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between rounded-md border px-3 py-2">
                          <span>{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground"
                            onClick={() => removeFeature(index)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Input
                        placeholder="Add feature"
                        value={newFeatureValue}
                        onChange={(e) => setNewFeatureValue(e.target.value)}
                        className="max-w-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addFeature}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <Label>Specifications</Label>
                    <div className="mt-2 flex flex-col gap-2">
                      {Object.entries(form.getValues("specifications") || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between rounded-md border px-3 py-2">
                          <div>
                            <span className="font-medium">{key}:</span> {value}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground"
                            onClick={() => removeSpecification(key)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Input
                        placeholder="Specification name"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                      />
                      <Input
                        placeholder="Specification value"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="sm:col-span-2 w-full sm:w-auto"
                        onClick={addSpecification}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Specification
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/products")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <LoadingIndicator className="mr-2" />
                      Saving...
                    </>
                  ) : isEditMode ? (
                    "Update Product"
                  ) : (
                    "Create Product"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </AdminLayout>
    </AdminWrapper>
  );
};

export default AdminProductFormPage;
