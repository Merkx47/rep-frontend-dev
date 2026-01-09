import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Landmark, ArrowUpRight, ArrowDownLeft, RefreshCw, CreditCard, Link2 } from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function SalesBankPage() {
  const moduleColor = getModuleColor("sales");
  const [isLinkBankOpen, setIsLinkBankOpen] = useState(false);
  const { toast } = useToast();

  const handleLinkBank = () => {
    toast({
      title: "Bank Account Linked",
      description: "Bank account has been linked to sales module.",
    });
    setIsLinkBankOpen(false);
  };
  const linkedAccounts = [
    {
      id: 1,
      bankName: "First Bank of Nigeria",
      accountNumber: "2012345678",
      purpose: "Sales Receipts",
      balance: 8500000,
      lastDeposit: "2024-01-07",
      status: "Primary",
    },
    {
      id: 2,
      bankName: "GTBank",
      accountNumber: "0234567890",
      purpose: "Customer Payments",
      balance: 4200000,
      lastDeposit: "2024-01-06",
      status: "Active",
    },
  ];

  const recentPayments = [
    { id: 1, customer: "ABC Industries", invoice: "INV-2024-045", amount: 850000, date: "2024-01-07", method: "Bank Transfer", bank: "First Bank" },
    { id: 2, customer: "XYZ Limited", invoice: "INV-2024-044", amount: 1200000, date: "2024-01-06", method: "Bank Transfer", bank: "GTBank" },
    { id: 3, customer: "Tech Solutions", invoice: "INV-2024-043", amount: 450000, date: "2024-01-06", method: "Card Payment", bank: "First Bank" },
    { id: 4, customer: "Global Traders", invoice: "INV-2024-042", amount: 2500000, date: "2024-01-05", method: "Bank Transfer", bank: "First Bank" },
    { id: 5, customer: "Metro Services", invoice: "INV-2024-041", amount: 380000, date: "2024-01-05", method: "Card Payment", bank: "GTBank" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalCollections = recentPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Bank Management</h1>
            <p className="text-muted-foreground mt-1">Sales collections and payment tracking</p>
          </div>
          <Dialog open={isLinkBankOpen} onOpenChange={setIsLinkBankOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Link2 className="w-4 h-4 mr-2" />
                Link Bank Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Link Bank Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Select Bank Account</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose from existing accounts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-bank-2012345678">First Bank - 2012345678</SelectItem>
                      <SelectItem value="gtbank-0234567890">GTBank - 0234567890</SelectItem>
                      <SelectItem value="access-bank-1234567890">Access Bank - 1234567890</SelectItem>
                      <SelectItem value="zenith-bank-1098765432">Zenith Bank - 1098765432</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales-receipts">Sales Receipts</SelectItem>
                      <SelectItem value="customer-payments">Customer Payments</SelectItem>
                      <SelectItem value="refunds">Refunds</SelectItem>
                      <SelectItem value="collections">Collections</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary Account</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsLinkBankOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleLinkBank}
                  className="text-white"
                  style={{ backgroundColor: moduleColor }}
                >
                  Link Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Collections (MTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalCollections)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-yellow-600">{formatCurrency(850000)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Bank Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{recentPayments.filter(p => p.method === "Bank Transfer").length}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Card Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{recentPayments.filter(p => p.method === "Card Payment").length}</span>
            </CardContent>
          </Card>
        </div>

        {/* Linked Bank Accounts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Linked Bank Accounts</CardTitle>
                <CardDescription>Bank accounts for receiving sales payments</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Balances
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {linkedAccounts.map((account) => (
                <Card key={account.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${moduleColor}20` }}
                        >
                          <Landmark className="w-6 h-6" style={{ color: moduleColor }} />
                        </div>
                        <div>
                          <p className="font-semibold">{account.bankName}</p>
                          <p className="text-sm text-muted-foreground font-mono">{account.accountNumber}</p>
                        </div>
                      </div>
                      <Badge className={account.status === "Primary" ? "bg-blue-500" : "bg-green-500"}>
                        {account.status}
                      </Badge>
                    </div>
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Purpose</span>
                        <span className="text-sm font-medium">{account.purpose}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Balance</span>
                        <span className="text-sm font-semibold text-green-600">{formatCurrency(account.balance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Deposit</span>
                        <span className="text-sm">{account.lastDeposit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Payment Collections</CardTitle>
            <CardDescription>Customer payments received this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                    <TableCell className="font-medium">{payment.customer}</TableCell>
                    <TableCell className="font-mono text-sm">{payment.invoice}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payment.method === "Bank Transfer" ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-500" />
                        ) : (
                          <CreditCard className="w-4 h-4 text-blue-500" />
                        )}
                        {payment.method}
                      </div>
                    </TableCell>
                    <TableCell>{payment.bank}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      +{formatCurrency(payment.amount)}
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
