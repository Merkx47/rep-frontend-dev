import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  useGrades,
  useCreateGrade,
  useUpdateGrade,
  useDeleteGrade,
  useSalaryComponents,
  useAllSalaryComponents,
  useCreateSalaryComponent,
  useUpdateSalaryComponent,
  useDeleteSalaryComponent,
  usePayrollRuns,
  useCreatePayrollRun,
  useProcessPayrollRun,
  useApprovePayrollRun,
  useMarkPayrollRunPaid,
  usePayrollRecords,
  useEmployees,
} from "@/hooks/use-hr";
import type { Grade, SalaryComponent, PayrollRun, PayrollRecord } from "@shared/schema";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Download,
  Wallet,
  TrendingUp,
  CheckCircle,
  FileText,
  Calendar,
  Play,
  Check,
  CreditCard,
  Layers,
  Users,
  Receipt,
} from "lucide-react";

function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(num);
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

// Grades Tab Component
function GradesTab({ moduleColor }: { moduleColor: string }) {
  const { data: grades = [], isLoading } = useGrades();
  const createGrade = useCreateGrade();
  const updateGrade = useUpdateGrade();
  const deleteGrade = useDeleteGrade();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      code: "",
      name: "",
      level: "",
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (editingGrade) {
        await updateGrade.mutateAsync({ id: editingGrade.id, data });
        toast({ title: "Grade Updated", description: "Grade has been updated successfully." });
      } else {
        await createGrade.mutateAsync({ ...data, level: parseInt(data.level) || 1 });
        toast({ title: "Grade Created", description: "Grade has been created successfully." });
      }
      setIsDialogOpen(false);
      setEditingGrade(null);
      form.reset();
    } catch {
      toast({ title: "Error", description: "Failed to save grade.", variant: "destructive" });
    }
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    form.reset({
      code: grade.code || "",
      name: grade.name || "",
      level: grade.level?.toString() || "",
      description: grade.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGrade.mutateAsync(id);
      toast({ title: "Grade Deleted", description: "Grade has been deleted successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to delete grade.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Salary Grades</h3>
          <p className="text-sm text-muted-foreground">Define salary grades for your organization</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) { setEditingGrade(null); form.reset(); } }}>
          <DialogTrigger asChild>
            <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Grade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGrade ? "Edit Grade" : "Create Grade"}</DialogTitle>
              <DialogDescription>Define a salary grade with its level and description</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    rules={{ required: "Code is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., GRD-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="level"
                    rules={{ required: "Level is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Senior Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Optional description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full text-white border-0" style={{ backgroundColor: moduleColor }} disabled={createGrade.isPending || updateGrade.isPending}>
                  {editingGrade ? "Update Grade" : "Create Grade"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading grades...</TableCell>
                </TableRow>
              ) : grades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No grades defined. Create your first grade.</TableCell>
                </TableRow>
              ) : (
                grades.map((grade: Grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.code}</TableCell>
                    <TableCell>{grade.name}</TableCell>
                    <TableCell><Badge variant="secondary">Level {grade.level}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{grade.description || "-"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(grade)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(grade.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Salary Components Tab Component
function SalaryComponentsTab({ moduleColor }: { moduleColor: string }) {
  const { data: grades = [] } = useGrades();
  const { data: components = [], isLoading } = useAllSalaryComponents();
  const createComponent = useCreateSalaryComponent();
  const updateComponent = useUpdateSalaryComponent();
  const deleteComponent = useDeleteSalaryComponent();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<SalaryComponent | null>(null);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>("all");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      gradeId: "",
      code: "",
      name: "",
      type: "earning" as "earning" | "deduction",
      amount: "",
      isPercentage: false,
      isTaxable: true,
    },
  });

  const filteredComponents = selectedGradeFilter === "all"
    ? components
    : components.filter((c: SalaryComponent) => c.gradeId === selectedGradeFilter);

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        amount: data.amount.toString(),
      };
      if (editingComponent) {
        await updateComponent.mutateAsync({ id: editingComponent.id, data: payload });
        toast({ title: "Component Updated", description: "Salary component has been updated." });
      } else {
        await createComponent.mutateAsync(payload);
        toast({ title: "Component Created", description: "Salary component has been created." });
      }
      setIsDialogOpen(false);
      setEditingComponent(null);
      form.reset();
    } catch {
      toast({ title: "Error", description: "Failed to save component.", variant: "destructive" });
    }
  };

  const handleEdit = (component: SalaryComponent) => {
    setEditingComponent(component);
    form.reset({
      gradeId: component.gradeId,
      code: component.code,
      name: component.name,
      type: component.type as "earning" | "deduction",
      amount: component.amount?.toString() || "",
      isPercentage: component.isPercentage ?? false,
      isTaxable: component.isTaxable ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComponent.mutateAsync(id);
      toast({ title: "Component Deleted", description: "Salary component has been deleted." });
    } catch {
      toast({ title: "Error", description: "Failed to delete component.", variant: "destructive" });
    }
  };

  const getGradeName = (gradeId: string) => {
    const grade = grades.find((g: Grade) => g.id === gradeId);
    return grade ? `${grade.code} - ${grade.name}` : gradeId;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Salary Components</h3>
          <p className="text-sm text-muted-foreground">Define earnings and deductions for each grade</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedGradeFilter} onValueChange={setSelectedGradeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              {grades.map((grade: Grade) => (
                <SelectItem key={grade.id} value={grade.id}>{grade.code} - {grade.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) { setEditingComponent(null); form.reset(); } }}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Component
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingComponent ? "Edit Component" : "Create Salary Component"}</DialogTitle>
                <DialogDescription>Add an earning or deduction component to a grade</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="gradeId"
                    rules={{ required: "Grade is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grades.map((grade: Grade) => (
                              <SelectItem key={grade.id} value={grade.id}>{grade.code} - {grade.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="code"
                      rules={{ required: "Code is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., BASIC" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="earning">Earning</SelectItem>
                              <SelectItem value="deduction">Deduction</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Basic Salary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    rules={{ required: "Amount is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-6">
                    <FormField
                      control={form.control}
                      name="isPercentage"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal">Is Percentage</FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isTaxable"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal">Is Taxable</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full text-white border-0" style={{ backgroundColor: moduleColor }} disabled={createComponent.isPending || updateComponent.isPending}>
                    {editingComponent ? "Update Component" : "Create Component"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Grade</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Taxable</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading components...</TableCell>
                </TableRow>
              ) : filteredComponents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No salary components defined.</TableCell>
                </TableRow>
              ) : (
                filteredComponents.map((component: SalaryComponent) => (
                  <TableRow key={component.id}>
                    <TableCell className="font-medium">{getGradeName(component.gradeId)}</TableCell>
                    <TableCell>{component.code}</TableCell>
                    <TableCell>{component.name}</TableCell>
                    <TableCell>
                      <Badge className={component.type === "earning" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}>
                        {component.type === "earning" ? "Earning" : "Deduction"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {component.isPercentage ? `${component.amount}%` : formatCurrency(component.amount)}
                    </TableCell>
                    <TableCell>{component.isTaxable ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(component)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(component.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Payroll Runs Tab Component
function PayrollRunsTab({ moduleColor }: { moduleColor: string }) {
  const { data: payrollRuns = [], isLoading } = usePayrollRuns();
  const createPayrollRun = useCreatePayrollRun();
  const processPayrollRun = useProcessPayrollRun();
  const approvePayrollRun = useApprovePayrollRun();
  const markPaidPayrollRun = useMarkPayrollRunPaid();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const { data: payrollRecords = [] } = usePayrollRecords(selectedRunId || undefined);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      name: "",
      periodStart: "",
      periodEnd: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await createPayrollRun.mutateAsync(data);
      toast({ title: "Payroll Run Created", description: "Payroll run has been created. Process it to calculate salaries." });
      setIsDialogOpen(false);
      form.reset();
    } catch {
      toast({ title: "Error", description: "Failed to create payroll run.", variant: "destructive" });
    }
  };

  const handleProcess = async (id: string) => {
    try {
      await processPayrollRun.mutateAsync(id);
      toast({ title: "Payroll Processed", description: "Payroll has been calculated for all employees." });
    } catch {
      toast({ title: "Error", description: "Failed to process payroll.", variant: "destructive" });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approvePayrollRun.mutateAsync(id);
      toast({ title: "Payroll Approved", description: "Payroll run has been approved." });
    } catch {
      toast({ title: "Error", description: "Failed to approve payroll.", variant: "destructive" });
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await markPaidPayrollRun.mutateAsync(id);
      toast({ title: "Payroll Marked Paid", description: "Payroll has been marked as paid." });
    } catch {
      toast({ title: "Error", description: "Failed to mark payroll as paid.", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-600">Paid</Badge>;
      case "approved":
        return <Badge className="bg-blue-500/10 text-blue-600">Approved</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500/10 text-yellow-600">Processing</Badge>;
      case "draft":
        return <Badge className="bg-gray-500/10 text-gray-600">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Calculate totals
  const totalGross = payrollRuns.reduce((sum: number, r: PayrollRun) => sum + parseFloat(r.totalGrossPay?.toString() || "0"), 0);
  const totalDeductions = payrollRuns.reduce((sum: number, r: PayrollRun) => sum + parseFloat(r.totalDeductions?.toString() || "0"), 0);
  const totalNet = payrollRuns.reduce((sum: number, r: PayrollRun) => sum + parseFloat(r.totalNetPay?.toString() || "0"), 0);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Total Gross Pay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalGross)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Deductions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Total Net Pay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalNet)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Payroll Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payrollRuns.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Payroll Runs</h3>
          <p className="text-sm text-muted-foreground">Create and manage payroll cycles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor }}>
              <Plus className="w-4 h-4 mr-2" />
              New Payroll Run
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Payroll Run</DialogTitle>
              <DialogDescription>Start a new payroll cycle for a specific period</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., January 2024 Payroll" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="periodStart"
                    rules={{ required: "Start date is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period Start</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="periodEnd"
                    rules={{ required: "End date is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period End</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full text-white border-0" style={{ backgroundColor: moduleColor }} disabled={createPayrollRun.isPending}>
                  Create Payroll Run
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Gross Pay</TableHead>
                <TableHead className="text-right">Deductions</TableHead>
                <TableHead className="text-right">Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading payroll runs...</TableCell>
                </TableRow>
              ) : payrollRuns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No payroll runs. Create your first payroll run.</TableCell>
                </TableRow>
              ) : (
                payrollRuns.map((run: PayrollRun) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">{run.name}</TableCell>
                    <TableCell>{formatDate(run.periodStart)} - {formatDate(run.periodEnd)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(run.totalGrossPay)}</TableCell>
                    <TableCell className="text-right text-red-600">{formatCurrency(run.totalDeductions)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">{formatCurrency(run.totalNetPay)}</TableCell>
                    <TableCell>{getStatusBadge(run.status || "draft")}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedRunId(run.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Records
                          </DropdownMenuItem>
                          {run.status === "draft" && (
                            <DropdownMenuItem onClick={() => handleProcess(run.id)}>
                              <Play className="w-4 h-4 mr-2" />
                              Process
                            </DropdownMenuItem>
                          )}
                          {run.status === "processing" && (
                            <DropdownMenuItem onClick={() => handleApprove(run.id)}>
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          {run.status === "approved" && (
                            <DropdownMenuItem onClick={() => handleMarkPaid(run.id)}>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payroll Records for Selected Run */}
      {selectedRunId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Payroll Records</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRunId(null)}>Close</Button>
            </CardTitle>
            <CardDescription>Individual employee records for this payroll run</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead className="text-right">Gross Pay</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No records for this payroll run.</TableCell>
                  </TableRow>
                ) : (
                  payrollRecords.map((record: PayrollRecord) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employeeId}</TableCell>
                      <TableCell className="text-right">{formatCurrency(record.grossPay)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(record.totalDeductions)}</TableCell>
                      <TableCell className="text-right font-bold text-green-600">{formatCurrency(record.netPay)}</TableCell>
                      <TableCell>{getStatusBadge(record.status || "pending")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function PayrollPage() {
  const moduleColor = getModuleColor("hr");
  const [activeTab, setActiveTab] = useState("payroll");

  return (
    <SidebarLayout moduleId="hr">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Payroll Management</h1>
          <p className="text-muted-foreground mt-1">Manage grades, salary components, and process payroll</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Grades
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Salary Components
            </TabsTrigger>
            <TabsTrigger value="payroll" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Payroll Runs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grades" className="mt-6">
            <GradesTab moduleColor={moduleColor} />
          </TabsContent>

          <TabsContent value="components" className="mt-6">
            <SalaryComponentsTab moduleColor={moduleColor} />
          </TabsContent>

          <TabsContent value="payroll" className="mt-6">
            <PayrollRunsTab moduleColor={moduleColor} />
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
