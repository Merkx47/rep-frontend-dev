import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Wrench, Infinity, Pencil, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductInventory {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  category: string;
  unitPrice: string;
  stock: number | 'unlimited';
  sold: number;
}

interface ServiceInventory {
  id: number;
  serviceId: number;
  serviceName: string;
  serviceSku: string;
  category: string;
  unitPrice: string;
  delivered: number;
}

// Mock existing products (would come from products module)
const existingProducts = [
  { id: 1, sku: "HRD-001", name: "Dell Laptop (Latitude 5540)", category: "Hardware", unitPrice: "950000.00" },
  { id: 2, sku: "HRD-002", name: "HP LaserJet Pro Printer", category: "Hardware", unitPrice: "285000.00" },
  { id: 3, sku: "LIC-001", name: "Qorpy ERP License (Per Seat)", category: "Software", unitPrice: "450000.00" },
  { id: 4, sku: "LIC-002", name: "Microsoft 365 Business", category: "Software", unitPrice: "85000.00" },
  { id: 5, sku: "SUB-001", name: "Cloud Hosting - Standard", category: "Cloud Services", unitPrice: "75000.00" },
  { id: 6, sku: "SUB-002", name: "Cloud Hosting - Enterprise", category: "Cloud Services", unitPrice: "250000.00" },
  { id: 7, sku: "DIG-001", name: "ERP User Guide (PDF)", category: "Documentation", unitPrice: "25000.00" },
  { id: 8, sku: "DIG-002", name: "Video Training Course", category: "Training", unitPrice: "120000.00" },
];

// Mock existing services (would come from services module)
const existingServices = [
  { id: 1, sku: "SVC-001", name: "Technical Support", category: "Support", unitPrice: "15000.00" },
  { id: 2, sku: "SVC-002", name: "Custom Development", category: "Development", unitPrice: "25000.00" },
  { id: 3, sku: "SVC-003", name: "Consulting", category: "Advisory", unitPrice: "35000.00" },
  { id: 4, sku: "PRJ-001", name: "ERP Implementation", category: "Implementation", unitPrice: "2500000.00" },
  { id: 5, sku: "PRJ-002", name: "Data Migration", category: "Migration", unitPrice: "750000.00" },
  { id: 6, sku: "RET-001", name: "Managed IT Support", category: "Managed Services", unitPrice: "350000.00" },
  { id: 7, sku: "RET-002", name: "DevOps Support", category: "Managed Services", unitPrice: "500000.00" },
];

// Mock inventory data (tracks stock/delivery for existing products/services)
const mockProductInventory: ProductInventory[] = [
  { id: 1, productId: 1, productName: "Dell Laptop (Latitude 5540)", productSku: "HRD-001", category: "Hardware", unitPrice: "950000.00", stock: 8, sold: 24 },
  { id: 2, productId: 2, productName: "HP LaserJet Pro Printer", productSku: "HRD-002", category: "Hardware", unitPrice: "285000.00", stock: 12, sold: 15 },
  { id: 3, productId: 3, productName: "Qorpy ERP License (Per Seat)", productSku: "LIC-001", category: "Software", unitPrice: "450000.00", stock: 100, sold: 67 },
  { id: 4, productId: 4, productName: "Microsoft 365 Business", productSku: "LIC-002", category: "Software", unitPrice: "85000.00", stock: 50, sold: 45 },
  { id: 5, productId: 5, productName: "Cloud Hosting - Standard", productSku: "SUB-001", category: "Cloud Services", unitPrice: "75000.00", stock: 'unlimited', sold: 34 },
  { id: 6, productId: 6, productName: "Cloud Hosting - Enterprise", productSku: "SUB-002", category: "Cloud Services", unitPrice: "250000.00", stock: 'unlimited', sold: 12 },
  { id: 7, productId: 7, productName: "ERP User Guide (PDF)", productSku: "DIG-001", category: "Documentation", unitPrice: "25000.00", stock: 'unlimited', sold: 156 },
  { id: 8, productId: 8, productName: "Video Training Course", productSku: "DIG-002", category: "Training", unitPrice: "120000.00", stock: 'unlimited', sold: 89 },
];

const mockServiceInventory: ServiceInventory[] = [
  { id: 1, serviceId: 1, serviceName: "Technical Support", serviceSku: "SVC-001", category: "Support", unitPrice: "15000.00", delivered: 145 },
  { id: 2, serviceId: 2, serviceName: "Custom Development", serviceSku: "SVC-002", category: "Development", unitPrice: "25000.00", delivered: 320 },
  { id: 3, serviceId: 3, serviceName: "Consulting", serviceSku: "SVC-003", category: "Advisory", unitPrice: "35000.00", delivered: 45 },
  { id: 4, serviceId: 4, serviceName: "ERP Implementation", serviceSku: "PRJ-001", category: "Implementation", unitPrice: "2500000.00", delivered: 12 },
  { id: 5, serviceId: 5, serviceName: "Data Migration", serviceSku: "PRJ-002", category: "Migration", unitPrice: "750000.00", delivered: 8 },
  { id: 6, serviceId: 6, serviceName: "Managed IT Support", serviceSku: "RET-001", category: "Managed Services", unitPrice: "350000.00", delivered: 15 },
  { id: 7, serviceId: 7, serviceName: "DevOps Support", serviceSku: "RET-002", category: "Managed Services", unitPrice: "500000.00", delivered: 8 },
];

function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num);
}

export default function InventoryPage() {
  const moduleColor = getModuleColor("products");
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [isUpdateStockDialogOpen, setIsUpdateStockDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductInventory | null>(null);
  const [activeTab, setActiveTab] = useState<string>("products");
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const addStockForm = useForm({
    defaultValues: {
      productId: "",
      stock: "",
    },
  });

  const updateStockForm = useForm({
    defaultValues: {
      stock: "",
    },
  });

  const onAddStock = (data: any) => {
    const product = existingProducts.find(p => p.id.toString() === data.productId);
    toast({
      title: "Product Inventory Added",
      description: `Inventory for ${product?.name} has been added.`,
    });
    setIsAddStockDialogOpen(false);
    setIsUnlimited(false);
    addStockForm.reset();
  };

  const onUpdateStock = (data: any) => {
    toast({
      title: "Stock Updated",
      description: `Stock for ${selectedProduct?.productName} has been updated.`,
    });
    setIsUpdateStockDialogOpen(false);
    setSelectedProduct(null);
    setIsUnlimited(false);
    updateStockForm.reset();
  };

  const handleEditProductStock = (item: ProductInventory) => {
    setSelectedProduct(item);
    setIsUnlimited(item.stock === 'unlimited');
    updateStockForm.setValue('stock', item.stock === 'unlimited' ? '' : item.stock.toString());
    setIsUpdateStockDialogOpen(true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh - would call API refetch in real implementation
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Refreshed",
        description: "Inventory data has been updated.",
      });
    }, 1000);
  };

  // Stats
  const totalProducts = mockProductInventory.length;
  const totalProductsSold = mockProductInventory.reduce((sum, item) => sum + item.sold, 0);
  const totalServices = mockServiceInventory.length;
  const totalServicesDelivered = mockServiceInventory.reduce((sum, item) => sum + item.delivered, 0);

  const getStockBadge = (stock: number | 'unlimited') => {
    if (stock === 'unlimited') {
      return (
        <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-600 border-cyan-200">
          <Infinity className="w-3 h-3 mr-1" />
          Unlimited
        </Badge>
      );
    }
    if (stock <= 5) {
      return <Badge variant="destructive">{stock} in stock</Badge>;
    }
    if (stock <= 15) {
      return <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-200">{stock} in stock</Badge>;
    }
    return <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-200">{stock} in stock</Badge>;
  };

  // Get products not yet in inventory
  const productsNotInInventory = existingProducts.filter(
    p => !mockProductInventory.find(inv => inv.productId === p.id)
  );

  return (
    <SidebarLayout moduleId="products">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight" data-testid="text-inventory-title">Inventory</h2>
            <p className="text-muted-foreground mt-1">Track stock levels and delivery counts.</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Services
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6 mt-6">
            <div className="flex justify-end gap-2">
              <Button
                className="text-white shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {productsNotInInventory.length > 0 && (
                <Dialog open={isAddStockDialogOpen} onOpenChange={(open) => {
                  setIsAddStockDialogOpen(open);
                  if (!open) {
                    setIsUnlimited(false);
                    addStockForm.reset();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} data-testid="button-add-stock">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product to Inventory
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Product to Inventory</DialogTitle>
                    </DialogHeader>
                    <Form {...addStockForm}>
                      <form onSubmit={addStockForm.handleSubmit(onAddStock)} className="space-y-4">
                        <FormField
                          control={addStockForm.control}
                          name="productId"
                          rules={{ required: "Product is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Product</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-product">
                                    <SelectValue placeholder="Select a product" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {productsNotInInventory.map(product => (
                                    <SelectItem key={product.id} value={product.id.toString()}>
                                      <div className="flex flex-col">
                                        <span>{product.name}</span>
                                        <span className="text-xs text-muted-foreground">{product.sku} • {product.category}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="unlimited-add"
                              checked={isUnlimited}
                              onCheckedChange={(checked) => setIsUnlimited(checked === true)}
                              data-testid="checkbox-unlimited"
                            />
                            <label
                              htmlFor="unlimited-add"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Unlimited stock (digital/subscription product)
                            </label>
                          </div>

                          {!isUnlimited && (
                            <FormField
                              control={addStockForm.control}
                              name="stock"
                              rules={{ required: !isUnlimited ? "Stock quantity is required" : false }}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stock Quantity</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="0" {...field} data-testid="input-stock" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>

                        <Button type="submit" className="w-full" data-testid="button-submit-stock">
                          Add to Inventory
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Product Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Products in Inventory</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-products">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Tracked products</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sold</CardTitle>
                  <Package className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-products-sold">{totalProductsSold}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
            </div>

            {/* Products Inventory Table */}
            <Card>
              <CardHeader>
                <CardTitle>Product Inventory</CardTitle>
                <CardDescription>Stock levels for all products</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Sold</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProductInventory.map((item) => (
                      <TableRow key={item.id} data-testid={`row-product-${item.id}`}>
                        <TableCell className="font-mono text-sm">{item.productSku}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell>{getStockBadge(item.stock)}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">{item.sold}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditProductStock(item)}
                            data-testid={`button-edit-stock-${item.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Update Stock Dialog */}
            <Dialog open={isUpdateStockDialogOpen} onOpenChange={(open) => {
              setIsUpdateStockDialogOpen(open);
              if (!open) {
                setSelectedProduct(null);
                setIsUnlimited(false);
                updateStockForm.reset();
              }
            }}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Update Stock</DialogTitle>
                </DialogHeader>
                {selectedProduct && (
                  <div className="mb-4 p-3 bg-muted rounded-lg">
                    <p className="font-medium">{selectedProduct.productName}</p>
                    <p className="text-sm text-muted-foreground">{selectedProduct.productSku}</p>
                  </div>
                )}
                <Form {...updateStockForm}>
                  <form onSubmit={updateStockForm.handleSubmit(onUpdateStock)} className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="unlimited-update"
                          checked={isUnlimited}
                          onCheckedChange={(checked) => setIsUnlimited(checked === true)}
                          data-testid="checkbox-unlimited-update"
                        />
                        <label
                          htmlFor="unlimited-update"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Unlimited stock
                        </label>
                      </div>

                      {!isUnlimited && (
                        <FormField
                          control={updateStockForm.control}
                          name="stock"
                          rules={{ required: !isUnlimited ? "Stock quantity is required" : false }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stock Quantity</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} data-testid="input-update-stock" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <Button type="submit" className="w-full" data-testid="button-update-stock">
                      Update Stock
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6 mt-6">
            <div className="flex justify-end">
              <Button
                className="text-white shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Service Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Services in Inventory</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-services">{totalServices}</div>
                  <p className="text-xs text-muted-foreground">Tracked services</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Total Delivered</CardTitle>
                  <Wrench className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-services-delivered">{totalServicesDelivered}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
            </div>

            {/* Services Inventory Table */}
            <Card>
              <CardHeader>
                <CardTitle>Service Inventory</CardTitle>
                <CardDescription>Delivery counts for all services</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Delivered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockServiceInventory.map((item) => (
                      <TableRow key={item.id} data-testid={`row-service-${item.id}`}>
                        <TableCell className="font-mono text-sm">{item.serviceSku}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.serviceName}</p>
                            <p className="text-xs text-muted-foreground">{item.category}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-medium">{item.delivered}</span>
                        </TableCell>
                      </TableRow>
                    ))}
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
