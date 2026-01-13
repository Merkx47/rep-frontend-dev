import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, TrendingUp, Star, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { getModuleColor } from "@/contexts/module-context";
import { useToast } from "@/hooks/use-toast";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useTablePagination } from "@/hooks/use-table-pagination";

interface Customer {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  type: "enterprise" | "business" | "startup";
}

// Mock data for customers
const initialCustomers: Customer[] = [
  {
    id: "CUS-001",
    companyName: "Acme Corporation",
    contactPerson: "John Smith",
    email: "john@acme.com",
    phone: "+234 801 234 5678",
    totalOrders: 24,
    totalSpent: 45000000,
    status: "active",
    type: "enterprise",
  },
  {
    id: "CUS-002",
    companyName: "TechStart Ltd",
    contactPerson: "Sarah Johnson",
    email: "sarah@techstart.com",
    phone: "+234 802 345 6789",
    totalOrders: 12,
    totalSpent: 18500000,
    status: "active",
    type: "business",
  },
  {
    id: "CUS-003",
    companyName: "Global Industries",
    contactPerson: "Michael Chen",
    email: "m.chen@global.com",
    phone: "+234 803 456 7890",
    totalOrders: 36,
    totalSpent: 72000000,
    status: "active",
    type: "enterprise",
  },
  {
    id: "CUS-004",
    companyName: "Innovation Hub",
    contactPerson: "Emily Davis",
    email: "emily@innovhub.com",
    phone: "+234 804 567 8901",
    totalOrders: 8,
    totalSpent: 9500000,
    status: "active",
    type: "startup",
  },
  {
    id: "CUS-005",
    companyName: "Digital Solutions",
    contactPerson: "David Wilson",
    email: "david@digsol.com",
    phone: "+234 805 678 9012",
    totalOrders: 15,
    totalSpent: 24500000,
    status: "inactive",
    type: "business",
  },
  {
    id: "CUS-006",
    companyName: "Enterprise Co",
    contactPerson: "Lisa Brown",
    email: "lisa@enterprise.com",
    phone: "+234 806 789 0123",
    totalOrders: 42,
    totalSpent: 93000000,
    status: "active",
    type: "enterprise",
  },
  {
    id: "CUS-007",
    companyName: "Smart Systems",
    contactPerson: "James Taylor",
    email: "james@smartsys.com",
    phone: "+234 807 890 1234",
    totalOrders: 3,
    totalSpent: 4500000,
    status: "active",
    type: "startup",
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
}

function getTypeBadge(type: string) {
  const typeStyles: Record<string, string> = {
    enterprise: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    business: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    startup: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  return (
    <Badge className={typeStyles[type] || "bg-gray-100 text-gray-700"}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}

function getStatusBadge(status: string) {
  return status === "active" ? (
    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
      Active
    </Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">
      Inactive
    </Badge>
  );
}

export default function CustomersPage() {
  const moduleColor = getModuleColor("sales");
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { toast } = useToast();

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    type: "business" as "enterprise" | "business" | "startup",
  });

  const handleAddCustomer = () => {
    if (!newCustomer.companyName || !newCustomer.contactPerson || !newCustomer.email) {
      toast({
        title: "Missing Fields",
        description: "Please fill in company name, contact person, and email.",
        variant: "destructive",
      });
      return;
    }

    const customerNum = String(customers.length + 1).padStart(3, "0");

    const customer: Customer = {
      id: `CUS-${customerNum}`,
      companyName: newCustomer.companyName,
      contactPerson: newCustomer.contactPerson,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      totalOrders: 0,
      totalSpent: 0,
      status: "active",
      type: newCustomer.type,
    };

    setCustomers([customer, ...customers]);
    setNewCustomer({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      type: "business",
    });
    setIsAddCustomerOpen(false);
    toast({
      title: "Customer Added",
      description: `${customer.companyName} has been added.`,
    });
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || customer.type === selectedType;
      const matchesStatus = selectedStatus === "all" || customer.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [customers, searchQuery, selectedType, selectedStatus]);

  // Pagination
  const {
    paginatedData: paginatedCustomers,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    setCurrentPage,
    setPageSize,
  } = useTablePagination({ data: filteredCustomers, initialPageSize: 5 });

  // Stats
  const totalCustomersCount = customers.length;
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const enterpriseCustomers = customers.filter(c => c.type === "enterprise").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground mt-1">Manage your customer relationships and data.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCustomersCount}</p>
                  <p className="text-xs text-muted-foreground">Total Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-emerald-500/10">
                  <Star className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeCustomers}</p>
                  <p className="text-xs text-muted-foreground">Active Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-purple-500/10">
                  <Building2 className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{enterpriseCustomers}</p>
                  <p className="text-xs text-muted-foreground">Enterprise</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-blue-500/10">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
                  <p className="text-xs text-muted-foreground">Lifetime Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-9 rounded-xl border-border/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="startup">Startup</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 rounded-xl border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input
                    placeholder="e.g., Acme Corporation"
                    value={newCustomer.companyName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, companyName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Person *</Label>
                    <Input
                      placeholder="John Doe"
                      value={newCustomer.contactPerson}
                      onChange={(e) => setNewCustomer({ ...newCustomer, contactPerson: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Type</Label>
                    <Select
                      value={newCustomer.type}
                      onValueChange={(value: "enterprise" | "business" | "startup") => setNewCustomer({ ...newCustomer, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="startup">Startup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="contact@company.com"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+234 xxx xxx xxxx"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    placeholder="Company address..."
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddCustomerOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCustomer}
                  className="text-white"
                  style={{ backgroundColor: moduleColor }}
                >
                  Add Customer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Customers Table */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
            <CardDescription>View and manage customer information</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.companyName}</p>
                          <p className="text-xs text-muted-foreground">{customer.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{customer.contactPerson}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                      <TableCell className="text-center font-medium">{customer.totalOrders}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(customer.totalSpent)}</TableCell>
                      <TableCell>{getTypeBadge(customer.type)}</TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
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
      </div>
    </SidebarLayout>
  );
}
