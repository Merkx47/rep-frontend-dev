import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  Plus,
  Search,
  Pencil,
  Package,
  Infinity,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  Boxes,
  ArrowUpDown,
} from "lucide-react";

interface InventoryItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  category: string;
  stock: number | "unlimited";
  minStock: number;
  sold: number;
  reserved: number;
  available: number | "unlimited";
  lastRestocked: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "unlimited";
}

// Mock data
const mockInventory: InventoryItem[] = [
  { id: "1", productId: "1", sku: "HRD-001", name: "Dell Laptop (Latitude 5540)", category: "Hardware", stock: 8, minStock: 5, sold: 24, reserved: 2, available: 6, lastRestocked: "2024-12-15", status: "in_stock" },
  { id: "2", productId: "2", sku: "HRD-002", name: "HP LaserJet Pro Printer", category: "Hardware", stock: 12, minStock: 3, sold: 15, reserved: 0, available: 12, lastRestocked: "2024-12-20", status: "in_stock" },
  { id: "3", productId: "3", sku: "LIC-001", name: "Qorpy ERP License (Per Seat)", category: "Software", stock: "unlimited", minStock: 0, sold: 67, reserved: 0, available: "unlimited", lastRestocked: "2024-02-01", status: "unlimited" },
  { id: "4", productId: "4", sku: "LIC-002", name: "Microsoft 365 Business", category: "Software", stock: "unlimited", minStock: 0, sold: 45, reserved: 0, available: "unlimited", lastRestocked: "2024-02-10", status: "unlimited" },
  { id: "5", productId: "5", sku: "SUB-001", name: "Cloud Hosting - Standard", category: "Cloud Services", stock: "unlimited", minStock: 0, sold: 34, reserved: 0, available: "unlimited", lastRestocked: "2024-03-01", status: "unlimited" },
  { id: "6", productId: "6", sku: "SUB-002", name: "Cloud Hosting - Enterprise", category: "Cloud Services", stock: "unlimited", minStock: 0, sold: 12, reserved: 0, available: "unlimited", lastRestocked: "2024-03-05", status: "unlimited" },
  { id: "7", productId: "9", sku: "HRD-003", name: "USB-C Docking Station", category: "Hardware", stock: 25, minStock: 10, sold: 42, reserved: 5, available: 20, lastRestocked: "2024-11-01", status: "in_stock" },
  { id: "8", productId: "10", sku: "HRD-004", name: "Wireless Mouse", category: "Hardware", stock: 3, minStock: 10, sold: 87, reserved: 1, available: 2, lastRestocked: "2024-10-15", status: "low_stock" },
  { id: "9", productId: "11", sku: "HRD-005", name: "Mechanical Keyboard", category: "Hardware", stock: 0, minStock: 5, sold: 56, reserved: 0, available: 0, lastRestocked: "2024-09-20", status: "out_of_stock" },
  { id: "10", productId: "12", sku: "HRD-006", name: "Monitor Stand", category: "Hardware", stock: 4, minStock: 8, sold: 23, reserved: 0, available: 4, lastRestocked: "2024-11-10", status: "low_stock" },
];

// Products not yet in inventory
const productsNotInInventory = [
  { id: "7", sku: "DIG-001", name: "ERP User Guide (PDF)", category: "Documentation" },
  { id: "8", sku: "DIG-002", name: "Video Training Course", category: "Training" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
}

export default function ProductInventoryPage() {
  const moduleColor = getModuleColor("sales");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const addForm = useForm({
    defaultValues: {
      productId: "",
      stock: "",
      minStock: "",
    },
  });

  const updateForm = useForm({
    defaultValues: {
      stock: "",
      minStock: "",
    },
  });

  const onAddToInventory = (data: any) => {
    const product = productsNotInInventory.find(p => p.id === data.productId);
    toast({
      title: "Product Added to Inventory",
      description: `${product?.name} has been added to inventory.`,
    });
    setIsAddDialogOpen(false);
    setIsUnlimited(false);
    addForm.reset();
  };

  const onUpdateStock = (data: any) => {
    toast({
      title: "Inventory Updated",
      description: `Stock for ${selectedItem?.name} has been updated.`,
    });
    setIsUpdateDialogOpen(false);
    setSelectedItem(null);
    setIsUnlimited(false);
    updateForm.reset();
  };

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsUnlimited(item.stock === "unlimited");
    updateForm.setValue("stock", item.stock === "unlimited" ? "" : item.stock.toString());
    updateForm.setValue("minStock", item.minStock.toString());
    setIsUpdateDialogOpen(true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Inventory Refreshed",
        description: "Stock levels have been updated.",
      });
    }, 1000);
  };

  // Filter inventory
  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalItems = mockInventory.length;
  const lowStockItems = mockInventory.filter((i) => i.status === "low_stock").length;
  const outOfStockItems = mockInventory.filter((i) => i.status === "out_of_stock").length;
  const totalReserved = mockInventory.reduce((sum, i) => sum + i.reserved, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">In Stock</Badge>;
      case "low_stock":
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-200">Low Stock</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      case "unlimited":
        return (
          <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-600 border-cyan-200">
            <Infinity className="w-3 h-3 mr-1" />
            Unlimited
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStockDisplay = (stock: number | "unlimited", available: number | "unlimited") => {
    if (stock === "unlimited") {
      return <span className="text-cyan-600 font-medium">-</span>;
    }
    return (
      <div className="text-right">
        <span className="font-medium">{stock}</span>
        <span className="text-muted-foreground text-xs ml-1">({available} avail.)</span>
      </div>
    );
  };

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground mt-1">Track stock levels, manage inventory, and monitor product availability</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
              <Boxes className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">Products in inventory</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
              <p className="text-xs text-muted-foreground">Need restocking</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reserved</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReserved}</div>
              <p className="text-xs text-muted-foreground">Items reserved for orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {productsNotInInventory.length > 0 && (
              <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                setIsAddDialogOpen(open);
                if (!open) {
                  setIsUnlimited(false);
                  addForm.reset();
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Inventory
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add Product to Inventory</DialogTitle>
                  </DialogHeader>
                  <Form {...addForm}>
                    <form onSubmit={addForm.handleSubmit(onAddToInventory)} className="space-y-4">
                      <FormField
                        control={addForm.control}
                        name="productId"
                        rules={{ required: "Product is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Product</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {productsNotInInventory.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    <div className="flex flex-col">
                                      <span>{product.name}</span>
                                      <span className="text-xs text-muted-foreground">{product.sku} - {product.category}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="unlimited"
                          checked={isUnlimited}
                          onCheckedChange={(checked) => setIsUnlimited(checked === true)}
                        />
                        <label htmlFor="unlimited" className="text-sm font-medium">
                          Unlimited stock (digital/subscription product)
                        </label>
                      </div>

                      {!isUnlimited && (
                        <>
                          <FormField
                            control={addForm.control}
                            name="stock"
                            rules={{ required: !isUnlimited ? "Stock quantity is required" : false }}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stock Quantity</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addForm.control}
                            name="minStock"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Minimum Stock Level</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                        Add to Inventory
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>Manage stock levels for all products</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      Stock
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Min Stock</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead className="text-right">Reserved</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id} className={item.status === "out_of_stock" ? "bg-red-50/50 dark:bg-red-950/10" : item.status === "low_stock" ? "bg-orange-50/50 dark:bg-orange-950/10" : ""}>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.category}</TableCell>
                    <TableCell>{getStockDisplay(item.stock, item.available)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.stock === "unlimited" ? "-" : item.minStock}
                    </TableCell>
                    <TableCell className="text-right">{item.sold}</TableCell>
                    <TableCell className="text-right">{item.reserved}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(item.lastRestocked).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditClick(item)}
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
        <Dialog open={isUpdateDialogOpen} onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);
          if (!open) {
            setSelectedItem(null);
            setIsUnlimited(false);
            updateForm.reset();
          }
        }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Update Inventory</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedItem.name}</p>
                <p className="text-sm text-muted-foreground">{selectedItem.sku}</p>
              </div>
            )}
            <Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit(onUpdateStock)} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unlimited-update"
                    checked={isUnlimited}
                    onCheckedChange={(checked) => setIsUnlimited(checked === true)}
                  />
                  <label htmlFor="unlimited-update" className="text-sm font-medium">
                    Unlimited stock
                  </label>
                </div>

                {!isUnlimited && (
                  <>
                    <FormField
                      control={updateForm.control}
                      name="stock"
                      rules={{ required: !isUnlimited ? "Stock quantity is required" : false }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={updateForm.control}
                      name="minStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Stock Level</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                  Update Inventory
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Empty State */}
        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <Boxes className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No inventory items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
