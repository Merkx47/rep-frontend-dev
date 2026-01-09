import { useState } from "react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutGrid,
  Search,
  Users,
  Shield,
  Settings,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAdminApps } from "@/hooks/use-admin-apps";
import { useAdminUsers } from "@/hooks/use-admin-users";

const ADMIN_COLOR = "#6366F1";

export default function AdminAppsPage() {
  const { apps, toggleApp } = useAdminApps();
  const { users } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Stats
  const enabledApps = apps.filter((a) => a.isEnabled).length;
  const totalApps = apps.length;
  const usersWithAccess = new Set(users.flatMap((u) => u.appAccess.map((a) => a.appId))).size;
  const totalRoles = apps.reduce((acc, app) => acc + app.roles.length, 0);

  // Filtered apps
  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "enabled" && app.isEnabled) ||
      (statusFilter === "disabled" && !app.isEnabled);
    return matchesSearch && matchesStatus;
  });

  const getUserCountForApp = (appId: string) => {
    return users.filter((u) => u.appAccess.some((a) => a.appId === appId)).length;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">App Management</h1>
          <p className="text-sm text-muted-foreground">
            Enable or disable apps and manage roles for each application
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${ADMIN_COLOR}15` }}
                >
                  <LayoutGrid className="w-5 h-5" style={{ color: ADMIN_COLOR }} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{enabledApps}/{totalApps}</p>
                  <p className="text-xs text-muted-foreground">Apps Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{usersWithAccess}</p>
                  <p className="text-xs text-muted-foreground">Apps with Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                  <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalRoles}</p>
                  <p className="text-xs text-muted-foreground">Total Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                  <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {apps.reduce((acc, app) => acc + app.modules.length, 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Apps</SelectItem>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Apps Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Application</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Modules</TableHead>
                <TableHead className="w-[100px]">Enabled</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => {
                const userCount = getUserCountForApp(app.id);
                return (
                  <TableRow key={app.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <Link href={`/admin/apps/${app.id}`}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${app.color}20` }}
                          >
                            <app.icon size={22} />
                          </div>
                          <div>
                            <p className="font-medium">{app.name}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {app.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      {app.isEnabled ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          Disabled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{userCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span>{app.roles.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        <span>{app.modules.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={app.isEnabled}
                        onCheckedChange={() => toggleApp(app.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/apps/${app.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredApps.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No apps found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}
