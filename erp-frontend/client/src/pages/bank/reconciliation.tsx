import { useState } from "react";
import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getModuleColor } from "@/contexts/module-context";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Upload,
  FileSpreadsheet,
  Search,
  Download,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReconciliationItem {
  id: string;
  date: string;
  description: string;
  bankAmount: number;
  systemAmount: number;
  difference: number;
  status: "matched" | "unmatched" | "pending";
  matchedWith?: string;
}

interface ReconciliationSummary {
  id: string;
  bankName: string;
  accountNumber: string;
  period: string;
  bankBalance: number;
  systemBalance: number;
  difference: number;
  matchedItems: number;
  unmatchedItems: number;
  status: "completed" | "in_progress" | "pending";
  lastUpdated: string;
}

const mockSummaries: ReconciliationSummary[] = [
  {
    id: "1",
    bankName: "First Bank",
    accountNumber: "3082567890",
    period: "January 2024",
    bankBalance: 15750000,
    systemBalance: 15750000,
    difference: 0,
    matchedItems: 45,
    unmatchedItems: 0,
    status: "completed",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    bankName: "GTBank",
    accountNumber: "0234567891",
    period: "January 2024",
    bankBalance: 8350000,
    systemBalance: 8250000,
    difference: 100000,
    matchedItems: 32,
    unmatchedItems: 3,
    status: "in_progress",
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    bankName: "Access Bank",
    accountNumber: "1098765432",
    period: "January 2024",
    bankBalance: 25000000,
    systemBalance: 25000000,
    difference: 0,
    matchedItems: 12,
    unmatchedItems: 0,
    status: "completed",
    lastUpdated: "2024-01-10",
  },
  {
    id: "4",
    bankName: "Zenith Bank",
    accountNumber: "5012345678",
    period: "January 2024",
    bankBalance: 45000,
    systemBalance: 45000,
    difference: 0,
    matchedItems: 8,
    unmatchedItems: 0,
    status: "completed",
    lastUpdated: "2024-01-12",
  },
  {
    id: "5",
    bankName: "UBA",
    accountNumber: "2098765432",
    period: "January 2024",
    bankBalance: 0,
    systemBalance: 0,
    difference: 0,
    matchedItems: 0,
    unmatchedItems: 0,
    status: "pending",
    lastUpdated: "-",
  },
];

const mockReconciliationItems: ReconciliationItem[] = [
  {
    id: "1",
    date: "2024-01-14",
    description: "Bank charge - Maintenance fee",
    bankAmount: 2500,
    systemAmount: 0,
    difference: 2500,
    status: "unmatched",
  },
  {
    id: "2",
    date: "2024-01-13",
    description: "Transfer - ABC Corp Payment",
    bankAmount: 500000,
    systemAmount: 500000,
    difference: 0,
    status: "matched",
    matchedWith: "INV-2024-015",
  },
  {
    id: "3",
    date: "2024-01-12",
    description: "POS Transaction",
    bankAmount: 45000,
    systemAmount: 45000,
    difference: 0,
    status: "matched",
    matchedWith: "EXP-2024-089",
  },
  {
    id: "4",
    date: "2024-01-11",
    description: "Unknown credit",
    bankAmount: 75000,
    systemAmount: 0,
    difference: 75000,
    status: "unmatched",
  },
  {
    id: "5",
    date: "2024-01-10",
    description: "Interest Credit",
    bankAmount: 22500,
    systemAmount: 0,
    difference: 22500,
    status: "pending",
  },
];

export default function ReconciliationPage() {
  const moduleColor = getModuleColor("bank");
  const [searchTerm, setSearchTerm] = useState("");
  const [accountFilter, setAccountFilter] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredSummaries = mockSummaries.filter((summary) => {
    const matchesSearch =
      summary.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      summary.accountNumber.includes(searchTerm);
    const matchesAccount = accountFilter === "all" || summary.id === accountFilter;
    return matchesSearch && matchesAccount;
  });

  const completedCount = mockSummaries.filter((s) => s.status === "completed").length;
  const inProgressCount = mockSummaries.filter((s) => s.status === "in_progress").length;
  const pendingCount = mockSummaries.filter((s) => s.status === "pending").length;
  const totalDifference = mockSummaries.reduce((sum, s) => sum + Math.abs(s.difference), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: ReconciliationSummary["status"]) => {
    const config = {
      completed: {
        style: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
      },
      in_progress: {
        style: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        icon: <RefreshCw className="w-3 h-3 mr-1" />,
      },
      pending: {
        style: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        icon: <Clock className="w-3 h-3 mr-1" />,
      },
    };
    return (
      <Badge className={`${config[status].style} flex items-center`}>
        {config[status].icon}
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getItemStatusBadge = (status: ReconciliationItem["status"]) => {
    const styles = {
      matched: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      unmatched: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <SidebarLayout moduleId="bank">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bank Reconciliation</h1>
            <p className="text-muted-foreground">
              Match bank statements with system records
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
              <Upload className="w-4 h-4 mr-2" />
              Import Statement
            </Button>
            <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Reconciliation
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{inProgressCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-900/30">
                  <Clock className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Difference</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalDifference)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reconciliation Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank Account</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Bank Balance</TableHead>
                  <TableHead>System Balance</TableHead>
                  <TableHead>Difference</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSummaries.map((summary) => {
                  const totalItems = summary.matchedItems + summary.unmatchedItems;
                  const progress = totalItems > 0 ? (summary.matchedItems / totalItems) * 100 : 0;
                  return (
                    <TableRow key={summary.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{summary.bankName}</p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {summary.accountNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{summary.period}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(summary.bankBalance)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(summary.systemBalance)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            summary.difference === 0
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {formatCurrency(summary.difference)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-24">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{summary.matchedItems}/{totalItems}</span>
                            <span>{progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(summary.status)}</TableCell>
                      <TableCell>
                        {summary.lastUpdated !== "-"
                          ? new Date(summary.lastUpdated).toLocaleDateString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Unmatched Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reconciliation Items - GTBank (In Progress)</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={selectedItems.length === 0}>
                Match Selected
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Bank Amount</TableHead>
                  <TableHead>System Amount</TableHead>
                  <TableHead>Difference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Matched With</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockReconciliationItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                        disabled={item.status === "matched"}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(item.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(item.bankAmount)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(item.systemAmount)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          item.difference === 0
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {formatCurrency(item.difference)}
                      </span>
                    </TableCell>
                    <TableCell>{getItemStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      {item.matchedWith ? (
                        <span className="font-mono text-sm text-primary">
                          {item.matchedWith}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
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
