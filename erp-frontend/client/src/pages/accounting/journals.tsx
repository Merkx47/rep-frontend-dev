import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, MoreHorizontal, FileText, CheckCircle, Clock, XCircle, Pencil, Trash2, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getModuleColor } from "@/contexts/module-context";
import { useJournals, useCreateJournal, useChartOfAccounts } from "@/hooks/use-accounting";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Journal, ChartOfAccount } from "@shared/schema";

function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(num);
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

const getStatusConfig = (status: string | null) => {
  switch (status) {
    case "posted":
      return {
        color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        icon: CheckCircle,
        label: "Posted",
      };
    case "pending":
      return {
        color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        icon: Clock,
        label: "Pending",
      };
    case "draft":
      return {
        color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        icon: FileText,
        label: "Draft",
      };
    case "voided":
      return {
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        icon: XCircle,
        label: "Voided",
      };
    default:
      return {
        color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        icon: FileText,
        label: status || "Unknown",
      };
  }
};

interface JournalLineInput {
  accountId: string;
  debit: string;
  credit: string;
  description: string;
}

export default function JournalEntriesPage() {
  const moduleColor = getModuleColor("accounting");
  const { data: journals = [], isLoading } = useJournals();
  const { data: accounts = [] } = useChartOfAccounts();
  const createJournal = useCreateJournal();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      description: "",
      reference: "",
      lines: [
        { accountId: "", debit: "", credit: "", description: "" },
        { accountId: "", debit: "", credit: "", description: "" },
      ] as JournalLineInput[],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  });

  // Filter journals
  const filteredJournals = journals.filter((journal: Journal) => {
    const matchesSearch =
      journal.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || journal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const postedCount = journals.filter((j: Journal) => j.status === "posted").length;
  const pendingCount = journals.filter((j: Journal) => j.status === "pending").length;
  const draftCount = journals.filter((j: Journal) => j.status === "draft").length;
  const totalAmount = journals
    .filter((j: Journal) => j.status === "posted")
    .reduce((sum: number, j: Journal) => sum + parseFloat(j.totalDebit?.toString() || "0"), 0);

  const onSubmit = async (data: any) => {
    // Calculate totals
    let totalDebit = 0;
    let totalCredit = 0;
    data.lines.forEach((line: JournalLineInput) => {
      totalDebit += parseFloat(line.debit || "0");
      totalCredit += parseFloat(line.credit || "0");
    });

    // Validate debits equal credits
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      toast({
        title: "Validation Error",
        description: "Total debits must equal total credits.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createJournal.mutateAsync({
        date: data.date,
        description: data.description,
        reference: data.reference,
        totalDebit: totalDebit.toString(),
        totalCredit: totalCredit.toString(),
        status: "draft",
      });
      toast({ title: "Journal Created", description: "Journal entry has been created successfully." });
      setIsDialogOpen(false);
      form.reset();
    } catch {
      toast({ title: "Error", description: "Failed to create journal entry.", variant: "destructive" });
    }
  };

  // Calculate line totals for display
  const watchedLines = form.watch("lines");
  const totalDebits = watchedLines.reduce((sum, line) => sum + parseFloat(line.debit || "0"), 0);
  const totalCredits = watchedLines.reduce((sum, line) => sum + parseFloat(line.credit || "0"), 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  return (
    <SidebarLayout moduleId="accounting">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Journal Entries</h2>
            <p className="text-muted-foreground mt-1">
              Record and manage all financial transactions in your general ledger.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="text-white shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Journal Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Journal Entry</DialogTitle>
                <DialogDescription>Record a new double-entry transaction</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      rules={{ required: "Date is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., INV-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Transaction description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Journal Lines */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <FormLabel>Journal Lines</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => append({ accountId: "", debit: "", credit: "", description: "" })}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Line
                      </Button>
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Account</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[120px] text-right">Debit</TableHead>
                            <TableHead className="w-[120px] text-right">Credit</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`lines.${index}.accountId`}
                                  rules={{ required: "Account is required" }}
                                  render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select account" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {accounts.map((account: ChartOfAccount) => (
                                          <SelectItem key={account.id} value={account.id}>
                                            {account.code} - {account.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`lines.${index}.description`}
                                  render={({ field }) => (
                                    <Input className="h-8" placeholder="Line description" {...field} />
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`lines.${index}.debit`}
                                  render={({ field }) => (
                                    <Input
                                      className="h-8 text-right"
                                      type="number"
                                      placeholder="0.00"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        if (e.target.value) {
                                          form.setValue(`lines.${index}.credit`, "");
                                        }
                                      }}
                                    />
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`lines.${index}.credit`}
                                  render={({ field }) => (
                                    <Input
                                      className="h-8 text-right"
                                      type="number"
                                      placeholder="0.00"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        if (e.target.value) {
                                          form.setValue(`lines.${index}.debit`, "");
                                        }
                                      }}
                                    />
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                {fields.length > 2 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => remove(index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                          {/* Totals Row */}
                          <TableRow className="bg-muted/50 font-medium">
                            <TableCell colSpan={2} className="text-right">
                              Totals:
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(totalDebits)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(totalCredits)}
                            </TableCell>
                            <TableCell>
                              {isBalanced ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    {!isBalanced && (
                      <p className="text-sm text-destructive">
                        Debits and credits must be equal. Difference: {formatCurrency(Math.abs(totalDebits - totalCredits))}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-white border-0"
                    style={{ backgroundColor: moduleColor }}
                    disabled={createJournal.isPending || !isBalanced}
                  >
                    Create Journal Entry
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{journals.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All journal entries</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Posted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">{postedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Finalized entries</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Posted Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
              <p className="text-xs text-muted-foreground mt-1">Total debits posted</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>All Journal Entries</CardTitle>
                <CardDescription>View and manage all journal entries</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search entries..."
                    className="pl-9 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="posted">Posted</SelectItem>
                    <SelectItem value="voided">Voided</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entry No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading journal entries...
                    </TableCell>
                  </TableRow>
                ) : filteredJournals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No journal entries found. Create your first entry.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJournals.map((journal: Journal) => {
                    const statusConfig = getStatusConfig(journal.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <TableRow key={journal.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{journal.number}</TableCell>
                        <TableCell>{formatDate(journal.date)}</TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {journal.description}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">
                          {journal.reference || "-"}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(journal.totalDebit)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(journal.totalCredit)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusConfig.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
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
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {journal.status === "draft" && (
                                <DropdownMenuItem>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit Entry
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              {journal.status === "pending" && (
                                <DropdownMenuItem>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Post Entry
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {journal.status !== "voided" && journal.status !== "posted" && (
                                <DropdownMenuItem className="text-destructive">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Void Entry
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
