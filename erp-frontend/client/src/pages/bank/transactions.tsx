import { useState } from "react";
import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  TrendingDown,
  Receipt,
  Calendar,
} from "lucide-react";

interface BankTransaction {
  id: string;
  accountId: string;
  bankName: string;
  accountNumber: string;
  type: "credit" | "debit";
  description: string;
  reference: string;
  amount: number;
  balance: number;
  date: string;
  status: "completed" | "pending" | "failed";
  category: string;
}

const mockTransactions: BankTransaction[] = [
  {
    id: "1",
    accountId: "1",
    bankName: "First Bank",
    accountNumber: "3082567890",
    type: "credit",
    description: "Payment from ABC Corp - Invoice #INV-2024-001",
    reference: "FBN/TRF/24011500001",
    amount: 2500000,
    balance: 15750000,
    date: "2024-01-15",
    status: "completed",
    category: "Customer Payment",
  },
  {
    id: "2",
    accountId: "2",
    bankName: "GTBank",
    accountNumber: "0234567891",
    type: "debit",
    description: "Vendor Payment - Office Supplies",
    reference: "GTB/PAY/24011400002",
    amount: 125000,
    balance: 8250000,
    date: "2024-01-14",
    status: "completed",
    category: "Vendor Payment",
  },
  {
    id: "3",
    accountId: "1",
    bankName: "First Bank",
    accountNumber: "3082567890",
    type: "debit",
    description: "Staff Salary - January 2024",
    reference: "FBN/SAL/24011300003",
    amount: 4500000,
    balance: 13250000,
    date: "2024-01-13",
    status: "completed",
    category: "Payroll",
  },
  {
    id: "4",
    accountId: "3",
    bankName: "Access Bank",
    accountNumber: "1098765432",
    type: "credit",
    description: "Interest Credit - Q4 2023",
    reference: "ACB/INT/24011200004",
    amount: 375000,
    balance: 25000000,
    date: "2024-01-12",
    status: "completed",
    category: "Interest",
  },
  {
    id: "5",
    accountId: "2",
    bankName: "GTBank",
    accountNumber: "0234567891",
    type: "debit",
    description: "Utility Payment - Electricity",
    reference: "GTB/UTL/24011100005",
    amount: 85000,
    balance: 8375000,
    date: "2024-01-11",
    status: "pending",
    category: "Utilities",
  },
  {
    id: "6",
    accountId: "1",
    bankName: "First Bank",
    accountNumber: "3082567890",
    type: "credit",
    description: "Payment from XYZ Ltd - Invoice #INV-2024-002",
    reference: "FBN/TRF/24011000006",
    amount: 1850000,
    balance: 17750000,
    date: "2024-01-10",
    status: "completed",
    category: "Customer Payment",
  },
  {
    id: "7",
    accountId: "2",
    bankName: "GTBank",
    accountNumber: "0234567891",
    type: "debit",
    description: "Internet Service - Monthly",
    reference: "GTB/SRV/24010900007",
    amount: 45000,
    balance: 8460000,
    date: "2024-01-09",
    status: "completed",
    category: "Utilities",
  },
  {
    id: "8",
    accountId: "4",
    bankName: "Zenith Bank",
    accountNumber: "5012345678",
    type: "credit",
    description: "Foreign Payment - Client ABC",
    reference: "ZNB/FX/24010800008",
    amount: 5000,
    balance: 45000,
    date: "2024-01-08",
    status: "completed",
    category: "Foreign Receipt",
  },
];

export default function BankTransactionsPage() {
  const moduleColor = getModuleColor("bank");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bankFilter, setBankFilter] = useState<string>("all");

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || txn.type === typeFilter;
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    const matchesBank = bankFilter === "all" || txn.bankName === bankFilter;
    return matchesSearch && matchesType && matchesStatus && matchesBank;
  });

  const totalCredits = mockTransactions
    .filter((t) => t.type === "credit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = mockTransactions
    .filter((t) => t.type === "debit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = mockTransactions.filter((t) => t.status === "pending").length;
  const totalTransactions = mockTransactions.length;

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: BankTransaction["status"]) => {
    const styles = {
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const banks = [...new Set(mockTransactions.map((t) => t.bankName))];

  return (
    <SidebarLayout moduleId="bank">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bank Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all bank transactions
            </p>
          </div>
          <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <Download className="w-4 h-4 mr-2" />
            Export Statement
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
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalCredits)}</p>
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
                  <p className="text-sm text-muted-foreground">Total Debits</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalDebits)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
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
              placeholder="Search by description, reference..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={bankFilter} onValueChange={setBankFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Banks</SelectItem>
              {banks.map((bank) => (
                <SelectItem key={bank} value={bank}>
                  {bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Bank Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell>
                      {new Date(txn.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{txn.bankName}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {txn.accountNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {txn.description}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{txn.reference}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{txn.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {txn.type === "credit" ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={
                            txn.type === "credit"
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {txn.type === "credit" ? "+" : "-"}
                          {formatCurrency(txn.amount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(txn.balance)}
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
