import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileCheck, TrendingUp, Clock, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface Quotation {
  id: string;
  customer: string;
  title: string;
  date: string;
  validUntil: string;
  total: number;
  status: "pending" | "accepted" | "rejected" | "expired" | "draft";
  items: { description: string; quantity: number; unitPrice: number }[];
  notes: string;
}

interface QuotationItem {
  description: string;
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

// Mock data for quotations
const initialQuotations: Quotation[] = [
  {
    id: "QUO-001",
    customer: "Acme Corporation",
    title: "Enterprise Software Package",
    date: "2025-01-07",
    validUntil: "2025-02-07",
    total: 5500000,
    status: "pending",
    items: [{ description: "Software License", quantity: 1, unitPrice: 5500000 }],
    notes: "",
  },
  {
    id: "QUO-002",
    customer: "TechStart Ltd",
    title: "Cloud Migration Services",
    date: "2025-01-06",
    validUntil: "2025-02-06",
    total: 2800000,
    status: "accepted",
    items: [{ description: "Migration Service", quantity: 1, unitPrice: 2800000 }],
    notes: "",
  },
  {
    id: "QUO-003",
    customer: "Global Industries",
    title: "Annual Support Contract",
    date: "2025-01-05",
    validUntil: "2025-02-05",
    total: 8200000,
    status: "pending",
    items: [{ description: "Annual Support", quantity: 1, unitPrice: 8200000 }],
    notes: "",
  },
  {
    id: "QUO-004",
    customer: "Innovation Hub",
    title: "Development Services",
    date: "2025-01-04",
    validUntil: "2025-02-04",
    total: 1500000,
    status: "expired",
    items: [{ description: "Development", quantity: 1, unitPrice: 1500000 }],
    notes: "",
  },
  {
    id: "QUO-005",
    customer: "Digital Solutions",
    title: "Hardware Procurement",
    date: "2025-01-03",
    validUntil: "2025-02-03",
    total: 3200000,
    status: "accepted",
    items: [{ description: "Hardware", quantity: 1, unitPrice: 3200000 }],
    notes: "",
  },
  {
    id: "QUO-006",
    customer: "Enterprise Co",
    title: "ERP Implementation",
    date: "2025-01-02",
    validUntil: "2025-02-02",
    total: 12500000,
    status: "rejected",
    items: [{ description: "ERP System", quantity: 1, unitPrice: 12500000 }],
    notes: "",
  },
  {
    id: "QUO-007",
    customer: "Smart Systems",
    title: "Training Package",
    date: "2025-01-01",
    validUntil: "2025-02-01",
    total: 750000,
    status: "draft",
    items: [{ description: "Training", quantity: 1, unitPrice: 750000 }],
    notes: "",
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

function getStatusBadge(status: string) {
  const statusStyles: Record<string, { style: string; icon: React.ReactNode }> = {
    pending: {
      style: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      icon: <Clock className="h-3 w-3 mr-1" />,
    },
    accepted: {
      style: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
      icon: <CheckCircle className="h-3 w-3 mr-1" />,
    },
    rejected: {
      style: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: <XCircle className="h-3 w-3 mr-1" />,
    },
    expired: {
      style: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      icon: null,
    },
    draft: {
      style: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      icon: null,
    },
  };

  const config = statusStyles[status] || statusStyles.draft;

  return (
    <Badge className={`flex items-center ${config.style}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export default function QuotationsPage() {
  const moduleColor = getModuleColor("sales");
  const [searchQuery, setSearchQuery] = useState("");
  const [quotations, setQuotations] = useState<Quotation[]>(initialQuotations);
  const [isAddQuotationOpen, setIsAddQuotationOpen] = useState(false);
  const { toast } = useToast();

  // New quotation form state
  const [newQuotation, setNewQuotation] = useState({
    customer: "",
    title: "",
    validUntil: "",
    notes: "",
  });
  const [newItems, setNewItems] = useState<QuotationItem[]>([
    { description: "", quantity: 1, unitPrice: 0 }
  ]);

  const handleAddItem = () => {
    setNewItems([...newItems, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (newItems.length > 1) {
      setNewItems(newItems.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, value: string | number) => {
    const updatedItems = [...newItems];
    if (field === "description") {
      updatedItems[index].description = value as string;
    } else if (field === "quantity") {
      updatedItems[index].quantity = Number(value) || 0;
    } else if (field === "unitPrice") {
      updatedItems[index].unitPrice = Number(value) || 0;
    }
    setNewItems(updatedItems);
  };

  const calculateTotal = () => {
    return newItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleAddQuotation = () => {
    if (!newQuotation.customer || !newQuotation.title || !newQuotation.validUntil) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const validItems = newItems.filter(item => item.description && item.unitPrice > 0);
    if (validItems.length === 0) {
      toast({
        title: "Missing Items",
        description: "Please add at least one line item.",
        variant: "destructive",
      });
      return;
    }

    const quoteNum = String(quotations.length + 1).padStart(3, "0");
    const today = new Date().toISOString().split('T')[0];

    const quotation: Quotation = {
      id: `QUO-${quoteNum}`,
      customer: newQuotation.customer,
      title: newQuotation.title,
      date: today,
      validUntil: newQuotation.validUntil,
      total: calculateTotal(),
      status: "draft",
      items: validItems,
      notes: newQuotation.notes,
    };

    setQuotations([quotation, ...quotations]);
    setNewQuotation({ customer: "", title: "", validUntil: "", notes: "" });
    setNewItems([{ description: "", quantity: 1, unitPrice: 0 }]);
    setIsAddQuotationOpen(false);
    toast({
      title: "Quotation Created",
      description: `Quotation ${quotation.id} has been created as draft.`,
    });
  };

  const filteredQuotations = quotations.filter(quotation =>
    quotation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quotation.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quotation.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalQuotations = quotations.length;
  const pendingQuotations = quotations.filter(q => q.status === "pending").length;
  const acceptedQuotations = quotations.filter(q => q.status === "accepted").length;
  const totalValue = quotations
    .filter(q => q.status === "accepted")
    .reduce((sum, q) => sum + q.total, 0);

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Quotations</h2>
          <p className="text-muted-foreground mt-1">Create and manage customer quotations.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-primary/10">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalQuotations}</p>
                  <p className="text-xs text-muted-foreground">Total Quotations</p>
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
                  <p className="text-2xl font-bold">{pendingQuotations}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
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
                  <p className="text-2xl font-bold">{acceptedQuotations}</p>
                  <p className="text-xs text-muted-foreground">Accepted</p>
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
                  <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                  <p className="text-xs text-muted-foreground">Accepted Value</p>
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
              placeholder="Search quotations..."
              className="pl-9 rounded-xl border-border/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddQuotationOpen} onOpenChange={setIsAddQuotationOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 rounded-xl border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" /> New Quotation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Quotation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer *</Label>
                    <Select
                      value={newQuotation.customer}
                      onValueChange={(value) => setNewQuotation({ ...newQuotation, customer: value })}
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
                  <div className="space-y-2">
                    <Label>Valid Until *</Label>
                    <Input
                      type="date"
                      value={newQuotation.validUntil}
                      onChange={(e) => setNewQuotation({ ...newQuotation, validUntil: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    placeholder="e.g., Enterprise Software Package"
                    value={newQuotation.title}
                    onChange={(e) => setNewQuotation({ ...newQuotation, title: e.target.value })}
                  />
                </div>

                {/* Line Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Line Items *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                      <Plus className="w-3 h-3 mr-1" /> Add Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, "description", e.target.value)}
                          />
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
                          disabled={newItems.length === 1}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end pt-2 border-t">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-bold">{formatCurrency(calculateTotal())}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Additional notes or terms..."
                    value={newQuotation.notes}
                    onChange={(e) => setNewQuotation({ ...newQuotation, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddQuotationOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddQuotation}
                  className="text-white"
                  style={{ backgroundColor: moduleColor }}
                >
                  Create Quotation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quotations Table */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>All Quotations</CardTitle>
            <CardDescription>View and manage customer quotations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No quotations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotations.map(quotation => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-mono text-sm">{quotation.id}</TableCell>
                      <TableCell className="font-medium">{quotation.customer}</TableCell>
                      <TableCell>
                        <p className="text-muted-foreground">{quotation.title}</p>
                      </TableCell>
                      <TableCell>{new Date(quotation.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(quotation.validUntil).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(quotation.total)}</TableCell>
                      <TableCell>{getStatusBadge(quotation.status)}</TableCell>
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
