import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import {
  User,
  Building2,
  Bell,
  Shield,
  Globe,
  Plug,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Users,
  UserPlus,
  Mail,
  MoreVertical,
  Trash2,
  RefreshCw,
  Copy,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/use-currency";
import { CURRENCIES } from "@/lib/currency";
import { getModuleColor } from "@/contexts/module-context";

// Mock team members data
const mockTeamMembers = [
  { id: "user-001", firstName: "Yinka", lastName: "Daramola", email: "yinka.daramola@qucoon.com", role: "admin", status: "active", joinedAt: "2020-01-15", lastActive: "2025-01-07" },
  { id: "user-002", firstName: "Tope", lastName: "Olakunle", email: "tope.olakunle@qucoon.com", role: "admin", status: "active", joinedAt: "2020-03-01", lastActive: "2025-01-07" },
  { id: "user-003", firstName: "Adaeze", lastName: "Okafor", email: "adaeze.okafor@qucoon.com", role: "user", status: "active", joinedAt: "2021-06-15", lastActive: "2025-01-06" },
  { id: "user-004", firstName: "Bola", lastName: "Tinubu", email: "bola.tinubu@qucoon.com", role: "user", status: "active", joinedAt: "2022-02-20", lastActive: "2025-01-05" },
  { id: "user-005", firstName: "Chidi", lastName: "Eze", email: "chidi.eze@qucoon.com", role: "viewer", status: "active", joinedAt: "2023-08-10", lastActive: "2025-01-04" },
];

// Mock pending invitations
const mockPendingInvitations = [
  { id: "inv-001", email: "new.user@company.com", role: "user", invitedBy: "Yinka Daramola", invitedAt: "2025-01-05", expiresAt: "2025-01-12" },
  { id: "inv-002", email: "finance.viewer@company.com", role: "viewer", invitedBy: "Tope Olakunle", invitedAt: "2025-01-06", expiresAt: "2025-01-13" },
];

const roleDescriptions: Record<string, string> = {
  admin: "Full access to all modules and settings. Can view and approve requests, manage users and company settings.",
  user: "Limited access. Can submit expenses, leave requests, and view assigned modules.",
  viewer: "Read-only access to reports and dashboards. Cannot make changes.",
};

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  user: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  viewer: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

export default function SettingsPage() {
  const moduleColor = getModuleColor("accounting");
  const { user, tenant } = useAuth();
  const { toast } = useToast();
  const { currency, setCurrency, rates, ratesLastUpdated, ratesLoading, formatRate, refetchRates } = useCurrency();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Team/Invitation state
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [pendingInvitations, setPendingInvitations] = useState(mockPendingInvitations);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("user");
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<typeof mockTeamMembers[0] | null>(null);

  // Tymer Integration state
  const [tymerApiKey, setTymerApiKey] = useState("");
  const [tymerSecretKey, setTymerSecretKey] = useState("");
  const [tymerCompanyId, setTymerCompanyId] = useState("");
  const [tymerConnected, setTymerConnected] = useState(false);
  const [tymerConnecting, setTymerConnecting] = useState(false);
  const [tymerSyncing, setTymerSyncing] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleSaveCompany = () => {
    toast({
      title: "Company Settings Updated",
      description: "Company information has been saved.",
    });
  };

  // Team invitation handlers
  const handleInviteUser = async () => {
    if (!inviteEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to invite.",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists in team or pending invitations
    const existsInTeam = teamMembers.some(m => m.email.toLowerCase() === inviteEmail.toLowerCase());
    const existsInInvites = pendingInvitations.some(i => i.email.toLowerCase() === inviteEmail.toLowerCase());

    if (existsInTeam) {
      toast({
        title: "User Already Exists",
        description: "This email is already a team member.",
        variant: "destructive",
      });
      return;
    }

    if (existsInInvites) {
      toast({
        title: "Invitation Pending",
        description: "An invitation has already been sent to this email.",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newInvitation = {
      id: `inv-${Date.now()}`,
      email: inviteEmail,
      role: inviteRole,
      invitedBy: `${user?.firstName || 'Admin'} ${user?.lastName || ''}`.trim(),
      invitedAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    setPendingInvitations([...pendingInvitations, newInvitation]);
    setIsInviting(false);
    setIsInviteDialogOpen(false);
    setInviteEmail("");
    setInviteRole("user");

    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${inviteEmail} with ${inviteRole} access.`,
    });
  };

  const handleResendInvitation = async (invitationId: string) => {
    const invitation = pendingInvitations.find(i => i.id === invitationId);
    if (!invitation) return;

    toast({
      title: "Resending Invitation...",
      description: `Sending invitation to ${invitation.email}`,
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update expiration date
    setPendingInvitations(pendingInvitations.map(i =>
      i.id === invitationId
        ? { ...i, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
        : i
    ));

    toast({
      title: "Invitation Resent",
      description: `A new invitation has been sent to ${invitation.email}`,
    });
  };

  const handleCancelInvitation = (invitationId: string) => {
    const invitation = pendingInvitations.find(i => i.id === invitationId);
    setPendingInvitations(pendingInvitations.filter(i => i.id !== invitationId));
    toast({
      title: "Invitation Cancelled",
      description: `The invitation to ${invitation?.email} has been cancelled.`,
    });
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setTeamMembers(teamMembers.filter(m => m.id !== memberToRemove.id));
    setIsRemoveDialogOpen(false);
    setMemberToRemove(null);

    toast({
      title: "User Removed",
      description: `${memberToRemove.firstName} ${memberToRemove.lastName} has been removed from the organization.`,
    });
  };

  const handleChangeRole = async (memberId: string, newRole: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setTeamMembers(teamMembers.map(m =>
      m.id === memberId ? { ...m, role: newRole } : m
    ));

    const member = teamMembers.find(m => m.id === memberId);
    toast({
      title: "Role Updated",
      description: `${member?.firstName}'s role has been changed to ${newRole}.`,
    });
  };

  const copyInviteLink = (invitationId: string) => {
    const inviteLink = `${window.location.origin}/auth?invite=${invitationId}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link Copied",
      description: "Invitation link has been copied to clipboard.",
    });
  };

  const handleConnectTymer = async () => {
    if (!tymerApiKey || !tymerSecretKey || !tymerCompanyId) {
      toast({
        title: "Missing Credentials",
        description: "Please enter all Tymer API credentials.",
        variant: "destructive",
      });
      return;
    }

    setTymerConnecting(true);
    // Simulate API connection
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTymerConnecting(false);
    setTymerConnected(true);
    setLastSyncTime(new Date().toLocaleString());
    toast({
      title: "Tymer Connected",
      description: "Successfully connected to your Tymer account. Attendance data will now sync automatically.",
    });
  };

  const handleDisconnectTymer = () => {
    setTymerConnected(false);
    setTymerApiKey("");
    setTymerSecretKey("");
    setTymerCompanyId("");
    setLastSyncTime(null);
    toast({
      title: "Tymer Disconnected",
      description: "Your Tymer integration has been removed.",
    });
  };

  const handleSyncTymer = async () => {
    setTymerSyncing(true);
    // Simulate sync
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setTymerSyncing(false);
    setLastSyncTime(new Date().toLocaleString());
    toast({
      title: "Sync Complete",
      description: "Attendance data has been synced from Tymer.",
    });
  };

  return (
    <SidebarLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight" data-testid="text-settings-title">Settings</h2>
          <p className="text-muted-foreground mt-1">Manage your account and company settings.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-3xl grid-cols-6">
            <TabsTrigger value="profile" className="gap-2" data-testid="tab-profile">
              <User className="h-4 w-4 hidden sm:block" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-2" data-testid="tab-company">
              <Building2 className="h-4 w-4 hidden sm:block" />
              Company
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2" data-testid="tab-team">
              <Users className="h-4 w-4 hidden sm:block" />
              Team
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2" data-testid="tab-integrations">
              <Plug className="h-4 w-4 hidden sm:block" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2" data-testid="tab-notifications">
              <Bell className="h-4 w-4 hidden sm:block" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2" data-testid="tab-security">
              <Shield className="h-4 w-4 hidden sm:block" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={user?.firstName || ""} data-testid="input-first-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={user?.lastName || ""} data-testid="input-last-name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} data-testid="input-email" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue={user?.phone || ""} placeholder="+234 XXX XXX XXXX" data-testid="input-phone" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={user?.role || "User"} disabled className="bg-muted" />
                </div>

                <Button onClick={handleSaveProfile} data-testid="button-save-profile">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Manage your company's basic information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue={tenant?.name || ""} data-testid="input-company-name" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select defaultValue="technology">
                      <SelectTrigger data-testid="select-industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="services">Professional Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees">Company Size</Label>
                    <Select defaultValue="50-100">
                      <SelectTrigger data-testid="select-company-size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="50-100">50-100 employees</SelectItem>
                        <SelectItem value="100-500">100-500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input id="address" defaultValue={tenant?.address || ""} placeholder="Enter business address" data-testid="input-address" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue={tenant?.city || ""} placeholder="Lagos" data-testid="input-city" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select defaultValue="lagos">
                      <SelectTrigger data-testid="select-state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">FCT Abuja</SelectItem>
                        <SelectItem value="rivers">Rivers</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        <SelectItem value="oyo">Oyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Tax Information</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tin">Tax Identification Number (TIN)</Label>
                      <Input id="tin" defaultValue={tenant?.taxId || ""} placeholder="Enter TIN" data-testid="input-tin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rcNumber">RC Number</Label>
                      <Input id="rcNumber" defaultValue={tenant?.rcNumber || ""} placeholder="Enter RC Number" data-testid="input-rc" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Currency & Display</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="displayCurrency">Display Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger data-testid="select-currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(CURRENCIES).map((curr) => (
                            <SelectItem key={curr.code} value={curr.code}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{curr.symbol}</span>
                                <span>{curr.code}</span>
                                <span className="opacity-70">- {curr.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        All amounts will be displayed in this currency
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Base Currency</Label>
                      <Input value="NGN - Nigerian Naira" disabled className="bg-muted" />
                      <p className="text-xs text-muted-foreground">
                        All transactions are stored in NGN
                      </p>
                    </div>
                  </div>
                </div>

                {currency !== "NGN" && (
                  <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium text-blue-800 dark:text-blue-400 mb-1">
                            Exchange Rate
                          </h5>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            {formatRate("NGN", currency)}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            {ratesLastUpdated
                              ? `Last updated: ${new Date(ratesLastUpdated).toLocaleString()}`
                              : "Using fallback rates"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => refetchRates()}
                          disabled={ratesLoading}
                          className="border-blue-300 hover:bg-blue-100 dark:border-blue-800"
                        >
                          {ratesLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Refresh Rate
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={handleSaveCompany} data-testid="button-save-company">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="space-y-6">
            {/* Team Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{teamMembers.length}</p>
                      <p className="text-xs text-muted-foreground">Team Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-red-500/10">
                      <Shield className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{teamMembers.filter(m => m.role === 'admin').length}</p>
                      <p className="text-xs text-muted-foreground">Admins</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-yellow-500/10">
                      <Mail className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{pendingInvitations.length}</p>
                      <p className="text-xs text-muted-foreground">Pending Invites</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-gray-500/10">
                      <Eye className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{teamMembers.filter(m => m.role === 'viewer').length}</p>
                      <p className="text-xs text-muted-foreground">Viewers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Members Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage users in your organization</CardDescription>
                  </div>
                  <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite New User</DialogTitle>
                        <DialogDescription>
                          Send an invitation to join your organization. They'll receive an email with instructions.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="inviteEmail">Email Address</Label>
                          <Input
                            id="inviteEmail"
                            type="email"
                            placeholder="colleague@company.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="inviteRole">Access Role</Label>
                          <Select value={inviteRole} onValueChange={setInviteRole}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Badge className={roleColors.admin}>Admin</Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="user">
                                <div className="flex items-center gap-2">
                                  <Badge className={roleColors.user}>User</Badge>
                                </div>
                              </SelectItem>
                              <SelectItem value="viewer">
                                <div className="flex items-center gap-2">
                                  <Badge className={roleColors.viewer}>Viewer</Badge>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            {roleDescriptions[inviteRole]}
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleInviteUser} disabled={isInviting}>
                          {isInviting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Invitation
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{member.firstName} {member.lastName}</p>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleColors[member.role]}>{member.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(member.joinedAt)}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(member.lastActive)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleChangeRole(member.id, 'admin')}>
                                <Shield className="h-4 w-4 mr-2" />
                                Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeRole(member.id, 'user')}>
                                <User className="h-4 w-4 mr-2" />
                                Make User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeRole(member.id, 'viewer')}>
                                <Eye className="h-4 w-4 mr-2" />
                                Make Viewer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setMemberToRemove(member);
                                  setIsRemoveDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove User
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

            {/* Pending Invitations Card */}
            {pendingInvitations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Pending Invitations
                  </CardTitle>
                  <CardDescription>Invitations that haven't been accepted yet</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Invited By</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingInvitations.map((invitation) => (
                        <TableRow key={invitation.id}>
                          <TableCell className="font-medium">{invitation.email}</TableCell>
                          <TableCell>
                            <Badge className={roleColors[invitation.role]}>{invitation.role}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{invitation.invitedBy}</TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(invitation.invitedAt)}</TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(invitation.expiresAt)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => copyInviteLink(invitation.id)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Invite Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleResendInvitation(invitation.id)}>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Resend Invitation
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleCancelInvitation(invitation.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Cancel Invitation
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
            )}

            {/* Remove User Confirmation Dialog */}
            <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Remove User</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove {memberToRemove?.firstName} {memberToRemove?.lastName} from your organization?
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleRemoveMember}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Role Permissions Info */}
            <Card>
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>Understanding what each role can do</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(roleDescriptions).map(([role, description]) => (
                    <div key={role} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={roleColors[role]}>{role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tymer - Attendance System
                </CardTitle>
                <CardDescription>
                  Connect your Tymer biometric/attendance system to automatically sync employee attendance data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tymerConnected ? (
                  <>
                    {/* Connected State */}
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-green-800 dark:text-green-400">Connected to Tymer</p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          {lastSyncTime ? `Last synced: ${lastSyncTime}` : "Ready to sync attendance data"}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSyncTymer}
                        disabled={tymerSyncing}
                      >
                        {tymerSyncing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          "Sync Now"
                        )}
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Sync Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Auto-sync attendance</Label>
                            <p className="text-sm text-muted-foreground">Automatically sync attendance data every hour</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Sync clock-in/clock-out times</Label>
                            <p className="text-sm text-muted-foreground">Import exact timestamp from Tymer</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Sync employee photos</Label>
                            <p className="text-sm text-muted-foreground">Import employee profile photos from Tymer</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-destructive">Disconnect Tymer</p>
                        <p className="text-sm text-muted-foreground">Remove the Tymer integration from your account</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={handleDisconnectTymer}>
                        Disconnect
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Not Connected State */}
                    <div className="flex items-center gap-3 p-4 bg-muted/50 border rounded-lg">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Not Connected</p>
                        <p className="text-sm text-muted-foreground">Enter your Tymer API credentials to connect</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="tymerApiKey">API Key</Label>
                        <div className="relative">
                          <Input
                            id="tymerApiKey"
                            type={showApiKey ? "text" : "password"}
                            value={tymerApiKey}
                            onChange={(e) => setTymerApiKey(e.target.value)}
                            placeholder="Enter your Tymer API key"
                            data-testid="input-tymer-api-key"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Found in your Tymer dashboard under Settings &gt; API</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tymerSecretKey">Secret Key</Label>
                        <div className="relative">
                          <Input
                            id="tymerSecretKey"
                            type={showSecretKey ? "text" : "password"}
                            value={tymerSecretKey}
                            onChange={(e) => setTymerSecretKey(e.target.value)}
                            placeholder="Enter your Tymer secret key"
                            data-testid="input-tymer-secret-key"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowSecretKey(!showSecretKey)}
                          >
                            {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tymerCompanyId">Company ID</Label>
                        <Input
                          id="tymerCompanyId"
                          value={tymerCompanyId}
                          onChange={(e) => setTymerCompanyId(e.target.value)}
                          placeholder="Enter your Tymer company ID"
                          data-testid="input-tymer-company-id"
                        />
                        <p className="text-xs text-muted-foreground">Your unique company identifier in Tymer</p>
                      </div>

                      <Button
                        onClick={handleConnectTymer}
                        disabled={tymerConnecting}
                        className="w-full"
                        data-testid="button-connect-tymer"
                      >
                        {tymerConnecting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Plug className="w-4 h-4 mr-2" />
                            Connect to Tymer
                          </>
                        )}
                      </Button>
                    </div>

                    <Separator />

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">How to get your Tymer API credentials</h4>
                      <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-4">
                        <li>Log in to your Tymer admin dashboard</li>
                        <li>Navigate to Settings &gt; Integrations &gt; API Access</li>
                        <li>Generate a new API key and secret key pair</li>
                        <li>Copy your Company ID from the dashboard header</li>
                        <li>Paste the credentials above and click Connect</li>
                      </ol>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Future Integrations Placeholder */}
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                <Plug className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium text-foreground mb-2">More Integrations Coming Soon</h3>
                <p className="text-sm">Paystack, Flutterwave, QuickBooks, and more integrations are on the way.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications}
                    data-testid="switch-email-notifications"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch 
                    checked={pushNotifications} 
                    onCheckedChange={setPushNotifications}
                    data-testid="switch-push-notifications"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Notify me about:</h4>
                  <div className="space-y-3">
                    {[
                      { id: "invoices", label: "New invoices and payments" },
                      { id: "expenses", label: "Expense approvals" },
                      { id: "payroll", label: "Payroll processing" },
                      { id: "lowStock", label: "Low stock alerts" },
                      { id: "reports", label: "Weekly reports" },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                        <Switch id={item.id} defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Change Password</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" data-testid="input-current-password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" data-testid="input-new-password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" data-testid="input-confirm-password" />
                    </div>
                    <Button variant="outline" data-testid="button-change-password">Change Password</Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch 
                    checked={twoFactor} 
                    onCheckedChange={setTwoFactor}
                    data-testid="switch-two-factor"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Chrome on Windows</p>
                          <p className="text-xs text-muted-foreground">Lagos, Nigeria - Current session</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
