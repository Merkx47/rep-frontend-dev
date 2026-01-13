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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Ban,
  MoreHorizontal,
  Eye,
  Lock,
  Unlock,
  Receipt,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getModuleColor } from "@/contexts/module-context";

interface CorporateCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  department: string;
  cardType: "virtual" | "physical";
  status: "active" | "frozen" | "cancelled" | "pending";
  limit: number;
  spent: number;
  expiryDate: string;
  lastUsed: string;
}

interface Transaction {
  id: string;
  cardId: string;
  cardHolder: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  status: "approved" | "pending" | "declined";
}

const mockCards: CorporateCard[] = [
  {
    id: "1",
    cardNumber: "**** **** **** 4521",
    cardHolder: "Adebayo Johnson",
    department: "Marketing",
    cardType: "physical",
    status: "active",
    limit: 500000,
    spent: 325000,
    expiryDate: "12/26",
    lastUsed: "2024-01-15",
  },
  {
    id: "2",
    cardNumber: "**** **** **** 7832",
    cardHolder: "Fatima Mohammed",
    department: "Operations",
    cardType: "virtual",
    status: "active",
    limit: 250000,
    spent: 180000,
    expiryDate: "08/25",
    lastUsed: "2024-01-14",
  },
  {
    id: "3",
    cardNumber: "**** **** **** 9156",
    cardHolder: "Chukwuemeka Obi",
    department: "IT",
    cardType: "physical",
    status: "frozen",
    limit: 300000,
    spent: 295000,
    expiryDate: "03/26",
    lastUsed: "2024-01-10",
  },
  {
    id: "4",
    cardNumber: "**** **** **** 2847",
    cardHolder: "Grace Adekunle",
    department: "Finance",
    cardType: "virtual",
    status: "pending",
    limit: 1000000,
    spent: 0,
    expiryDate: "01/27",
    lastUsed: "-",
  },
  {
    id: "5",
    cardNumber: "**** **** **** 6390",
    cardHolder: "Ibrahim Yusuf",
    department: "Sales",
    cardType: "physical",
    status: "cancelled",
    limit: 200000,
    spent: 198500,
    expiryDate: "06/24",
    lastUsed: "2023-12-20",
  },
];

const mockTransactions: Transaction[] = [
  {
    id: "1",
    cardId: "1",
    cardHolder: "Adebayo Johnson",
    merchant: "Google Ads",
    category: "Advertising",
    amount: 75000,
    date: "2024-01-15",
    status: "approved",
  },
  {
    id: "2",
    cardId: "2",
    cardHolder: "Fatima Mohammed",
    merchant: "Amazon Web Services",
    category: "Software",
    amount: 45000,
    date: "2024-01-14",
    status: "approved",
  },
  {
    id: "3",
    cardId: "1",
    cardHolder: "Adebayo Johnson",
    merchant: "Facebook Ads",
    category: "Advertising",
    amount: 50000,
    date: "2024-01-13",
    status: "approved",
  },
  {
    id: "4",
    cardId: "3",
    cardHolder: "Chukwuemeka Obi",
    merchant: "Microsoft 365",
    category: "Software",
    amount: 25000,
    date: "2024-01-12",
    status: "declined",
  },
  {
    id: "5",
    cardId: "2",
    cardHolder: "Fatima Mohammed",
    merchant: "Uber Business",
    category: "Travel",
    amount: 15000,
    date: "2024-01-11",
    status: "pending",
  },
];

export default function CorporateCardsPage() {
  const moduleColor = getModuleColor("corporate-cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const filteredCards = mockCards.filter((card) => {
    const matchesSearch =
      card.cardHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.cardNumber.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalLimit = mockCards.reduce((sum, card) => sum + card.limit, 0);
  const totalSpent = mockCards.reduce((sum, card) => sum + card.spent, 0);
  const activeCards = mockCards.filter((c) => c.status === "active").length;
  const frozenCards = mockCards.filter((c) => c.status === "frozen").length;

  const getStatusBadge = (status: CorporateCard["status"]) => {
    const styles = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      frozen: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

  const getTransactionStatusBadge = (status: Transaction["status"]) => {
    const styles = {
      approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      declined: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return <Badge className={styles[status]}>{status}</Badge>;
  };

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

  return (
    <SidebarLayout moduleId="corporate-cards">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Corporate Cards</h1>
            <p className="text-muted-foreground">
              Manage company cards and track spending
            </p>
          </div>
          <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
            <DialogTrigger asChild>
              <Button
                className="text-gray-900 shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Issue New Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Issue New Corporate Card</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Card Holder Name</Label>
                  <Input placeholder="Enter employee name" />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Card Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual Card</SelectItem>
                      <SelectItem value="physical">Physical Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monthly Limit (₦)</Label>
                  <Input type="number" placeholder="Enter spending limit" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="text-gray-900 shadow-lg hover:opacity-90 border-0"
                    style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
                    onClick={() => setIsAddCardOpen(false)}
                  >
                    Issue Card
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
                <div className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-primary/10">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cards</p>
                  <p className="text-2xl font-bold">{mockCards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Cards</p>
                  <p className="text-2xl font-bold">{activeCards}</p>
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
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-yellow-100 dark:bg-yellow-900/30">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Frozen Cards</p>
                  <p className="text-2xl font-bold">{frozenCards}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="cards" className="space-y-4">
          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by card holder, department..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="frozen">Frozen</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cards Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Card Details</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Limit</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCards.map((card) => (
                      <TableRow key={card.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{card.cardHolder}</p>
                            <p className="text-sm text-muted-foreground font-mono">
                              {card.cardNumber}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{card.department}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {card.cardType === "virtual" ? "Virtual" : "Physical"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(card.limit)}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{formatCurrency(card.spent)}</span>
                              <span className="text-muted-foreground">
                                {getUsagePercentage(card.spent, card.limit)}%
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  getUsagePercentage(card.spent, card.limit) > 90
                                    ? "bg-red-500"
                                    : getUsagePercentage(card.spent, card.limit) > 70
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    getUsagePercentage(card.spent, card.limit),
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(card.status)}</TableCell>
                        <TableCell>{card.expiryDate}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Receipt className="w-4 h-4 mr-2" />
                                View Transactions
                              </DropdownMenuItem>
                              {card.status === "active" ? (
                                <DropdownMenuItem>
                                  <Lock className="w-4 h-4 mr-2" />
                                  Freeze Card
                                </DropdownMenuItem>
                              ) : card.status === "frozen" ? (
                                <DropdownMenuItem>
                                  <Unlock className="w-4 h-4 mr-2" />
                                  Unfreeze Card
                                </DropdownMenuItem>
                              ) : null}
                              <DropdownMenuItem className="text-destructive">
                                <Ban className="w-4 h-4 mr-2" />
                                Cancel Card
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
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Card Holder</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell>
                          {new Date(txn.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{txn.cardHolder}</TableCell>
                        <TableCell>{txn.merchant}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{txn.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(txn.amount)}
                        </TableCell>
                        <TableCell>
                          {getTransactionStatusBadge(txn.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
