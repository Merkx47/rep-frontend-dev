import { useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, UserPlus, Info } from "lucide-react";
import { useAdminUsers, type AppAccess } from "@/hooks/use-admin-users";
import { useAdminApps } from "@/hooks/use-admin-apps";

const ADMIN_COLOR = "#6366F1";

export default function AddUserPage() {
  const [, navigate] = useLocation();
  const { addUser } = useAdminUsers();
  const { apps } = useAdminApps();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "member" as "superAdmin" | "admin" | "member" | "viewer",
  });

  const [selectedApps, setSelectedApps] = useState<Record<string, { selected: boolean; role: string }>>(() => {
    const initial: Record<string, { selected: boolean; role: string }> = {};
    apps.filter(app => app.isEnabled).forEach((app) => {
      initial[app.id] = {
        selected: false,
        role: app.roles[0]?.name || "Viewer",
      };
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const enabledApps = apps.filter((app) => app.isEnabled);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Build app access from selected apps
    const appAccess: AppAccess[] = Object.entries(selectedApps)
      .filter(([, value]) => value.selected)
      .map(([appId, value]) => {
        const app = apps.find((a) => a.id === appId);
        return {
          appId,
          appName: app?.name || appId,
          role: value.role,
        };
      });

    addUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role,
      isActive: true,
      appAccess,
    });

    navigate("/admin/users");
  };

  const selectedAppCount = Object.values(selectedApps).filter((a) => a.selected).length;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/users")}
            className="h-9 w-9"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Add New User</h1>
            <p className="text-sm text-muted-foreground">
              Create a new user account and configure their access
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <CardDescription>
                Enter the user's personal details and credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData({ ...formData, firstName: e.target.value });
                      if (errors.firstName) setErrors({ ...errors, firstName: "" });
                    }}
                    placeholder="John"
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData({ ...formData, lastName: e.target.value });
                      if (errors.lastName) setErrors({ ...errors, lastName: "" });
                    }}
                    placeholder="Doe"
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="john.doe@company.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Global Role */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Global Role</CardTitle>
              <CardDescription>
                Define the user's system-wide permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Select Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value as "superAdmin" | "admin" | "member" | "viewer" })
                  }
                >
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="superAdmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.role === "superAdmin"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-950/20"
                      : "border-transparent bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      Super Admin
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Full system access. Can manage all users, apps, and settings.
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.role === "admin"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                      : "border-transparent bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Admin
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Can manage users and configure apps. Limited system settings.
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.role === "member"
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : "border-transparent bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Member
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Standard user. Can use assigned apps based on app-level roles.
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    formData.role === "viewer"
                      ? "border-gray-500 bg-gray-50 dark:bg-gray-950/20"
                      : "border-transparent bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      Viewer
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Read-only access. Can view but not modify any data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Access */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">App Access</CardTitle>
                  <CardDescription>
                    Select which apps this user can access and their role in each app
                  </CardDescription>
                </div>
                {selectedAppCount > 0 && (
                  <Badge
                    variant="secondary"
                    style={{ backgroundColor: `${ADMIN_COLOR}15`, color: ADMIN_COLOR }}
                  >
                    {selectedAppCount} app{selectedAppCount !== 1 ? "s" : ""} selected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {enabledApps.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No apps are currently enabled.</p>
                  <p className="text-sm">Enable apps in App Management first.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {enabledApps.map((app) => (
                    <div
                      key={app.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                        selectedApps[app.id]?.selected
                          ? "border-current bg-muted/30"
                          : "border-border hover:border-muted-foreground/30"
                      }`}
                      style={{
                        borderColor: selectedApps[app.id]?.selected ? app.color : undefined,
                      }}
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <Checkbox
                          checked={selectedApps[app.id]?.selected || false}
                          onCheckedChange={(checked) =>
                            setSelectedApps({
                              ...selectedApps,
                              [app.id]: {
                                ...selectedApps[app.id],
                                selected: !!checked,
                              },
                            })
                          }
                        />
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${app.color}20` }}
                        >
                          <app.icon size={22} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium">{app.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {app.description}
                          </p>
                        </div>
                      </div>
                      <Select
                        value={selectedApps[app.id]?.role || app.roles[0]?.name}
                        onValueChange={(value) =>
                          setSelectedApps({
                            ...selectedApps,
                            [app.id]: {
                              ...selectedApps[app.id],
                              role: value,
                            },
                          })
                        }
                        disabled={!selectedApps[app.id]?.selected}
                      >
                        <SelectTrigger className="w-[180px] flex-shrink-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {app.roles.map((role) => (
                            <SelectItem key={role.id} value={role.name}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/users")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: ADMIN_COLOR }}
              className="text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
