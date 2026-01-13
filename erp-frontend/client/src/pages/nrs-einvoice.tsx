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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  XCircle,
  ExternalLink,
  RefreshCw,
  Upload,
  Download,
  Shield,
} from "lucide-react";

interface NRSInvoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  amount: number;
  issueDate: string;
  nrsStatus: "pending" | "submitted" | "validated" | "rejected";
  nrsReference?: string;
  errorMessage?: string;
}

const mockNRSInvoices: NRSInvoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    customer: "ABC Corporation Ltd",
    amount: 3171250,
    issueDate: "2024-01-15",
    nrsStatus: "validated",
    nrsReference: "NRS-2024-001234",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    customer: "XYZ Industries",
    amount: 1075000,
    issueDate: "2024-01-18",
    nrsStatus: "submitted",
    nrsReference: "NRS-2024-001235",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    customer: "Global Tech Solutions",
    amount: 5912500,
    issueDate: "2024-01-10",
    nrsStatus: "rejected",
    errorMessage: "Invalid TIN format",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    customer: "Startup Hub Nigeria",
    amount: 1290000,
    issueDate: "2024-01-20",
    nrsStatus: "pending",
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-005",
    customer: "Lagos Retail Group",
    amount: 1075000,
    issueDate: "2024-01-22",
    nrsStatus: "validated",
    nrsReference: "NRS-2024-001236",
  },
];

export default function NRSEInvoicePage() {
  const moduleColor = getModuleColor("nrs-einvoice");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = mockNRSInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.nrsStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const validatedCount = mockNRSInvoices.filter((i) => i.nrsStatus === "validated").length;
  const pendingCount = mockNRSInvoices.filter((i) => i.nrsStatus === "pending").length;
  const submittedCount = mockNRSInvoices.filter((i) => i.nrsStatus === "submitted").length;
  const rejectedCount = mockNRSInvoices.filter((i) => i.nrsStatus === "rejected").length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: NRSInvoice["nrsStatus"]) => {
    const styles = {
      pending: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      validated: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    const icons = {
      pending: <Clock className="w-3 h-3 mr-1" />,
      submitted: <RefreshCw className="w-3 h-3 mr-1" />,
      validated: <CheckCircle className="w-3 h-3 mr-1" />,
      rejected: <XCircle className="w-3 h-3 mr-1" />,
    };
    return (
      <Badge className={`${styles[status]} flex items-center`}>
        {icons[status]}
        {status}
      </Badge>
    );
  };

  return (
    <SidebarLayout moduleId="nrs-einvoice">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">NRS E-Invoice</h1>
            <p className="text-muted-foreground">
              NRS-compliant electronic invoicing for Nigeria
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href="https://qorpy.vercel.app/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open NRS Portal
            </a>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Validated</p>
                  <p className="text-2xl font-bold">{validatedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-blue-100 dark:bg-blue-900/30">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold">{submittedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-gray-100 dark:bg-gray-900/30">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
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
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">E-Invoices</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="validated">Validated</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Upload className="w-4 h-4 mr-2" />
                Submit to NRS
              </Button>
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
                      <TableHead>Amount</TableHead>
                      <TableHead>NRS Status</TableHead>
                      <TableHead>NRS Reference</TableHead>
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
                        <TableCell>{invoice.customer}</TableCell>
                        <TableCell>
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(invoice.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.nrsStatus)}</TableCell>
                        <TableCell>
                          {invoice.nrsReference ? (
                            <span className="font-mono text-sm">{invoice.nrsReference}</span>
                          ) : invoice.errorMessage ? (
                            <span className="text-sm text-red-600">{invoice.errorMessage}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  NRS Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Company TIN Verified</p>
                      <p className="text-sm text-muted-foreground">Tax Identification Number is valid</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">NRS Integration</p>
                      <p className="text-sm text-muted-foreground">Connected to NRS API</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Connected</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Last Sync</p>
                      <p className="text-sm text-muted-foreground">Invoice data synchronized with NRS</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>

                <div className="pt-4">
                  <Button className="w-full sm:w-auto text-white shadow-lg hover:opacity-90" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Compliance Report
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
