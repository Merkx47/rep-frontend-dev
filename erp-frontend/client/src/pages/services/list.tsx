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
  Filter,
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

// Mock data
const mockServices: Service[] = [
  { id: "1", sku: "SVC-001", name: "Technical Support", description: "Remote technical assistance and troubleshooting", category: "Support", unitPrice: 15000, billingType: "hourly", delivered: 145, status: "active", createdAt: "2024-01-15" },
  { id: "2", sku: "SVC-002", name: "Custom Development", description: "Bespoke software development services", category: "Development", unitPrice: 25000, billingType: "hourly", delivered: 320, status: "active", createdAt: "2024-01-20" },
  { id: "3", sku: "SVC-003", name: "Business Consulting", description: "Business and IT consulting services", category: "Advisory", unitPrice: 35000, billingType: "hourly", delivered: 45, status: "active", createdAt: "2024-02-01" },
  { id: "4", sku: "PRJ-001", name: "ERP Implementation", description: "Full ERP system implementation and training", category: "Implementation", unitPrice: 2500000, billingType: "project", delivered: 12, status: "active", createdAt: "2024-02-10" },
  { id: "5", sku: "PRJ-002", name: "Data Migration", description: "Legacy data migration to new systems", category: "Migration", unitPrice: 750000, billingType: "project", delivered: 8, status: "active", createdAt: "2024-03-01" },
  { id: "6", sku: "RET-001", name: "Managed IT Support", description: "Monthly IT support and maintenance", category: "Managed Services", unitPrice: 350000, billingType: "monthly", delivered: 15, status: "active", createdAt: "2024-03-05" },
  { id: "7", sku: "RET-002", name: "DevOps Support", description: "Monthly DevOps management and CI/CD", category: "Managed Services", unitPrice: 500000, billingType: "monthly", delivered: 8, status: "active", createdAt: "2024-03-10" },
  { id: "8", sku: "SVC-004", name: "Security Audit", description: "Comprehensive security assessment", category: "Security", unitPrice: 450000, billingType: "fixed", delivered: 22, status: "active", createdAt: "2024-03-15" },
  { id: "9", sku: "SVC-005", name: "Training Workshop", description: "On-site or virtual training sessions", category: "Training", unitPrice: 75000, billingType: "fixed", delivered: 38, status: "inactive", createdAt: "2024-04-01" },
  { id: "10", sku: "PRJ-003", name: "Cloud Migration", description: "Cloud infrastructure setup and migration", category: "Migration", unitPrice: 1200000, billingType: "project", delivered: 5, status: "active", createdAt: "2024-04-10" },
];

const mockCategories = [
  { id: "1", name: "Support" },
  { id: "2", name: "Development" },
  { id: "3", name: "Advisory" },
  { id: "4", name: "Implementation" },
  { id: "5", name: "Migration" },
  { id: "6", name: "Managed Services" },
  { id: "7", name: "Security" },
  { id: "8", name: "Training" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
}

export default function ServicesListPage() {
  const moduleColor = getModuleColor("sales");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      category: "",
      unitPrice: "",
      billingType: "",
    },
  });

  const onSubmit = (data: any) => {
    toast({
      title: "Service Created",
      description: `${data.name} has been added to the catalog.`,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (service: Service) => {
    toast({
      title: "Service Deleted",
      description: `${service.name} has been removed.`,
      variant: "destructive",
    });
  };

  // Filter services
  const filteredServices = mockServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || service.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Stats
  const totalServices = mockServices.length;
  const activeServices = mockServices.filter((s) => s.status === "active").length;
  const hourlyServices = mockServices.filter((s) => s.billingType === "hourly").length;
  const projectServices = mockServices.filter((s) => s.billingType === "project").length;

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
    <SidebarLayout moduleId="sales">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Service List</h1>
            <p className="text-muted-foreground mt-1">Manage and organize all your service offerings</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Hourly Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{hourlyServices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Project Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{projectServices}</div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
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
                {filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No services found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
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
                              View Details
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
                              onClick={() => handleDelete(service)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
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
      </div>
    </SidebarLayout>
  );
}
