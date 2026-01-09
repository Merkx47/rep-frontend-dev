import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Calendar,
  Clock,
  Palmtree,
  Stethoscope,
  Baby,
  Briefcase,
} from "lucide-react";

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: "annual" | "sick" | "maternity" | "paternity" | "unpaid" | "bereavement";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  requestedOn: string;
  approvedBy: string | null;
}

// Mock data
const mockLeaveRequests: LeaveRequest[] = [
  { id: "1", employeeId: "EMP-001", employeeName: "Adebayo Okonkwo", department: "Engineering", leaveType: "annual", startDate: "2024-02-15", endDate: "2024-02-22", days: 6, reason: "Family vacation", status: "approved", requestedOn: "2024-01-25", approvedBy: "Chidi Eze" },
  { id: "2", employeeId: "EMP-002", employeeName: "Ngozi Adeyemi", department: "Marketing", leaveType: "sick", startDate: "2024-02-01", endDate: "2024-02-02", days: 2, reason: "Doctor's appointment and rest", status: "approved", requestedOn: "2024-01-31", approvedBy: "Funke Akindele" },
  { id: "3", employeeId: "EMP-004", employeeName: "Amara Okwu", department: "Finance", leaveType: "maternity", startDate: "2024-01-15", endDate: "2024-04-15", days: 90, reason: "Maternity leave", status: "approved", requestedOn: "2024-01-05", approvedBy: "Bola Tinubu" },
  { id: "4", employeeId: "EMP-007", employeeName: "Yusuf Ibrahim", department: "Operations", leaveType: "annual", startDate: "2024-02-28", endDate: "2024-03-05", days: 5, reason: "Personal travel", status: "pending", requestedOn: "2024-02-01", approvedBy: null },
  { id: "5", employeeId: "EMP-008", employeeName: "Chiamaka Obi", department: "HR", leaveType: "sick", startDate: "2024-02-10", endDate: "2024-02-10", days: 1, reason: "Not feeling well", status: "pending", requestedOn: "2024-02-09", approvedBy: null },
  { id: "6", employeeId: "EMP-003", employeeName: "Chidi Eze", department: "Engineering", leaveType: "bereavement", startDate: "2024-01-20", endDate: "2024-01-25", days: 5, reason: "Family bereavement", status: "approved", requestedOn: "2024-01-19", approvedBy: "Emeka Nwosu" },
  { id: "7", employeeId: "EMP-006", employeeName: "Funke Akindele", department: "Marketing", leaveType: "annual", startDate: "2024-03-01", endDate: "2024-03-08", days: 6, reason: "International conference", status: "pending", requestedOn: "2024-02-05", approvedBy: null },
  { id: "8", employeeId: "EMP-001", employeeName: "Adebayo Okonkwo", department: "Engineering", leaveType: "unpaid", startDate: "2024-04-01", endDate: "2024-04-05", days: 5, reason: "Extended personal leave", status: "rejected", requestedOn: "2024-02-01", approvedBy: null },
];

const leaveTypes = [
  { value: "annual", label: "Annual Leave", icon: Palmtree },
  { value: "sick", label: "Sick Leave", icon: Stethoscope },
  { value: "maternity", label: "Maternity Leave", icon: Baby },
  { value: "paternity", label: "Paternity Leave", icon: Baby },
  { value: "unpaid", label: "Unpaid Leave", icon: Briefcase },
  { value: "bereavement", label: "Bereavement Leave", icon: Calendar },
];

const departments = [
  "Executive",
  "Engineering",
  "Marketing",
  "Finance",
  "HR",
  "Operations",
];

export default function LeavePage() {
  const moduleColor = getModuleColor("hr");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      employeeId: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const onSubmit = (data: any) => {
    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been submitted for approval.",
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleApprove = (request: LeaveRequest) => {
    toast({
      title: "Leave Approved",
      description: `Leave request for ${request.employeeName} has been approved.`,
    });
  };

  const handleReject = (request: LeaveRequest) => {
    toast({
      title: "Leave Rejected",
      description: `Leave request for ${request.employeeName} has been rejected.`,
      variant: "destructive",
    });
  };

  // Filter requests
  const filteredRequests = mockLeaveRequests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || request.leaveType === selectedType;
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Stats
  const totalRequests = mockLeaveRequests.length;
  const pendingRequests = mockLeaveRequests.filter((r) => r.status === "pending").length;
  const approvedRequests = mockLeaveRequests.filter((r) => r.status === "approved").length;
  const totalDaysOff = mockLeaveRequests.filter((r) => r.status === "approved").reduce((sum, r) => sum + r.days, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Pending</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    const leaveType = leaveTypes.find((lt) => lt.value === type);
    const Icon = leaveType?.icon || Calendar;

    const colors: Record<string, string> = {
      annual: "bg-blue-500/10 text-blue-600 border-blue-200",
      sick: "bg-red-500/10 text-red-600 border-red-200",
      maternity: "bg-pink-500/10 text-pink-600 border-pink-200",
      paternity: "bg-purple-500/10 text-purple-600 border-purple-200",
      unpaid: "bg-gray-500/10 text-gray-600 border-gray-200",
      bereavement: "bg-slate-500/10 text-slate-600 border-slate-200",
    };

    return (
      <Badge className={colors[type] || "bg-gray-500/10 text-gray-600 border-gray-200"}>
        <Icon className="w-3 h-3 mr-1" />
        {leaveType?.label || type}
      </Badge>
    );
  };

  return (
    <SidebarLayout moduleId="hr">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Leave Management</h1>
            <p className="text-muted-foreground mt-1">Manage employee leave requests and balances</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 rounded-xl border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Submit Leave Request</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    rules={{ required: "Employee is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockLeaveRequests.slice(0, 5).map((record) => (
                              <SelectItem key={record.employeeId} value={record.employeeId}>
                                {record.employeeName} ({record.employeeId})
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
                    name="leaveType"
                    rules={{ required: "Leave type is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {leaveTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
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
                    <FormField
                      control={form.control}
                      name="endDate"
                      rules={{ required: "End date is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="reason"
                    rules={{ required: "Reason is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Please provide a reason for your leave request..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    Submit Request
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Palmtree className="h-4 w-4" />
                Days Off (Approved)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDaysOff}</div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Leave Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Leave Requests Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No leave requests found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.employeeName}</p>
                          <p className="text-xs text-muted-foreground">{request.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getLeaveTypeBadge(request.leaveType)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{new Date(request.startDate).toLocaleDateString()}</p>
                          <p className="text-muted-foreground">to {new Date(request.endDate).toLocaleDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{request.days}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {request.reason}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
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
                            {request.status === "pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() => handleApprove(request)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleReject(request)}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
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
