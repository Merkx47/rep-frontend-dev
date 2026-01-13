import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, ShoppingCart, TrendingUp, Clock, CheckCircle, Package, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { getModuleColor } from "@/contexts/module-context";
import { useToast } from "@/hooks/use-toast";

interface SalesOrder {
  id: string;
  customer: string;
  items: number;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  lineItems: { product: string; quantity: number; unitPrice: number }[];
}

interface OrderItem {
  product: string;
  quantity: number;
  unitPrice: number;
}

// Mock customers for dropdown
const mockCustomers = [
  { id: "1", name: "Acme Corporation" },
  { id: "2", name: "TechStart Ltd" },
  { id: "3", name: "Global Industries" },
  { id: "4", name: "Innovation Hub" },
  { id: "5", name: "Digital Solutions" },
  { id: "6", name: "Enterprise Co" },
  { id: "7", name: "Smart Systems" },
];

// Mock products for dropdown
const mockProducts = [
  { id: "1", name: "ERP Software License", price: 500000 },
  { id: "2", name: "Cloud Storage (1TB)", price: 150000 },
  { id: "3", name: "Technical Support Package", price: 250000 },
  { id: "4", name: "Training Session", price: 100000 },
  { id: "5", name: "Hardware Bundle", price: 750000 },
];

// Mock data for sales orders
const initialOrders: SalesOrder[] = [
  {
    id: "ORD-001",
    customer: "Acme Corporation",
    items: 5,
    date: "2025-01-07",
    total: 2450000,
    status: "completed",
    lineItems: [{ product: "ERP Software License", quantity: 5, unitPrice: 490000 }],
  },
  {
    id: "ORD-002",
    customer: "TechStart Ltd",
    items: 3,
    date: "2025-01-06",
    total: 1850000,
    status: "processing",
    lineItems: [{ product: "Cloud Storage (1TB)", quantity: 3, unitPrice: 616667 }],
  },
  {
    id: "ORD-003",
    customer: "Global Industries",
    items: 8,
    date: "2025-01-05",
    total: 4200000,
    status: "pending",
    lineItems: [{ product: "Hardware Bundle", quantity: 8, unitPrice: 525000 }],
  },
  {
    id: "ORD-004",
    customer: "Innovation Hub",
    items: 2,
    date: "2025-01-04",
    total: 950000,
    status: "completed",
    lineItems: [{ product: "Technical Support Package", quantity: 2, unitPrice: 475000 }],
  },
  {
    id: "ORD-005",
    customer: "Digital Solutions",
    items: 4,
    date: "2025-01-03",
    total: 1650000,
    status: "shipped",
    lineItems: [{ product: "Training Session", quantity: 4, unitPrice: 412500 }],
  },
  {
    id: "ORD-006",
    customer: "Enterprise Co",
    items: 6,
    date: "2025-01-02",
    total: 3100000,
    status: "completed",
    lineItems: [{ product: "ERP Software License", quantity: 6, unitPrice: 516667 }],
  },
  {
    id: "ORD-007",
    customer: "Smart Systems",
    items: 1,
    date: "2025-01-01",
    total: 450000,
    status: "cancelled",
    lineItems: [{ product: "Cloud Storage (1TB)", quantity: 1, unitPrice: 450000 }],
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

function getStatusBadge(status: string) {
  const statusStyles: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <Badge className={statusStyles[status] || "bg-gray-100 text-gray-700"}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default function SalesOrdersPage() {
  const moduleColor = getModuleColor("sales");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<SalesOrder[]>(initialOrders);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const { toast } = useToast();

  // New order form state
  const [newOrder, setNewOrder] = useState({
    customer: "",
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { product: "", quantity: 1, unitPrice: 0 }
  ]);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { product: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItems = [...orderItems];
    if (field === "product") {
      const product = mockProducts.find(p => p.name === value);
      updatedItems[index].product = value as string;
      if (product) {
        updatedItems[index].unitPrice = product.price;
      }
    } else if (field === "quantity") {
      updatedItems[index].quantity = Number(value) || 0;
    } else if (field === "unitPrice") {
      updatedItems[index].unitPrice = Number(value) || 0;
    }
    setOrderItems(updatedItems);
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTotalItems = () => {
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleAddOrder = () => {
    if (!newOrder.customer) {
      toast({
        title: "Missing Customer",
        description: "Please select a customer.",
        variant: "destructive",
      });
      return;
    }

    const validItems = orderItems.filter(item => item.product && item.unitPrice > 0);
    if (validItems.length === 0) {
      toast({
        title: "Missing Items",
        description: "Please add at least one product.",
        variant: "destructive",
      });
      return;
    }

    const orderNum = String(orders.length + 1).padStart(3, "0");
    const today = new Date().toISOString().split('T')[0];

    const order: SalesOrder = {
      id: `ORD-${orderNum}`,
      customer: newOrder.customer,
      items: calculateTotalItems(),
      date: today,
      total: calculateTotal(),
      status: "pending",
      lineItems: validItems,
    };

    setOrders([order, ...orders]);
    setNewOrder({ customer: "" });
    setOrderItems([{ product: "", quantity: 1, unitPrice: 0 }]);
    setIsAddOrderOpen(false);
    toast({
      title: "Order Created",
      description: `Order ${order.id} has been created.`,
    });
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalOrdersCount = orders.length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing").length;
  const totalRevenue = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Sales Orders</h2>
          <p className="text-muted-foreground mt-1">Manage and track all sales orders.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-primary/10">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalOrdersCount}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-emerald-500/10">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedOrders}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingOrders}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-9 rounded-xl border-border/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 rounded-xl border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" /> New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Sales Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Customer *</Label>
                  <Select
                    value={newOrder.customer}
                    onValueChange={(value) => setNewOrder({ ...newOrder, customer: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.name}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Line Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Order Items *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                      <Plus className="w-3 h-3 mr-1" /> Add Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Select
                            value={item.product}
                            onValueChange={(value) => handleItemChange(index, "product", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockProducts.map((product) => (
                                <SelectItem key={product.id} value={product.name}>
                                  {product.name} - {formatCurrency(product.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity || ""}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          />
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            placeholder="Unit Price"
                            value={item.unitPrice || ""}
                            onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                          />
                        </div>
                        <div className="w-32 text-right pt-2 text-sm font-medium">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(index)}
                          disabled={orderItems.length === 1}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-2 border-t">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total ({calculateTotalItems()} items)</p>
                      <p className="text-lg font-bold">{formatCurrency(calculateTotal())}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddOrderOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddOrder}
                  className="text-white"
                  style={{ backgroundColor: moduleColor }}
                >
                  Create Order
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Orders Table */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>View and manage all sales orders</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell className="font-medium">{order.customer}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {order.items}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
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
