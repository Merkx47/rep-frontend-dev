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
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Factory,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface ProductionOrder {
  id: string;
  orderNumber: string;
  productName: string;
  quantity: number;
  completedQty: number;
  startDate: string;
  dueDate: string;
  status: "draft" | "in_progress" | "paused" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: string;
}

// Mock data
const mockOrders: ProductionOrder[] = [
  { id: "1", orderNumber: "PO-2024-001", productName: "Dell Laptop Assembly", quantity: 50, completedQty: 35, startDate: "2024-01-15", dueDate: "2024-01-30", status: "in_progress", priority: "high", assignedTo: "Production Team A" },
  { id: "2", orderNumber: "PO-2024-002", productName: "Server Rack Configuration", quantity: 10, completedQty: 10, startDate: "2024-01-10", dueDate: "2024-01-20", status: "completed", priority: "medium", assignedTo: "Production Team B" },
  { id: "3", orderNumber: "PO-2024-003", productName: "Network Switch Setup", quantity: 100, completedQty: 0, startDate: "2024-02-01", dueDate: "2024-02-15", status: "draft", priority: "low", assignedTo: "Production Team A" },
  { id: "4", orderNumber: "PO-2024-004", productName: "Workstation Assembly", quantity: 25, completedQty: 12, startDate: "2024-01-20", dueDate: "2024-02-05", status: "paused", priority: "medium", assignedTo: "Production Team C" },
  { id: "5", orderNumber: "PO-2024-005", productName: "UPS Unit Testing", quantity: 30, completedQty: 30, startDate: "2024-01-05", dueDate: "2024-01-15", status: "completed", priority: "high", assignedTo: "QA Team" },
  { id: "6", orderNumber: "PO-2024-006", productName: "Custom PC Build", quantity: 15, completedQty: 8, startDate: "2024-01-25", dueDate: "2024-02-10", status: "in_progress", priority: "urgent", assignedTo: "Production Team A" },
];

export default function ProductionPage() {
  const moduleColor = getModuleColor("production");
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const orderForm = useForm({
    defaultValues: {
      productName: "",
      quantity: "",
      startDate: "",
      dueDate: "",
      priority: "",
      assignedTo: "",
      notes: "",
    },
  });

  const onSubmitOrder = (data: any) => {
    toast({
      title: "Production Order Created",
      description: `Order for ${data.productName} has been created.`,
    });
    setIsOrderDialogOpen(false);
    orderForm.reset();
  };

  const handleStatusChange = (order: ProductionOrder, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `${order.orderNumber} status changed to ${newStatus}.`,
    });
  };

  // Filter orders
  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalOrders = mockOrders.length;
  const inProgress = mockOrders.filter((o) => o.status === "in_progress").length;
  const completed = mockOrders.filter((o) => o.status === "completed").length;
  const totalUnits = mockOrders.reduce((sum, o) => sum + o.quantity, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">In Progress</Badge>;
      case "paused":
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-200">Paused</Badge>;
      case "completed":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline" className="text-slate-600">Low</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Medium</Badge>;
      case "high":
        return <Badge variant="outline" className="text-orange-600 border-orange-200">High</Badge>;
      case "urgent":
        return <Badge variant="outline" className="text-red-600 border-red-200">Urgent</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <SidebarLayout moduleId="production">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Production</h1>
            <p className="text-muted-foreground mt-1">Manage manufacturing orders and track progress</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Units</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUnits}</div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Production Order</DialogTitle>
              </DialogHeader>
              <Form {...orderForm}>
                <form onSubmit={orderForm.handleSubmit(onSubmitOrder)} className="space-y-4">
                  <FormField
                    control={orderForm.control}
                    name="productName"
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={orderForm.control}
                      name="quantity"
                      rules={{ required: "Quantity is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="priority"
                      rules={{ required: "Priority is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={orderForm.control}
                      name="startDate"
                      rules={{ required: "Start date is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={orderForm.control}
                      name="dueDate"
                      rules={{ required: "Due date is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={orderForm.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assigned To</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Production Team A">Production Team A</SelectItem>
                            <SelectItem value="Production Team B">Production Team B</SelectItem>
                            <SelectItem value="Production Team C">Production Team C</SelectItem>
                            <SelectItem value="QA Team">QA Team</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={orderForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional notes..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    Create Order
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const progress = (order.completedQty / order.quantity) * 100;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.orderNumber}</TableCell>
                      <TableCell className="font-medium">{order.productName}</TableCell>
                      <TableCell>
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{order.completedQty}/{order.quantity}</span>
                            <span>{progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{order.assignedTo}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {order.status === "draft" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(order, "in_progress")}>
                                <Play className="w-4 h-4 mr-2" />
                                Start Production
                              </DropdownMenuItem>
                            )}
                            {order.status === "in_progress" && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusChange(order, "paused")}>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order, "completed")}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Complete
                                </DropdownMenuItem>
                              </>
                            )}
                            {order.status === "paused" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(order, "in_progress")}>
                                <Play className="w-4 h-4 mr-2" />
                                Resume
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
