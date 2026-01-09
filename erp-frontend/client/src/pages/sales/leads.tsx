import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  useSalesLeads,
  useCreateSalesLead,
  useUpdateSalesLead,
  useDeleteSalesLead,
  useConvertLeadToCustomer,
} from "@/hooks/use-sales";
import type { SalesLead } from "@shared/schema";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  UserPlus,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Building2,
  DollarSign,
  Calendar,
} from "lucide-react";

function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === "string" ? parseFloat(amount) : (amount ?? 0);
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(num);
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

const leadSources = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "cold_call", label: "Cold Call" },
  { value: "advertisement", label: "Advertisement" },
  { value: "trade_show", label: "Trade Show" },
  { value: "social_media", label: "Social Media" },
  { value: "other", label: "Other" },
];

const leadStatuses = [
  { value: "new", label: "New", color: "bg-blue-500/10 text-blue-600" },
  { value: "contacted", label: "Contacted", color: "bg-purple-500/10 text-purple-600" },
  { value: "qualified", label: "Qualified", color: "bg-yellow-500/10 text-yellow-600" },
  { value: "proposal", label: "Proposal", color: "bg-orange-500/10 text-orange-600" },
  { value: "negotiation", label: "Negotiation", color: "bg-cyan-500/10 text-cyan-600" },
  { value: "won", label: "Won", color: "bg-green-500/10 text-green-600" },
  { value: "lost", label: "Lost", color: "bg-red-500/10 text-red-600" },
];

const leadPriorities = [
  { value: "low", label: "Low", color: "bg-gray-500/10 text-gray-600" },
  { value: "medium", label: "Medium", color: "bg-yellow-500/10 text-yellow-600" },
  { value: "high", label: "High", color: "bg-red-500/10 text-red-600" },
];

export default function LeadsPage() {
  const moduleColor = getModuleColor("sales");
  const { data: leads = [], isLoading } = useSalesLeads();
  const createLead = useCreateSalesLead();
  const updateLead = useUpdateSalesLead();
  const deleteLead = useDeleteSalesLead();
  const convertToCustomer = useConvertLeadToCustomer();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<SalesLead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      source: "website" as string,
      status: "new" as string,
      priority: "medium" as string,
      estimatedValue: "",
      notes: "",
    },
  });

  // Filter leads
  const filteredLeads = leads.filter((lead: SalesLead) => {
    const matchesSearch =
      lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalLeads = leads.length;
  const newLeads = leads.filter((l: SalesLead) => l.status === "new").length;
  const qualifiedLeads = leads.filter((l: SalesLead) => ["qualified", "proposal", "negotiation"].includes(l.status || "")).length;
  const wonLeads = leads.filter((l: SalesLead) => l.status === "won").length;
  const totalValue = leads.reduce((sum: number, l: SalesLead) => sum + parseFloat(l.estimatedValue?.toString() || "0"), 0);

  const onSubmit = async (data: any) => {
    try {
      if (editingLead) {
        await updateLead.mutateAsync({ id: editingLead.id, data });
        toast({ title: "Lead Updated", description: "Sales lead has been updated successfully." });
      } else {
        await createLead.mutateAsync(data);
        toast({ title: "Lead Created", description: "Sales lead has been created successfully." });
      }
      setIsDialogOpen(false);
      setEditingLead(null);
      form.reset();
    } catch {
      toast({ title: "Error", description: "Failed to save lead.", variant: "destructive" });
    }
  };

  const handleEdit = (lead: SalesLead) => {
    setEditingLead(lead);
    form.reset({
      companyName: lead.companyName || "",
      contactPerson: lead.contactPerson || "",
      email: lead.email || "",
      phone: lead.phone || "",
      source: lead.source || "website",
      status: lead.status || "new",
      priority: lead.priority || "medium",
      estimatedValue: lead.estimatedValue?.toString() || "",
      notes: lead.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead.mutateAsync(id);
      toast({ title: "Lead Deleted", description: "Sales lead has been deleted successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to delete lead.", variant: "destructive" });
    }
  };

  const handleConvert = async (id: string) => {
    try {
      await convertToCustomer.mutateAsync(id);
      toast({ title: "Lead Converted", description: "Sales lead has been converted to a customer successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to convert lead.", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusConfig = leadStatuses.find((s) => s.value === status) || leadStatuses[0];
    return <Badge className={statusConfig.color}>{statusConfig.label}</Badge>;
  };

  const getPriorityBadge = (priority: string | null) => {
    const priorityConfig = leadPriorities.find((p) => p.value === priority) || leadPriorities[1];
    return <Badge className={priorityConfig.color}>{priorityConfig.label}</Badge>;
  };

  const getSourceLabel = (source: string | null) => {
    return leadSources.find((s) => s.value === source)?.label || source || "-";
  };

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Sales Leads</h1>
          <p className="text-muted-foreground mt-1">Track and manage potential customers through the sales pipeline</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalLeads}</p>
                  <p className="text-xs text-muted-foreground">Total Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{newLeads}</p>
                  <p className="text-xs text-muted-foreground">New Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{qualifiedLeads}</p>
                  <p className="text-xs text-muted-foreground">In Pipeline</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{wonLeads}</p>
                  <p className="text-xs text-muted-foreground">Won Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                  <p className="text-xs text-muted-foreground">Pipeline Value</p>
                </div>
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
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {leadStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) { setEditingLead(null); form.reset(); } }}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingLead ? "Edit Lead" : "Create New Lead"}</DialogTitle>
                <DialogDescription>Enter the details for this sales lead</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    rules={{ required: "Company name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+234 xxx xxx xxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {leadSources.map((source) => (
                                <SelectItem key={source.value} value={source.value}>
                                  {source.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {leadStatuses.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {leadPriorities.map((priority) => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  {priority.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="estimatedValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Value (NGN)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional notes about this lead..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-white border-0" style={{ backgroundColor: moduleColor }} disabled={createLead.isPending || updateLead.isPending}>
                    {editingLead ? "Update Lead" : "Create Lead"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
            <CardDescription>Track and manage your sales leads through the pipeline</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Est. Value</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading leads...
                    </TableCell>
                  </TableRow>
                ) : filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No leads found. Create your first lead.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead: SalesLead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.companyName}</p>
                          {lead.code && <p className="text-xs text-muted-foreground">{lead.code}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{lead.contactPerson || "-"}</p>
                          {lead.email && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getSourceLabel(lead.source)}</TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>{getPriorityBadge(lead.priority)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(lead.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(lead)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {lead.status !== "won" && lead.status !== "lost" && (
                              <DropdownMenuItem onClick={() => handleConvert(lead.id)}>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Convert to Customer
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="text-destructive">
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
    </SidebarLayout>
  );
}
