import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Download, Printer, TrendingUp, TrendingDown, Calendar, FileText, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useChartOfAccounts, useJournals } from "@/hooks/use-accounting";
import { getModuleColor } from "@/contexts/module-context";
import type { ChartOfAccount, Journal } from "@shared/schema";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProfitLossPage() {
  const moduleColor = getModuleColor("accounting");
  const { data: accounts = [], isLoading: loadingAccounts } = useChartOfAccounts();
  const { data: journals = [], isLoading: loadingJournals } = useJournals();
  const [period, setPeriod] = useState("this-month");

  // Get revenue accounts (type = revenue or income)
  const revenueAccounts = accounts.filter(
    (a: ChartOfAccount) => a.type === "revenue" || a.type === "income"
  );

  // Get expense accounts (type = expense)
  const expenseAccounts = accounts.filter((a: ChartOfAccount) => a.type === "expense");

  // Calculate balances from posted journals (simplified - in production would aggregate journal lines)
  // For now, use opening balances as a starting point
  const revenueItems = revenueAccounts.map((account: ChartOfAccount) => ({
    account: account.name,
    code: account.code,
    amount: parseFloat(account.openingBalance?.toString() || "0"),
  }));

  const expenseItems = expenseAccounts.map((account: ChartOfAccount) => ({
    account: account.name,
    code: account.code,
    amount: parseFloat(account.openingBalance?.toString() || "0"),
  }));

  // If no real data, use mock data for demonstration
  const defaultRevenueItems = [
    { account: "Sales Revenue", code: "4000", amount: 12500000 },
    { account: "Service Revenue", code: "4100", amount: 3200000 },
    { account: "Interest Income", code: "4200", amount: 85000 },
    { account: "Other Income", code: "4900", amount: 150000 },
  ];

  const defaultExpenseItems = [
    { account: "Cost of Goods Sold", code: "5000", amount: 6800000 },
    { account: "Salaries & Wages", code: "5100", amount: 2400000 },
    { account: "Rent Expense", code: "5200", amount: 480000 },
    { account: "Utilities", code: "5300", amount: 120000 },
    { account: "Marketing & Advertising", code: "5400", amount: 350000 },
    { account: "Depreciation", code: "5500", amount: 180000 },
    { account: "Insurance", code: "5600", amount: 95000 },
    { account: "Office Supplies", code: "5700", amount: 45000 },
  ];

  const displayRevenueItems = revenueItems.length > 0 && revenueItems.some(r => r.amount !== 0) ? revenueItems : defaultRevenueItems;
  const displayExpenseItems = expenseItems.length > 0 && expenseItems.some(e => e.amount !== 0) ? expenseItems : defaultExpenseItems;

  const totalRevenue = displayRevenueItems.reduce((sum, item) => sum + item.amount, 0);
  const totalExpenses = displayExpenseItems.reduce((sum, item) => sum + item.amount, 0);
  const grossProfit = displayRevenueItems.filter(r => r.code?.startsWith("4") && !r.code?.startsWith("49")).reduce((sum, r) => sum + r.amount, 0) -
    displayExpenseItems.filter(e => e.code?.startsWith("50")).reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : "0";

  const isLoading = loadingAccounts || loadingJournals;

  return (
    <SidebarLayout moduleId="accounting">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Profit & Loss Statement</h1>
            <p className="text-muted-foreground mt-1">Income statement for the selected period</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-quarter">This Quarter</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
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
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Gross Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{formatCurrency(grossProfit)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Profit Margin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className={`text-2xl font-bold ${parseFloat(profitMargin) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {profitMargin}%
              </span>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading financial data...
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Revenue Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Revenue</CardTitle>
                <CardDescription>Income from operations and other sources</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayRevenueItems.map((item) => (
                      <TableRow key={item.code}>
                        <TableCell className="font-mono text-sm text-muted-foreground">{item.code}</TableCell>
                        <TableCell>{item.account}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-green-50/50 dark:bg-green-950/20">
                      <TableCell></TableCell>
                      <TableCell>Total Revenue</TableCell>
                      <TableCell className="text-right text-green-600">{formatCurrency(totalRevenue)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Expenses Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-600">Expenses</CardTitle>
                <CardDescription>Operating expenses and costs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayExpenseItems.map((item) => (
                      <TableRow key={item.code}>
                        <TableCell className="font-mono text-sm text-muted-foreground">{item.code}</TableCell>
                        <TableCell>{item.account}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-red-50/50 dark:bg-red-950/20">
                      <TableCell></TableCell>
                      <TableCell>Total Expenses</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(totalExpenses)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Net Income */}
            <Card className={netIncome >= 0 ? "border-green-200 bg-green-50/50 dark:bg-green-950/20" : "border-red-200 bg-red-50/50 dark:bg-red-950/20"}>
              <CardContent className="py-6">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xl font-bold">Net Income</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {netIncome >= 0 ? "Profit" : "Loss"} for the period
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-3xl font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(Math.abs(netIncome))}
                    </span>
                    {netIncome < 0 && (
                      <p className="text-sm text-red-600">(Loss)</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </SidebarLayout>
  );
}
