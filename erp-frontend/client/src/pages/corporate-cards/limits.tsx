import { useState } from "react";
import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Search,
  Settings,
  MoreHorizontal,
  Pencil,
  AlertTriangle,
  TrendingUp,
  Wallet,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { getModuleColor } from "@/contexts/module-context";

interface CardLimit {
  id: string;
  cardHolder: string;
  cardNumber: string;
  department: string;
  dailyLimit: number;
  dailySpent: number;
  monthlyLimit: number;
  monthlySpent: number;
  transactionLimit: number;
  categories: string[];
  status: "normal" | "warning" | "exceeded";
}

const mockLimits: CardLimit[] = [
  {
    id: "1",
    cardHolder: "Adebayo Johnson",
    cardNumber: "**** 4521",
    department: "Marketing",
    dailyLimit: 100000,
    dailySpent: 75000,
    monthlyLimit: 500000,
    monthlySpent: 325000,
    transactionLimit: 50000,
    categories: ["Advertising", "Software", "Travel"],
    status: "warning",
  },
  {
    id: "2",
    cardHolder: "Fatima Mohammed",
    cardNumber: "**** 7832",
    department: "Operations",
    dailyLimit: 50000,
    dailySpent: 15000,
    monthlyLimit: 250000,
    monthlySpent: 180000,
    transactionLimit: 25000,
    categories: ["Software", "Travel", "Office Supplies"],
    status: "normal",
  },
  {
    id: "3",
    cardHolder: "Chukwuemeka Obi",
    cardNumber: "**** 9156",
    department: "IT",
    dailyLimit: 75000,
    dailySpent: 80000,
    monthlyLimit: 300000,
    monthlySpent: 295000,
    transactionLimit: 35000,
    categories: ["Software", "Hardware", "Cloud Services"],
    status: "exceeded",
  },
  {
    id: "4",
    cardHolder: "Grace Adekunle",
    cardNumber: "**** 2847",
    department: "Finance",
    dailyLimit: 200000,
    dailySpent: 0,
    monthlyLimit: 1000000,
    monthlySpent: 0,
    transactionLimit: 100000,
    categories: ["All Categories"],
    status: "normal",
  },
  {
    id: "5",
    cardHolder: "Ibrahim Yusuf",
    cardNumber: "**** 6390",
    department: "Sales",
    dailyLimit: 40000,
    dailySpent: 38000,
    monthlyLimit: 200000,
    monthlySpent: 198500,
    transactionLimit: 20000,
    categories: ["Travel", "Entertainment", "Client Meetings"],
    status: "exceeded",
  },
];

export default function LimitsPage() {
  const moduleColor = getModuleColor("corporate-cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isEditLimitOpen, setIsEditLimitOpen] = useState(false);

  const filteredLimits = mockLimits.filter((limit) => {
    const matchesSearch =
      limit.cardHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      limit.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || limit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMonthlyLimit = mockLimits.reduce((sum, l) => sum + l.monthlyLimit, 0);
  const totalMonthlySpent = mockLimits.reduce((sum, l) => sum + l.monthlySpent, 0);
  const warningCount = mockLimits.filter((l) => l.status === "warning").length;
  const exceededCount = mockLimits.filter((l) => l.status === "exceeded").length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getUsagePercentage = (spent: number, limit: number) => {
    return Math.round((spent / limit) * 100);
  };

  const getStatusBadge = (status: CardLimit["status"]) => {
    const styles = {
      normal: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      exceeded: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  return (
    <SidebarLayout moduleId="corporate-cards">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Spending Limits</h1>
            <p className="text-muted-foreground">
              Configure and monitor card spending limits
            </p>
          </div>
          <Dialog open={isEditLimitOpen} onOpenChange={setIsEditLimitOpen}>
            <DialogTrigger asChild>
              <Button
                className="text-gray-900 shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configure Default Limits
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Default Spending Limits</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Default Daily Limit (NGN)</Label>
                  <Input type="number" placeholder="50000" defaultValue="50000" />
                </div>
                <div className="space-y-2">
                  <Label>Default Monthly Limit (NGN)</Label>
                  <Input type="number" placeholder="250000" defaultValue="250000" />
                </div>
                <div className="space-y-2">
                  <Label>Default Transaction Limit (NGN)</Label>
                  <Input type="number" placeholder="25000" defaultValue="25000" />
                </div>
                <div className="space-y-2">
                  <Label>Warning Threshold (%)</Label>
                  <Input type="number" placeholder="70" defaultValue="70" />
                  <p className="text-sm text-muted-foreground">
                    Alert when spending reaches this percentage of limit
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditLimitOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="text-gray-900 shadow-lg hover:opacity-90 border-0"
                    style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
                    onClick={() => setIsEditLimitOpen(false)}
                  >
                    Save Defaults
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
                  <p className="text-sm text-muted-foreground">Total Monthly Limit</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalMonthlyLimit)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Monthly Spent</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalMonthlySpent)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approaching Limit</p>
                  <p className="text-2xl font-bold">{warningCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Exceeded Limit</p>
                  <p className="text-2xl font-bold">{exceededCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by cardholder, department..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="exceeded">Exceeded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Limits Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card Holder</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Daily Usage</TableHead>
                  <TableHead>Monthly Usage</TableHead>
                  <TableHead>Transaction Limit</TableHead>
                  <TableHead>Allowed Categories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLimits.map((limit) => (
                  <TableRow key={limit.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{limit.cardHolder}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {limit.cardNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{limit.department}</TableCell>
                    <TableCell>
                      <div className="w-28">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{formatCurrency(limit.dailySpent)}</span>
                          <span>{getUsagePercentage(limit.dailySpent, limit.dailyLimit)}%</span>
                        </div>
                        <Progress
                          value={Math.min(getUsagePercentage(limit.dailySpent, limit.dailyLimit), 100)}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          of {formatCurrency(limit.dailyLimit)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-28">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{formatCurrency(limit.monthlySpent)}</span>
                          <span>{getUsagePercentage(limit.monthlySpent, limit.monthlyLimit)}%</span>
                        </div>
                        <Progress
                          value={Math.min(getUsagePercentage(limit.monthlySpent, limit.monthlyLimit), 100)}
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          of {formatCurrency(limit.monthlyLimit)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(limit.transactionLimit)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {limit.categories.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                        {limit.categories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{limit.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(limit.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit Limits
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            Configure Categories
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
      </div>
    </SidebarLayout>
  );
}
