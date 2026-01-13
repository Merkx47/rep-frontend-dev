import { useState } from "react";
import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getModuleColor } from "@/contexts/module-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  Eye,
  Send,
  Download,
  Copy,
  Printer,
  Mail,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  items: { description: string; quantity: number; rate: number; amount: number }[];
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled";
  notes?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    customer: "ABC Corporation Ltd",
    customerEmail: "finance@abccorp.com",
    issueDate: "2024-01-15",
    dueDate: "2024-02-15",
    items: [
      { description: "Software Development Services", quantity: 1, rate: 2500000, amount: 2500000 },
      { description: "Monthly Support Package", quantity: 3, rate: 150000, amount: 450000 },
    ],
    subtotal: 2950000,
    tax: 221250,
    total: 3171250,
    status: "paid",
    notes: "Thank you for your business!",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    customer: "XYZ Industries",
    customerEmail: "accounts@xyzind.com",
    issueDate: "2024-01-18",
    dueDate: "2024-02-18",
    items: [
      { description: "Consulting Services", quantity: 40, rate: 25000, amount: 1000000 },
    ],
    subtotal: 1000000,
    tax: 75000,
    total: 1075000,
    status: "sent",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    customer: "Global Tech Solutions",
    customerEmail: "billing@globaltech.ng",
    issueDate: "2024-01-10",
    dueDate: "2024-01-25",
    items: [
      { description: "ERP Implementation", quantity: 1, rate: 5000000, amount: 5000000 },
      { description: "Training Sessions", quantity: 5, rate: 100000, amount: 500000 },
    ],
    subtotal: 5500000,
    tax: 412500,
    total: 5912500,
    status: "overdue",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    customer: "Startup Hub Nigeria",
    customerEmail: "ops@startuphub.ng",
    issueDate: "2024-01-20",
    dueDate: "2024-02-20",
    items: [
      { description: "Cloud Hosting - Annual", quantity: 1, rate: 1200000, amount: 1200000 },
    ],
    subtotal: 1200000,
    tax: 90000,
    total: 1290000,
    status: "viewed",
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-005",
    customer: "Lagos Retail Group",
    customerEmail: "procurement@lagosretail.com",
    issueDate: "2024-01-22",
    dueDate: "2024-02-22",
    items: [
      { description: "POS System Integration", quantity: 10, rate: 75000, amount: 750000 },
      { description: "Hardware Setup", quantity: 10, rate: 25000, amount: 250000 },
    ],
    subtotal: 1000000,
    tax: 75000,
    total: 1075000,
    status: "draft",
  },
];

export default function InvoicePage() {
  const moduleColor = getModuleColor("invoice");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = mockInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);

  const pendingAmount = mockInvoices
    .filter((i) => ["sent", "viewed"].includes(i.status))
    .reduce((sum, i) => sum + i.total, 0);

  const overdueAmount = mockInvoices
    .filter((i) => i.status === "overdue")
    .reduce((sum, i) => sum + i.total, 0);

  const draftCount = mockInvoices.filter((i) => i.status === "draft").length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const styles = {
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      viewed: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      cancelled: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    const icons = {
      draft: <FileText className="w-3 h-3 mr-1" />,
      sent: <Send className="w-3 h-3 mr-1" />,
      viewed: <Eye className="w-3 h-3 mr-1" />,
      paid: <CheckCircle className="w-3 h-3 mr-1" />,
      overdue: <AlertTriangle className="w-3 h-3 mr-1" />,
      cancelled: <XCircle className="w-3 h-3 mr-1" />,
    };
    return (
      <Badge className={`${styles[status]} flex items-center`}>
        {icons[status]}
        {status}
      </Badge>
    );
  };

  return (
    <SidebarLayout moduleId="invoice">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">
              Create and manage customer invoices
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                Create Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input placeholder="Enter customer name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Email</Label>
                    <Input type="email" placeholder="customer@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Issue Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Invoice Items</Label>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                      <div className="col-span-5">Description</div>
                      <div className="col-span-2">Qty</div>
                      <div className="col-span-2">Rate</div>
                      <div className="col-span-3">Amount</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <Input className="col-span-5" placeholder="Item description" />
                      <Input className="col-span-2" type="number" placeholder="1" />
                      <Input className="col-span-2" type="number" placeholder="0.00" />
                      <Input className="col-span-3" disabled placeholder="₦0.00" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Textarea placeholder="Additional notes for the customer..." />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <FileText className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} onClick={() => setIsCreateOpen(false)}>
                    <Send className="w-4 h-4 mr-2" />
                    Create & Send
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-blue-100 dark:bg-blue-900/30">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{formatCurrency(pendingAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold">{formatCurrency(overdueAmount)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-gray-100 dark:bg-gray-900/30">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                  <p className="text-2xl font-bold">{draftCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice number, customer..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Invoices Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <span className="font-mono font-medium">
                            {invoice.invoiceNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{invoice.customer}</p>
                            <p className="text-sm text-muted-foreground">
                              {invoice.customerEmail}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(invoice.total)}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {invoice.status === "draft" && (
                                <DropdownMenuItem>
                                  <Send className="w-4 h-4 mr-2" />
                                  Send Invoice
                                </DropdownMenuItem>
                              )}
                              {["sent", "viewed", "overdue"].includes(invoice.status) && (
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Reminder
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel Invoice
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

          <TabsContent value="recurring" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Recurring Invoices</h3>
                  <p className="text-muted-foreground mb-4">
                    Set up automatic invoicing for regular customers
                  </p>
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Recurring Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
