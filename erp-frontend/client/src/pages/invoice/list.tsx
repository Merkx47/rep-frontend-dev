import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getModuleColor } from "@/contexts/module-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm, useFieldArray } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useInvoices, useCreateInvoice, useCustomers, useProducts } from "@/hooks/use-sales";
import type { Invoice, Customer, Product } from "@shared/schema";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Send,
  Download,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(num);
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

interface InvoiceLineInput {
  productId: string;
  description: string;
  quantity: string;
  unitPrice: string;
  amount: string;
}

export default function InvoiceListPage() {
  const moduleColor = getModuleColor("invoice");
  const { data: invoices = [], isLoading } = useInvoices();
  const { data: customers = [] } = useCustomers();
  const { data: products = [] } = useProducts();
  const createInvoice = useCreateInvoice();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      customerId: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      notes: "",
      lines: [
        { productId: "", description: "", quantity: "1", unitPrice: "", amount: "0" },
      ] as InvoiceLineInput[],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice: Invoice) => {
    const matchesSearch =
      invoice.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum: number, i: Invoice) => sum + parseFloat(i.total?.toString() || "0"), 0);
  const paidAmount = invoices
    .filter((i: Invoice) => i.status === "paid")
    .reduce((sum: number, i: Invoice) => sum + parseFloat(i.total?.toString() || "0"), 0);
  const overdueCount = invoices.filter((i: Invoice) => i.status === "overdue").length;
  const draftCount = invoices.filter((i: Invoice) => i.status === "draft").length;

  const onSubmit = async (data: any) => {
    // Calculate totals
    let subtotal = 0;
    data.lines.forEach((line: InvoiceLineInput) => {
      const qty = parseFloat(line.quantity || "0");
      const price = parseFloat(line.unitPrice || "0");
      subtotal += qty * price;
    });
    const tax = subtotal * 0.075; // 7.5% VAT
    const total = subtotal + tax;

    try {
      await createInvoice.mutateAsync({
        customerId: data.customerId,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        total: total.toString(),
        notes: data.notes,
        status: "draft",
      });
      toast({ title: "Invoice Created", description: "Invoice has been created successfully." });
      setIsDialogOpen(false);
      form.reset();
    } catch {
      toast({ title: "Error", description: "Failed to create invoice.", variant: "destructive" });
    }
  };

  // Calculate line amount when quantity or price changes
  const watchedLines = form.watch("lines");
  const subtotal = watchedLines.reduce((sum, line) => {
    const qty = parseFloat(line.quantity || "0");
    const price = parseFloat(line.unitPrice || "0");
    return sum + qty * price;
  }, 0);
  const taxAmount = subtotal * 0.075;
  const totalAmount_calc = subtotal + taxAmount;

  const updateLineAmount = (index: number) => {
    const line = form.getValues(`lines.${index}`);
    const qty = parseFloat(line.quantity || "0");
    const price = parseFloat(line.unitPrice || "0");
    form.setValue(`lines.${index}.amount`, (qty * price).toString());
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Paid</Badge>;
      case "sent":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Sent</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  const getCustomerName = (customerId: string | null) => {
    if (!customerId) return "-";
    const customer = customers.find((c: Customer) => c.id === customerId);
    return customer?.companyName || customerId;
  };

  return (
    <SidebarLayout moduleId="invoice">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground mt-1">Create, manage and track all invoices</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices}</div>
              <p className="text-xs text-muted-foreground mt-1">{draftCount} drafts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Billed</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Collected</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
              <Clock className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Invoice</DialogTitle>
                <DialogDescription>Create a new invoice with line items</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="customerId"
                      rules={{ required: "Customer is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select customer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {customers.map((customer: Customer) => (
                                <SelectItem key={customer.id} value={customer.id}>
                                  {customer.companyName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="issueDate"
                      rules={{ required: "Issue date is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
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

                  {/* Invoice Lines */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <FormLabel>Line Items</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ productId: "", description: "", quantity: "1", unitPrice: "", amount: "0" })}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Item
                      </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Product/Service</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[80px] text-right">Qty</TableHead>
                            <TableHead className="w-[120px] text-right">Unit Price</TableHead>
                            <TableHead className="w-[120px] text-right">Amount</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`lines.${index}.productId`}
                                  render={({ field }) => (
                                    <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        const product = products.find((p: Product) => p.id === value);
                                        if (product) {
                                          form.setValue(`lines.${index}.description`, product.name || "");
                                          form.setValue(`lines.${index}.unitPrice`, product.price?.toString() || "");
                                          updateLineAmount(index);
                                        }
                                      }}
                                      value={field.value}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {products.map((product: Product) => (
                                          <SelectItem key={product.id} value={product.id}>
                                            {product.code} - {product.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`lines.${index}.description`}
                                  render={({ field }) => (
                                    <Input className="h-8" placeholder="Description" {...field} />
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`lines.${index}.quantity`}
                                  render={({ field }) => (
                                    <Input
                                      className="h-8 text-right"
                                      type="number"
                                      min="1"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setTimeout(() => updateLineAmount(index), 0);
                                      }}
                                    />
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`lines.${index}.unitPrice`}
                                  render={({ field }) => (
                                    <Input
                                      className="h-8 text-right"
                                      type="number"
                                      placeholder="0.00"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setTimeout(() => updateLineAmount(index), 0);
                                      }}
                                    />
                                  )}
                                />
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(
                                  parseFloat(watchedLines[index]?.quantity || "0") *
                                    parseFloat(watchedLines[index]?.unitPrice || "0")
                                )}
                              </TableCell>
                              <TableCell>
                                {fields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => remove(index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          {/* Totals Rows */}
                          <TableRow className="bg-muted/30">
                            <TableCell colSpan={4} className="text-right font-medium">
                              Subtotal:
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(subtotal)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow className="bg-muted/30">
                            <TableCell colSpan={4} className="text-right font-medium">
                              VAT (7.5%):
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(taxAmount)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow className="bg-muted/50 font-bold">
                            <TableCell colSpan={4} className="text-right">
                              Total:
                            </TableCell>
                            <TableCell className="text-right text-lg">
                              {formatCurrency(totalAmount_calc)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input placeholder="Optional notes for the invoice" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full text-white border-0"
                    style={{ backgroundColor: moduleColor }}
                    disabled={createInvoice.isPending}
                  >
                    Create Invoice
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Loading invoices...
                    </TableCell>
                  </TableRow>
                ) : filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No invoices found. Create your first invoice.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice: Invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-sm">{invoice.number}</TableCell>
                      <TableCell>
                        <p className="font-medium">{getCustomerName(invoice.customerId)}</p>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(invoice.subtotal)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(invoice.tax)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>{formatDate(invoice.issueDate)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
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
                            {invoice.status === "draft" && (
                              <DropdownMenuItem>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {invoice.status === "draft" && (
                              <DropdownMenuItem>
                                <Send className="w-4 h-4 mr-2" />
                                Send
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {invoice.status === "draft" && (
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
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
