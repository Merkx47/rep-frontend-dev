import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useTablePagination } from "@/hooks/use-table-pagination";

// Mock data for chart of accounts
const mockAccounts = [
  { id: 1, code: "1000", name: "Cash", type: "asset", balance: 125000.00, status: "active", parent: null },
  { id: 2, code: "1001", name: "Cash in Hand", type: "asset", balance: 25000.00, status: "active", parent: "1000" },
  { id: 3, code: "1002", name: "Cash at Bank", type: "asset", balance: 100000.00, status: "active", parent: "1000" },
  { id: 4, code: "1100", name: "Accounts Receivable", type: "asset", balance: 85000.00, status: "active", parent: null },
  { id: 5, code: "1200", name: "Inventory", type: "asset", balance: 250000.00, status: "active", parent: null },
  { id: 6, code: "1300", name: "Prepaid Expenses", type: "asset", balance: 15000.00, status: "active", parent: null },
  { id: 7, code: "1500", name: "Fixed Assets", type: "asset", balance: 500000.00, status: "active", parent: null },
  { id: 8, code: "2000", name: "Accounts Payable", type: "liability", balance: 45000.00, status: "active", parent: null },
  { id: 9, code: "2100", name: "Accrued Expenses", type: "liability", balance: 12000.00, status: "active", parent: null },
  { id: 10, code: "2200", name: "Short-term Loans", type: "liability", balance: 100000.00, status: "active", parent: null },
  { id: 11, code: "3000", name: "Share Capital", type: "equity", balance: 500000.00, status: "active", parent: null },
  { id: 12, code: "3100", name: "Retained Earnings", type: "equity", balance: 150000.00, status: "active", parent: null },
  { id: 13, code: "4000", name: "Sales Revenue", type: "revenue", balance: 750000.00, status: "active", parent: null },
  { id: 14, code: "4100", name: "Service Revenue", type: "revenue", balance: 125000.00, status: "active", parent: null },
  { id: 15, code: "5000", name: "Cost of Goods Sold", type: "expense", balance: 350000.00, status: "active", parent: null },
  { id: 16, code: "5100", name: "Salaries Expense", type: "expense", balance: 180000.00, status: "active", parent: null },
  { id: 17, code: "5200", name: "Rent Expense", type: "expense", balance: 36000.00, status: "active", parent: null },
  { id: 18, code: "5300", name: "Utilities Expense", type: "expense", balance: 12000.00, status: "active", parent: null },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "asset":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "liability":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "equity":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "revenue":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "expense":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

export default function ChartOfAccountsPage() {
  const moduleColor = getModuleColor("accounting");
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const { toast } = useToast();

  const handleAddAccount = () => {
    toast({
      title: "Account Created",
      description: "New account has been added to the chart of accounts.",
    });
    setIsAddAccountOpen(false);
  };

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return mockAccounts.filter((account) => {
      const matchesSearch =
        account.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || account.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  // Pagination
  const {
    paginatedData: paginatedAccounts,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage,
    setPageSize,
  } = useTablePagination({ data: filteredAccounts, initialPageSize: 10 });

  return (
    <SidebarLayout moduleId="accounting">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Chart of Accounts</h2>
            <p className="text-muted-foreground mt-1">
              Manage your organization's financial structure and account hierarchy.
            </p>
          </div>
          <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
            <DialogTrigger asChild>
              <Button
                className="text-white shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountCode">Account Code</Label>
                    <Input id="accountCode" placeholder="e.g., 1000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input id="accountName" placeholder="Enter account name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asset">Asset</SelectItem>
                      <SelectItem value="liability">Liability</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentAccount">Parent Account (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent</SelectItem>
                      <SelectItem value="1000">1000 - Cash</SelectItem>
                      <SelectItem value="1100">1100 - Accounts Receivable</SelectItem>
                      <SelectItem value="1200">1200 - Inventory</SelectItem>
                      <SelectItem value="2000">2000 - Accounts Payable</SelectItem>
                      <SelectItem value="3000">3000 - Share Capital</SelectItem>
                      <SelectItem value="4000">4000 - Sales Revenue</SelectItem>
                      <SelectItem value="5000">5000 - Cost of Goods Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="openingBalance">Opening Balance (₦)</Label>
                  <Input id="openingBalance" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea id="description" placeholder="Account description..." />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAccount}
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
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₦97,500,000</div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Liabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">₦15,700,000</div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Equity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₦65,000,000</div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">₦87,500,000</div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">₦57,800,000</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>All Accounts</CardTitle>
                <CardDescription>Complete list of accounts in your chart of accounts</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search accounts..."
                    className="pl-9 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="asset">Asset</SelectItem>
                    <SelectItem value="liability">Liability</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
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
                  <TableHead>Parent</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No accounts found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAccounts.map((account) => (
                    <TableRow key={account.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{account.code}</TableCell>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getTypeColor(account.type)}>
                          {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {account.parent || "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Account</DropdownMenuItem>
                            <DropdownMenuItem>View Transactions</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
