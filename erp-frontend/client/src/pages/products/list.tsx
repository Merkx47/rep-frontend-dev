import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Archive,
  Eye,
  Package,
  TrendingUp,
  DollarSign,
  ShoppingBag,
} from "lucide-react";

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  stock: number | "unlimited";
  sold: number;
  status: "active" | "inactive" | "discontinued";
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
}

// Mock data
const mockProducts: Product[] = [
  { id: "1", sku: "HRD-001", name: "Dell Laptop (Latitude 5540)", description: "Business laptop with Intel i7", category: "Hardware", unitPrice: 950000, costPrice: 800000, stock: 8, sold: 24, status: "active", createdAt: "2024-01-15" },
  { id: "2", sku: "HRD-002", name: "HP LaserJet Pro Printer", description: "Color laser printer", category: "Hardware", unitPrice: 285000, costPrice: 220000, stock: 12, sold: 15, status: "active", createdAt: "2024-01-20" },
  { id: "3", sku: "LIC-001", name: "Qorpy ERP License (Per Seat)", description: "Annual software license", category: "Software", unitPrice: 450000, costPrice: 0, stock: "unlimited", sold: 67, status: "active", createdAt: "2024-02-01" },
  { id: "4", sku: "LIC-002", name: "Microsoft 365 Business", description: "Annual subscription", category: "Software", unitPrice: 85000, costPrice: 65000, stock: "unlimited", sold: 45, status: "active", createdAt: "2024-02-10" },
  { id: "5", sku: "SUB-001", name: "Cloud Hosting - Standard", description: "Monthly cloud hosting", category: "Cloud Services", unitPrice: 75000, costPrice: 40000, stock: "unlimited", sold: 34, status: "active", createdAt: "2024-03-01" },
  { id: "6", sku: "SUB-002", name: "Cloud Hosting - Enterprise", description: "Premium cloud hosting", category: "Cloud Services", unitPrice: 250000, costPrice: 150000, stock: "unlimited", sold: 12, status: "active", createdAt: "2024-03-05" },
  { id: "7", sku: "DIG-001", name: "ERP User Guide (PDF)", description: "Digital documentation", category: "Documentation", unitPrice: 25000, costPrice: 0, stock: "unlimited", sold: 156, status: "active", createdAt: "2024-03-10" },
  { id: "8", sku: "DIG-002", name: "Video Training Course", description: "Online training videos", category: "Training", unitPrice: 120000, costPrice: 0, stock: "unlimited", sold: 89, status: "active", createdAt: "2024-03-15" },
  { id: "9", sku: "HRD-003", name: "USB-C Docking Station", description: "Multi-port docking station", category: "Hardware", unitPrice: 45000, costPrice: 32000, stock: 25, sold: 42, status: "active", createdAt: "2024-04-01" },
  { id: "10", sku: "HRD-004", name: "Wireless Mouse", description: "Ergonomic wireless mouse", category: "Hardware", unitPrice: 8500, costPrice: 5000, stock: 3, sold: 87, status: "active", createdAt: "2024-04-05" },
];

const mockCategories: Category[] = [
  { id: "1", name: "Hardware" },
  { id: "2", name: "Software" },
  { id: "3", name: "Cloud Services" },
  { id: "4", name: "Documentation" },
  { id: "5", name: "Training" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
}

export default function ProductListPage() {
  const moduleColor = getModuleColor("sales");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { toast } = useToast();

  const productForm = useForm({
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      category: "",
      unitPrice: "",
      costPrice: "",
      stock: "",
    },
  });

  const onSubmitProduct = (data: any) => {
    toast({
      title: "Product Created",
      description: `${data.name} has been added to the catalog.`,
    });
    setIsProductDialogOpen(false);
    productForm.reset();
  };

  const handleDeleteProduct = (product: Product) => {
    toast({
      title: "Product Deleted",
      description: `${product.name} has been removed.`,
      variant: "destructive",
    });
  };

  // Filter products
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Stats
  const totalProducts = mockProducts.length;
  const activeProducts = mockProducts.filter((p) => p.status === "active").length;
  const totalValue = mockProducts.reduce((sum, p) => sum + (typeof p.stock === "number" ? p.stock * p.unitPrice : 0), 0);
  const totalSold = mockProducts.reduce((sum, p) => sum + p.sold, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "discontinued":
        return <Badge variant="destructive">Discontinued</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStockDisplay = (stock: number | "unlimited") => {
    if (stock === "unlimited") {
      return <span className="text-cyan-600 font-medium">Unlimited</span>;
    }
    if (stock <= 5) {
      return <span className="text-red-600 font-medium">{stock}</span>;
    }
    if (stock <= 15) {
      return <span className="text-orange-600 font-medium">{stock}</span>;
    }
    return <span className="text-green-600 font-medium">{stock}</span>;
  };

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Product List</h1>
            <p className="text-muted-foreground mt-1">View and manage all products in your catalog</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sold</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSold}</div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Product</DialogTitle>
              </DialogHeader>
              <Form {...productForm}>
                <form onSubmit={productForm.handleSubmit(onSubmitProduct)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={productForm.control}
                      name="sku"
                      rules={{ required: "SKU is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="PRD-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={productForm.control}
                      name="category"
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockCategories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={productForm.control}
                    name="name"
                    rules={{ required: "Product name is required" }}
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
                    control={productForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Product description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={productForm.control}
                      name="unitPrice"
                      rules={{ required: "Unit price is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Price (NGN)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={productForm.control}
                      name="costPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost Price (NGN)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={productForm.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Stock</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    Create Product
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Cost Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(product.unitPrice)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatCurrency(product.costPrice)}</TableCell>
                    <TableCell className="text-right">{getStockDisplay(product.stock)}</TableCell>
                    <TableCell className="text-right">{product.sold}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
