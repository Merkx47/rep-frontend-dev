import { useState, useMemo } from "react";
import { PlatformLayout } from "@/components/platform-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  HeadphonesIcon,
  Search,
  MoreHorizontal,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Building2,
  Calendar,
  Send,
  Paperclip,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useTablePagination } from "@/hooks/use-table-pagination";

// Mock tickets data
const mockTickets = [
  {
    id: "TKT-001",
    subject: "Unable to generate invoice",
    description: "Getting an error when trying to generate invoice for customer ABC Corp. The system shows 'Template not found' error.",
    tenant: { name: "TechCorp Industries", email: "admin@techcorp.com" },
    category: "Technical",
    priority: "high",
    status: "open",
    assignee: null,
    createdAt: "2024-01-10 14:30",
    updatedAt: "2024-01-10 14:30",
    messages: [
      {
        id: "1",
        sender: "tenant",
        senderName: "John Admin",
        message: "Getting an error when trying to generate invoice for customer ABC Corp. The system shows 'Template not found' error.",
        timestamp: "2024-01-10 14:30",
      },
    ],
  },
  {
    id: "TKT-002",
    subject: "Request for custom report",
    description: "We need a custom sales report that shows monthly trends with breakdown by product category.",
    tenant: { name: "MetroBank Financial", email: "tech@metrobank.ng" },
    category: "Feature Request",
    priority: "medium",
    status: "in_progress",
    assignee: "Sarah Manager",
    createdAt: "2024-01-10 09:15",
    updatedAt: "2024-01-10 11:45",
    messages: [
      {
        id: "1",
        sender: "tenant",
        senderName: "Finance Team",
        message: "We need a custom sales report that shows monthly trends with breakdown by product category.",
        timestamp: "2024-01-10 09:15",
      },
      {
        id: "2",
        sender: "admin",
        senderName: "Sarah Manager",
        message: "Thank you for reaching out. I've noted your requirements. Our team will look into creating this custom report. Could you provide more details on the date range and specific categories you'd like to include?",
        timestamp: "2024-01-10 11:45",
      },
    ],
  },
  {
    id: "TKT-003",
    subject: "API integration help needed",
    description: "Need assistance integrating our CRM with the Qorpy API. Documentation seems incomplete.",
    tenant: { name: "GreenLeaf Solutions", email: "contact@greenleaf.ng" },
    category: "Integration",
    priority: "low",
    status: "open",
    assignee: null,
    createdAt: "2024-01-09 16:20",
    updatedAt: "2024-01-09 16:20",
    messages: [
      {
        id: "1",
        sender: "tenant",
        senderName: "Dev Team",
        message: "Need assistance integrating our CRM with the Qorpy API. Documentation seems incomplete for the authentication flow.",
        timestamp: "2024-01-09 16:20",
      },
    ],
  },
  {
    id: "TKT-004",
    subject: "Billing discrepancy",
    description: "We were charged twice for the December subscription. Please investigate and refund.",
    tenant: { name: "Swift Logistics", email: "ops@swiftlogistics.ng" },
    category: "Billing",
    priority: "high",
    status: "resolved",
    assignee: "Lisa Finance",
    createdAt: "2024-01-08 10:00",
    updatedAt: "2024-01-09 14:30",
    messages: [
      {
        id: "1",
        sender: "tenant",
        senderName: "Accounts",
        message: "We were charged twice for the December subscription. Please investigate and refund.",
        timestamp: "2024-01-08 10:00",
      },
      {
        id: "2",
        sender: "admin",
        senderName: "Lisa Finance",
        message: "I've reviewed your account and confirmed the duplicate charge. A refund has been processed and should reflect in 3-5 business days.",
        timestamp: "2024-01-09 14:30",
      },
    ],
  },
  {
    id: "TKT-005",
    subject: "Employee import failing",
    description: "CSV import for employees keeps failing with validation error on row 45.",
    tenant: { name: "EduTech Academy", email: "admin@edutech.edu" },
    category: "Technical",
    priority: "medium",
    status: "closed",
    assignee: "Mike Support",
    createdAt: "2024-01-07 11:30",
    updatedAt: "2024-01-08 09:15",
    messages: [
      {
        id: "1",
        sender: "tenant",
        senderName: "HR Admin",
        message: "CSV import for employees keeps failing with validation error on row 45.",
        timestamp: "2024-01-07 11:30",
      },
      {
        id: "2",
        sender: "admin",
        senderName: "Mike Support",
        message: "The issue was with the date format in row 45. Please use DD/MM/YYYY format. I've attached a sample template.",
        timestamp: "2024-01-07 15:00",
      },
      {
        id: "3",
        sender: "tenant",
        senderName: "HR Admin",
        message: "Thank you! That fixed it. Import successful now.",
        timestamp: "2024-01-08 09:15",
      },
    ],
  },
  {
    id: "TKT-006",
    subject: "Request to upgrade plan",
    description: "We want to upgrade from Professional to Enterprise plan. Please advise on the process.",
    tenant: { name: "AutoParts Plus", email: "sales@autoparts.com" },
    category: "Billing",
    priority: "medium",
    status: "in_progress",
    assignee: "Lisa Finance",
    createdAt: "2024-01-06 14:00",
    updatedAt: "2024-01-07 10:30",
    messages: [
      {
        id: "1",
        sender: "tenant",
        senderName: "Admin",
        message: "We want to upgrade from Professional to Enterprise plan. Please advise on the process and pricing.",
        timestamp: "2024-01-06 14:00",
      },
      {
        id: "2",
        sender: "admin",
        senderName: "Lisa Finance",
        message: "Great to hear you're looking to upgrade! I'll prepare a quote for the Enterprise plan and send it over shortly.",
        timestamp: "2024-01-07 10:30",
      },
    ],
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "medium":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "low":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "in_progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "resolved":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "closed":
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    case "in_progress":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "resolved":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case "closed":
      return <XCircle className="w-4 h-4 text-slate-400" />;
    default:
      return null;
  }
};

// Team members for assignment
const teamMembers = [
  { id: "1", name: "Sarah Manager" },
  { id: "2", name: "Mike Support" },
  { id: "3", name: "Lisa Finance" },
  { id: "4", name: "David Support" },
];

export default function AdminSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const { toast } = useToast();

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return mockTickets.filter((ticket) => {
      const matchesSearch =
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.tenant.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchQuery, statusFilter, priorityFilter]);

  // Pagination
  const {
    paginatedData: paginatedTickets,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage,
    setPageSize,
  } = useTablePagination({ data: filteredTickets, initialPageSize: 10 });

  // Stats
  const stats = {
    total: mockTickets.length,
    open: mockTickets.filter((t) => t.status === "open").length,
    inProgress: mockTickets.filter((t) => t.status === "in_progress").length,
    resolved: mockTickets.filter((t) => t.status === "resolved" || t.status === "closed").length,
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    toast({
      title: "Reply Sent",
      description: "Your response has been sent to the tenant.",
    });
    setReplyMessage("");
  };

  const handleAssign = (ticket: typeof mockTickets[0], assignee: string) => {
    toast({
      title: "Ticket Assigned",
      description: `${ticket.id} has been assigned to ${assignee}.`,
    });
  };

  const handleChangeStatus = (ticket: typeof mockTickets[0], status: string) => {
    toast({
      title: "Status Updated",
      description: `${ticket.id} status changed to ${status.replace("_", " ")}.`,
    });
  };

  return (
    <PlatformLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Support Tickets
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and respond to tenant support requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <HeadphonesIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Tickets</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Open</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.open}</p>
                    <ArrowUpRight className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">In Progress</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Resolved</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.resolved}</p>
                    <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Table */}
        <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-slate-900 dark:text-white">All Tickets</CardTitle>
                <CardDescription>Manage support requests from tenants</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-9 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No tickets found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                            {ticket.id}
                          </p>
                          <p className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]">
                            {ticket.subject}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {ticket.tenant.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                        {ticket.category}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getPriorityColor(ticket.priority)}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                            {ticket.status.replace("_", " ").charAt(0).toUpperCase() + ticket.status.replace("_", " ").slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 dark:text-slate-300">
                        {ticket.assignee || "-"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                        {ticket.updatedAt}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedTicket(ticket)}>
                              <MessageSquare className="w-4 h-4 mr-2" />
                              View & Reply
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleChangeStatus(ticket, "in_progress")}>
                              <Clock className="w-4 h-4 mr-2" />
                              Mark In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeStatus(ticket, "resolved")}>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Mark Resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeStatus(ticket, "closed")}>
                              <XCircle className="w-4 h-4 mr-2" />
                              Close Ticket
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </CardContent>
        </Card>

        {/* Ticket Detail Dialog */}
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="font-mono text-sm text-slate-500">{selectedTicket?.id}</span>
                <span className="text-slate-900 dark:text-white">{selectedTicket?.subject}</span>
              </DialogTitle>
              <DialogDescription>
                From {selectedTicket?.tenant.name} • {selectedTicket?.createdAt}
              </DialogDescription>
            </DialogHeader>
            {selectedTicket && (
              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Ticket Info */}
                <div className="flex flex-wrap gap-4 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Priority:</span>
                    <Badge variant="secondary" className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Status:</span>
                    <Select
                      defaultValue={selectedTicket.status}
                      onValueChange={(value) => handleChangeStatus(selectedTicket, value)}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-500">Assignee:</span>
                    <Select
                      defaultValue={selectedTicket.assignee || "unassigned"}
                      onValueChange={(value) => handleAssign(selectedTicket, value)}
                    >
                      <SelectTrigger className="w-[160px] h-8">
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === "admin" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === "admin"
                            ? "bg-indigo-100 dark:bg-indigo-900/30"
                            : "bg-slate-100 dark:bg-slate-700"
                        }`}
                      >
                        <User
                          className={`w-4 h-4 ${
                            message.sender === "admin"
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-slate-600 dark:text-slate-300"
                          }`}
                        />
                      </div>
                      <div
                        className={`flex-1 max-w-[80%] ${
                          message.sender === "admin" ? "text-right" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === "admin" && (
                            <span className="text-xs text-slate-500">{message.timestamp}</span>
                          )}
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {message.senderName}
                          </span>
                          {message.sender !== "admin" && (
                            <span className="text-xs text-slate-500">{message.timestamp}</span>
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            message.sender === "admin"
                              ? "bg-indigo-50 dark:bg-indigo-900/20 text-slate-700 dark:text-slate-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {message.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                <div className="pt-4 border-t">
                  <div className="flex gap-3">
                    <Textarea
                      placeholder="Type your reply..."
                      className="flex-1 resize-none"
                      rows={3}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4 mr-2" />
                      Attach
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                        Close
                      </Button>
                      <Button
                        onClick={handleSendReply}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={!replyMessage.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PlatformLayout>
  );
}
