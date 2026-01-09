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
import { Download, Printer, Calendar } from "lucide-react";

export default function SalesBalanceSheetPage() {
  const currentAssets = [
    { account: "Accounts Receivable", amount: 4200000 },
    { account: "Allowance for Doubtful Accounts", amount: -150000 },
    { account: "Inventory - Finished Goods", amount: 2800000 },
    { account: "Prepaid Sales Expenses", amount: 120000 },
  ];

  const currentLiabilities = [
    { account: "Customer Deposits", amount: 850000 },
    { account: "Deferred Revenue", amount: 320000 },
    { account: "Sales Tax Payable", amount: 180000 },
    { account: "Accrued Commissions", amount: 95000 },
  ];

  const totalCurrentAssets = currentAssets.reduce((sum, item) => sum + item.amount, 0);
  const totalCurrentLiabilities = currentLiabilities.reduce((sum, item) => sum + item.amount, 0);
  const workingCapital = totalCurrentAssets - totalCurrentLiabilities;

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
            <h1 className="text-3xl font-display font-bold tracking-tight">Sales Balance Sheet</h1>
            <p className="text-muted-foreground mt-1">Sales-related assets and liabilities</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="today">
              <SelectTrigger className="w-[180px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="As of date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">As of Today</SelectItem>
                <SelectItem value="month-end">End of Month</SelectItem>
                <SelectItem value="quarter-end">End of Quarter</SelectItem>
                <SelectItem value="year-end">End of Year</SelectItem>
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
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sales Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalCurrentAssets)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sales Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-orange-600">{formatCurrency(totalCurrentLiabilities)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Working Capital</CardTitle>
            </CardHeader>
            <CardContent>
              <span className={`text-2xl font-bold ${workingCapital >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(workingCapital)}
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Assets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sales-Related Assets</CardTitle>
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
                  {currentAssets.map((item) => (
                    <TableRow key={item.account}>
                      <TableCell>{item.account}</TableCell>
                      <TableCell className={`text-right ${item.amount < 0 ? "text-red-600" : ""}`}>
                        {formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>Total Sales Assets</TableCell>
                    <TableCell className="text-right text-blue-600">{formatCurrency(totalCurrentAssets)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Liabilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sales-Related Liabilities</CardTitle>
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
                  {currentLiabilities.map((item) => (
                    <TableRow key={item.account}>
                      <TableCell>{item.account}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell>Total Sales Liabilities</TableCell>
                    <TableCell className="text-right text-orange-600">{formatCurrency(totalCurrentLiabilities)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Working Capital */}
        <Card className={workingCapital >= 0 ? "border-green-200 bg-green-50/50 dark:bg-green-950/20" : "border-red-200 bg-red-50/50 dark:bg-red-950/20"}>
          <CardContent className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xl font-bold">Net Working Capital</span>
                <p className="text-sm text-muted-foreground">Sales Assets - Sales Liabilities</p>
              </div>
              <span className={`text-2xl font-bold ${workingCapital >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(workingCapital)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
