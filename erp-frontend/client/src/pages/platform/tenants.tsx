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
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  Trash2,
  Mail,
  Calendar,
  Globe,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useTablePagination } from "@/hooks/use-table-pagination";

// Mock tenants data
const mockTenants = [
  {
    id: "1",
    name: "TechCorp Industries",
    email: "admin@techcorp.com",
    phone: "+234 801 234 5678",
    website: "www.techcorp.com",
    plan: "Enterprise",
    status: "active",
    users: 45,
    apps: 8,
    mrr: 125000,
    createdAt: "2023-06-15",
    lastActive: "2024-01-10",
    country: "Nigeria",
  },
  {
    id: "2",
    name: "GreenLeaf Solutions",
    email: "contact@greenleaf.ng",
    phone: "+234 802 345 6789",
    website: "www.greenleaf.ng",
    plan: "Professional",
    status: "active",
    users: 22,
    apps: 5,
    mrr: 45000,
    createdAt: "2023-08-22",
    lastActive: "2024-01-10",
    country: "Nigeria",
  },
  {
    id: "3",
    name: "BlueSky Enterprises",
    email: "info@bluesky.com",
    phone: "+234 803 456 7890",
    website: "www.bluesky.com",
    plan: "Starter",
    status: "trial",
    users: 5,
    apps: 3,
    mrr: 0,
    createdAt: "2024-01-02",
    lastActive: "2024-01-09",
    country: "Ghana",
  },
  {
    id: "4",
    name: "MetroBank Financial",
    email: "tech@metrobank.ng",
    phone: "+234 804 567 8901",
    website: "www.metrobank.ng",
    plan: "Enterprise",
    status: "active",
    users: 120,
    apps: 9,
    mrr: 250000,
    createdAt: "2023-03-10",
    lastActive: "2024-01-10",
    country: "Nigeria",
  },
  {
    id: "5",
    name: "AgriGrow Farms",
    email: "admin@agrigrow.com",
    phone: "+234 805 678 9012",
    website: "www.agrigrow.com",
    plan: "Professional",
    status: "pending",
    users: 0,
    apps: 0,
    mrr: 0,
    createdAt: "2024-01-06",
    lastActive: "-",
    country: "Kenya",
  },
  {
    id: "6",
    name: "Swift Logistics",
    email: "ops@swiftlogistics.ng",
    phone: "+234 806 789 0123",
    website: "www.swiftlogistics.ng",
    plan: "Professional",
    status: "active",
    users: 35,
    apps: 6,
    mrr: 55000,
    createdAt: "2023-09-05",
    lastActive: "2024-01-10",
    country: "Nigeria",
  },
  {
    id: "7",
    name: "EduTech Academy",
    email: "admin@edutech.edu",
    phone: "+234 807 890 1234",
    website: "www.edutech.edu",
    plan: "Starter",
    status: "active",
    users: 12,
    apps: 4,
    mrr: 15000,
    createdAt: "2023-11-20",
    lastActive: "2024-01-08",
    country: "Nigeria",
  },
  {
    id: "8",
    name: "HealthFirst Clinic",
    email: "info@healthfirst.ng",
    phone: "+234 808 901 2345",
    website: "www.healthfirst.ng",
    plan: "Professional",
    status: "suspended",
    users: 18,
    apps: 5,
    mrr: 0,
    createdAt: "2023-07-12",
    lastActive: "2023-12-15",
    country: "Nigeria",
  },
  {
    id: "9",
    name: "AutoParts Plus",
    email: "sales@autoparts.com",
    phone: "+234 809 012 3456",
    website: "www.autoparts.com",
    plan: "Enterprise",
    status: "active",
    users: 65,
    apps: 7,
    mrr: 150000,
    createdAt: "2023-04-28",
    lastActive: "2024-01-10",
    country: "Nigeria",
  },
  {
    id: "10",
    name: "FoodChain Restaurants",
    email: "hq@foodchain.ng",
    phone: "+234 810 123 4567",
    website: "www.foodchain.ng",
    plan: "Professional",
    status: "active",
    users: 28,
    apps: 5,
    mrr: 48000,
    createdAt: "2023-10-15",
    lastActive: "2024-01-09",
    country: "Nigeria",
  },
];

const getPlanColor = (plan: string) => {
  switch (plan.toLowerCase()) {
    case "enterprise":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "professional":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "starter":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "trial":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "pending":
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
    case "suspended":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

export default function AdminTenants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<typeof mockTenants[0] | null>(null);
  const [editingTenant, setEditingTenant] = useState<typeof mockTenants[0] | null>(null);
  const { toast } = useToast();

  // Filter tenants
  const filteredTenants = useMemo(() => {
    return mockTenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
      const matchesPlan = planFilter === "all" || tenant.plan.toLowerCase() === planFilter;
      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [searchQuery, statusFilter, planFilter]);

  // Pagination
  const {
    paginatedData: paginatedTenants,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage,
    setPageSize,
  } = useTablePagination({ data: filteredTenants, initialPageSize: 10 });

  // Stats
  const stats = {
    total: mockTenants.length,
    active: mockTenants.filter((t) => t.status === "active").length,
    trial: mockTenants.filter((t) => t.status === "trial").length,
    totalMrr: mockTenants.reduce((sum, t) => sum + t.mrr, 0),
  };

  const handleAddTenant = () => {
    toast({
      title: "Tenant Created",
      description: "New tenant has been successfully created.",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditTenant = () => {
    toast({
      title: "Tenant Updated",
      description: "Tenant details have been updated successfully.",
    });
    setEditingTenant(null);
  };

  const handleDeleteTenant = (tenant: typeof mockTenants[0]) => {
    toast({
      title: "Tenant Deleted",
      description: `${tenant.name} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleSuspend = (tenant: typeof mockTenants[0]) => {
    toast({
      title: "Tenant Suspended",
      description: `${tenant.name} has been suspended.`,
      variant: "destructive",
    });
  };

  const handleActivate = (tenant: typeof mockTenants[0]) => {
    toast({
      title: "Tenant Activated",
      description: `${tenant.name} has been activated.`,
    });
  };

  return (
    <PlatformLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tenant Management
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage all organizations using your platform
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Tenant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Tenant</DialogTitle>
                <DialogDescription>
                  Create a new organization account on the platform
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantName">Organization Name</Label>
                  <Input id="tenantName" placeholder="Enter organization name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input id="adminEmail" type="email" placeholder="admin@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="+234 800 000 0000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input id="website" placeholder="www.company.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan">Subscription Plan</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                        <SelectItem value="ghana">Ghana</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="south-africa">South Africa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTenant} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Create Tenant
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
                  <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Tenants</p>
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
                  <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">In Trial</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.trial}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total MRR</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    ₦{(stats.totalMrr / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tenants Table */}
        <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-slate-900 dark:text-white">All Tenants</CardTitle>
                <CardDescription>Complete list of registered organizations</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search tenants..."
                    className="pl-9 w-64"
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Users</TableHead>
                  <TableHead className="text-center">Apps</TableHead>
                  <TableHead className="text-right">MRR</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No tenants found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTenants.map((tenant) => (
                    <TableRow key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {tenant.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{tenant.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{tenant.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getPlanColor(tenant.plan)}>
                          {tenant.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(tenant.status)}>
                          {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{tenant.users}</TableCell>
                      <TableCell className="text-center">{tenant.apps}</TableCell>
                      <TableCell className="text-right font-medium">
                        {tenant.mrr > 0 ? `₦${tenant.mrr.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400 text-sm">
                        {tenant.lastActive}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedTenant(tenant)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingTenant(tenant)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Tenant
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="w-4 h-4 mr-2" />
                              Manage Subscription
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {tenant.status === "suspended" ? (
                              <DropdownMenuItem
                                onClick={() => handleActivate(tenant)}
                                className="text-emerald-600"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Activate
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleSuspend(tenant)}
                                className="text-amber-600"
                              >
                                <Ban className="w-4 h-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeleteTenant(tenant)}
                              className="text-red-600"
                            >
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

        {/* Tenant Details Dialog */}
        <Dialog open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tenant Details</DialogTitle>
            </DialogHeader>
            {selectedTenant && (
              <div className="space-y-6 py-4">
                {/* Tenant Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {selectedTenant.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {selectedTenant.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className={getPlanColor(selectedTenant.plan)}>
                        {selectedTenant.plan}
                      </Badge>
                      <Badge variant="secondary" className={getStatusColor(selectedTenant.status)}>
                        {selectedTenant.status.charAt(0).toUpperCase() + selectedTenant.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {selectedTenant.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <Phone className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {selectedTenant.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <Globe className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Website</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {selectedTenant.website}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Created</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {selectedTenant.createdAt}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedTenant.users}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Users</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedTenant.apps}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Apps</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      ₦{(selectedTenant.mrr / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">MRR</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedTenant.country}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Country</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedTenant(null)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedTenant(null);
                      setEditingTenant(selectedTenant);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Tenant
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Tenant Dialog */}
        <Dialog open={!!editingTenant} onOpenChange={(open) => !open && setEditingTenant(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Tenant</DialogTitle>
              <DialogDescription>
                Update the organization's account details
              </DialogDescription>
            </DialogHeader>
            {editingTenant && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editTenantName">Organization Name</Label>
                  <Input
                    id="editTenantName"
                    defaultValue={editingTenant.name}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editAdminEmail">Admin Email</Label>
                    <Input
                      id="editAdminEmail"
                      type="email"
                      defaultValue={editingTenant.email}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editPhone">Phone</Label>
                    <Input
                      id="editPhone"
                      type="tel"
                      defaultValue={editingTenant.phone}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editWebsite">Website</Label>
                  <Input
                    id="editWebsite"
                    defaultValue={editingTenant.website}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editPlan">Subscription Plan</Label>
                    <Select defaultValue={editingTenant.plan.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editCountry">Country</Label>
                    <Select defaultValue={editingTenant.country.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                        <SelectItem value="ghana">Ghana</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="south africa">South Africa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select defaultValue={editingTenant.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingTenant(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditTenant} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PlatformLayout>
  );
}
