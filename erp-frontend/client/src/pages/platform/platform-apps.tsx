import { useState, useMemo } from "react";
import { PlatformLayout } from "@/components/platform-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  AppWindow,
  Search,
  MoreHorizontal,
  Edit,
  Settings,
  Users,
  CheckCircle2,
  XCircle,
  Eye,
  Shield,
  Zap,
  Lock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AccountingIcon,
  HRIcon,
  ProductionIcon,
  SalesIcon,
  CorporateCardsIcon,
  NRSInvoiceIcon,
  InvoiceIcon,
  BankIcon,
  FixedAssetsIcon,
} from "@/components/app-icons";

// Mock apps data
const mockApps = [
  {
    id: "accounting",
    name: "Accounting",
    description: "Double-entry bookkeeping, financial reports, and chart of accounts",
    category: "Finance",
    icon: AccountingIcon,
    color: "#4CAF50",
    isEnabled: true,
    isCore: true,
    tenantsUsing: 124,
    plans: ["Starter", "Professional", "Enterprise"],
    version: "2.4.1",
    lastUpdated: "2024-01-08",
    features: ["Chart of Accounts", "Journal Entries", "Financial Reports", "Multi-currency"],
  },
  {
    id: "hr",
    name: "HR",
    description: "Complete employee management, payroll processing, and attendance tracking",
    category: "Human Resources",
    icon: HRIcon,
    color: "#E91E63",
    isEnabled: true,
    isCore: true,
    tenantsUsing: 98,
    plans: ["Starter", "Professional", "Enterprise"],
    version: "2.2.0",
    lastUpdated: "2024-01-05",
    features: ["Employee Directory", "Payroll", "Attendance", "Leave Management"],
  },
  {
    id: "sales",
    name: "Sales",
    description: "Manage customers, leads, quotations, and sales orders",
    category: "Sales",
    icon: SalesIcon,
    color: "#2196F3",
    isEnabled: true,
    isCore: true,
    tenantsUsing: 112,
    plans: ["Starter", "Professional", "Enterprise"],
    version: "2.3.2",
    lastUpdated: "2024-01-07",
    features: ["Customer Management", "Quotations", "Sales Orders", "Pipeline"],
  },
  {
    id: "production",
    name: "Production",
    description: "Manufacturing orders, BOM management, and quality control",
    category: "Operations",
    icon: ProductionIcon,
    color: "#607D8B",
    isEnabled: true,
    isCore: false,
    tenantsUsing: 45,
    plans: ["Professional", "Enterprise"],
    version: "1.8.0",
    lastUpdated: "2023-12-20",
    features: ["Work Orders", "BOM", "Quality Control", "Inventory Tracking"],
  },
  {
    id: "invoice",
    name: "Invoice",
    description: "Create and send professional invoices to customers",
    category: "Finance",
    icon: InvoiceIcon,
    color: "#3F51B5",
    isEnabled: true,
    isCore: true,
    tenantsUsing: 134,
    plans: ["Starter", "Professional", "Enterprise"],
    version: "2.1.0",
    lastUpdated: "2024-01-02",
    features: ["Invoice Creation", "Templates", "Payment Tracking", "Reminders"],
  },
  {
    id: "bank",
    name: "Bank",
    description: "Bank account management and reconciliation",
    category: "Finance",
    icon: BankIcon,
    color: "#00BCD4",
    isEnabled: true,
    isCore: false,
    tenantsUsing: 78,
    plans: ["Professional", "Enterprise"],
    version: "1.5.0",
    lastUpdated: "2023-12-15",
    features: ["Bank Accounts", "Reconciliation", "Statement Import", "Cash Flow"],
  },
  {
    id: "fixed-assets",
    name: "Fixed Assets",
    description: "Track company assets and calculate depreciation",
    category: "Finance",
    icon: FixedAssetsIcon,
    color: "#009688",
    isEnabled: true,
    isCore: false,
    tenantsUsing: 56,
    plans: ["Professional", "Enterprise"],
    version: "1.3.0",
    lastUpdated: "2023-11-28",
    features: ["Asset Register", "Depreciation", "Disposal", "Reports"],
  },
  {
    id: "corporate-cards",
    name: "Corporate Cards",
    description: "Issue and manage company expense cards",
    category: "Corporate",
    icon: CorporateCardsIcon,
    color: "#FFC107",
    isEnabled: false,
    isCore: false,
    tenantsUsing: 0,
    plans: ["Enterprise"],
    version: "0.9.0",
    lastUpdated: "2023-10-15",
    features: ["Card Issuance", "Spending Limits", "Expense Tracking", "Reports"],
  },
  {
    id: "nrs-einvoice",
    name: "NRS E-Invoice",
    description: "Nigerian tax compliance and e-invoicing",
    category: "Compliance",
    icon: NRSInvoiceIcon,
    color: "#F44336",
    isEnabled: true,
    isCore: false,
    tenantsUsing: 89,
    plans: ["Professional", "Enterprise"],
    version: "1.2.0",
    lastUpdated: "2024-01-04",
    features: ["E-Invoice Generation", "Tax Compliance", "FIRS Integration", "Reports"],
  },
];

export default function AdminApps() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<typeof mockApps[0] | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [apps, setApps] = useState(mockApps);
  const { toast } = useToast();

  // Get unique categories
  const categories = Array.from(new Set(mockApps.map((app) => app.category)));

  // Filter apps
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || app.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "enabled" && app.isEnabled) ||
        (statusFilter === "disabled" && !app.isEnabled);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [apps, searchQuery, categoryFilter, statusFilter]);

  // Stats
  const stats = {
    total: apps.length,
    enabled: apps.filter((a) => a.isEnabled).length,
    core: apps.filter((a) => a.isCore).length,
    totalUsage: apps.reduce((sum, a) => sum + a.tenantsUsing, 0),
  };

  const handleToggleApp = (app: typeof mockApps[0]) => {
    if (app.isCore) {
      toast({
        title: "Cannot Disable Core App",
        description: "Core apps cannot be disabled as they are essential for platform operation.",
        variant: "destructive",
      });
      return;
    }

    // Update the app's enabled state
    setApps((prevApps) =>
      prevApps.map((a) =>
        a.id === app.id ? { ...a, isEnabled: !a.isEnabled } : a
      )
    );

    toast({
      title: app.isEnabled ? "App Disabled" : "App Enabled",
      description: `${app.name} has been ${app.isEnabled ? "disabled" : "enabled"}.`,
    });
  };

  const handleManagePermissions = (app: typeof mockApps[0]) => {
    setSelectedApp(app);
    setIsPermissionsDialogOpen(true);
  };

  const handleSaveApp = () => {
    toast({
      title: "App Updated",
      description: "App configuration has been updated successfully.",
    });
    setIsEditDialogOpen(false);
    setSelectedApp(null);
  };

  return (
    <PlatformLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              App Management
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Configure and manage platform applications
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <AppWindow className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Apps</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Enabled</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.enabled}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Core Apps</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.core}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Usage</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalUsage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search apps..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Apps Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <Card
              key={app.id}
              className={`border-2 bg-white dark:bg-slate-800 transition-all hover:shadow-lg ${
                !app.isEnabled ? "opacity-60" : ""
              }`}
              style={{ borderColor: app.isEnabled ? app.color : "#94A3B8" }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${app.color}20` }}
                    >
                      <app.icon size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{app.name}</h3>
                        {app.isCore && (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Core
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {app.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={app.isEnabled}
                      onCheckedChange={() => handleToggleApp(app)}
                      disabled={app.isCore}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedApp(app)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedApp(app);
                          setIsEditDialogOpen(true);
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Configuration
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleManagePermissions(app)}>
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Permissions
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 line-clamp-2">
                  {app.description}
                </p>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-300">
                      {app.tenantsUsing} tenants
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-300">v{app.version}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {app.plans.map((plan) => (
                    <Badge
                      key={plan}
                      variant="secondary"
                      className="text-xs bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    >
                      {plan}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* App Details Dialog */}
        <Dialog open={!!selectedApp && !isEditDialogOpen} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>App Details</DialogTitle>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-6 py-4">
                {/* App Header */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedApp.color}20` }}
                  >
                    <selectedApp.icon size={36} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {selectedApp.name}
                      </h3>
                      {selectedApp.isCore && (
                        <Badge className="bg-amber-100 text-amber-700">Core</Badge>
                      )}
                      <Badge
                        className={
                          selectedApp.isEnabled
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-700"
                        }
                      >
                        {selectedApp.isEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      {selectedApp.category} • v{selectedApp.version}
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300">{selectedApp.description}</p>

                <Tabs defaultValue="features" className="w-full">
                  <TabsList>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="plans">Plan Access</TabsTrigger>
                    <TabsTrigger value="stats">Usage Stats</TabsTrigger>
                  </TabsList>
                  <TabsContent value="features" className="mt-4">
                    <div className="grid grid-cols-2 gap-2">
                      {selectedApp.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="plans" className="mt-4">
                    <div className="space-y-3">
                      {["Starter", "Professional", "Enterprise"].map((plan) => (
                        <div
                          key={plan}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50"
                        >
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {plan}
                          </span>
                          {selectedApp.plans.includes(plan) ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="stats" className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-center">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedApp.tenantsUsing}
                        </p>
                        <p className="text-sm text-slate-500">Active Tenants</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-center">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {selectedApp.lastUpdated}
                        </p>
                        <p className="text-sm text-slate-500">Last Updated</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedApp(null)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => setIsEditDialogOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Configuration
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit App Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setSelectedApp(null);
        }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit App Configuration</DialogTitle>
              <DialogDescription>
                Update the configuration for {selectedApp?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="appName">App Name</Label>
                  <Input id="appName" defaultValue={selectedApp.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appDesc">Description</Label>
                  <Textarea id="appDesc" defaultValue={selectedApp.description} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appCategory">Category</Label>
                    <Select defaultValue={selectedApp.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appVersion">Version</Label>
                    <Input id="appVersion" defaultValue={selectedApp.version} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Available in Plans</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Starter", "Professional", "Enterprise"].map((plan) => (
                      <label
                        key={plan}
                        className="flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={selectedApp.plans.includes(plan)}
                          className="rounded"
                        />
                        <span className="text-sm">{plan}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                  <div>
                    <Label>Core App</Label>
                    <p className="text-xs text-slate-500">Core apps cannot be disabled</p>
                  </div>
                  <Switch checked={selectedApp.isCore} disabled />
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedApp(null);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSaveApp} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Permissions Dialog */}
        <Dialog open={isPermissionsDialogOpen} onOpenChange={(open) => {
          setIsPermissionsDialogOpen(open);
          if (!open) setSelectedApp(null);
        }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Manage Permissions</DialogTitle>
              <DialogDescription>
                Configure permissions for {selectedApp?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-4 py-4">
                {/* App Header */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${selectedApp.color}20` }}
                  >
                    <selectedApp.icon size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{selectedApp.name}</p>
                    <p className="text-xs text-slate-500">{selectedApp.category}</p>
                  </div>
                </div>

                {/* Permission Roles */}
                <div className="space-y-3">
                  <Label>Default Roles</Label>
                  {[
                    { name: "Admin", description: "Full access to all features", enabled: true },
                    { name: "Manager", description: "Can manage data and view reports", enabled: true },
                    { name: "User", description: "Basic access to core features", enabled: true },
                    { name: "Viewer", description: "Read-only access", enabled: false },
                  ].map((role) => (
                    <div
                      key={role.name}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div>
                        <p className="font-medium text-sm text-slate-900 dark:text-white">{role.name}</p>
                        <p className="text-xs text-slate-500">{role.description}</p>
                      </div>
                      <Switch defaultChecked={role.enabled} />
                    </div>
                  ))}
                </div>

                {/* Feature Access */}
                <div className="space-y-3">
                  <Label>Feature Access</Label>
                  <div className="space-y-2">
                    {selectedApp.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setIsPermissionsDialogOpen(false);
                setSelectedApp(null);
              }}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: "Permissions Updated",
                    description: `Permissions for ${selectedApp?.name} have been saved.`,
                  });
                  setIsPermissionsDialogOpen(false);
                  setSelectedApp(null);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Save Permissions
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PlatformLayout>
  );
}
