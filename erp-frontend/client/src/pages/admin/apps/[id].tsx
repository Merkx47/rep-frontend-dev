import { useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Shield,
  Users,
  Key,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAdminApps, type AppRole } from "@/hooks/use-admin-apps";
import { useAdminUsers } from "@/hooks/use-admin-users";

const ADMIN_COLOR = "#6366F1";

export default function AppDetailPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { apps, toggleApp, deleteRole, getRolePermissionCount, expandPermissions } = useAdminApps();
  const { users } = useAdminUsers();

  const app = apps.find((a) => a.id === params.id);

  if (!app) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-semibold mb-2">App not found</h2>
          <p className="text-muted-foreground mb-4">The requested app does not exist.</p>
          <Link href="/admin/apps">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Apps
            </Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const appUsers = users.filter((u) => u.appAccess.some((a) => a.appId === app.id));
  const totalPermissions = app.modules.reduce((acc, m) => acc + m.actions.length, 0);

  const handleDeleteRole = (role: AppRole) => {
    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      deleteRole(app.id, role.id);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/apps")}
              className="h-9 w-9"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${app.color}20` }}
            >
              <app.icon size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">{app.name}</h1>
                <Badge
                  variant={app.isEnabled ? "default" : "secondary"}
                  className={app.isEnabled ? "bg-green-500" : ""}
                >
                  {app.isEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{app.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {app.isEnabled ? "Enabled" : "Disabled"}
              </span>
              <Switch
                checked={app.isEnabled}
                onCheckedChange={() => toggleApp(app.id)}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${app.color}15` }}
                >
                  <Users className="w-5 h-5" style={{ color: app.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{appUsers.length}</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${app.color}15` }}
                >
                  <Shield className="w-5 h-5" style={{ color: app.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{app.roles.length}</p>
                  <p className="text-xs text-muted-foreground">Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${app.color}15` }}
                >
                  <Settings className="w-5 h-5" style={{ color: app.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{app.modules.length}</p>
                  <p className="text-xs text-muted-foreground">Modules</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${app.color}15` }}
                >
                  <Key className="w-5 h-5" style={{ color: app.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalPermissions}</p>
                  <p className="text-xs text-muted-foreground">Permissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="roles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="text-lg">Roles</CardTitle>
                  <CardDescription>
                    Define roles and their permissions for this app
                  </CardDescription>
                </div>
                <Link href={`/admin/apps/${app.id}/roles/add`}>
                  <Button style={{ backgroundColor: app.color }} className="text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Role
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {app.roles.map((role) => {
                      const permCount = getRolePermissionCount(app.id, role.id);
                      return (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div className="font-medium">{role.name}</div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {role.description || "-"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={role.isSystem ? "secondary" : "outline"}>
                              {role.isSystem ? "System" : "Custom"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              style={{ borderColor: app.color, color: app.color }}
                            >
                              <Key className="w-3 h-3 mr-1" />
                              {permCount} / {totalPermissions}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Link href={`/admin/apps/${app.id}/roles/${role.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              {!role.isSystem && (
                                <>
                                  <Link href={`/admin/apps/${app.id}/roles/${role.id}/edit`}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteRole(role)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Users with Access</CardTitle>
                <CardDescription>
                  Users who have access to this app
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role in App</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No users have access to this app yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      appUsers.map((user) => {
                        const userAppAccess = user.appAccess.find((a) => a.appId === app.id);
                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm"
                                  style={{ backgroundColor: `${app.color}15`, color: app.color }}
                                >
                                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </div>
                                <span className="font-medium">
                                  {user.firstName} {user.lastName}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {user.email}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{userAppAccess?.role}</Badge>
                            </TableCell>
                            <TableCell>
                              {user.isActive ? (
                                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Permission Matrix</CardTitle>
                <CardDescription>
                  Available modules and actions in this app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {app.modules.map((module) => (
                    <div key={module.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{module.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {module.actions.length} actions
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[200px]">Action</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="w-[200px]">Permission Key</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {module.actions.map((action) => (
                              <TableRow key={action.id}>
                                <TableCell className="font-medium">{action.name}</TableCell>
                                <TableCell className="text-muted-foreground">
                                  {action.description}
                                </TableCell>
                                <TableCell>
                                  <code className="text-xs bg-muted px-2 py-1 rounded">
                                    {module.id}.{action.id}
                                  </code>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
