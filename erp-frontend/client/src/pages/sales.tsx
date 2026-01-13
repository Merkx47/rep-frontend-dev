import { SidebarLayout } from "@/components/layout-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Search, Package, Wrench, FileText, Users, TrendingUp, Clock, Box, Layers, FolderOpen, Edit, Trash2, MoreVertical, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCustomers, useCreateCustomer, useInvoices, useCreateInvoice, useProducts, useCreateProduct } from "@/hooks/use-sales";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCustomerSchema, insertProductSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { mockProducts as initialProducts, mockServices as initialServices, mockProductCategories as initialCategories } from "@/lib/mockData";
import { getModuleColor } from "@/contexts/module-context";

const createCustomerFormSchema = insertCustomerSchema.pick({
  companyName: true,
  contactPerson: true,
  email: true,
  phone: true,
});
type CustomerFormValues = z.infer<typeof createCustomerFormSchema>;

// Format currency helper
function formatCurrency(amount: number): string {
  return '₦' + new Intl.NumberFormat('en-NG').format(amount);
}

export default function SalesPage() {
  const moduleColor = getModuleColor("sales");
  const { toast } = useToast();
  const { data: customers, isLoading: loadingCustomers } = useCustomers();
  const { data: invoices, isLoading: loadingInvoices, refetch: refetchInvoices, isFetching: isFetchingInvoices } = useInvoices();
  const { data: products, isLoading: loadingProducts } = useProducts();
  const createCustomer = useCreateCustomer();

  // Local state for categories, products, and services (will be replaced with API calls)
  const [categories, setCategories] = useState(initialCategories);
  const [localProducts, setLocalProducts] = useState(initialProducts);
  const [localServices, setLocalServices] = useState(initialServices);

  // Dialog states
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states for new category
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<"product" | "service">("product");

  // Form states for new product
  const [newProductName, setNewProductName] = useState("");
  const [newProductSku, setNewProductSku] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductBilling, setNewProductBilling] = useState("annual");

  // Form states for new service
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceSku, setNewServiceSku] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState("");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceUnit, setNewServiceUnit] = useState("project");
  const [newServiceDelivery, setNewServiceDelivery] = useState("");

  // Get category name helper
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  // Category CRUD handlers
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Error", description: "Category name is required", variant: "destructive" });
      return;
    }

    const newCategory = {
      id: `cat-${Date.now()}`,
      tenantId: "tenant-001",
      name: newCategoryName,
      description: newCategoryDescription,
      type: newCategoryType,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCategories([...categories, newCategory]);
    setCategoryDialogOpen(false);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setNewCategoryType("product");
    toast({ title: "Success", description: `Category "${newCategoryName}" created successfully` });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategoryName.trim()) return;

    setCategories(categories.map(cat =>
      cat.id === editingCategory.id
        ? { ...cat, name: newCategoryName, description: newCategoryDescription, updatedAt: new Date() }
        : cat
    ));
    setEditingCategory(null);
    setCategoryDialogOpen(false);
    setNewCategoryName("");
    setNewCategoryDescription("");
    toast({ title: "Success", description: "Category updated successfully" });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const hasProducts = localProducts.some(p => p.categoryId === categoryId);
    const hasServices = localServices.some(s => s.categoryId === categoryId);

    if (hasProducts || hasServices) {
      toast({
        title: "Cannot Delete",
        description: "This category has products or services. Remove them first.",
        variant: "destructive"
      });
      return;
    }

    setCategories(categories.filter(c => c.id !== categoryId));
    toast({ title: "Deleted", description: `Category "${category?.name}" has been deleted` });
  };

  const openEditCategory = (category: any) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description || "");
    setNewCategoryType(category.type);
    setCategoryDialogOpen(true);
  };

  // Product handler
  const handleCreateProduct = () => {
    if (!newProductName.trim() || !newProductCategory) {
      toast({ title: "Error", description: "Name and category are required", variant: "destructive" });
      return;
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      tenantId: "tenant-001",
      name: newProductName,
      sku: newProductSku || `SKU-${Date.now()}`,
      description: newProductDescription,
      categoryId: newProductCategory,
      type: "product",
      sellingPrice: parseFloat(newProductPrice) || 0,
      costPrice: 0,
      quantityOnHand: 999,
      reorderLevel: 0,
      unit: "license",
      isActive: true,
      taxable: true,
      features: [],
      billingCycle: newProductBilling,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setLocalProducts([...localProducts, newProduct]);
    setProductDialogOpen(false);
    setNewProductName("");
    setNewProductSku("");
    setNewProductDescription("");
    setNewProductCategory("");
    setNewProductPrice("");
    setNewProductBilling("annual");
    toast({ title: "Success", description: `Product "${newProductName}" created successfully` });
  };

  // Service handler
  const handleCreateService = () => {
    if (!newServiceName.trim() || !newServiceCategory) {
      toast({ title: "Error", description: "Name and category are required", variant: "destructive" });
      return;
    }

    const newService = {
      id: `svc-${Date.now()}`,
      tenantId: "tenant-001",
      name: newServiceName,
      sku: newServiceSku || `SVC-${Date.now()}`,
      description: newServiceDescription,
      categoryId: newServiceCategory,
      type: "service",
      sellingPrice: parseFloat(newServicePrice) || 0,
      costPrice: 0,
      unit: newServiceUnit,
      isActive: true,
      taxable: true,
      deliveryTime: newServiceDelivery,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setLocalServices([...localServices, newService]);
    setServiceDialogOpen(false);
    setNewServiceName("");
    setNewServiceSku("");
    setNewServiceDescription("");
    setNewServiceCategory("");
    setNewServicePrice("");
    setNewServiceUnit("project");
    setNewServiceDelivery("");
    toast({ title: "Success", description: `Service "${newServiceName}" created successfully` });
  };

  const customerForm = useForm<CustomerFormValues>({
    resolver: zodResolver(createCustomerFormSchema),
    defaultValues: { companyName: "", contactPerson: "", email: "", phone: "" },
  });

  const onCustomerSubmit = (data: CustomerFormValues) => {
    createCustomer.mutate(data, {
      onSuccess: () => {
        setCustomerDialogOpen(false);
        customerForm.reset();
      }
    });
  };

  // Calculate stats dynamically
  const productCategories = categories.filter(c => c.type === 'product');
  const serviceCategories = categories.filter(c => c.type === 'service');
  const totalProducts = localProducts.length;
  const totalServices = localServices.length;
  const totalProductRevenue = localProducts.reduce((sum, p) => sum + p.sellingPrice, 0);
  const totalServiceRevenue = localServices.reduce((sum, s) => sum + s.sellingPrice, 0);

  // Filter products and services based on search
  const filteredProducts = localProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredServices = localServices.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Sales</h2>
          <p className="text-muted-foreground mt-1">Manage invoices, customers, products, and services.</p>
        </div>

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="bg-muted/40 p-1 rounded-xl">
            <TabsTrigger value="invoices" className="rounded-lg gap-2">
              <TrendingUp className="h-4 w-4 hidden sm:block" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="customers" className="rounded-lg gap-2">
              <Users className="h-4 w-4 hidden sm:block" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-lg gap-2">
              <Package className="h-4 w-4 hidden sm:block" />
              Products
            </TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg gap-2">
              <Wrench className="h-4 w-4 hidden sm:block" />
              Services
            </TabsTrigger>
            <TabsTrigger value="categories" className="rounded-lg gap-2">
              <FolderOpen className="h-4 w-4 hidden sm:block" />
              Categories
            </TabsTrigger>
          </TabsList>

          {/* Sales Tab */}
          <TabsContent value="invoices" className="space-y-4 animate-enter">
            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search sales..." className="pl-9 rounded-xl border-border/60" />
              </div>
              <Button
                className="text-white shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
                onClick={() => refetchInvoices()}
                disabled={isFetchingInvoices}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isFetchingInvoices ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sale #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingInvoices ? (
                       <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="animate-spin inline mr-2" /> Loading...</TableCell></TableRow>
                    ) : invoices?.length === 0 ? (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No sales recorded yet.</TableCell></TableRow>
                    ) : (
                      invoices?.map(inv => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-mono text-xs">{inv.number}</TableCell>
                          <TableCell>{customers?.find(c => c.id === inv.customerId)?.companyName || 'Unknown'}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">-</TableCell>
                          <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(Number(inv.totalAmount))}</TableCell>
                          <TableCell>
                             <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize
                              ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                              {inv.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4 animate-enter">
            <div className="flex justify-between items-center">
               <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search customers..." className="pl-9 rounded-xl border-border/60" />
              </div>
              <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg hover:opacity-90 rounded-xl border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Customer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                  </DialogHeader>
                  <Form {...customerForm}>
                    <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="space-y-4">
                      <FormField
                        control={customerForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={customerForm.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person</FormLabel>
                            <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={customerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input type="email" placeholder="john@acme.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={customerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl><Input placeholder="+234..." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} disabled={createCustomer.isPending}>
                        {createCustomer.isPending ? "Creating..." : "Create Customer"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     {loadingCustomers ? (
                       <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="animate-spin inline mr-2" /> Loading...</TableCell></TableRow>
                    ) : customers?.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No customers found.</TableCell></TableRow>
                    ) : (
                      customers?.map(cus => (
                        <TableRow key={cus.id}>
                          <TableCell className="font-medium">{cus.companyName}</TableCell>
                          <TableCell>{cus.contactPerson}</TableCell>
                          <TableCell>{cus.email}</TableCell>
                          <TableCell>{cus.phone}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6 animate-enter">
            {/* Products Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalProducts}</p>
                      <p className="text-xs text-muted-foreground">Software Products</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-emerald-500/10">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{formatCurrency(totalProductRevenue)}</p>
                      <p className="text-xs text-muted-foreground">Total Product Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-blue-500/10">
                      <Layers className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{productCategories.length}</p>
                      <p className="text-xs text-muted-foreground">Product Categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-purple-500/10">
                      <Box className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{localProducts.filter(p => p.isActive).length}</p>
                      <p className="text-xs text-muted-foreground">Active Products</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-9 rounded-xl border-border/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg hover:opacity-90 rounded-xl border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>Create a new software product for sale.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Product Name</label>
                      <Input
                        placeholder="e.g., Enterprise Suite"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">SKU</label>
                        <Input
                          placeholder="e.g., ENT-001"
                          value={newProductSku}
                          onChange={(e) => setNewProductSku(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={newProductCategory} onValueChange={setNewProductCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {productCategories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Product description..."
                        value={newProductDescription}
                        onChange={(e) => setNewProductDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price (₦)</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newProductPrice}
                          onChange={(e) => setNewProductPrice(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Billing Cycle</label>
                        <Select value={newProductBilling} onValueChange={setNewProductBilling}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                            <SelectItem value="one-time">One-time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setProductDialogOpen(false)}>Cancel</Button>
                    <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} onClick={handleCreateProduct}>Create Product</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Table */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Software Products</CardTitle>
                <CardDescription>Qucoon's SaaS and enterprise software products</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead>Billing</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map(prod => (
                        <TableRow key={prod.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{prod.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{prod.description}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{prod.sku}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {getCategoryName(prod.categoryId)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(prod.sellingPrice)}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                              {prod.billingCycle}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={prod.isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}>
                              {prod.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6 animate-enter">
            {/* Services Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-primary/10">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalServices}</p>
                      <p className="text-xs text-muted-foreground">Services Offered</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-emerald-500/10">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{formatCurrency(totalServiceRevenue)}</p>
                      <p className="text-xs text-muted-foreground">Total Service Value</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-blue-500/10">
                      <Layers className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{serviceCategories.length}</p>
                      <p className="text-xs text-muted-foreground">Service Categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-purple-500/10">
                      <Clock className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{localServices.filter(s => s.isActive).length}</p>
                      <p className="text-xs text-muted-foreground">Active Services</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search services..."
                  className="pl-9 rounded-xl border-border/60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg hover:opacity-90 rounded-xl border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Service</DialogTitle>
                    <DialogDescription>Create a new professional service offering.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Service Name</label>
                      <Input
                        placeholder="e.g., Cloud Migration Service"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">SKU</label>
                        <Input
                          placeholder="e.g., CLD-MIG"
                          value={newServiceSku}
                          onChange={(e) => setNewServiceSku(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={newServiceCategory} onValueChange={setNewServiceCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {serviceCategories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Service description..."
                        value={newServiceDescription}
                        onChange={(e) => setNewServiceDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price (₦)</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newServicePrice}
                          onChange={(e) => setNewServicePrice(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Unit</label>
                        <Select value={newServiceUnit} onValueChange={setNewServiceUnit}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="project">Per Project</SelectItem>
                            <SelectItem value="hour">Per Hour</SelectItem>
                            <SelectItem value="day">Per Day</SelectItem>
                            <SelectItem value="month">Per Month</SelectItem>
                            <SelectItem value="year">Per Year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Delivery Time</label>
                      <Input
                        placeholder="e.g., 4-8 weeks"
                        value={newServiceDelivery}
                        onChange={(e) => setNewServiceDelivery(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setServiceDialogOpen(false)}>Cancel</Button>
                    <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} onClick={handleCreateService}>Create Service</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Services by Category */}
            {serviceCategories.map(category => {
              const categoryServices = filteredServices.filter(s => s.categoryId === category.id);
              if (categoryServices.length === 0) return null;

              return (
                <Card key={category.id} className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Delivery</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryServices.map(svc => (
                          <TableRow key={svc.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{svc.name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">{svc.description}</p>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{svc.sku}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(svc.sellingPrice)}</TableCell>
                            <TableCell>
                              <span className="text-sm capitalize">{svc.unit}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">{svc.deliveryTime}</span>
                            </TableCell>
                            <TableCell>
                              <Badge className={svc.isActive
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"}>
                                {svc.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6 animate-enter">
            {/* Categories Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-primary/10">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{categories.length}</p>
                      <p className="text-xs text-muted-foreground">Total Categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-blue-500/10">
                      <Package className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{productCategories.length}</p>
                      <p className="text-xs text-muted-foreground">Product Categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-purple-500/10">
                      <Wrench className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{serviceCategories.length}</p>
                      <p className="text-xs text-muted-foreground">Service Categories</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-emerald-500/10">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalProducts + totalServices}</p>
                      <p className="text-xs text-muted-foreground">Total Items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Manage Categories</h3>
                <p className="text-sm text-muted-foreground">Create and organize categories for your products and services</p>
              </div>
              <Dialog open={categoryDialogOpen} onOpenChange={(open) => {
                setCategoryDialogOpen(open);
                if (!open) {
                  setEditingCategory(null);
                  setNewCategoryName("");
                  setNewCategoryDescription("");
                  setNewCategoryType("product");
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg hover:opacity-90 rounded-xl border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                    <DialogDescription>
                      {editingCategory ? 'Update the category details.' : 'Create a new category for products or services.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category Name</label>
                      <Input
                        placeholder="e.g., Hardware Products"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Describe this category..."
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                      />
                    </div>
                    {!editingCategory && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category Type</label>
                        <Select value={newCategoryType} onValueChange={(v) => setNewCategoryType(v as "product" | "service")}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="product">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Product Category
                              </div>
                            </SelectItem>
                            <SelectItem value="service">
                              <div className="flex items-center gap-2">
                                <Wrench className="h-4 w-4" />
                                Service Category
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
                    <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Product Categories */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Categories
                </CardTitle>
                <CardDescription>Categories for organizing your products</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Products</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No product categories found. Create one to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      productCategories.map(cat => (
                        <TableRow key={cat.id}>
                          <TableCell className="font-medium">{cat.name}</TableCell>
                          <TableCell className="text-muted-foreground">{cat.description}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">
                              {localProducts.filter(p => p.categoryId === cat.id).length}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditCategory(cat)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteCategory(cat.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
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
              </CardContent>
            </Card>

            {/* Service Categories */}
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Service Categories
                </CardTitle>
                <CardDescription>Categories for organizing your services</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Services</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceCategories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No service categories found. Create one to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      serviceCategories.map(cat => (
                        <TableRow key={cat.id}>
                          <TableCell className="font-medium">{cat.name}</TableCell>
                          <TableCell className="text-muted-foreground">{cat.description}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">
                              {localServices.filter(s => s.categoryId === cat.id).length}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEditCategory(cat)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteCategory(cat.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
