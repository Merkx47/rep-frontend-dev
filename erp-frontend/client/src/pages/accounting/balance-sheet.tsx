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
import { Download, Printer, Calendar, Scale, Building2, CreditCard, Landmark } from "lucide-react";
import { useState } from "react";
import { useChartOfAccounts } from "@/hooks/use-accounting";
import type { ChartOfAccount } from "@shared/schema";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function BalanceSheetPage() {
  const { data: accounts = [], isLoading } = useChartOfAccounts();
  const [asOfDate, setAsOfDate] = useState("today");

  // Get asset accounts
  const assetAccounts = accounts.filter((a: ChartOfAccount) => a.type === "asset");
  const currentAssetCodes = ["1000", "1001", "1002", "1100", "1200", "1300"];
  const currentAssets = assetAccounts.filter((a: ChartOfAccount) =>
    currentAssetCodes.some((code) => a.code?.startsWith(code.substring(0, 2)))
  );
  const nonCurrentAssets = assetAccounts.filter(
    (a: ChartOfAccount) => !currentAssetCodes.some((code) => a.code?.startsWith(code.substring(0, 2)))
  );

  // Get liability accounts
  const liabilityAccounts = accounts.filter((a: ChartOfAccount) => a.type === "liability");
  const currentLiabilityCodes = ["2000", "2100", "2200"];
  const currentLiabilities = liabilityAccounts.filter((a: ChartOfAccount) =>
    currentLiabilityCodes.some((code) => a.code?.startsWith(code.substring(0, 2)))
  );
  const nonCurrentLiabilities = liabilityAccounts.filter(
    (a: ChartOfAccount) => !currentLiabilityCodes.some((code) => a.code?.startsWith(code.substring(0, 2)))
  );

  // Get equity accounts
  const equityAccounts = accounts.filter((a: ChartOfAccount) => a.type === "equity");

  // Default data for demonstration
  const defaultAssets = {
    current: [
      { account: "Cash & Bank", code: "1000", amount: 8500000 },
      { account: "Accounts Receivable", code: "1100", amount: 4200000 },
      { account: "Inventory", code: "1200", amount: 3800000 },
      { account: "Prepaid Expenses", code: "1300", amount: 280000 },
    ],
    nonCurrent: [
      { account: "Property & Equipment", code: "1500", amount: 12000000 },
      { account: "Less: Accumulated Depreciation", code: "1510", amount: -2400000 },
      { account: "Intangible Assets", code: "1600", amount: 1500000 },
      { account: "Long-term Investments", code: "1700", amount: 2000000 },
    ],
  };

  const defaultLiabilities = {
    current: [
      { account: "Accounts Payable", code: "2000", amount: 2800000 },
      { account: "Accrued Expenses", code: "2100", amount: 450000 },
      { account: "Short-term Loans", code: "2200", amount: 1200000 },
      { account: "Tax Payable", code: "2300", amount: 380000 },
    ],
    nonCurrent: [
      { account: "Long-term Debt", code: "2500", amount: 5000000 },
      { account: "Deferred Tax Liability", code: "2600", amount: 320000 },
    ],
  };

  const defaultEquity = [
    { account: "Share Capital", code: "3000", amount: 10000000 },
    { account: "Retained Earnings", code: "3100", amount: 8730000 },
    { account: "Current Year Earnings", code: "3200", amount: 1000000 },
  ];

  // Use real data if available, otherwise use defaults
  const hasRealData =
    currentAssets.length > 0 || nonCurrentAssets.length > 0 || currentLiabilities.length > 0;

  const displayCurrentAssets = hasRealData
    ? currentAssets.map((a: ChartOfAccount) => ({
        account: a.name,
        code: a.code,
        amount: parseFloat(a.openingBalance?.toString() || "0"),
      }))
    : defaultAssets.current;

  const displayNonCurrentAssets = hasRealData
    ? nonCurrentAssets.map((a: ChartOfAccount) => ({
        account: a.name,
        code: a.code,
        amount: parseFloat(a.openingBalance?.toString() || "0"),
      }))
    : defaultAssets.nonCurrent;

  const displayCurrentLiabilities = hasRealData
    ? currentLiabilities.map((a: ChartOfAccount) => ({
        account: a.name,
        code: a.code,
        amount: parseFloat(a.openingBalance?.toString() || "0"),
      }))
    : defaultLiabilities.current;

  const displayNonCurrentLiabilities = hasRealData
    ? nonCurrentLiabilities.map((a: ChartOfAccount) => ({
        account: a.name,
        code: a.code,
        amount: parseFloat(a.openingBalance?.toString() || "0"),
      }))
    : defaultLiabilities.nonCurrent;

  const displayEquity = hasRealData
    ? equityAccounts.map((a: ChartOfAccount) => ({
        account: a.name,
        code: a.code,
        amount: parseFloat(a.openingBalance?.toString() || "0"),
      }))
    : defaultEquity;

  const totalCurrentAssets = displayCurrentAssets.reduce((sum, item) => sum + item.amount, 0);
  const totalNonCurrentAssets = displayNonCurrentAssets.reduce((sum, item) => sum + item.amount, 0);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = displayCurrentLiabilities.reduce((sum, item) => sum + item.amount, 0);
  const totalNonCurrentLiabilities = displayNonCurrentLiabilities.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  const totalEquity = displayEquity.reduce((sum, item) => sum + item.amount, 0);
  const isBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;

  // Financial ratios
  const currentRatio = totalCurrentLiabilities > 0 ? (totalCurrentAssets / totalCurrentLiabilities).toFixed(2) : "N/A";
  const debtToEquity = totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : "N/A";

  return (
    <SidebarLayout moduleId="accounting">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Balance Sheet</h1>
            <p className="text-muted-foreground mt-1">Statement of financial position</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={asOfDate} onValueChange={setAsOfDate}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="As of date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">As of Today</SelectItem>
                <SelectItem value="month-end">End of Month</SelectItem>
                <SelectItem value="quarter-end">End of Quarter</SelectItem>
                <SelectItem value="year-end">End of Year</SelectItem>
                <SelectItem value="custom">Custom Date</SelectItem>
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
                <Building2 className="w-4 h-4 text-blue-500" />
                Total Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-blue-600">{formatCurrency(totalAssets)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-500" />
                Total Liabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-orange-600">{formatCurrency(totalLiabilities)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Landmark className="w-4 h-4 text-green-500" />
                Total Equity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(totalEquity)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Ratio</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{currentRatio}</span>
              <p className="text-xs text-muted-foreground">Debt/Equity: {debtToEquity}</p>
            </CardContent>
          </Card>
        </div>

        {/* Balance Check */}
        <Card
          className={
            isBalanced
              ? "border-green-200 bg-green-50/50 dark:bg-green-950/20"
              : "border-red-200 bg-red-50/50 dark:bg-red-950/20"
          }
        >
          <CardContent className="py-4">
            <div className="flex items-center gap-2">
              <Scale
                className={`w-5 h-5 ${isBalanced ? "text-green-600" : "text-red-600"}`}
              />
              <span className="font-medium">
                {isBalanced
                  ? "Balance Sheet is balanced"
                  : `Imbalance: ${formatCurrency(Math.abs(totalAssets - (totalLiabilities + totalEquity)))}`}
              </span>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading financial data...
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Assets */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Current Assets</CardTitle>
                  <CardDescription>Assets expected to be converted to cash within one year</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayCurrentAssets.map((item) => (
                        <TableRow key={item.code}>
                          <TableCell className="font-mono text-sm text-muted-foreground">{item.code}</TableCell>
                          <TableCell>{item.account}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-blue-50/50 dark:bg-blue-950/20">
                        <TableCell></TableCell>
                        <TableCell>Total Current Assets</TableCell>
                        <TableCell className="text-right text-blue-600">{formatCurrency(totalCurrentAssets)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Non-Current Assets</CardTitle>
                  <CardDescription>Long-term assets and investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayNonCurrentAssets.map((item) => (
                        <TableRow key={item.code}>
                          <TableCell className="font-mono text-sm text-muted-foreground">{item.code}</TableCell>
                          <TableCell>{item.account}</TableCell>
                          <TableCell className={`text-right font-medium ${item.amount < 0 ? "text-red-600" : ""}`}>
                            {formatCurrency(item.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-blue-50/50 dark:bg-blue-950/20">
                        <TableCell></TableCell>
                        <TableCell>Total Non-Current Assets</TableCell>
                        <TableCell className="text-right text-blue-600">{formatCurrency(totalNonCurrentAssets)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total Assets</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(totalAssets)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liabilities & Equity */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-orange-600">Current Liabilities</CardTitle>
                  <CardDescription>Obligations due within one year</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayCurrentLiabilities.map((item) => (
                        <TableRow key={item.code}>
                          <TableCell className="font-mono text-sm text-muted-foreground">{item.code}</TableCell>
                          <TableCell>{item.account}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-orange-50/50 dark:bg-orange-950/20">
                        <TableCell></TableCell>
                        <TableCell>Total Current Liabilities</TableCell>
                        <TableCell className="text-right text-orange-600">{formatCurrency(totalCurrentLiabilities)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-orange-600">Non-Current Liabilities</CardTitle>
                  <CardDescription>Long-term obligations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayNonCurrentLiabilities.map((item) => (
                        <TableRow key={item.code}>
                          <TableCell className="font-mono text-sm text-muted-foreground">{item.code}</TableCell>
                          <TableCell>{item.account}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-orange-50/50 dark:bg-orange-950/20">
                        <TableCell></TableCell>
                        <TableCell>Total Non-Current Liabilities</TableCell>
                        <TableCell className="text-right text-orange-600">{formatCurrency(totalNonCurrentLiabilities)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">Equity</CardTitle>
                  <CardDescription>Owner's stake in the business</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayEquity.map((item) => (
                        <TableRow key={item.code}>
                          <TableCell className="font-mono text-sm text-muted-foreground">{item.code}</TableCell>
                          <TableCell>{item.account}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-green-50/50 dark:bg-green-950/20">
                        <TableCell></TableCell>
                        <TableCell>Total Equity</TableCell>
                        <TableCell className="text-right text-green-600">{formatCurrency(totalEquity)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="py-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total Liabilities & Equity</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(totalLiabilities + totalEquity)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
