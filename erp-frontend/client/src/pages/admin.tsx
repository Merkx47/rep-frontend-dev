import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Search,
  Plus,
  MoreVertical,
  Eye,
  Settings,
  Ban,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  LogOut,
  Shield,
  BarChart3,
  Clock,
  Loader2,
  Lock,
  Mail,
  EyeIcon,
  EyeOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import qorpyLogo from "@assets/qorpy-logo.png";

// Admin login schema
const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

// Admin Login Component
function AdminLoginPage({ onLogin }: { onLogin: () => void }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    // Simulate API call - in production this would validate against admin credentials
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Demo credentials: admin@qucoon.com / admin123
    if (data.email === "admin@qucoon.com" && data.password === "admin123") {
      localStorage.setItem("qucoon-admin-auth", "true");
      localStorage.setItem("qucoon-admin-email", data.email);
      onLogin();
      toast({
        title: "Welcome, Administrator",
        description: "You have successfully logged into the Admin Portal.",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-background to-background dark:from-red-950/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {/* Logo removed */}
          </div>
          <div className="space-y-2">
            <Badge variant="destructive" className="mx-auto">Super Admin Portal</Badge>
            <CardTitle className="text-2xl">Administrator Login</CardTitle>
            <CardDescription>
              Access the platform administration panel to manage tenants, billing, and system settings.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="admin@qucoon.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Access Admin Portal
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <div className="text-xs text-center text-muted-foreground space-y-1">
              <p>Email: admin@qucoon.com</p>
              <p>Password: admin123</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Back to Main Site
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Mock tenants data
const mockTenants = [
  {
    id: "tenant-001",
    name: "QuCoon Limited",
    email: "admin@qucoon.com",
    industry: "Technology",
    plan: "Enterprise",
    status: "active",
    users: 16,
    maxUsers: -1,
    createdAt: "2020-01-15",
    lastActivity: "2025-01-07",
    mrr: 200000,
    storage: 45,
    maxStorage: 100,
  },
  {
    id: "tenant-002",
    name: "Dangote Industries",
    email: "erp@dangote.com",
    industry: "Manufacturing",
    plan: "Enterprise",
    status: "active",
    users: 250,
    maxUsers: -1,
    createdAt: "2021-03-20",
    lastActivity: "2025-01-06",
    mrr: 200000,
    storage: 78,
    maxStorage: 100,
  },
  {
    id: "tenant-003",
    name: "First Bank Nigeria",
    email: "it@firstbanknigeria.com",
    industry: "Financial Services",
    plan: "Enterprise",
    status: "active",
    users: 180,
    maxUsers: -1,
    createdAt: "2021-06-10",
    lastActivity: "2025-01-07",
    mrr: 200000,
    storage: 62,
    maxStorage: 100,
  },
  {
    id: "tenant-004",
    name: "TechStart Solutions",
    email: "admin@techstart.ng",
    industry: "Technology",
    plan: "Professional",
    status: "active",
    users: 12,
    maxUsers: 15,
    createdAt: "2023-08-15",
    lastActivity: "2025-01-05",
    mrr: 75000,
    storage: 23,
    maxStorage: 50,
  },
  {
    id: "tenant-005",
    name: "Lagos Retail Hub",
    email: "accounts@lagosretail.com",
    industry: "Retail",
    plan: "Professional",
    status: "active",
    users: 8,
    maxUsers: 15,
    createdAt: "2024-02-01",
    lastActivity: "2025-01-04",
    mrr: 75000,
    storage: 15,
    maxStorage: 50,
  },
  {
    id: "tenant-006",
    name: "HealthPlus Pharmacy",
    email: "finance@healthplus.ng",
    industry: "Healthcare",
    plan: "Starter",
    status: "trial",
    users: 3,
    maxUsers: 3,
    createdAt: "2025-01-01",
    lastActivity: "2025-01-07",
    mrr: 0,
    storage: 2,
    maxStorage: 10,
    trialEnds: "2025-01-15",
  },
  {
    id: "tenant-007",
    name: "BuildRight Construction",
    email: "admin@buildright.ng",
    industry: "Construction",
    plan: "Professional",
    status: "suspended",
    users: 10,
    maxUsers: 15,
    createdAt: "2023-05-20",
    lastActivity: "2024-12-15",
    mrr: 0,
    storage: 30,
    maxStorage: 50,
    suspendedReason: "Payment overdue",
  },
  {
    id: "tenant-008",
    name: "AgroFresh Farms",
    email: "operations@agrofresh.ng",
    industry: "Agriculture",
    plan: "Starter",
    status: "cancelled",
    users: 2,
    maxUsers: 3,
    createdAt: "2024-06-01",
    lastActivity: "2024-11-30",
    mrr: 0,
    storage: 5,
    maxStorage: 10,
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function AdminPortalPage() {
  const moduleColor = getModuleColor("accounting");
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("qucoon-admin-auth");
    setIsAuthenticated(authStatus === "true");
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("qucoon-admin-auth");
    localStorage.removeItem("qucoon-admin-email");
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out of the Admin Portal.",
    });
  };

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <AdminLoginPage onLogin={handleLogin} />;
  }

  // Calculate stats
  const totalTenants = mockTenants.length;
  const activeTenants = mockTenants.filter(t => t.status === "active").length;
  const trialTenants = mockTenants.filter(t => t.status === "trial").length;
  const totalMRR = mockTenants.reduce((sum, t) => sum + t.mrr, 0);
  const totalUsers = mockTenants.reduce((sum, t) => sum + t.users, 0);

  // Filter tenants
  const filteredTenants = mockTenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTenant = async () => {
    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsCreating(false);
    setIsCreateDialogOpen(false);
    toast({
      title: "Tenant Created",
      description: "New tenant has been created and invitation sent.",
    });
  };

  const handleSuspendTenant = (tenantId: string) => {
    toast({
      title: "Tenant Suspended",
      description: "The tenant has been suspended.",
    });
  };

  const handleActivateTenant = (tenantId: string) => {
    toast({
      title: "Tenant Activated",
      description: "The tenant has been activated.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>;
      case "trial":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"><Clock className="h-3 w-3 mr-1" />Trial</Badge>;
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"><AlertTriangle className="h-3 w-3 mr-1" />Suspended</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">{plan}</Badge>;
      case "Professional":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{plan}</Badge>;
      case "Starter":
        return <Badge variant="outline">{plan}</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo removed */}
            <div className="hidden sm:block">
              <Badge variant="destructive" className="text-xs">Super Admin</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">Platform Administrator</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground">Manage all tenants and platform settings</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="h-4 w-4 mr-2" />
                Create Tenant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Tenant</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input placeholder="Company Ltd" />
                </div>
                <div className="space-y-2">
                  <Label>Admin Email</Label>
                  <Input type="email" placeholder="admin@company.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="finance">Financial Services</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Plan</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTenant} disabled={isCreating}>
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create & Invite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tenants</p>
                  <p className="text-2xl font-bold">{totalTenants}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Tenants</p>
                  <p className="text-2xl font-bold">{activeTenants}</p>
                  <p className="text-xs text-muted-foreground">{trialTenants} in trial</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(totalMRR)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tenants Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>All Tenants</CardTitle>
                <CardDescription>Manage and monitor all registered tenants</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tenants..."
                    className="pl-9 w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Storage</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-sm text-muted-foreground">{tenant.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getPlanBadge(tenant.plan)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{tenant.users}</span>
                        <span className="text-muted-foreground text-sm">
                          / {tenant.maxUsers === -1 ? '∞' : tenant.maxUsers}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20">
                        <Progress value={(tenant.storage / tenant.maxStorage) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{tenant.storage}GB / {tenant.maxStorage}GB</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(tenant.mrr)}</TableCell>
                    <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(tenant.lastActivity)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="h-4 w-4 mr-2" />
                            Manage Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            Login as Tenant
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {tenant.status === "active" || tenant.status === "trial" ? (
                            <DropdownMenuItem
                              className="text-yellow-600"
                              onClick={() => handleSuspendTenant(tenant.id)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend Tenant
                            </DropdownMenuItem>
                          ) : tenant.status === "suspended" ? (
                            <DropdownMenuItem
                              className="text-emerald-600"
                              onClick={() => handleActivateTenant(tenant.id)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Activate Tenant
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredTenants.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tenants found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Platform Analytics</p>
                  <p className="text-sm text-muted-foreground">View detailed platform metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <CreditCard className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Billing & Invoices</p>
                  <p className="text-sm text-muted-foreground">Manage subscription billing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium">Security & Logs</p>
                  <p className="text-sm text-muted-foreground">View audit logs and security events</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
