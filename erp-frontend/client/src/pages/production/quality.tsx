import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  ClipboardCheck,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface QualityCheck {
  id: string;
  checkNumber: string;
  workOrder: string;
  productName: string;
  batchSize: number;
  sampleSize: number;
  passed: number;
  failed: number;
  defectRate: number;
  inspector: string;
  checkDate: string;
  status: "passed" | "failed" | "pending" | "in_review";
  notes: string;
}

// Mock data
const mockQualityChecks: QualityCheck[] = [
  { id: "1", checkNumber: "QC-2024-001", workOrder: "WO-2024-001", productName: "Steel Frame Assembly", batchSize: 100, sampleSize: 20, passed: 19, failed: 1, defectRate: 5, inspector: "James Wilson", checkDate: "2024-01-25", status: "passed", notes: "Minor surface scratch on 1 unit" },
  { id: "2", checkNumber: "QC-2024-002", workOrder: "WO-2024-002", productName: "Electronic Control Unit", batchSize: 250, sampleSize: 50, passed: 48, failed: 2, defectRate: 4, inspector: "Sarah Lee", checkDate: "2024-01-24", status: "passed", notes: "All units meet specifications" },
  { id: "3", checkNumber: "QC-2024-003", workOrder: "WO-2024-003", productName: "Plastic Housing", batchSize: 500, sampleSize: 100, passed: 85, failed: 15, defectRate: 15, inspector: "Michael Chen", checkDate: "2024-01-23", status: "failed", notes: "High defect rate - mold issues" },
  { id: "4", checkNumber: "QC-2024-004", workOrder: "WO-2024-004", productName: "Motor Assembly", batchSize: 75, sampleSize: 15, passed: 15, failed: 0, defectRate: 0, inspector: "Emily Brown", checkDate: "2024-01-22", status: "passed", notes: "Excellent quality" },
  { id: "5", checkNumber: "QC-2024-005", workOrder: "WO-2024-005", productName: "Circuit Board PCB", batchSize: 1000, sampleSize: 200, passed: 0, failed: 0, defectRate: 0, inspector: "David Kim", checkDate: "2024-01-26", status: "pending", notes: "Awaiting inspection" },
];

export default function QualityControlPage() {
  const moduleColor = getModuleColor("production");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      workOrder: "",
      sampleSize: "",
      inspector: "",
      notes: "",
    },
  });

  const onSubmit = (data: any) => {
    toast({
      title: "Quality Check Created",
      description: `Quality check for ${data.workOrder} has been scheduled.`,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const filteredChecks = mockQualityChecks.filter((check) => {
    const matchesSearch =
      check.checkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.workOrder.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || check.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalChecks = mockQualityChecks.length;
  const passedChecks = mockQualityChecks.filter((c) => c.status === "passed").length;
  const failedChecks = mockQualityChecks.filter((c) => c.status === "failed").length;
  const avgDefectRate = Math.round(
    mockQualityChecks.filter((c) => c.status !== "pending").reduce((sum, c) => sum + c.defectRate, 0) /
      (totalChecks - mockQualityChecks.filter((c) => c.status === "pending").length) || 0
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "passed":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Passed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "in_review":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">In Review</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDefectRateDisplay = (rate: number) => {
    if (rate === 0) return <span className="text-green-600 font-medium">0%</span>;
    if (rate <= 5) return <span className="text-green-600 font-medium">{rate}%</span>;
    if (rate <= 10) return <span className="text-yellow-600 font-medium">{rate}%</span>;
    return <span className="text-red-600 font-medium">{rate}%</span>;
  };

  return (
    <SidebarLayout moduleId="production">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Quality Control</h1>
            <p className="text-muted-foreground mt-1">Monitor quality checks and manage inspections</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Checks</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalChecks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Passed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{passedChecks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{failedChecks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Defect Rate</CardTitle>
              {avgDefectRate <= 5 ? (
                <TrendingDown className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${avgDefectRate <= 5 ? "text-green-600" : avgDefectRate <= 10 ? "text-yellow-600" : "text-red-600"}`}>
                {avgDefectRate}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quality checks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                New Quality Check
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Schedule Quality Check</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="workOrder"
                    rules={{ required: "Work order is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Order</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select work order" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="WO-2024-001">WO-2024-001 - Steel Frame</SelectItem>
                            <SelectItem value="WO-2024-002">WO-2024-002 - Control Unit</SelectItem>
                            <SelectItem value="WO-2024-003">WO-2024-003 - Plastic Housing</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="sampleSize"
                      rules={{ required: "Sample size is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sample Size</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="inspector"
                      rules={{ required: "Inspector is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inspector</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="James Wilson">James Wilson</SelectItem>
                              <SelectItem value="Sarah Lee">Sarah Lee</SelectItem>
                              <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Inspection notes..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    Schedule Check
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quality Checks Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Check #</TableHead>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sample</TableHead>
                  <TableHead className="text-right">Passed</TableHead>
                  <TableHead className="text-right">Failed</TableHead>
                  <TableHead className="text-right">Defect Rate</TableHead>
                  <TableHead>Inspector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChecks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell className="font-mono text-sm">{check.checkNumber}</TableCell>
                    <TableCell className="font-mono text-sm">{check.workOrder}</TableCell>
                    <TableCell>
                      <p className="font-medium">{check.productName}</p>
                      <p className="text-xs text-muted-foreground">Batch: {check.batchSize}</p>
                    </TableCell>
                    <TableCell className="text-right">{check.sampleSize}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600 font-medium">{check.passed}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={check.failed > 0 ? "text-red-600 font-medium" : ""}>{check.failed}</span>
                    </TableCell>
                    <TableCell className="text-right">{getDefectRateDisplay(check.defectRate)}</TableCell>
                    <TableCell>{check.inspector}</TableCell>
                    <TableCell>{getStatusBadge(check.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 mr-2" />
                            Re-inspect
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

        {filteredChecks.length === 0 && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No quality checks found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
