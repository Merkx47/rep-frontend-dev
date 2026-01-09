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
  FolderTree,
  Eye,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  serviceCount: number;
  activeServices: number;
  totalRevenue: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Support",
    description: "Technical support and customer assistance services",
    serviceCount: 3,
    activeServices: 2,
    totalRevenue: 2175000,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-06-15"
  },
  {
    id: "2",
    name: "Development",
    description: "Software development and programming services",
    serviceCount: 5,
    activeServices: 5,
    totalRevenue: 8000000,
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-06-20"
  },
  {
    id: "3",
    name: "Advisory",
    description: "Business consulting and strategic advisory services",
    serviceCount: 2,
    activeServices: 2,
    totalRevenue: 1575000,
    status: "active",
    createdAt: "2024-01-05",
    updatedAt: "2024-06-18"
  },
  {
    id: "4",
    name: "Implementation",
    description: "System implementation and deployment services",
    serviceCount: 4,
    activeServices: 3,
    totalRevenue: 30000000,
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-06-22"
  },
  {
    id: "5",
    name: "Migration",
    description: "Data and system migration services",
    serviceCount: 3,
    activeServices: 3,
    totalRevenue: 6000000,
    status: "active",
    createdAt: "2024-02-01",
    updatedAt: "2024-06-10"
  },
  {
    id: "6",
    name: "Managed Services",
    description: "Ongoing IT management and maintenance services",
    serviceCount: 4,
    activeServices: 4,
    totalRevenue: 9250000,
    status: "active",
    createdAt: "2024-02-15",
    updatedAt: "2024-06-25"
  },
  {
    id: "7",
    name: "Security",
    description: "Security audits and cybersecurity services",
    serviceCount: 2,
    activeServices: 2,
    totalRevenue: 9900000,
    status: "active",
    createdAt: "2024-03-01",
    updatedAt: "2024-06-12"
  },
  {
    id: "8",
    name: "Training",
    description: "Professional training and workshop services",
    serviceCount: 3,
    activeServices: 1,
    totalRevenue: 2850000,
    status: "inactive",
    createdAt: "2024-03-10",
    updatedAt: "2024-05-30"
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
}

export default function ServiceCategoriesPage() {
  const moduleColor = getModuleColor("sales");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: any) => {
    toast({
      title: "Category Created",
      description: `${data.name} category has been created.`,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (category: Category) => {
    if (category.serviceCount > 0) {
      toast({
        title: "Cannot Delete Category",
        description: `${category.name} has ${category.serviceCount} services. Please reassign or delete them first.`,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Category Deleted",
      description: `${category.name} category has been removed.`,
      variant: "destructive",
    });
  };

  // Filter categories
  const filteredCategories = mockCategories.filter((category) => {
    return (
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Stats
  const totalCategories = mockCategories.length;
  const activeCategories = mockCategories.filter((c) => c.status === "active").length;
  const totalServices = mockCategories.reduce((sum, c) => sum + c.serviceCount, 0);
  const totalRevenue = mockCategories.reduce((sum, c) => sum + c.totalRevenue, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Service Categories</h1>
            <p className="text-muted-foreground mt-1">Organize and manage your service categories</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-violet-500" />
                <span className="text-2xl font-bold">{totalCategories}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeCategories}</div>
            </CardContent>
          </Card>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Categories Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Services</TableHead>
                  <TableHead className="text-right">Active</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No categories found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                            <FolderTree className="h-4 w-4 text-violet-500" />
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[300px] truncate">
                        {category.description}
                      </TableCell>
                      <TableCell className="text-right">{category.serviceCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {category.activeServices}
                          {category.activeServices === category.serviceCount ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-amber-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(category.totalRevenue)}
                      </TableCell>
                      <TableCell>{getStatusBadge(category.status)}</TableCell>
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
                              View Services
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(category)}
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
