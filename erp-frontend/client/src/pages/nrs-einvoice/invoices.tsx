import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Send,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

interface EInvoice {
  id: string;
  invoiceNumber: string;
  nrsReference: string | null;
  customerName: string;
  customerTIN: string;
  amount: number;
  vat: number;
  total: number;
  issueDate: string;
  submissionDate: string | null;
  status: "draft" | "pending" | "submitted" | "approved" | "rejected";
  remarks: string | null;
}

// Mock data
const mockEInvoices: EInvoice[] = [
  { id: "1", invoiceNumber: "INV-2024-001", nrsReference: "NRS-2024-00123", customerName: "Acme Corporation", customerTIN: "12345678-0001", amount: 450000, vat: 33750, total: 483750, issueDate: "2024-01-15", submissionDate: "2024-01-15", status: "approved", remarks: null },
  { id: "2", invoiceNumber: "INV-2024-002", nrsReference: "NRS-2024-00124", customerName: "TechStart Ltd", customerTIN: "23456789-0001", amount: 850000, vat: 63750, total: 913750, issueDate: "2024-01-20", submissionDate: "2024-01-20", status: "approved", remarks: null },
  { id: "3", invoiceNumber: "INV-2024-003", nrsReference: null, customerName: "Global Industries", customerTIN: "34567890-0001", amount: 1250000, vat: 93750, total: 1343750, issueDate: "2024-01-22", submissionDate: "2024-01-22", status: "pending", remarks: "Awaiting NRS validation" },
  { id: "4", invoiceNumber: "INV-2024-004", nrsReference: null, customerName: "StartUp Inc", customerTIN: "45678901-0001", amount: 275000, vat: 20625, total: 295625, issueDate: "2024-01-25", submissionDate: null, status: "draft", remarks: null },
  { id: "5", invoiceNumber: "INV-2024-005", nrsReference: "NRS-2024-00125", customerName: "Enterprise Solutions", customerTIN: "56789012-0001", amount: 2100000, vat: 157500, total: 2257500, issueDate: "2024-01-18", submissionDate: "2024-01-18", status: "rejected", remarks: "Invalid TIN format" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
}

export default function NRSInvoicesPage() {
  const moduleColor = getModuleColor("nrs-einvoice");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { toast } = useToast();

  const handleSubmitToNRS = (invoice: EInvoice) => {
    toast({
      title: "Submitted to NRS",
      description: `${invoice.invoiceNumber} has been submitted for validation.`,
    });
  };

  const handleRetry = (invoice: EInvoice) => {
    toast({
      title: "Resubmitting to NRS",
      description: `${invoice.invoiceNumber} is being resubmitted.`,
    });
  };

  const filteredInvoices = mockEInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerTIN.includes(searchQuery);
    const matchesStatus = selectedStatus === "all" || invoice.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalInvoices = mockEInvoices.length;
  const approved = mockEInvoices.filter((i) => i.status === "approved").length;
  const pending = mockEInvoices.filter((i) => i.status === "pending" || i.status === "draft").length;
  const rejected = mockEInvoices.filter((i) => i.status === "rejected").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Approved</Badge>;
      case "submitted":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Submitted</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Pending</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <SidebarLayout moduleId="nrs-einvoice">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">NRS E-Invoices</h1>
            <p className="text-muted-foreground mt-1">Manage and track invoices submitted to NRS</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total E-Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice #, customer, TIN..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <Plus className="w-4 h-4 mr-2" />
            New E-Invoice
          </Button>
        </div>

        {/* E-Invoices Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>NRS Reference</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>TIN</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">VAT</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {invoice.nrsReference || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{invoice.customerName}</p>
                      <p className="text-xs text-muted-foreground">{invoice.issueDate}</p>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{invoice.customerTIN}</TableCell>
                    <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatCurrency(invoice.vat)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(invoice.total)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(invoice.status)}
                        {invoice.remarks && (
                          <p className="text-xs text-muted-foreground">{invoice.remarks}</p>
                        )}
                      </div>
                    </TableCell>
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
                          {invoice.status === "draft" && (
                            <DropdownMenuItem onClick={() => handleSubmitToNRS(invoice)}>
                              <Send className="w-4 h-4 mr-2" />
                              Submit to NRS
                            </DropdownMenuItem>
                          )}
                          {invoice.status === "rejected" && (
                            <DropdownMenuItem onClick={() => handleRetry(invoice)}>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Retry Submission
                            </DropdownMenuItem>
                          )}
                          {invoice.status === "approved" && (
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 mr-2" />
                              Download Certificate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
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

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No e-invoices found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
