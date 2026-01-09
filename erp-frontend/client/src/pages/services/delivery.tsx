import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Calendar,
  User,
  FileText,
  Plus,
} from "lucide-react";

interface ServiceDelivery {
  id: string;
  serviceOrderId: string;
  serviceName: string;
  customer: string;
  assignedTo: string;
  startDate: string;
  expectedEndDate: string;
  actualEndDate: string | null;
  progress: number;
  status: "scheduled" | "in_progress" | "on_hold" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  hoursLogged: number;
  hoursEstimated: number;
  notes: string;
}

// Mock data
const mockDeliveries: ServiceDelivery[] = [
  {
    id: "1",
    serviceOrderId: "SO-2024-001",
    serviceName: "ERP Implementation",
    customer: "ABC Corporation",
    assignedTo: "John Smith",
    startDate: "2024-06-01",
    expectedEndDate: "2024-08-30",
    actualEndDate: null,
    progress: 65,
    status: "in_progress",
    priority: "high",
    hoursLogged: 320,
    hoursEstimated: 500,
    notes: "Phase 2 in progress"
  },
  {
    id: "2",
    serviceOrderId: "SO-2024-002",
    serviceName: "Cloud Migration",
    customer: "Tech Innovations Ltd",
    assignedTo: "Sarah Johnson",
    startDate: "2024-06-15",
    expectedEndDate: "2024-07-31",
    actualEndDate: null,
    progress: 85,
    status: "in_progress",
    priority: "urgent",
    hoursLogged: 180,
    hoursEstimated: 200,
    notes: "Final testing phase"
  },
  {
    id: "3",
    serviceOrderId: "SO-2024-003",
    serviceName: "Security Audit",
    customer: "Financial Services Inc",
    assignedTo: "Mike Williams",
    startDate: "2024-06-20",
    expectedEndDate: "2024-06-30",
    actualEndDate: "2024-06-28",
    progress: 100,
    status: "completed",
    priority: "medium",
    hoursLogged: 45,
    hoursEstimated: 50,
    notes: "Completed ahead of schedule"
  },
  {
    id: "4",
    serviceOrderId: "SO-2024-004",
    serviceName: "Data Migration",
    customer: "Global Retail Group",
    assignedTo: "Emily Davis",
    startDate: "2024-07-01",
    expectedEndDate: "2024-08-15",
    actualEndDate: null,
    progress: 30,
    status: "on_hold",
    priority: "medium",
    hoursLogged: 60,
    hoursEstimated: 200,
    notes: "Waiting for customer data"
  },
  {
    id: "5",
    serviceOrderId: "SO-2024-005",
    serviceName: "Technical Support",
    customer: "Healthcare Solutions",
    assignedTo: "David Brown",
    startDate: "2024-07-05",
    expectedEndDate: "2024-07-05",
    actualEndDate: "2024-07-05",
    progress: 100,
    status: "completed",
    priority: "low",
    hoursLogged: 4,
    hoursEstimated: 4,
    notes: "Routine support call"
  },
  {
    id: "6",
    serviceOrderId: "SO-2024-006",
    serviceName: "Custom Development",
    customer: "Manufacturing Plus",
    assignedTo: "Lisa Anderson",
    startDate: "2024-07-10",
    expectedEndDate: "2024-09-30",
    actualEndDate: null,
    progress: 15,
    status: "in_progress",
    priority: "high",
    hoursLogged: 45,
    hoursEstimated: 300,
    notes: "Requirements gathering complete"
  },
  {
    id: "7",
    serviceOrderId: "SO-2024-007",
    serviceName: "Managed IT Support",
    customer: "Legal Associates",
    assignedTo: "Robert Taylor",
    startDate: "2024-01-01",
    expectedEndDate: "2024-12-31",
    actualEndDate: null,
    progress: 55,
    status: "in_progress",
    priority: "medium",
    hoursLogged: 280,
    hoursEstimated: 500,
    notes: "Monthly retainer - on track"
  },
  {
    id: "8",
    serviceOrderId: "SO-2024-008",
    serviceName: "Training Workshop",
    customer: "Education First",
    assignedTo: "Jennifer White",
    startDate: "2024-08-01",
    expectedEndDate: "2024-08-03",
    actualEndDate: null,
    progress: 0,
    status: "scheduled",
    priority: "low",
    hoursLogged: 0,
    hoursEstimated: 24,
    notes: "3-day on-site training"
  },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

// Mock services for dropdown
const mockServices = [
  { id: "1", name: "ERP Implementation" },
  { id: "2", name: "Cloud Migration" },
  { id: "3", name: "Security Audit" },
  { id: "4", name: "Data Migration" },
  { id: "5", name: "Technical Support" },
  { id: "6", name: "Custom Development" },
  { id: "7", name: "Managed IT Support" },
  { id: "8", name: "Training Workshop" },
];

// Mock customers for dropdown
const mockCustomers = [
  { id: "1", name: "ABC Corporation" },
  { id: "2", name: "Tech Innovations Ltd" },
  { id: "3", name: "Financial Services Inc" },
  { id: "4", name: "Global Retail Group" },
  { id: "5", name: "Healthcare Solutions" },
  { id: "6", name: "Manufacturing Plus" },
  { id: "7", name: "Legal Associates" },
  { id: "8", name: "Education First" },
];

// Mock staff for dropdown
const mockStaff = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Sarah Johnson" },
  { id: "3", name: "Mike Williams" },
  { id: "4", name: "Emily Davis" },
  { id: "5", name: "David Brown" },
  { id: "6", name: "Lisa Anderson" },
  { id: "7", name: "Robert Taylor" },
  { id: "8", name: "Jennifer White" },
];

export default function ServiceDeliveryPage() {
  const moduleColor = getModuleColor("sales");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [isAddDeliveryOpen, setIsAddDeliveryOpen] = useState(false);
  const [deliveries, setDeliveries] = useState<ServiceDelivery[]>(mockDeliveries);
  const { toast } = useToast();

  // New delivery form state
  const [newDelivery, setNewDelivery] = useState({
    serviceName: "",
    customer: "",
    assignedTo: "",
    startDate: "",
    expectedEndDate: "",
    hoursEstimated: 0,
    priority: "medium" as "low" | "medium" | "high" | "urgent",
    notes: "",
  });

  const handleStatusChange = (delivery: ServiceDelivery, newStatus: string) => {
    setDeliveries(deliveries.map(d =>
      d.id === delivery.id ? { ...d, status: newStatus as ServiceDelivery["status"] } : d
    ));
    toast({
      title: "Status Updated",
      description: `${delivery.serviceName} status changed to ${newStatus}.`,
    });
  };

  const handleAddDelivery = () => {
    if (!newDelivery.serviceName || !newDelivery.customer || !newDelivery.assignedTo || !newDelivery.startDate || !newDelivery.expectedEndDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newId = (deliveries.length + 1).toString();
    const orderYear = new Date().getFullYear();
    const orderNum = String(deliveries.length + 1).padStart(3, "0");

    const delivery: ServiceDelivery = {
      id: newId,
      serviceOrderId: `SO-${orderYear}-${orderNum}`,
      serviceName: newDelivery.serviceName,
      customer: newDelivery.customer,
      assignedTo: newDelivery.assignedTo,
      startDate: newDelivery.startDate,
      expectedEndDate: newDelivery.expectedEndDate,
      actualEndDate: null,
      progress: 0,
      status: "scheduled",
      priority: newDelivery.priority,
      hoursLogged: 0,
      hoursEstimated: newDelivery.hoursEstimated,
      notes: newDelivery.notes,
    };

    setDeliveries([...deliveries, delivery]);
    setNewDelivery({
      serviceName: "",
      customer: "",
      assignedTo: "",
      startDate: "",
      expectedEndDate: "",
      hoursEstimated: 0,
      priority: "medium",
      notes: "",
    });
    setIsAddDeliveryOpen(false);
    toast({
      title: "Delivery Created",
      description: `Service delivery ${delivery.serviceOrderId} has been created.`,
    });
  };

  // Filter deliveries
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.serviceOrderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || delivery.status === selectedStatus;
    const matchesPriority = selectedPriority === "all" || delivery.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Stats
  const totalDeliveries = deliveries.length;
  const inProgress = deliveries.filter((d) => d.status === "in_progress").length;
  const completed = deliveries.filter((d) => d.status === "completed").length;
  const onHold = deliveries.filter((d) => d.status === "on_hold").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Scheduled</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">In Progress</Badge>;
      case "on_hold":
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-200">On Hold</Badge>;
      case "completed":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "low":
        return <Badge variant="outline" className="text-slate-600 border-slate-200">Low</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Medium</Badge>;
      case "high":
        return <Badge variant="outline" className="text-orange-600 border-orange-200">High</Badge>;
      case "urgent":
        return <Badge variant="outline" className="text-red-600 border-red-200">Urgent</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-amber-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-slate-400";
  };

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Service Delivery</h1>
            <p className="text-muted-foreground mt-1">Track and manage ongoing service deliveries</p>
          </div>
          <Dialog open={isAddDeliveryOpen} onOpenChange={setIsAddDeliveryOpen}>
            <DialogTrigger asChild>
              <Button
                className="text-white shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Delivery
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Service Delivery</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Service *</Label>
                  <Select
                    value={newDelivery.serviceName}
                    onValueChange={(value) => setNewDelivery({ ...newDelivery, serviceName: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockServices.map((service) => (
                        <SelectItem key={service.id} value={service.name}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Customer *</Label>
                  <Select
                    value={newDelivery.customer}
                    onValueChange={(value) => setNewDelivery({ ...newDelivery, customer: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.name}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assigned To *</Label>
                  <Select
                    value={newDelivery.assignedTo}
                    onValueChange={(value) => setNewDelivery({ ...newDelivery, assignedTo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStaff.map((staff) => (
                        <SelectItem key={staff.id} value={staff.name}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Input
                      type="date"
                      value={newDelivery.startDate}
                      onChange={(e) => setNewDelivery({ ...newDelivery, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expected End Date *</Label>
                    <Input
                      type="date"
                      value={newDelivery.expectedEndDate}
                      onChange={(e) => setNewDelivery({ ...newDelivery, expectedEndDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Estimated Hours</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newDelivery.hoursEstimated || ""}
                      onChange={(e) => setNewDelivery({ ...newDelivery, hoursEstimated: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={newDelivery.priority}
                      onValueChange={(value: "low" | "medium" | "high" | "urgent") => setNewDelivery({ ...newDelivery, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Add any additional notes..."
                    value={newDelivery.notes}
                    onChange={(e) => setNewDelivery({ ...newDelivery, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDeliveryOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddDelivery}
                  className="text-white"
                  style={{ backgroundColor: moduleColor }}
                >
                  Create Delivery
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-violet-500" />
                <span className="text-2xl font-bold">{totalDeliveries}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold text-amber-600">{inProgress}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{completed}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">On Hold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <PauseCircle className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold text-orange-600">{onHold}</span>
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
                placeholder="Search deliveries..."
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
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Deliveries Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No deliveries found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-mono text-sm">{delivery.serviceOrderId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{delivery.serviceName}</p>
                          <p className="text-xs text-muted-foreground">{delivery.hoursLogged}h / {delivery.hoursEstimated}h</p>
                        </div>
                      </TableCell>
                      <TableCell>{delivery.customer}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm">{delivery.assignedTo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(delivery.startDate)} - {formatDate(delivery.expectedEndDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 min-w-[100px]">
                          <div className="flex justify-between text-xs">
                            <span>{delivery.progress}%</span>
                          </div>
                          <Progress value={delivery.progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(delivery.priority)}</TableCell>
                      <TableCell>{getStatusBadge(delivery.status)}</TableCell>
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
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(delivery, "in_progress")}>
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Mark In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(delivery, "on_hold")}>
                              <PauseCircle className="w-4 h-4 mr-2" />
                              Mark On Hold
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(delivery, "completed")}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleStatusChange(delivery, "cancelled")}>
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Cancel Delivery
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
