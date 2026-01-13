import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getModuleColor } from "@/contexts/module-context";

// Mock data for financial reports
const balanceSheetData = {
  assets: [
    { category: "Current Assets", items: [
      { name: "Cash and Cash Equivalents", amount: 125000 },
      { name: "Accounts Receivable", amount: 85000 },
      { name: "Inventory", amount: 250000 },
      { name: "Prepaid Expenses", amount: 15000 },
    ]},
    { category: "Non-Current Assets", items: [
      { name: "Property, Plant & Equipment", amount: 500000 },
      { name: "Less: Accumulated Depreciation", amount: -75000 },
      { name: "Intangible Assets", amount: 50000 },
    ]},
  ],
  liabilities: [
    { category: "Current Liabilities", items: [
      { name: "Accounts Payable", amount: 45000 },
      { name: "Accrued Expenses", amount: 12000 },
      { name: "Short-term Loans", amount: 100000 },
    ]},
    { category: "Non-Current Liabilities", items: [
      { name: "Long-term Debt", amount: 200000 },
    ]},
  ],
  equity: [
    { name: "Share Capital", amount: 500000 },
    { name: "Retained Earnings", amount: 93000 },
  ],
};

const incomeStatementData = {
  revenue: [
    { name: "Sales Revenue", amount: 750000 },
    { name: "Service Revenue", amount: 125000 },
    { name: "Other Income", amount: 15000 },
  ],
  expenses: [
    { name: "Cost of Goods Sold", amount: 350000 },
    { name: "Salaries & Wages", amount: 180000 },
    { name: "Rent Expense", amount: 36000 },
    { name: "Utilities", amount: 12000 },
    { name: "Depreciation", amount: 25000 },
    { name: "Marketing", amount: 45000 },
    { name: "Administrative", amount: 35000 },
  ],
};

const cashFlowData = {
  operating: [
    { name: "Net Income", amount: 207000 },
    { name: "Depreciation", amount: 25000 },
    { name: "Changes in Accounts Receivable", amount: -15000 },
    { name: "Changes in Inventory", amount: -30000 },
    { name: "Changes in Accounts Payable", amount: 10000 },
  ],
  investing: [
    { name: "Purchase of Equipment", amount: -75000 },
    { name: "Sale of Investments", amount: 20000 },
  ],
  financing: [
    { name: "Loan Repayment", amount: -50000 },
    { name: "Dividends Paid", amount: -25000 },
  ],
};

const reportTypes = [
  { id: "balance-sheet", name: "Balance Sheet", icon: PieChart, description: "Assets, liabilities, and equity snapshot" },
  { id: "income-statement", name: "Income Statement", icon: BarChart3, description: "Revenue and expenses summary" },
  { id: "cash-flow", name: "Cash Flow Statement", icon: DollarSign, description: "Cash inflows and outflows" },
  { id: "trial-balance", name: "Trial Balance", icon: FileText, description: "All account balances" },
  { id: "general-ledger", name: "General Ledger", icon: FileText, description: "Detailed transaction history" },
  { id: "aging-report", name: "Aging Report", icon: Calendar, description: "Receivables and payables aging" },
];

export default function FinancialReportsPage() {
  const moduleColor = getModuleColor("accounting");
  const totalAssets = balanceSheetData.assets.flatMap(c => c.items).reduce((sum, i) => sum + i.amount, 0);
  const totalLiabilities = balanceSheetData.liabilities.flatMap(c => c.items).reduce((sum, i) => sum + i.amount, 0);
  const totalEquity = balanceSheetData.equity.reduce((sum, i) => sum + i.amount, 0);
  const totalRevenue = incomeStatementData.revenue.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = incomeStatementData.expenses.reduce((sum, i) => sum + i.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  return (
    <SidebarLayout moduleId="accounting">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Financial Reports</h2>
            <p className="text-muted-foreground mt-1">
              Generate and analyze your organization's financial statements.
            </p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="2024-01">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-01">January 2024</SelectItem>
                <SelectItem value="2024-Q1">Q1 2024</SelectItem>
                <SelectItem value="2023">FY 2023</SelectItem>
                <SelectItem value="2024">FY 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAssets.toLocaleString()}</div>
              <div className="flex items-center text-xs text-emerald-600 mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8.2% from last period
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalLiabilities.toLocaleString()}</div>
              <div className="flex items-center text-xs text-red-600 mt-1">
                <TrendingDown className="w-3 h-3 mr-1" />
                -3.5% from last period
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Equity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEquity.toLocaleString()}</div>
              <div className="flex items-center text-xs text-emerald-600 mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.1% from last period
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">${netIncome.toLocaleString()}</div>
              <div className="flex items-center text-xs text-emerald-600 mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15.3% from last period
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Types */}
        <div className="grid gap-4 md:grid-cols-3">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.id} className="border-border/60 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{report.name}</CardTitle>
                      <CardDescription className="text-xs">{report.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" className="w-full">
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Balance Sheet Preview */}
        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Balance Sheet</CardTitle>
                <CardDescription>As of January 31, 2024</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Assets */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Assets</h3>
                <Table>
                  <TableBody>
                    {balanceSheetData.assets.map((category, idx) => (
                      <>
                        <TableRow key={`cat-${idx}`} className="bg-muted/30">
                          <TableCell colSpan={2} className="font-semibold">
                            {category.category}
                          </TableCell>
                        </TableRow>
                        {category.items.map((item, itemIdx) => (
                          <TableRow key={`item-${idx}-${itemIdx}`}>
                            <TableCell className="pl-6">{item.name}</TableCell>
                            <TableCell className="text-right font-mono">
                              ${item.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))}
                    <TableRow className="border-t-2 font-bold">
                      <TableCell>Total Assets</TableCell>
                      <TableCell className="text-right font-mono">
                        ${totalAssets.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Liabilities & Equity */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Liabilities & Equity</h3>
                <Table>
                  <TableBody>
                    {balanceSheetData.liabilities.map((category, idx) => (
                      <>
                        <TableRow key={`liab-cat-${idx}`} className="bg-muted/30">
                          <TableCell colSpan={2} className="font-semibold">
                            {category.category}
                          </TableCell>
                        </TableRow>
                        {category.items.map((item, itemIdx) => (
                          <TableRow key={`liab-item-${idx}-${itemIdx}`}>
                            <TableCell className="pl-6">{item.name}</TableCell>
                            <TableCell className="text-right font-mono">
                              ${item.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    ))}
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={2} className="font-semibold">Equity</TableCell>
                    </TableRow>
                    {balanceSheetData.equity.map((item, idx) => (
                      <TableRow key={`equity-${idx}`}>
                        <TableCell className="pl-6">{item.name}</TableCell>
                        <TableCell className="text-right font-mono">
                          ${item.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 font-bold">
                      <TableCell>Total Liabilities & Equity</TableCell>
                      <TableCell className="text-right font-mono">
                        ${(totalLiabilities + totalEquity).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Statement Preview */}
        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Income Statement</CardTitle>
                <CardDescription>For the period ending January 31, 2024</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={2} className="font-semibold">Revenue</TableCell>
                </TableRow>
                {incomeStatementData.revenue.map((item, idx) => (
                  <TableRow key={`rev-${idx}`}>
                    <TableCell className="pl-6">{item.name}</TableCell>
                    <TableCell className="text-right font-mono text-emerald-600">
                      ${item.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-medium border-t">
                  <TableCell>Total Revenue</TableCell>
                  <TableCell className="text-right font-mono text-emerald-600">
                    ${totalRevenue.toLocaleString()}
                  </TableCell>
                </TableRow>
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={2} className="font-semibold">Expenses</TableCell>
                </TableRow>
                {incomeStatementData.expenses.map((item, idx) => (
                  <TableRow key={`exp-${idx}`}>
                    <TableCell className="pl-6">{item.name}</TableCell>
                    <TableCell className="text-right font-mono text-red-600">
                      (${item.amount.toLocaleString()})
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-medium border-t">
                  <TableCell>Total Expenses</TableCell>
                  <TableCell className="text-right font-mono text-red-600">
                    (${totalExpenses.toLocaleString()})
                  </TableCell>
                </TableRow>
                <TableRow className="border-t-2 font-bold text-lg">
                  <TableCell>Net Income</TableCell>
                  <TableCell className={`text-right font-mono ${netIncome >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ${netIncome.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
