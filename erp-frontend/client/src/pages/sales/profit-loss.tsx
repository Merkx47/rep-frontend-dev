import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Printer, TrendingUp, TrendingDown, Calendar } from "lucide-react";

export default function SalesProfitLossPage() {
  const revenueItems = [
    { account: "Product Sales", amount: 12500000 },
    { account: "Service Revenue", amount: 3300000 },
    { account: "Commission Income", amount: 180000 },
  ];

  const deductions = [
    { account: "Sales Returns", amount: 450000 },
    { account: "Sales Discounts", amount: 280000 },
    { account: "Allowances", amount: 50000 },
  ];

  const costOfSales = [
    { account: "Cost of Goods Sold", amount: 6200000 },
    { account: "Direct Labor", amount: 850000 },
    { account: "Shipping & Handling", amount: 320000 },
  ];

  const operatingExpenses = [
    { account: "Sales Commissions", amount: 480000 },
    { account: "Marketing Expenses", amount: 350000 },
    { account: "Customer Support", amount: 180000 },
  ];

  const grossRevenue = revenueItems.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
  const netRevenue = grossRevenue - totalDeductions;
  const totalCostOfSales = costOfSales.reduce((sum, item) => sum + item.amount, 0);
  const grossProfit = netRevenue - totalCostOfSales;
  const totalOperatingExpenses = operatingExpenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = grossProfit - totalOperatingExpenses;

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
            <h1 className="text-3xl font-display font-bold tracking-tight">Sales Profit & Loss</h1>
            <p className="text-muted-foreground mt-1">Sales performance and profitability report</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="this-month">
              <SelectTrigger className="w-[180px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Printer className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gross Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(grossRevenue)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{formatCurrency(netRevenue)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Gross Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{formatCurrency(grossProfit)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {netProfit >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <span className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(netProfit)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueItems.map((item) => (
                  <TableRow key={item.account}>
                    <TableCell>{item.account}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Gross Revenue</TableCell>
                  <TableCell className="text-right text-blue-600">{formatCurrency(grossRevenue)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Deductions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Less: Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deductions.map((item) => (
                  <TableRow key={item.account}>
                    <TableCell>{item.account}</TableCell>
                    <TableCell className="text-right text-red-600">({formatCurrency(item.amount)})</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Net Revenue</TableCell>
                  <TableCell className="text-right">{formatCurrency(netRevenue)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Cost of Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Less: Cost of Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costOfSales.map((item) => (
                  <TableRow key={item.account}>
                    <TableCell>{item.account}</TableCell>
                    <TableCell className="text-right text-red-600">({formatCurrency(item.amount)})</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Gross Profit</TableCell>
                  <TableCell className="text-right text-green-600">{formatCurrency(grossProfit)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Operating Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Less: Operating Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operatingExpenses.map((item) => (
                  <TableRow key={item.account}>
                    <TableCell>{item.account}</TableCell>
                    <TableCell className="text-right text-red-600">({formatCurrency(item.amount)})</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Total Operating Expenses</TableCell>
                  <TableCell className="text-right text-red-600">({formatCurrency(totalOperatingExpenses)})</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card className={netProfit >= 0 ? "border-green-200 bg-green-50/50 dark:bg-green-950/20" : "border-red-200 bg-red-50/50 dark:bg-red-950/20"}>
          <CardContent className="py-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Net Sales Profit</span>
              <span className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(netProfit)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
