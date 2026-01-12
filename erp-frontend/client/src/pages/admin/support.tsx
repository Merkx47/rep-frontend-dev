import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Send,
  Paperclip,
  ExternalLink,
  HelpCircle,
  BookOpen,
  MessageCircle,
  TicketIcon,
  AlertTriangle,
} from "lucide-react";

// Mock tickets data
const mockTickets = [
  {
    id: "TKT-001",
    subject: "Unable to generate invoice",
    category: "Technical",
    priority: "high",
    status: "in_progress",
    createdAt: "2024-01-10 14:30",
    updatedAt: "2024-01-10 16:45",
    messages: [
      {
        id: "1",
        sender: "user",
        message: "Getting an error when trying to generate invoice for customer ABC Corp. The system shows 'Template not found' error.",
        timestamp: "2024-01-10 14:30",
      },
      {
        id: "2",
        sender: "support",
        senderName: "Support Team",
        message: "Thank you for reporting this issue. We're looking into it and will update you shortly.",
        timestamp: "2024-01-10 16:45",
      },
    ],
  },
  {
    id: "TKT-002",
    subject: "Question about API integration",
    category: "Integration",
    priority: "low",
    status: "open",
    createdAt: "2024-01-08 10:15",
    updatedAt: "2024-01-08 10:15",
    messages: [
      {
        id: "1",
        sender: "user",
        message: "I need help understanding how to use the API to sync our inventory data.",
        timestamp: "2024-01-08 10:15",
      },
    ],
  },
  {
    id: "TKT-003",
    subject: "Request for additional users",
    category: "Billing",
    priority: "medium",
    status: "resolved",
    createdAt: "2024-01-05 09:00",
    updatedAt: "2024-01-06 11:30",
    messages: [
      {
        id: "1",
        sender: "user",
        message: "We need to add 5 more users to our account. Can you help with the upgrade?",
        timestamp: "2024-01-05 09:00",
      },
      {
        id: "2",
        sender: "support",
        senderName: "Billing Team",
        message: "Your account has been upgraded. You can now add up to 25 users.",
        timestamp: "2024-01-06 11:30",
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

export default function AdminSupportPage() {
  const { toast } = useToast();
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const handleCreateTicket = () => {
    toast({
      title: "Ticket Created",
      description: "Your support ticket has been submitted. We'll respond shortly.",
    });
    setIsNewTicketOpen(false);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    toast({
      title: "Reply Sent",
      description: "Your message has been sent to the support team.",
    });
    setReplyMessage("");
  };

  const openTickets = mockTickets.filter(t => t.status === "open").length;
  const inProgressTickets = mockTickets.filter(t => t.status === "in_progress").length;
  const resolvedTickets = mockTickets.filter(t => t.status === "resolved").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
          <p className="text-sm text-muted-foreground">
            Get help and submit support requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <TicketIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tickets</p>
                  <p className="text-2xl font-bold">{mockTickets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open</p>
                  <p className="text-2xl font-bold">{openTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{inProgressTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold">{resolvedTickets}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Help Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Documentation</h3>
                <p className="text-sm text-muted-foreground">Browse our guides</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Chat with support</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">FAQ</h3>
                <p className="text-sm text-muted-foreground">Common questions</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
            </CardContent>
          </Card>
        </div>

        {/* Tickets Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>View and manage your support requests</CardDescription>
            </div>
            <Button onClick={() => setIsNewTicketOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {mockTickets.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-1">No Support Tickets</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You haven't submitted any support tickets yet.
                </p>
                <Button onClick={() => setIsNewTicketOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Ticket
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-mono text-xs text-muted-foreground">{ticket.id}</p>
                          <p className="font-medium">{ticket.subject}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{ticket.category}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                            {ticket.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {ticket.updatedAt}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* New Ticket Dialog */}
        <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and we'll get back to you as soon as possible.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of the issue" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="integration">Integration</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please describe your issue in detail..."
                  rows={5}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Paperclip className="w-4 h-4" />
                <span>Attach files (coming soon)</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTicket}>
                <Send className="w-4 h-4 mr-2" />
                Submit Ticket
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Ticket Detail Dialog */}
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-muted-foreground">{selectedTicket?.id}</span>
                <Badge variant="secondary" className={getStatusColor(selectedTicket?.status || "")}>
                  {selectedTicket?.status.replace("_", " ")}
                </Badge>
              </div>
              <DialogTitle>{selectedTicket?.subject}</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === "support" ? "" : "flex-row-reverse"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === "support"
                            ? "bg-primary/10"
                            : "bg-muted"
                        }`}
                      >
                        <MessageSquare
                          className={`w-4 h-4 ${
                            message.sender === "support" ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className={`flex-1 max-w-[80%] ${message.sender !== "support" ? "text-right" : ""}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender !== "support" && (
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          )}
                          <span className="text-sm font-medium">
                            {message.sender === "support" ? message.senderName : "You"}
                          </span>
                          {message.sender === "support" && (
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            message.sender === "support"
                              ? "bg-primary/5"
                              : "bg-muted"
                          }`}
                        >
                          {message.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                {selectedTicket.status !== "resolved" && selectedTicket.status !== "closed" && (
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
                        <Button onClick={handleSendReply} disabled={!replyMessage.trim()}>
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
