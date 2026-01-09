import { useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronRight,
  Key,
} from "lucide-react";
import { useAdminApps } from "@/hooks/use-admin-apps";

export default function AddRolePage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { apps, addRole } = useAdminApps();

  const app = apps.find((a) => a.id === params.id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
    }
    if (selectedPermissions.length === 0) {
      newErrors.permissions = "Select at least one permission";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    addRole(app.id, {
      name: formData.name,
      description: formData.description,
      isSystem: false,
      permissions: selectedPermissions,
    });

    navigate(`/admin/apps/${app.id}`);
  };

  // Permission toggle helpers
  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
    if (errors.permissions) setErrors({ ...errors, permissions: "" });
  };

  const toggleModuleAllPermissions = (moduleId: string) => {
    const module = app.modules.find((m) => m.id === moduleId);
    if (!module) return;

    const modulePermissions = module.actions.map((a) => `${moduleId}.${a.id}`);
    const allSelected = modulePermissions.every((p) => selectedPermissions.includes(p));

    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((p) => !modulePermissions.includes(p)));
    } else {
      setSelectedPermissions((prev) => Array.from(new Set([...prev, ...modulePermissions])));
    }
    if (errors.permissions) setErrors({ ...errors, permissions: "" });
  };

  const isModuleFullySelected = (moduleId: string) => {
    const module = app.modules.find((m) => m.id === moduleId);
    if (!module) return false;
    return module.actions.every((a) => selectedPermissions.includes(`${moduleId}.${a.id}`));
  };

  const isModulePartiallySelected = (moduleId: string) => {
    const module = app.modules.find((m) => m.id === moduleId);
    if (!module) return false;
    const count = module.actions.filter((a) =>
      selectedPermissions.includes(`${moduleId}.${a.id}`)
    ).length;
    return count > 0 && count < module.actions.length;
  };

  const toggleModuleExpand = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((m) => m !== moduleId) : [...prev, moduleId]
    );
  };

  const getModuleSelectedCount = (moduleId: string) => {
    const module = app.modules.find((m) => m.id === moduleId);
    if (!module) return 0;
    return module.actions.filter((a) =>
      selectedPermissions.includes(`${moduleId}.${a.id}`)
    ).length;
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/admin/apps/${app.id}`)}
            className="h-9 w-9"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${app.color}20` }}
            >
              <app.icon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Add Role</h1>
              <p className="text-sm text-muted-foreground">
                Create a new role for {app.name}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role Information</CardTitle>
              <CardDescription>
                Define the name and description for this role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Role Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    placeholder="e.g., Auditor, Reviewer"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe what this role can do"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Permissions</CardTitle>
                  <CardDescription>
                    Select the permissions this role should have
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  style={{ borderColor: app.color, color: app.color }}
                >
                  <Key className="w-3 h-3 mr-1" />
                  {selectedPermissions.length} selected
                </Badge>
              </div>
              {errors.permissions && (
                <p className="text-sm text-destructive">{errors.permissions}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {app.modules.map((module) => {
                  const selectedCount = getModuleSelectedCount(module.id);
                  const isExpanded = expandedModules.includes(module.id);
                  const isFullySelected = isModuleFullySelected(module.id);
                  const isPartiallySelected = isModulePartiallySelected(module.id);

                  return (
                    <Collapsible
                      key={module.id}
                      open={isExpanded}
                      onOpenChange={() => toggleModuleExpand(module.id)}
                    >
                      <div
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                          isFullySelected
                            ? "border-current bg-muted/30"
                            : isPartiallySelected
                            ? "border-current/50 bg-muted/20"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                        style={{
                          borderColor:
                            isFullySelected || isPartiallySelected ? app.color : undefined,
                        }}
                      >
                        <Checkbox
                          checked={isFullySelected}
                          ref={(el) => {
                            if (el && isPartiallySelected) {
                              (el as HTMLButtonElement).dataset.state = "indeterminate";
                            }
                          }}
                          onCheckedChange={() => toggleModuleAllPermissions(module.id)}
                        />
                        <CollapsibleTrigger asChild>
                          <button
                            type="button"
                            className="flex items-center gap-3 flex-1 text-left"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{module.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {selectedCount}/{module.actions.length}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {module.description}
                              </p>
                            </div>
                          </button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="ml-6 mt-2 space-y-1 border-l-2 pl-4 pb-2" style={{ borderColor: `${app.color}30` }}>
                          {module.actions.map((action) => {
                            const permKey = `${module.id}.${action.id}`;
                            const isSelected = selectedPermissions.includes(permKey);
                            return (
                              <div
                                key={action.id}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                  isSelected
                                    ? "bg-muted/50"
                                    : "hover:bg-muted/30"
                                }`}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => togglePermission(permKey)}
                                  id={permKey}
                                />
                                <label
                                  htmlFor={permKey}
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{action.name}</span>
                                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                      {permKey}
                                    </code>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {action.description}
                                  </p>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/admin/apps/${app.id}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: app.color }}
              className="text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
