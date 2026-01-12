import { useState, useMemo } from "react";
import { PlatformLayout } from "@/components/platform-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
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
  UserCog,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Crown,
  HeadphonesIcon,
  CreditCard,
  Mail,
  Key,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useTablePagination } from "@/hooks/use-table-pagination";

// Mock team members data
const mockTeamMembers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Admin",
    email: "john@qorpy.com",
    role: "super_admin",
    status: "active",
    lastLogin: "2024-01-10 14:30",
    createdAt: "2023-01-15",
    permissions: ["all"],
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Manager",
    email: "sarah@qorpy.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-10 10:15",
    createdAt: "2023-03-20",
    permissions: ["tenants", "subscriptions", "support"],
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Support",
    email: "mike@qorpy.com",
    role: "support",
    status: "active",
    lastLogin: "2024-01-10 09:45",
    createdAt: "2023-06-10",
    permissions: ["support", "tenants.view"],
  },
  {
    id: "4",
    firstName: "Lisa",
    lastName: "Finance",
    email: "lisa@qorpy.com",
    role: "finance",
    status: "active",
    lastLogin: "2024-01-09 16:20",
    createdAt: "2023-08-05",
    permissions: ["subscriptions", "billing", "reports"],
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Support",
    email: "david@qorpy.com",
    role: "support",
    status: "inactive",
    lastLogin: "2023-12-15 11:00",
    createdAt: "2023-04-12",
    permissions: ["support"],
  },
  {
    id: "6",
    firstName: "Emily",
    lastName: "Admin",
    email: "emily@qorpy.com",
    role: "admin",
    status: "pending",
    lastLogin: "-",
    createdAt: "2024-01-08",
    permissions: ["tenants", "apps", "categories"],
  },
];

// Role configurations
const roles = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full access to all platform features",
    icon: Crown,
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manage tenants, subscriptions, and apps",
    icon: Shield,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
  },
  {
    id: "support",
    name: "Support",
    description: "Handle support tickets and basic tenant queries",
    icon: HeadphonesIcon,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    id: "finance",
    name: "Finance",
    description: "Manage billing, subscriptions, and financial reports",
    icon: CreditCard,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
];

const getRoleConfig = (roleId: string) => {
  return roles.find((r) => r.id === roleId) || roles[2];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "inactive":
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case "pending":
      return <Clock className="w-4 h-4 text-amber-500" />;
    case "inactive":
      return <XCircle className="w-4 h-4 text-slate-400" />;
    default:
      return null;
  }
};

export default function AdminTeam() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof mockTeamMembers[0] | null>(null);
  const { toast } = useToast();

  // Filter team members
  const filteredMembers = useMemo(() => {
    return mockTeamMembers.filter((member) => {
      const matchesSearch =
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      const matchesStatus = statusFilter === "all" || member.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchQuery, roleFilter, statusFilter]);

  // Pagination
  const {
    paginatedData: paginatedMembers,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage,
    setPageSize,
  } = useTablePagination({ data: filteredMembers, initialPageSize: 10 });

  // Stats
  const stats = {
    total: mockTeamMembers.length,
    active: mockTeamMembers.filter((m) => m.status === "active").length,
    pending: mockTeamMembers.filter((m) => m.status === "pending").length,
    superAdmins: mockTeamMembers.filter((m) => m.role === "super_admin").length,
  };

  const handleInviteMember = () => {
    toast({
      title: "Invitation Sent",
      description: "An invitation email has been sent to the new team member.",
    });
    setIsInviteDialogOpen(false);
  };

  const handleResendInvite = (member: typeof mockTeamMembers[0]) => {
    toast({
      title: "Invitation Resent",
      description: `A new invitation has been sent to ${member.email}.`,
    });
  };

  const handleDeactivate = (member: typeof mockTeamMembers[0]) => {
    toast({
      title: "Member Deactivated",
      description: `${member.firstName} ${member.lastName} has been deactivated.`,
      variant: "destructive",
    });
  };

  const handleActivate = (member: typeof mockTeamMembers[0]) => {
    toast({
      title: "Member Activated",
      description: `${member.firstName} ${member.lastName} has been activated.`,
    });
  };

  const handleResetPassword = (member: typeof mockTeamMembers[0]) => {
    toast({
      title: "Password Reset Email Sent",
      description: `A password reset link has been sent to ${member.email}.`,
    });
  };

  return (
    <PlatformLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Team Management
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage admin team members and their permissions
            </p>
          </div>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join the admin team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@qorpy.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <role.icon className={`w-4 h-4 ${role.color}`} />
                            <span>{role.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    The invited member will receive an email with instructions to set up their account.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteMember} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <UserCog className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Members</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
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
                  <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Super Admins</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.superAdmins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Roles Overview */}
        <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">Role Overview</CardTitle>
            <CardDescription>Available roles and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {roles.map((role) => {
                const count = mockTeamMembers.filter((m) => m.role === role.id).length;
                return (
                  <div
                    key={role.id}
                    className="p-4 rounded-lg border border-slate-300 dark:border-slate-600 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${role.bgColor} flex items-center justify-center`}>
                        <role.icon className={`w-5 h-5 ${role.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{role.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{count} members</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">{role.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Team Members Table */}
        <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-slate-900 dark:text-white">Team Members</CardTitle>
                <CardDescription>All admin team members</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search members..."
                    className="pl-9 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No team members found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedMembers.map((member) => {
                    const roleConfig = getRoleConfig(member.role);
                    return (
                      <TableRow key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {member.firstName[0]}{member.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {member.firstName} {member.lastName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded ${roleConfig.bgColor} flex items-center justify-center`}>
                              <roleConfig.icon className={`w-3.5 h-3.5 ${roleConfig.color}`} />
                            </div>
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {roleConfig.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(member.status)}
                            <Badge variant="secondary" className={getStatusColor(member.status)}>
                              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                          {member.lastLogin}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                          {member.createdAt}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedMember(member)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Member
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(member)}>
                                <Key className="w-4 h-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              {member.status === "pending" && (
                                <DropdownMenuItem onClick={() => handleResendInvite(member)}>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Resend Invite
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              {member.status === "inactive" ? (
                                <DropdownMenuItem onClick={() => handleActivate(member)} className="text-emerald-600">
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Activate
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleDeactivate(member)} className="text-amber-600">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Deactivate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
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

        {/* Edit Member Dialog */}
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {selectedMember.firstName} {selectedMember.lastName}
                    </p>
                    <p className="text-sm text-slate-500">{selectedMember.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName">First Name</Label>
                    <Input id="editFirstName" defaultValue={selectedMember.firstName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastName">Last Name</Label>
                    <Input id="editLastName" defaultValue={selectedMember.lastName} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input id="editEmail" type="email" defaultValue={selectedMember.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editRole">Role</Label>
                  <Select defaultValue={selectedMember.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            <role.icon className={`w-4 h-4 ${role.color}`} />
                            <span>{role.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedMember(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Member Updated",
                    description: "Team member has been updated successfully.",
                  });
                  setSelectedMember(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PlatformLayout>
  );
}
