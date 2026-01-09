import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, MoreHorizontal, UserPlus, Shield, Mail, Clock } from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function AccountingUsersPage() {
  const moduleColor = getModuleColor("accounting");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const { toast } = useToast();

  const handleAddUser = () => {
    toast({
      title: "User Added",
      description: "New user has been added to the accounting module.",
    });
    setIsAddUserOpen(false);
  };

  const users = [
    {
      id: 1,
      name: "Adebayo Johnson",
      email: "adebayo@company.com",
      role: "Accountant",
      permissions: ["View Ledger", "Create Entries", "Generate Reports"],
      status: "Active",
      lastLogin: "2024-01-07 09:30 AM",
    },
    {
      id: 2,
      name: "Chioma Okonkwo",
      email: "chioma@company.com",
      role: "Senior Accountant",
      permissions: ["Full Access", "Approve Entries", "Manage Users"],
      status: "Active",
      lastLogin: "2024-01-07 08:15 AM",
    },
    {
      id: 3,
      name: "Emeka Nwosu",
      email: "emeka@company.com",
      role: "Finance Manager",
      permissions: ["Full Access", "Bank Reconciliation", "Financial Reports"],
      status: "Active",
      lastLogin: "2024-01-06 04:45 PM",
    },
    {
      id: 4,
      name: "Fatima Mohammed",
      email: "fatima@company.com",
      role: "Junior Accountant",
      permissions: ["View Ledger", "Create Entries"],
      status: "Active",
      lastLogin: "2024-01-07 10:00 AM",
    },
    {
      id: 5,
      name: "Oluwaseun Adeleke",
      email: "oluwaseun@company.com",
      role: "Auditor",
      permissions: ["View Only", "Generate Reports"],
      status: "Inactive",
      lastLogin: "2024-01-01 11:20 AM",
    },
  ];

  const roles = [
    { name: "Finance Manager", count: 1, color: "bg-purple-500" },
    { name: "Senior Accountant", count: 1, color: "bg-blue-500" },
    { name: "Accountant", count: 1, color: "bg-green-500" },
    { name: "Junior Accountant", count: 1, color: "bg-yellow-500" },
    { name: "Auditor", count: 1, color: "bg-gray-500" },
  ];

  return (
    <SidebarLayout moduleId="accounting">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage accounting module access and permissions</p>
          </div>
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button
                className="text-white shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="user@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="finance-manager">Finance Manager</SelectItem>
                      <SelectItem value="senior-accountant">Senior Accountant</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="junior-accountant">Junior Accountant</SelectItem>
                      <SelectItem value="auditor">Auditor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">View Ledger</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Create Entries</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Generate Reports</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Approve Entries</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">Full Access</Badge>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddUser}
                  className="text-white"
                  style={{ backgroundColor: moduleColor }}
                >
                  Add User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{users.length}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === "Active").length}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Users</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-gray-500">
                {users.filter(u => u.status === "Inactive").length}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{roles.length}</span>
            </CardContent>
          </Card>
        </div>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Role Distribution</CardTitle>
            <CardDescription>Users by role in accounting module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {roles.map((role) => (
                <div key={role.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                  <div className={`w-3 h-3 rounded-full ${role.color}`} />
                  <span className="text-sm font-medium">{role.name}</span>
                  <Badge variant="secondary">{role.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg">Users</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                          style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
                        >
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        {user.role}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {user.permissions.slice(0, 2).map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                        {user.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.permissions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "Active" ? "default" : "secondary"}
                        className={user.status === "Active" ? "bg-green-500" : ""}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {user.lastLogin}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>View Activity</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            {user.status === "Active" ? "Deactivate" : "Activate"}
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
      </div>
    </SidebarLayout>
  );
}
