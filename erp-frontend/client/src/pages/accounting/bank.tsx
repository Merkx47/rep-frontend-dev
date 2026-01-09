import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, MoreHorizontal, Landmark, ArrowUpRight, ArrowDownLeft, RefreshCw, Building2 } from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function AccountingBankPage() {
  const moduleColor = getModuleColor("accounting");
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const { toast } = useToast();

  const handleAddBank = () => {
    toast({
      title: "Bank Account Added",
      description: "New bank account has been added successfully.",
    });
    setIsAddBankOpen(false);
  };
  const bankAccounts = [
    {
      id: 1,
      bankName: "First Bank of Nigeria",
      accountName: "Qorpy Technologies Ltd",
      accountNumber: "2012345678",
      accountType: "Current",
      balance: 15450000,
      currency: "NGN",
      status: "Active",
      lastReconciled: "2024-01-05",
    },
    {
      id: 2,
      bankName: "GTBank",
      accountName: "Qorpy Technologies Ltd",
      accountNumber: "0234567890",
      accountType: "Current",
      balance: 8200000,
      currency: "NGN",
      status: "Active",
      lastReconciled: "2024-01-06",
    },
    {
      id: 3,
      bankName: "Access Bank",
      accountName: "Qorpy Technologies Ltd - USD",
      accountNumber: "1234567890",
      accountType: "Domiciliary",
      balance: 25000,
      currency: "USD",
      status: "Active",
      lastReconciled: "2024-01-04",
    },
    {
      id: 4,
      bankName: "Zenith Bank",
      accountName: "Qorpy Technologies Ltd",
      accountNumber: "1098765432",
      accountType: "Savings",
      balance: 5000000,
      currency: "NGN",
      status: "Active",
      lastReconciled: "2024-01-03",
    },
  ];

  const recentTransactions = [
    { id: 1, type: "credit", description: "Payment from Client A", amount: 2500000, date: "2024-01-07", bank: "First Bank" },
    { id: 2, type: "debit", description: "Salary Payment", amount: 1800000, date: "2024-01-06", bank: "GTBank" },
    { id: 3, type: "credit", description: "Invoice #INV-2024-001", amount: 450000, date: "2024-01-06", bank: "First Bank" },
    { id: 4, type: "debit", description: "Office Rent", amount: 400000, date: "2024-01-05", bank: "GTBank" },
    { id: 5, type: "credit", description: "Payment from Client B", amount: 1200000, date: "2024-01-05", bank: "Zenith Bank" },
  ];

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalNGNBalance = bankAccounts
    .filter(a => a.currency === "NGN")
    .reduce((sum, a) => sum + a.balance, 0);

  return (
    <SidebarLayout moduleId="accounting">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Bank Management</h1>
            <p className="text-muted-foreground mt-1">Manage bank accounts and transactions</p>
          </div>
          <Dialog open={isAddBankOpen} onOpenChange={setIsAddBankOpen}>
            <DialogTrigger asChild>
              <Button
                className="text-white shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Bank Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Bank Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-bank">First Bank of Nigeria</SelectItem>
                      <SelectItem value="gtbank">GTBank</SelectItem>
                      <SelectItem value="access-bank">Access Bank</SelectItem>
                      <SelectItem value="zenith-bank">Zenith Bank</SelectItem>
                      <SelectItem value="uba">UBA</SelectItem>
                      <SelectItem value="stanbic">Stanbic IBTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input id="accountName" placeholder="Enter account name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" placeholder="Enter 10-digit account number" maxLength={10} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
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
                  <Label htmlFor="currency">Currency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddBankOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddBank}
                  className="text-white"
                  style={{ backgroundColor: moduleColor }}
                >
                  Add Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total NGN Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalNGNBalance)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{bankAccounts.length}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reconciliation</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-yellow-600">2</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">USD Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(25000, "USD")}</span>
            </CardContent>
          </Card>
        </div>

        {/* Bank Accounts */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Bank Accounts</CardTitle>
                <CardDescription>Connected bank accounts for this company</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search accounts..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Last Reconciled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${moduleColor}20` }}
                        >
                          <Landmark className="w-5 h-5" style={{ color: moduleColor }} />
                        </div>
                        <div>
                          <p className="font-medium">{account.bankName}</p>
                          <p className="text-sm text-muted-foreground">{account.accountName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{account.accountNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{account.accountType}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(account.balance, account.currency)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{account.lastReconciled}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{account.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Transactions</DropdownMenuItem>
                          <DropdownMenuItem>Reconcile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Account</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Latest bank transactions across all accounts</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="text-muted-foreground">{txn.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {txn.type === "credit" ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-500" />
                        )}
                        {txn.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {txn.bank}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                      {txn.type === "credit" ? "+" : "-"}{formatCurrency(txn.amount)}
                    </TableCell>
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
