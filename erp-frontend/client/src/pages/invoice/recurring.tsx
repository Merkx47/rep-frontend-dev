import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getModuleColor } from "@/contexts/module-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  Calendar,
  DollarSign,
  Play,
  Pause,
} from "lucide-react";

interface RecurringInvoice {
  id: string;
  profileName: string;
  customerName: string;
  amount: number;
  frequency: "weekly" | "monthly" | "quarterly" | "yearly";
  nextDate: string;
  lastGenerated: string | null;
  totalGenerated: number;
  isActive: boolean;
}

// Mock data
const mockRecurringInvoices: RecurringInvoice[] = [
  { id: "1", profileName: "Monthly Hosting - Acme", customerName: "Acme Corporation", amount: 75000, frequency: "monthly", nextDate: "2024-02-01", lastGenerated: "2024-01-01", totalGenerated: 12, isActive: true },
  { id: "2", profileName: "Quarterly License - TechStart", customerName: "TechStart Ltd", amount: 450000, frequency: "quarterly", nextDate: "2024-04-01", lastGenerated: "2024-01-01", totalGenerated: 4, isActive: true },
  { id: "3", profileName: "Annual Support - Global", customerName: "Global Industries", amount: 2400000, frequency: "yearly", nextDate: "2024-06-15", lastGenerated: "2023-06-15", totalGenerated: 3, isActive: true },
  { id: "4", profileName: "Monthly Retainer - StartUp", customerName: "StartUp Inc", amount: 150000, frequency: "monthly", nextDate: "2024-02-01", lastGenerated: "2024-01-01", totalGenerated: 6, isActive: false },
  { id: "5", profileName: "Weekly Services - Enterprise", customerName: "Enterprise Solutions", amount: 50000, frequency: "weekly", nextDate: "2024-01-29", lastGenerated: "2024-01-22", totalGenerated: 52, isActive: true },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);
}

export default function RecurringInvoicesPage() {
  const moduleColor = getModuleColor("invoice");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      profileName: "",
      customerName: "",
      amount: "",
      frequency: "monthly",
      startDate: "",
    },
  });

  const onSubmit = (data: any) => {
    toast({
      title: "Recurring Invoice Created",
      description: `${data.profileName} has been set up.`,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const filteredInvoices = mockRecurringInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActive = !showActiveOnly || invoice.isActive;
    return matchesSearch && matchesActive;
  });

  // Stats
  const totalProfiles = mockRecurringInvoices.length;
  const activeProfiles = mockRecurringInvoices.filter((i) => i.isActive).length;
  const monthlyRevenue = mockRecurringInvoices
    .filter((i) => i.isActive)
    .reduce((sum, i) => {
      switch (i.frequency) {
        case "weekly": return sum + i.amount * 4;
        case "monthly": return sum + i.amount;
        case "quarterly": return sum + i.amount / 3;
        case "yearly": return sum + i.amount / 12;
        default: return sum;
      }
    }, 0);

  const getFrequencyBadge = (frequency: string) => {
    switch (frequency) {
      case "weekly":
        return <Badge variant="outline">Weekly</Badge>;
      case "monthly":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Monthly</Badge>;
      case "quarterly":
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-200">Quarterly</Badge>;
      case "yearly":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Yearly</Badge>;
      default:
        return <Badge variant="secondary">{frequency}</Badge>;
    }
  };

  return (
    <SidebarLayout moduleId="invoice">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Recurring Invoices</h1>
            <p className="text-muted-foreground mt-1">Automate billing with recurring invoice profiles</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Profiles</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProfiles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
              <Play className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeProfiles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Est. Monthly</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Next 7 Days</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">3</div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search profiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={showActiveOnly}
                onCheckedChange={setShowActiveOnly}
                id="active-only"
              />
              <label htmlFor="active-only" className="text-sm text-muted-foreground">
                Active only
              </label>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                New Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Recurring Invoice</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="profileName"
                    rules={{ required: "Profile name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Monthly Hosting - Client Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerName"
                    rules={{ required: "Customer is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                            <SelectItem value="TechStart Ltd">TechStart Ltd</SelectItem>
                            <SelectItem value="Global Industries">Global Industries</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      rules={{ required: "Amount is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (NGN)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="startDate"
                    rules={{ required: "Start date is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    Create Profile
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recurring Invoices Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Next Invoice</TableHead>
                  <TableHead className="text-right">Generated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.profileName}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{getFrequencyBadge(invoice.frequency)}</TableCell>
                    <TableCell>{invoice.nextDate}</TableCell>
                    <TableCell className="text-right">{invoice.totalGenerated}</TableCell>
                    <TableCell>
                      {invoice.isActive ? (
                        <Badge className="bg-green-500/10 text-green-600 border-green-200">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Paused</Badge>
                      )}
                    </TableCell>
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
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {invoice.isActive ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Resume
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
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

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No recurring invoices found</h3>
            <p className="text-muted-foreground">Create a profile to automate billing.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
