import { useState } from "react";
import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getModuleColor } from "@/contexts/module-context";
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
import {
  Landmark,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Building2,
  Wallet,
  TrendingUp,
  MoreHorizontal,
  Eye,
  FileText,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  accountType: "current" | "savings" | "domiciliary";
  currency: string;
  balance: number;
  status: "active" | "inactive" | "pending";
  lastReconciled: string;
}

interface BankTransaction {
  id: string;
  accountId: string;
  bankName: string;
  type: "credit" | "debit";
  description: string;
  reference: string;
  amount: number;
  balance: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

const mockAccounts: BankAccount[] = [
  {
    id: "1",
    bankName: "First Bank",
    accountName: "Qorpy Technologies Ltd - Main",
    accountNumber: "3082567890",
    accountType: "current",
    currency: "NGN",
    balance: 15750000,
    status: "active",
    lastReconciled: "2024-01-15",
  },
  {
    id: "2",
    bankName: "GTBank",
    accountName: "Qorpy Technologies Ltd - Operations",
    accountNumber: "0234567891",
    accountType: "current",
    currency: "NGN",
    balance: 8250000,
    status: "active",
    lastReconciled: "2024-01-14",
  },
  {
    id: "3",
    bankName: "Access Bank",
    accountName: "Qorpy Technologies Ltd - Savings",
    accountNumber: "1098765432",
    accountType: "savings",
    currency: "NGN",
    balance: 25000000,
    status: "active",
    lastReconciled: "2024-01-10",
  },
  {
    id: "4",
    bankName: "Zenith Bank",
    accountName: "Qorpy Technologies Ltd - USD",
    accountNumber: "5012345678",
    accountType: "domiciliary",
    currency: "USD",
    balance: 45000,
    status: "active",
    lastReconciled: "2024-01-12",
  },
  {
    id: "5",
    bankName: "UBA",
    accountName: "Qorpy Technologies Ltd - Payroll",
    accountNumber: "2098765432",
    accountType: "current",
    currency: "NGN",
    balance: 3500000,
    status: "pending",
    lastReconciled: "-",
  },
];

const mockTransactions: BankTransaction[] = [
  {
    id: "1",
    accountId: "1",
    bankName: "First Bank",
    type: "credit",
    description: "Payment from ABC Corp - Invoice #INV-2024-001",
    reference: "FBN/TRF/24011500001",
    amount: 2500000,
    balance: 15750000,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    accountId: "2",
    bankName: "GTBank",
    type: "debit",
    description: "Vendor Payment - Office Supplies",
    reference: "GTB/PAY/24011400002",
    amount: 125000,
    balance: 8250000,
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "3",
    accountId: "1",
    bankName: "First Bank",
    type: "debit",
    description: "Staff Salary - January 2024",
    reference: "FBN/SAL/24011300003",
    amount: 4500000,
    balance: 13250000,
    date: "2024-01-13",
    status: "completed",
  },
  {
    id: "4",
    accountId: "3",
    bankName: "Access Bank",
    type: "credit",
    description: "Interest Credit - Q4 2023",
    reference: "ACB/INT/24011200004",
    amount: 375000,
    balance: 25000000,
    date: "2024-01-12",
    status: "completed",
  },
  {
    id: "5",
    accountId: "2",
    bankName: "GTBank",
    type: "debit",
    description: "Utility Payment - Electricity",
    reference: "GTB/UTL/24011100005",
    amount: 85000,
    balance: 8375000,
    date: "2024-01-11",
    status: "pending",
  },
];

export default function BankPage() {
  const moduleColor = getModuleColor("bank");
  const [searchTerm, setSearchTerm] = useState("");
  const [accountFilter, setAccountFilter] = useState<string>("all");
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);

  const filteredAccounts = mockAccounts.filter((account) => {
    const matchesSearch =
      account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber.includes(searchTerm);
    const matchesFilter =
      accountFilter === "all" || account.accountType === accountFilter;
    return matchesSearch && matchesFilter;
  });

  const totalNGNBalance = mockAccounts
    .filter((a) => a.currency === "NGN" && a.status === "active")
    .reduce((sum, a) => sum + a.balance, 0);

  const totalUSDBalance = mockAccounts
    .filter((a) => a.currency === "USD" && a.status === "active")
    .reduce((sum, a) => sum + a.balance, 0);

  const totalAccounts = mockAccounts.length;
  const activeAccounts = mockAccounts.filter((a) => a.status === "active").length;

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: BankAccount["status"]) => {
    const styles = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      inactive: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const getTransactionStatusBadge = (status: BankTransaction["status"]) => {
    const styles = {
      completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const getAccountTypeBadge = (type: BankAccount["accountType"]) => {
    const labels = {
      current: "Current",
      savings: "Savings",
      domiciliary: "Domiciliary",
    };
    return <Badge variant="outline">{labels[type]}</Badge>;
  };

  return (
    <SidebarLayout moduleId="bank">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bank Management</h1>
            <p className="text-muted-foreground">
              Manage bank accounts and reconciliation
            </p>
          </div>
          <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Bank Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Bank Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-bank">First Bank</SelectItem>
                      <SelectItem value="gtbank">GTBank</SelectItem>
                      <SelectItem value="access">Access Bank</SelectItem>
                      <SelectItem value="zenith">Zenith Bank</SelectItem>
                      <SelectItem value="uba">UBA</SelectItem>
                      <SelectItem value="stanbic">Stanbic IBTC</SelectItem>
                      <SelectItem value="fidelity">Fidelity Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Account Name</Label>
                  <Input placeholder="Enter account name" />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input placeholder="Enter 10-digit account number" maxLength={10} />
                </div>
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Account</SelectItem>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="domiciliary">Domiciliary Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} onClick={() => setIsAddAccountOpen(false)}>
                    Add Account
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
                <div className="p-3 rounded-lg bg-primary/10">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NGN Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalNGNBalance)}</p>
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
                  <p className="text-sm text-muted-foreground">USD Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalUSDBalance, "USD")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Accounts</p>
                  <p className="text-2xl font-bold">{totalAccounts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Landmark className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Accounts</p>
                  <p className="text-2xl font-bold">{activeAccounts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by bank name, account..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={accountFilter} onValueChange={setAccountFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="domiciliary">Domiciliary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Accounts Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bank</TableHead>
                      <TableHead>Account Details</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Reconciled</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Landmark className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <span className="font-medium">{account.bankName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{account.accountName}</p>
                            <p className="text-sm text-muted-foreground font-mono">
                              {account.accountNumber}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getAccountTypeBadge(account.accountType)}</TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            {formatCurrency(account.balance, account.currency)}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(account.status)}</TableCell>
                        <TableCell>
                          {account.lastReconciled !== "-"
                            ? new Date(account.lastReconciled).toLocaleDateString()
                            : "-"}
                        </TableCell>
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
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reconcile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="w-4 h-4 mr-2" />
                                View Statement
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Export
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

          <TabsContent value="transactions" className="space-y-4">
            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell>
                          {new Date(txn.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{txn.bankName}</TableCell>
                        <TableCell className="max-w-[250px] truncate">
                          {txn.description}
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{txn.reference}</span>
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
                        <TableCell>
                          {getTransactionStatusBadge(txn.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reconciliation" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Bank Reconciliation</h3>
                  <p className="text-muted-foreground mb-4">
                    Match your bank statements with recorded transactions
                  </p>
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Reconciliation
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
