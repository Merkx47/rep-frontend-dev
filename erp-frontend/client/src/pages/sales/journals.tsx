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
import { Plus, Search, Filter, FileText } from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function SalesJournalsPage() {
  const moduleColor = getModuleColor("sales");
  const journalEntries = [
    {
      id: "JE-2024-0156",
      date: "2024-01-07",
      description: "Sales Invoice #INV-2024-045",
      debit: 850000,
      credit: 850000,
      status: "Posted",
    },
    {
      id: "JE-2024-0155",
      date: "2024-01-06",
      description: "Customer Payment - Client A",
      debit: 1200000,
      credit: 1200000,
      status: "Posted",
    },
    {
      id: "JE-2024-0154",
      date: "2024-01-06",
      description: "Sales Return - Order #ORD-2024-089",
      debit: 45000,
      credit: 45000,
      status: "Posted",
    },
    {
      id: "JE-2024-0153",
      date: "2024-01-05",
      description: "Sales Invoice #INV-2024-044",
      debit: 2500000,
      credit: 2500000,
      status: "Posted",
    },
    {
      id: "JE-2024-0152",
      date: "2024-01-05",
      description: "Sales Discount Applied",
      debit: 25000,
      credit: 25000,
      status: "Posted",
    },
    {
      id: "JE-2024-0151",
      date: "2024-01-04",
      description: "Bad Debt Write-off",
      debit: 150000,
      credit: 150000,
      status: "Pending",
    },
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
            <h1 className="text-3xl font-display font-bold tracking-tight">Journal Entries</h1>
            <p className="text-muted-foreground mt-1">Sales-related journal entries and transactions</p>
          </div>
          <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{journalEntries.length}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Posted</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">
                {journalEntries.filter(j => j.status === "Posted").length}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-yellow-600">
                {journalEntries.filter(j => j.status === "Pending").length}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{journalEntries.length}</span>
            </CardContent>
          </Card>
        </div>

        {/* Journal Entries Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Recent Entries</CardTitle>
                <CardDescription>Journal entries for sales transactions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search entries..." className="pl-9" />
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
                  <TableHead>Entry ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journalEntries.map((entry) => (
                  <TableRow key={entry.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono font-medium">{entry.id}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{entry.date}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(entry.debit)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(entry.credit)}</TableCell>
                    <TableCell>
                      <Badge className={entry.status === "Posted" ? "bg-green-500" : "bg-yellow-500"}>
                        {entry.status}
                      </Badge>
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
