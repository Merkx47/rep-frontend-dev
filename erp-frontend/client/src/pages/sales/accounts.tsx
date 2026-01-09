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
import { Plus, Search, Filter } from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function SalesAccountsPage() {
  const moduleColor = getModuleColor("sales");
  const accounts = [
    { code: "4000", name: "Sales Revenue", type: "Revenue", balance: 15800000, status: "Active" },
    { code: "4100", name: "Product Sales", type: "Revenue", balance: 12500000, status: "Active" },
    { code: "4200", name: "Service Revenue", type: "Revenue", balance: 3300000, status: "Active" },
    { code: "4300", name: "Sales Returns", type: "Contra Revenue", balance: -450000, status: "Active" },
    { code: "4400", name: "Sales Discounts", type: "Contra Revenue", balance: -280000, status: "Active" },
    { code: "1200", name: "Accounts Receivable", type: "Asset", balance: 4200000, status: "Active" },
    { code: "1210", name: "Allowance for Doubtful Accounts", type: "Contra Asset", balance: -150000, status: "Active" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Chart of Accounts</h1>
            <p className="text-muted-foreground mt-1">Sales-related accounts and ledgers</p>
          </div>
          <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(15800000)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{formatCurrency(15070000)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Receivables</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(4200000)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{accounts.length}</span>
            </CardContent>
          </Card>
        </div>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Sales Accounts</CardTitle>
                <CardDescription>All accounts related to sales operations</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search accounts..." className="pl-9" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.code} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono font-medium">{account.code}</TableCell>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{account.type}</Badge>
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${account.balance < 0 ? "text-red-600" : ""}`}>
                      {formatCurrency(account.balance)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{account.status}</Badge>
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
