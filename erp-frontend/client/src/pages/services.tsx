import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Wrench,
  FolderTree,
  Archive,
  Eye,
  Clock,
} from "lucide-react";

interface Service {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unitPrice: number;
  billingType: "hourly" | "fixed" | "monthly" | "project";
  delivered: number;
  status: "active" | "inactive" | "discontinued";
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  serviceCount: number;
}

// Mock data
const mockServices: Service[] = [
  { id: "1", sku: "SVC-001", name: "Technical Support", description: "Remote technical assistance", category: "Support", unitPrice: 15000, billingType: "hourly", delivered: 145, status: "active", createdAt: "2024-01-15" },
  { id: "2", sku: "SVC-002", name: "Custom Development", description: "Bespoke software development", category: "Development", unitPrice: 25000, billingType: "hourly", delivered: 320, status: "active", createdAt: "2024-01-20" },
  { id: "3", sku: "SVC-003", name: "Consulting", description: "Business and IT consulting", category: "Advisory", unitPrice: 35000, billingType: "hourly", delivered: 45, status: "active", createdAt: "2024-02-01" },
  { id: "4", sku: "PRJ-001", name: "ERP Implementation", description: "Full ERP system implementation", category: "Implementation", unitPrice: 2500000, billingType: "project", delivered: 12, status: "active", createdAt: "2024-02-10" },
  { id: "5", sku: "PRJ-002", name: "Data Migration", description: "Legacy data migration service", category: "Migration", unitPrice: 750000, billingType: "project", delivered: 8, status: "active", createdAt: "2024-03-01" },
  { id: "6", sku: "RET-001", name: "Managed IT Support", description: "Monthly IT support retainer", category: "Managed Services", unitPrice: 350000, billingType: "monthly", delivered: 15, status: "active", createdAt: "2024-03-05" },
  { id: "7", sku: "RET-002", name: "DevOps Support", description: "Monthly DevOps management", category: "Managed Services", unitPrice: 500000, billingType: "monthly", delivered: 8, status: "active", createdAt: "2024-03-10" },
];

const mockCategories: Category[] = [
  { id: "1", name: "Support", description: "Technical support services", serviceCount: 1 },
  { id: "2", name: "Development", description: "Software development services", serviceCount: 1 },
  { id: "3", name: "Advisory", description: "Consulting and advisory services", serviceCount: 1 },
  { id: "4", name: "Implementation", description: "System implementation services", serviceCount: 1 },
  { id: "5", name: "Migration", description: "Data and system migration", serviceCount: 1 },
  { id: "6", name: "Managed Services", description: "Ongoing managed services", serviceCount: 2 },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
}

export default function ServicesPage() {
  const moduleColor = getModuleColor("services");
  const [activeTab, setActiveTab] = useState("services");
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const serviceForm = useForm({
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      category: "",
      unitPrice: "",
      billingType: "",
    },
  });

  const categoryForm = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmitService = (data: any) => {
    toast({
      title: "Service Created",
      description: `${data.name} has been added to the catalog.`,
    });
    setIsServiceDialogOpen(false);
    serviceForm.reset();
  };

  const onSubmitCategory = (data: any) => {
    toast({
      title: "Category Created",
      description: `${data.name} category has been created.`,
    });
    setIsCategoryDialogOpen(false);
    categoryForm.reset();
  };

  const handleDeleteService = (service: Service) => {
    toast({
      title: "Service Deleted",
      description: `${service.name} has been removed.`,
      variant: "destructive",
    });
  };

  const handleDeleteCategory = (category: Category) => {
    toast({
      title: "Category Deleted",
      description: `${category.name} category has been removed.`,
      variant: "destructive",
    });
  };

  // Filter services
  const filteredServices = mockServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalServices = mockServices.length;
  const activeServices = mockServices.filter((s) => s.status === "active").length;
  const totalDelivered = mockServices.reduce((sum, s) => sum + s.delivered, 0);
  const totalRevenue = mockServices.reduce((sum, s) => sum + s.delivered * s.unitPrice, 0);

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

  const getBillingTypeBadge = (type: string) => {
    switch (type) {
      case "hourly":
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Hourly</Badge>;
      case "fixed":
        return <Badge variant="outline" className="text-purple-600 border-purple-200">Fixed</Badge>;
      case "monthly":
        return <Badge variant="outline" className="text-green-600 border-green-200">Monthly</Badge>;
      case "project":
        return <Badge variant="outline" className="text-orange-600 border-orange-200">Project</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <SidebarLayout moduleId="services">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground mt-1">Manage your service offerings and delivery</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderTree className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6 mt-6">
            {/* Stats */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalServices}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeServices}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Delivered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalDelivered}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
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
              </div>
              <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create Service</DialogTitle>
                  </DialogHeader>
                  <Form {...serviceForm}>
                    <form onSubmit={serviceForm.handleSubmit(onSubmitService)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={serviceForm.control}
                          name="sku"
                          rules={{ required: "SKU is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input placeholder="SVC-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={serviceForm.control}
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
                        control={serviceForm.control}
                        name="name"
                        rules={{ required: "Service name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter service name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Service description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={serviceForm.control}
                          name="unitPrice"
                          rules={{ required: "Price is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price (NGN)</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0.00" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={serviceForm.control}
                          name="billingType"
                          rules={{ required: "Billing type is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Billing Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="hourly">Hourly</SelectItem>
                                  <SelectItem value="fixed">Fixed</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                  <SelectItem value="project">Project</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                        Create Service
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Services Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead>Billing</TableHead>
                      <TableHead className="text-right">Delivered</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-mono text-sm">{service.sku}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{service.category}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(service.unitPrice)}</TableCell>
                        <TableCell>{getBillingTypeBadge(service.billingType)}</TableCell>
                        <TableCell className="text-right">{service.delivered}</TableCell>
                        <TableCell>{getStatusBadge(service.status)}</TableCell>
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
                                onClick={() => handleDeleteService(service)}
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
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search categories..." className="pl-9" />
              </div>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                  </DialogHeader>
                  <Form {...categoryForm}>
                    <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-4">
                      <FormField
                        control={categoryForm.control}
                        name="name"
                        rules={{ required: "Category name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter category name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={categoryForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Category description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                        Create Category
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Services</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">{category.description}</TableCell>
                        <TableCell className="text-right">{category.serviceCount}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteCategory(category)}
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
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
