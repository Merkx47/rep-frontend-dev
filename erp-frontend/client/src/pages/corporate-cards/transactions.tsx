import { useState } from "react";
import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Search,
  Filter,
  Download,
  Receipt,
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

interface Transaction {
  id: string;
  cardId: string;
  cardNumber: string;
  cardHolder: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  status: "approved" | "pending" | "declined";
  reference: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    cardId: "1",
    cardNumber: "**** 4521",
    cardHolder: "Adebayo Johnson",
    merchant: "Google Ads",
    category: "Advertising",
    amount: 75000,
    date: "2024-01-15",
    time: "14:32",
    status: "approved",
    reference: "TXN-2024-001234",
  },
  {
    id: "2",
    cardId: "2",
    cardNumber: "**** 7832",
    cardHolder: "Fatima Mohammed",
    merchant: "Amazon Web Services",
    category: "Software",
    amount: 45000,
    date: "2024-01-14",
    time: "09:15",
    status: "approved",
    reference: "TXN-2024-001235",
  },
  {
    id: "3",
    cardId: "1",
    cardNumber: "**** 4521",
    cardHolder: "Adebayo Johnson",
    merchant: "Facebook Ads",
    category: "Advertising",
    amount: 50000,
    date: "2024-01-13",
    time: "11:45",
    status: "approved",
    reference: "TXN-2024-001236",
  },
  {
    id: "4",
    cardId: "3",
    cardNumber: "**** 9156",
    cardHolder: "Chukwuemeka Obi",
    merchant: "Microsoft 365",
    category: "Software",
    amount: 25000,
    date: "2024-01-12",
    time: "16:20",
    status: "declined",
    reference: "TXN-2024-001237",
  },
  {
    id: "5",
    cardId: "2",
    cardNumber: "**** 7832",
    cardHolder: "Fatima Mohammed",
    merchant: "Uber Business",
    category: "Travel",
    amount: 15000,
    date: "2024-01-11",
    time: "08:30",
    status: "pending",
    reference: "TXN-2024-001238",
  },
  {
    id: "6",
    cardId: "1",
    cardNumber: "**** 4521",
    cardHolder: "Adebayo Johnson",
    merchant: "LinkedIn Premium",
    category: "Subscription",
    amount: 12000,
    date: "2024-01-10",
    time: "10:00",
    status: "approved",
    reference: "TXN-2024-001239",
  },
  {
    id: "7",
    cardId: "2",
    cardNumber: "**** 7832",
    cardHolder: "Fatima Mohammed",
    merchant: "Zoom Pro",
    category: "Software",
    amount: 8000,
    date: "2024-01-09",
    time: "13:45",
    status: "approved",
    reference: "TXN-2024-001240",
  },
  {
    id: "8",
    cardId: "3",
    cardNumber: "**** 9156",
    cardHolder: "Chukwuemeka Obi",
    merchant: "GitHub Enterprise",
    category: "Software",
    amount: 35000,
    date: "2024-01-08",
    time: "15:30",
    status: "approved",
    reference: "TXN-2024-001241",
  },
];

export default function TransactionsPage() {
  const moduleColor = getModuleColor("corporate-cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesSearch =
      txn.cardHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || txn.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalTransactions = mockTransactions.length;
  const totalSpent = mockTransactions
    .filter((t) => t.status === "approved")
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = mockTransactions.filter((t) => t.status === "pending").length;
  const declinedCount = mockTransactions.filter((t) => t.status === "declined").length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    const config = {
      approved: {
        style: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
      pending: {
        style: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
      declined: {
        style: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        icon: <XCircle className="w-3 h-3 mr-1" />,
      },
    };
    return (
      <Badge className={`${config[status].style} flex items-center`}>
        {config[status].icon}
        {status}
      </Badge>
    );
  };

  const categories = [...new Set(mockTransactions.map((t) => t.category))];

  return (
    <SidebarLayout moduleId="corporate-cards">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">
              View all corporate card transactions
            </p>
          </div>
          <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <Download className="w-4 h-4 mr-2" />
            Export Transactions
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Receipt className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <Clock className="w-6 h-6 text-yellow-600" />
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
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Declined</p>
                  <p className="text-2xl font-bold">{declinedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by cardholder, merchant, reference..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Card Holder</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {new Date(txn.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">{txn.time}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{txn.cardHolder}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {txn.cardNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{txn.merchant}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{txn.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{txn.reference}</span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(txn.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(txn.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
