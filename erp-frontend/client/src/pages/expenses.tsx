import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, Receipt, TrendingUp, TrendingDown, Check, X, MoreHorizontal, PiggyBank, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { NairaSign } from "@/components/ui/naira-icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useExpenses, useExpenseCategories, useCreateExpense, useApproveExpense, useRejectExpense, useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from "@/hooks/use-expenses";
import { Skeleton } from "@/components/ui/skeleton";
import { getModuleColor } from "@/contexts/module-context";

function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return '₦' + new Intl.NumberFormat('en-NG').format(num);
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function ExpensesPage() {
  const moduleColor = getModuleColor("accounting");
  const [activeTab, setActiveTab] = useState("expenses");
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [isEditBudgetDialogOpen, setIsEditBudgetDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const { toast } = useToast();

  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();
  const { data: categories = [], isLoading: categoriesLoading } = useExpenseCategories();
  const { data: budgets = [], isLoading: budgetsLoading } = useBudgets();
  const createExpense = useCreateExpense();
  const approveExpense = useApproveExpense();
  const rejectExpense = useRejectExpense();
  const createBudget = useCreateBudget();
  const updateBudget = useUpdateBudget();
  const deleteBudget = useDeleteBudget();

  const expenseForm = useForm({
    defaultValues: {
      description: "",
      amount: "",
      categoryId: "",
      date: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  const budgetForm = useForm({
    defaultValues: {
      categoryId: "",
      year: new Date().getFullYear().toString(),
      month: (new Date().getMonth() + 1).toString(),
      amount: "",
    },
  });

  const onSubmitExpense = async (data: any) => {
    try {
      await createExpense.mutateAsync({
        description: data.description,
        amount: data.amount,
        categoryId: data.categoryId,
        date: data.date,
        notes: data.notes || null,
      });
      toast({
        title: "Expense Submitted",
        description: "Your expense has been submitted for approval.",
      });
      setIsExpenseDialogOpen(false);
      expenseForm.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit expense. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onSubmitBudget = async (data: any) => {
    try {
      await createBudget.mutateAsync({
        categoryId: data.categoryId,
        year: parseInt(data.year),
        month: parseInt(data.month),
        amount: parseFloat(data.amount),
      });
      toast({
        title: "Budget Created",
        description: "The budget has been created successfully.",
      });
      setIsBudgetDialogOpen(false);
      budgetForm.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create budget.",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (expenseId: string) => {
    try {
      await approveExpense.mutateAsync(expenseId);
      toast({
        title: "Expense Approved",
        description: "The expense has been approved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve expense.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (expenseId: string) => {
    try {
      await rejectExpense.mutateAsync(expenseId);
      toast({
        title: "Expense Rejected",
        description: "The expense has been rejected.",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject expense.",
        variant: "destructive",
      });
    }
  };

  const handleEditBudget = (budget: any) => {
    setEditingBudget(budget);
    budgetForm.setValue('categoryId', budget.categoryId);
    budgetForm.setValue('year', budget.year.toString());
    budgetForm.setValue('month', budget.month.toString());
    budgetForm.setValue('amount', budget.amount.toString());
    setIsEditBudgetDialogOpen(true);
  };

  const onUpdateBudget = async (data: any) => {
    if (!editingBudget) return;
    try {
      await updateBudget.mutateAsync({
        id: editingBudget.id,
        categoryId: data.categoryId,
        year: parseInt(data.year),
        month: parseInt(data.month),
        amount: parseFloat(data.amount),
      });
      toast({
        title: "Budget Updated",
        description: "The budget has been updated successfully.",
      });
      setIsEditBudgetDialogOpen(false);
      setEditingBudget(null);
      budgetForm.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update budget.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await deleteBudget.mutateAsync(budgetId);
      toast({
        title: "Budget Deleted",
        description: "The budget has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete budget.",
        variant: "destructive",
      });
    }
  };

  const isLoading = expensesLoading || categoriesLoading || budgetsLoading;

  // Expense stats
  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + parseFloat(exp.amount || '0'), 0);
  const pendingExpenses = expenses.filter((e: any) => e.status === 'pending').reduce((sum: number, exp: any) => sum + parseFloat(exp.amount || '0'), 0);
  const approvedExpenses = expenses.filter((e: any) => e.status === 'approved').reduce((sum: number, exp: any) => sum + parseFloat(exp.amount || '0'), 0);

  // Budget stats
  const totalBudget = budgets.reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
  const totalSpent = budgets.reduce((sum: number, b: any) => sum + (b.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const overBudgetCount = budgets.filter((b: any) => b.spent > b.amount).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-200">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getBudgetStatusBadge = (budget: any) => {
    const percentUsed = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
    if (percentUsed >= 100) {
      return <Badge variant="destructive">Over Budget</Badge>;
    } else if (percentUsed >= 80) {
      return <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-200">Warning</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-200">On Track</Badge>;
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getMonthName = (month: number) => {
    return months.find(m => m.value === month)?.label || 'Unknown';
  };

  if (isLoading) {
    return (
      <SidebarLayout moduleId="accounting">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout moduleId="accounting">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight" data-testid="text-expenses-title">
              Expense Management
            </h2>
            <p className="text-muted-foreground mt-1">Track expenses and manage budgets.</p>
          </div>
          {activeTab === "expenses" ? (
            <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
              <DialogTrigger asChild>
                <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} data-testid="button-add-expense">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Expense</DialogTitle>
                </DialogHeader>
                <Form {...expenseForm}>
                  <form onSubmit={expenseForm.handleSubmit(onSubmitExpense)} className="space-y-4">
                    <FormField
                      control={expenseForm.control}
                      name="description"
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="What was this expense for?" {...field} data-testid="input-expense-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={expenseForm.control}
                        name="amount"
                        rules={{ required: "Amount is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (NGN)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0.00" {...field} data-testid="input-expense-amount" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={expenseForm.control}
                        name="date"
                        rules={{ required: "Date is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} data-testid="input-expense-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={expenseForm.control}
                      name="categoryId"
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-expense-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={expenseForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional notes..." className="resize-none" {...field} data-testid="input-expense-notes" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={createExpense.isPending} data-testid="button-submit-expense">
                      {createExpense.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Expense"
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
              <DialogTrigger asChild>
                <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} data-testid="button-add-budget">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Budget</DialogTitle>
                </DialogHeader>
                <Form {...budgetForm}>
                  <form onSubmit={budgetForm.handleSubmit(onSubmitBudget)} className="space-y-4">
                    <FormField
                      control={budgetForm.control}
                      name="categoryId"
                      rules={{ required: "Category is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expense Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-budget-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={budgetForm.control}
                        name="year"
                        rules={{ required: "Year is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-budget-year">
                                  <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2026">2026</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={budgetForm.control}
                        name="month"
                        rules={{ required: "Month is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Month</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-budget-month">
                                  <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {months.map((m) => (
                                  <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={budgetForm.control}
                      name="amount"
                      rules={{ required: "Budget amount is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Amount (NGN)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} data-testid="input-budget-amount" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={createBudget.isPending} data-testid="button-submit-budget">
                      {createBudget.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Budget"
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Edit Budget Dialog */}
        <Dialog open={isEditBudgetDialogOpen} onOpenChange={(open) => {
          setIsEditBudgetDialogOpen(open);
          if (!open) {
            setEditingBudget(null);
            budgetForm.reset();
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
            </DialogHeader>
            <Form {...budgetForm}>
              <form onSubmit={budgetForm.handleSubmit(onUpdateBudget)} className="space-y-4">
                <FormField
                  control={budgetForm.control}
                  name="categoryId"
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expense Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-edit-budget-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat: any) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={budgetForm.control}
                    name="year"
                    rules={{ required: "Year is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-edit-budget-year">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2026">2026</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={budgetForm.control}
                    name="month"
                    rules={{ required: "Month is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Month</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-edit-budget-month">
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {months.map((m) => (
                              <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={budgetForm.control}
                  name="amount"
                  rules={{ required: "Budget amount is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Amount (NGN)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} data-testid="input-edit-budget-amount" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={updateBudget.isPending} data-testid="button-update-budget">
                  {updateBudget.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Budget"
                  )}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="budgeting" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Budgeting
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-6 mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <NairaSign size={16} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-expenses">{formatCurrency(totalExpenses)}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-pending-expenses">{formatCurrency(pendingExpenses)}</div>
                  <p className="text-xs text-muted-foreground">{expenses.filter((e: any) => e.status === 'pending').length} expenses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-approved-expenses">{formatCurrency(approvedExpenses)}</div>
                  <p className="text-xs text-muted-foreground">{expenses.filter((e: any) => e.status === 'approved').length} expenses</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-category-count">{categories.length}</div>
                  <p className="text-xs text-muted-foreground">Active categories</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>View and manage submitted expenses</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No expenses recorded yet.</p>
                    <p className="text-sm">Click "Add Expense" to submit your first expense.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((expense: any) => (
                        <TableRow key={expense.id} data-testid={`row-expense-${expense.id}`}>
                          <TableCell className="text-muted-foreground">{expense.date}</TableCell>
                          <TableCell className="font-medium">{expense.description}</TableCell>
                          <TableCell>{categories.find((c: any) => c.id === expense.categoryId)?.name || '-'}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
                          <TableCell>{getStatusBadge(expense.status)}</TableCell>
                          <TableCell>
                            {expense.status === 'pending' ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    data-testid={`button-actions-expense-${expense.id}`}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem
                                    onClick={() => handleApprove(expense.id)}
                                    disabled={approveExpense.isPending}
                                    className="text-green-600 focus:text-green-600 focus:bg-green-50 cursor-pointer"
                                    data-testid={`button-approve-expense-${expense.id}`}
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleReject(expense.id)}
                                    disabled={rejectExpense.isPending}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                    data-testid={`button-reject-expense-${expense.id}`}
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgeting" className="space-y-6 mt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                  <PiggyBank className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-budget">{formatCurrency(totalBudget)}</div>
                  <p className="text-xs text-muted-foreground">{budgets.length} active budgets</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-spent">{formatCurrency(totalSpent)}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalBudget > 0 ? `${((totalSpent / totalBudget) * 100).toFixed(1)}% of budget` : '0%'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                  <NairaSign size={16} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-destructive'}`} data-testid="text-remaining">
                    {formatCurrency(Math.abs(totalRemaining))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalRemaining >= 0 ? 'Available to spend' : 'Over budget'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive" data-testid="text-over-budget">{overBudgetCount}</div>
                  <p className="text-xs text-muted-foreground">Categories exceeded</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription>Track spending against allocated budgets</CardDescription>
              </CardHeader>
              <CardContent>
                {budgets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <PiggyBank className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No budgets created yet.</p>
                    <p className="text-sm">Click "Create Budget" to set up your first budget.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Budget</TableHead>
                        <TableHead className="text-right">Spent</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {budgets.map((budget: any) => {
                        const percentUsed = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
                        const remaining = budget.amount - budget.spent;

                        return (
                          <TableRow key={budget.id} data-testid={`row-budget-${budget.id}`}>
                            <TableCell className="font-medium">{getCategoryName(budget.categoryId)}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {getMonthName(budget.month)} {budget.year}
                            </TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(budget.amount)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(budget.spent)}</TableCell>
                            <TableCell>
                              <div className="w-32">
                                <Progress
                                  value={Math.min(percentUsed, 100)}
                                  className={`h-2 ${percentUsed >= 100 ? '[&>div]:bg-destructive' : percentUsed >= 80 ? '[&>div]:bg-orange-500' : ''}`}
                                />
                                <div className="flex justify-between text-xs mt-1">
                                  <span className="text-muted-foreground">{percentUsed.toFixed(0)}%</span>
                                  <span className={remaining >= 0 ? 'text-green-600' : 'text-destructive'}>
                                    {remaining >= 0 ? formatCurrency(remaining) : `-${formatCurrency(Math.abs(remaining))}`}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getBudgetStatusBadge(budget)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    data-testid={`button-actions-budget-${budget.id}`}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40">
                                  <DropdownMenuItem
                                    onClick={() => handleEditBudget(budget)}
                                    className="cursor-pointer"
                                    data-testid={`button-edit-budget-${budget.id}`}
                                  >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteBudget(budget.id)}
                                    disabled={deleteBudget.isPending}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                    data-testid={`button-delete-budget-${budget.id}`}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
