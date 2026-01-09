import { useState } from "react";
import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  Settings,
  Calendar,
  Clock,
  Users,
  Wallet,
  Save,
  Building,
  GraduationCap,
  Shield,
  Bell,
  Award,
  Briefcase,
  FileText,
  UserCheck,
  Target,
  TrendingUp,
  Heart,
  Plane,
  BookOpen,
  AlertTriangle,
  Timer,
  Link2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Key,
  Layers,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  GripVertical,
} from "lucide-react";

export default function HRSettingsPage() {
  const moduleColor = getModuleColor("hr");
  const { toast } = useToast();

  // Tymer integration state
  const [tymerConnected, setTymerConnected] = useState(false);
  const [tymerSyncing, setTymerSyncing] = useState(false);
  const [tymerTenantId, setTymerTenantId] = useState("");
  const [tymerApiKey, setTymerApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  // Grades & Salary state
  const [grades, setGrades] = useState([
    { id: 1, code: "GL-1", name: "Grade Level 1", title: "Junior Associate", minSalary: 50000, maxSalary: 75000, currency: "NGN" },
    { id: 2, code: "GL-2", name: "Grade Level 2", title: "Associate", minSalary: 75000, maxSalary: 120000, currency: "NGN" },
    { id: 3, code: "GL-3", name: "Grade Level 3", title: "Senior Associate", minSalary: 120000, maxSalary: 180000, currency: "NGN" },
    { id: 4, code: "GL-4", name: "Grade Level 4", title: "Team Lead", minSalary: 180000, maxSalary: 280000, currency: "NGN" },
    { id: 5, code: "GL-5", name: "Grade Level 5", title: "Manager", minSalary: 280000, maxSalary: 450000, currency: "NGN" },
    { id: 6, code: "GL-6", name: "Grade Level 6", title: "Senior Manager", minSalary: 450000, maxSalary: 650000, currency: "NGN" },
    { id: 7, code: "GL-7", name: "Grade Level 7", title: "Director", minSalary: 650000, maxSalary: 1000000, currency: "NGN" },
    { id: 8, code: "GL-8", name: "Grade Level 8", title: "Executive Director", minSalary: 1000000, maxSalary: 2000000, currency: "NGN" },
  ]);
  const [isAddGradeOpen, setIsAddGradeOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<number | null>(null);
  const [newGrade, setNewGrade] = useState({ code: "", name: "", title: "", minSalary: 0, maxSalary: 0, currency: "NGN" });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "HR settings have been updated successfully.",
    });
  };

  const handleAddGrade = () => {
    if (!newGrade.code || !newGrade.name || !newGrade.title) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    const newId = Math.max(...grades.map(g => g.id)) + 1;
    setGrades([...grades, { ...newGrade, id: newId }]);
    setNewGrade({ code: "", name: "", title: "", minSalary: 0, maxSalary: 0, currency: "NGN" });
    setIsAddGradeOpen(false);
    toast({
      title: "Grade Added",
      description: `${newGrade.name} has been added successfully.`,
    });
  };

  const handleDeleteGrade = (id: number) => {
    setGrades(grades.filter(g => g.id !== id));
    toast({
      title: "Grade Deleted",
      description: "The grade has been removed.",
    });
  };

  const formatCurrency = (amount: number, currency: string = "NGN") => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleConnectTymer = () => {
    if (!tymerTenantId.trim() || !tymerApiKey.trim()) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both Tenant ID and API Key to connect.",
        variant: "destructive",
      });
      return;
    }
    setTymerSyncing(true);
    // Simulate connection
    setTimeout(() => {
      setTymerConnected(true);
      setTymerSyncing(false);
      toast({
        title: "Tymer Connected",
        description: "Successfully connected to Tymer attendance system.",
      });
    }, 1500);
  };

  const handleDisconnectTymer = () => {
    setTymerConnected(false);
    toast({
      title: "Tymer Disconnected",
      description: "Disconnected from Tymer attendance system.",
    });
  };

  const handleSyncTymer = () => {
    setTymerSyncing(true);
    setTimeout(() => {
      setTymerSyncing(false);
      toast({
        title: "Sync Complete",
        description: "Attendance data synced with Tymer successfully.",
      });
    }, 2000);
  };

  return (
    <SidebarLayout moduleId="hr">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">HR Settings</h1>
            <p className="text-muted-foreground mt-1">Configure HR policies, benefits, and preferences</p>
          </div>
          <Button onClick={handleSave} className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="grades">Grades & Salary</TabsTrigger>
            <TabsTrigger value="leave">Leave Policy</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Employee Settings</CardTitle>
                </div>
                <CardDescription>Configure employee-related settings and identification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Employee ID Format</Label>
                    <Input defaultValue="EMP-{YYYY}-{####}" />
                    <p className="text-xs text-muted-foreground">
                      Use {`{YYYY}`} for year, {`{####}`} for sequence
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Probation Period (months)</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Notice Period (months)</Label>
                    <Input type="number" defaultValue="1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Employment Type</Label>
                    <Select defaultValue="full-time">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-Time</SelectItem>
                        <SelectItem value="part-time">Part-Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Employee Self-Service</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employees to update their own profiles
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Manager Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Require approval for profile changes
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Org Chart View</Label>
                    <p className="text-sm text-muted-foreground">
                      Show organizational hierarchy to employees
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Department Settings</CardTitle>
                </div>
                <CardDescription>Configure department and team structures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Department Code Format</Label>
                    <Input defaultValue="DEPT-{XXX}" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Department Levels</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Cross-Department Transfers</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable internal department transfers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require HOD Approval for Transfers</Label>
                    <p className="text-sm text-muted-foreground">
                      Head of department must approve transfers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Document Management</CardTitle>
                </div>
                <CardDescription>Configure employee document requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require ID Documents</Label>
                    <p className="text-sm text-muted-foreground">
                      Employees must upload identification documents
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Employment Contract</Label>
                    <p className="text-sm text-muted-foreground">
                      Signed contract must be uploaded
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Expire Document Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when documents are about to expire
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Document Expiry Warning (days before)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grades & Salary Settings */}
          <TabsContent value="grades" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5" style={{ color: moduleColor }} />
                    <div>
                      <CardTitle>Job Grades & Salary Structure</CardTitle>
                      <CardDescription>Define employee grades, titles, and salary ranges</CardDescription>
                    </div>
                  </div>
                  <Dialog open={isAddGradeOpen} onOpenChange={setIsAddGradeOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="text-white"
                        style={{ backgroundColor: moduleColor }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Grade
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Grade</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Grade Code</Label>
                            <Input
                              placeholder="e.g., GL-9"
                              value={newGrade.code}
                              onChange={(e) => setNewGrade({ ...newGrade, code: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Grade Name</Label>
                            <Input
                              placeholder="e.g., Grade Level 9"
                              value={newGrade.name}
                              onChange={(e) => setNewGrade({ ...newGrade, name: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Job Title</Label>
                          <Input
                            placeholder="e.g., Chief Executive Officer"
                            value={newGrade.title}
                            onChange={(e) => setNewGrade({ ...newGrade, title: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Minimum Salary</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={newGrade.minSalary || ""}
                              onChange={(e) => setNewGrade({ ...newGrade, minSalary: Number(e.target.value) })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Maximum Salary</Label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={newGrade.maxSalary || ""}
                              onChange={(e) => setNewGrade({ ...newGrade, maxSalary: Number(e.target.value) })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select
                            value={newGrade.currency}
                            onValueChange={(value) => setNewGrade({ ...newGrade, currency: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                              <SelectItem value="USD">US Dollar (USD)</SelectItem>
                              <SelectItem value="EUR">Euro (EUR)</SelectItem>
                              <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsAddGradeOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddGrade}
                          className="text-white"
                          style={{ backgroundColor: moduleColor }}
                        >
                          Add Grade
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Code</TableHead>
                      <TableHead>Grade Name</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead className="text-right">Min Salary</TableHead>
                      <TableHead className="text-right">Max Salary</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {grade.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{grade.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            {grade.title}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(grade.minSalary, grade.currency)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(grade.maxSalary, grade.currency)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteGrade(grade.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Salary Settings</CardTitle>
                </div>
                <CardDescription>Configure salary and compensation defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <Select defaultValue="NGN">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pay Frequency</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Salary Negotiation</Label>
                    <p className="text-sm text-muted-foreground">
                      Permit salaries outside grade range with approval
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enforce Salary Bands</Label>
                    <p className="text-sm text-muted-foreground">
                      Strictly enforce min/max salary for each grade
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-adjust for Annual Increment</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically apply yearly salary increases
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Annual Increment (%)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Increment Effective Month</Label>
                    <Select defaultValue="january">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">January</SelectItem>
                        <SelectItem value="april">April</SelectItem>
                        <SelectItem value="july">July</SelectItem>
                        <SelectItem value="october">October</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Grade Progression Rules</CardTitle>
                </div>
                <CardDescription>Configure promotion and grade advancement criteria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Minimum Time in Grade (months)</Label>
                    <Input type="number" defaultValue="12" />
                    <p className="text-xs text-muted-foreground">
                      Minimum duration before eligible for promotion
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Required Performance Rating</Label>
                    <Select defaultValue="exceeds">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meets">Meets Expectations</SelectItem>
                        <SelectItem value="exceeds">Exceeds Expectations</SelectItem>
                        <SelectItem value="outstanding">Outstanding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Training Completion</Label>
                    <p className="text-sm text-muted-foreground">
                      Mandatory training must be completed for promotion
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Skip-Level Promotion</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow promotion to skip intermediate grades
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leave Policy Settings */}
          <TabsContent value="leave" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Leave Entitlements</CardTitle>
                </div>
                <CardDescription>Configure default leave allowances by type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Annual Leave Days</Label>
                    <Input type="number" defaultValue="21" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sick Leave Days</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Casual Leave Days</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maternity Leave Days</Label>
                    <Input type="number" defaultValue="90" />
                  </div>
                  <div className="space-y-2">
                    <Label>Paternity Leave Days</Label>
                    <Input type="number" defaultValue="14" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bereavement Leave Days</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Study Leave Days</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Marriage Leave Days</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Compassionate Leave Days</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Leave Policies</CardTitle>
                </div>
                <CardDescription>Configure leave carryover and approval rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Leave Carryover</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow unused leave to carry over to next year
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Maximum Carryover Days</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Carryover Expiry (months)</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Leave Encashment</Label>
                    <p className="text-sm text-muted-foreground">
                      Convert unused leave to cash at year end
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Maximum Encashment Days</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Encashment Rate (%)</Label>
                    <Input type="number" defaultValue="100" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Medical Certificate for Sick Leave</Label>
                    <p className="text-sm text-muted-foreground">
                      After specified consecutive days
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Days Before Certificate Required</Label>
                  <Input type="number" defaultValue="3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Leave Approval Workflow</CardTitle>
                </div>
                <CardDescription>Configure approval chain and rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Approval Chain</Label>
                  <Select defaultValue="manager">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manager">Direct Manager Only</SelectItem>
                      <SelectItem value="manager-hod">Manager → HOD</SelectItem>
                      <SelectItem value="manager-hr">Manager → HR</SelectItem>
                      <SelectItem value="multi">Multi-Level Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Approve Short Leaves</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve leaves under threshold
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Auto-Approve Threshold (days)</Label>
                  <Input type="number" defaultValue="1" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Half-Day Leave</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable half-day leave requests
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Backdated Leave</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow leave requests for past dates
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Backdated Days</Label>
                  <Input type="number" defaultValue="3" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Settings */}
          <TabsContent value="payroll" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Payroll Processing</CardTitle>
                </div>
                <CardDescription>Configure payroll schedule and processing options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Pay Frequency</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pay Day</Label>
                    <Select defaultValue="25">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last">Last Day of Month</SelectItem>
                        <SelectItem value="25">25th of Month</SelectItem>
                        <SelectItem value="28">28th of Month</SelectItem>
                        <SelectItem value="1">1st of Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <Select defaultValue="NGN">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payslip Format</Label>
                    <Select defaultValue="detailed">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-process Payroll</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically process payroll on pay day
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Send Payslips</Label>
                    <p className="text-sm text-muted-foreground">
                      Email payslips to employees after processing
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Salary Advance</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable salary advance requests
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Statutory Deductions</CardTitle>
                </div>
                <CardDescription>Configure pension, tax, and other statutory contributions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Pension Rate (Employee %)</Label>
                    <Input type="number" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label>Pension Rate (Employer %)</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>NHF Rate (%)</Label>
                    <Input type="number" defaultValue="2.5" />
                    <p className="text-xs text-muted-foreground">National Housing Fund</p>
                  </div>
                  <div className="space-y-2">
                    <Label>NSITF Rate (%)</Label>
                    <Input type="number" defaultValue="1" />
                    <p className="text-xs text-muted-foreground">Social Insurance Trust Fund</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>ITF Rate (%)</Label>
                    <Input type="number" defaultValue="1" />
                    <p className="text-xs text-muted-foreground">Industrial Training Fund</p>
                  </div>
                  <div className="space-y-2">
                    <Label>WHT Rate (%)</Label>
                    <Input type="number" defaultValue="10" />
                    <p className="text-xs text-muted-foreground">Withholding Tax (contractors)</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable PAYE Tax Calculation</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-calculate Pay As You Earn tax
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Tax Relief (Annual)</Label>
                  <Input type="number" defaultValue="200000" />
                  <p className="text-xs text-muted-foreground">Consolidated relief allowance</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Overtime & Allowances</CardTitle>
                </div>
                <CardDescription>Configure overtime rates and standard allowances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Overtime Rate (Weekday %)</Label>
                    <Input type="number" defaultValue="150" />
                  </div>
                  <div className="space-y-2">
                    <Label>Overtime Rate (Weekend %)</Label>
                    <Input type="number" defaultValue="200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Overtime Rate (Holiday %)</Label>
                    <Input type="number" defaultValue="250" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Overtime Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Manager must approve overtime before processing
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Monthly Overtime Hours</Label>
                  <Input type="number" defaultValue="40" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Settings */}
          <TabsContent value="attendance" className="space-y-4">
            {/* Tymer Integration Card */}
            <Card className="border-2" style={{ borderColor: tymerConnected ? "#22c55e" : undefined }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5" style={{ color: moduleColor }} />
                    <CardTitle>Tymer Integration</CardTitle>
                  </div>
                  <Badge className={tymerConnected ? "bg-green-500" : "bg-gray-500"}>
                    {tymerConnected ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Connected
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Not Connected
                      </span>
                    )}
                  </Badge>
                </div>
                <CardDescription>
                  Connect to Tymer for automated attendance tracking and time management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tymerConnected ? (
                  <>
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-700 dark:text-green-400">Tymer is connected</p>
                          <p className="text-sm text-green-600 dark:text-green-500">
                            Last synced: Today at 9:30 AM
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSyncTymer}
                            disabled={tymerSyncing}
                            className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-400"
                          >
                            <RefreshCw className={`h-4 w-4 mr-2 ${tymerSyncing ? "animate-spin" : ""}`} />
                            {tymerSyncing ? "Syncing..." : "Sync Now"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDisconnectTymer}
                            className="border-red-300 text-red-600 hover:bg-red-100"
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Sync Settings</Label>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto-sync attendance data</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically sync attendance records from Tymer
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sync break times</Label>
                          <p className="text-sm text-muted-foreground">
                            Include break time tracking from Tymer
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Sync overtime records</Label>
                          <p className="text-sm text-muted-foreground">
                            Import overtime hours from Tymer
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Sync Frequency</Label>
                          <Select defaultValue="realtime">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realtime">Real-time</SelectItem>
                              <SelectItem value="hourly">Every Hour</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Data Retention</Label>
                          <Select defaultValue="365">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="90">90 Days</SelectItem>
                              <SelectItem value="180">180 Days</SelectItem>
                              <SelectItem value="365">1 Year</SelectItem>
                              <SelectItem value="forever">Forever</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Timer className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Connect to Tymer</h3>
                      <p className="text-sm text-muted-foreground">
                        Tymer is a powerful time tracking and attendance system. Enter your credentials to
                        automatically sync employee attendance, breaks, and overtime data.
                      </p>
                    </div>

                    <div className="space-y-4 max-w-md mx-auto">
                      <div className="space-y-2">
                        <Label htmlFor="tymer-tenant-id">Tenant ID</Label>
                        <div className="relative">
                          <Input
                            id="tymer-tenant-id"
                            placeholder="Enter your Tymer Tenant ID"
                            value={tymerTenantId}
                            onChange={(e) => setTymerTenantId(e.target.value)}
                            className="pl-10"
                          />
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Your unique Tymer organization identifier
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tymer-api-key">API Key</Label>
                        <div className="relative">
                          <Input
                            id="tymer-api-key"
                            type={showApiKey ? "text" : "password"}
                            placeholder="Enter your Tymer API Key"
                            value={tymerApiKey}
                            onChange={(e) => setTymerApiKey(e.target.value)}
                            className="pl-10 pr-10"
                          />
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Your secret API key from Tymer dashboard
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                          onClick={handleConnectTymer}
                          disabled={tymerSyncing || !tymerTenantId.trim() || !tymerApiKey.trim()}
                          className="text-white flex-1"
                          style={{ backgroundColor: moduleColor }}
                        >
                          <Link2 className="h-4 w-4 mr-2" />
                          {tymerSyncing ? "Connecting..." : "Connect Tymer"}
                        </Button>
                        <Button variant="outline">
                          Learn More
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <Clock className="h-6 w-6 mb-2" style={{ color: moduleColor }} />
                        <p className="font-medium text-sm">Real-time Tracking</p>
                        <p className="text-xs text-muted-foreground">Instant attendance sync</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <UserCheck className="h-6 w-6 mb-2" style={{ color: moduleColor }} />
                        <p className="font-medium text-sm">Biometric Support</p>
                        <p className="text-xs text-muted-foreground">Face & fingerprint</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <Target className="h-6 w-6 mb-2" style={{ color: moduleColor }} />
                        <p className="font-medium text-sm">Geofencing</p>
                        <p className="text-xs text-muted-foreground">Location verification</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Work Hours</CardTitle>
                </div>
                <CardDescription>Configure standard work hours and schedules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Work Start Time</Label>
                    <Input type="time" defaultValue="09:00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Work End Time</Label>
                    <Input type="time" defaultValue="17:00" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Lunch Break Start</Label>
                    <Input type="time" defaultValue="12:00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Lunch Break Duration (minutes)</Label>
                    <Input type="number" defaultValue="60" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Work Days</Label>
                    <Select defaultValue="mon-fri">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mon-fri">Monday - Friday</SelectItem>
                        <SelectItem value="mon-sat">Monday - Saturday</SelectItem>
                        <SelectItem value="sun-thu">Sunday - Thursday</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Hours per Week</Label>
                    <Input type="number" defaultValue="40" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Attendance Rules</CardTitle>
                </div>
                <CardDescription>Configure lateness and absence policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Grace Period (minutes)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                  <div className="space-y-2">
                    <Label>Late After (minutes)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Very Late After (minutes)</Label>
                    <Input type="number" defaultValue="60" />
                  </div>
                  <div className="space-y-2">
                    <Label>Absent After (hours)</Label>
                    <Input type="number" defaultValue="4" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Deduct Late Arrivals from Salary</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically deduct for lateness
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Late Deduction Rate (per hour %)</Label>
                  <Input type="number" defaultValue="0.5" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Self-Correction</Label>
                    <p className="text-sm text-muted-foreground">
                      Let employees correct attendance records
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Check-in Options</CardTitle>
                </div>
                <CardDescription>Configure attendance tracking methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Web Check-in</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow check-in from browser
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Mobile Check-in</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow check-in from mobile app
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Geolocation Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require location verification for attendance
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Geofence Radius (meters)</Label>
                  <Input type="number" defaultValue="100" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Facial Recognition</Label>
                    <p className="text-sm text-muted-foreground">
                      Use face detection for check-in
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Remote Work Check-in</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable work-from-home attendance
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recruitment Settings */}
          <TabsContent value="recruitment" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Job Posting</CardTitle>
                </div>
                <CardDescription>Configure job posting and application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Job ID Format</Label>
                    <Input defaultValue="JOB-{YYYY}-{####}" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Posting Duration (days)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Public Job Board</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow public access to job listings
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Internal Job Board</Label>
                    <p className="text-sm text-muted-foreground">
                      Show job openings to current employees
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require HOD Approval for Job Posts</Label>
                    <p className="text-sm text-muted-foreground">
                      Department head must approve before posting
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Application Settings</CardTitle>
                </div>
                <CardDescription>Configure candidate application process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Application ID Format</Label>
                    <Input defaultValue="APP-{####}" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Attachments</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Resume/CV</Label>
                    <p className="text-sm text-muted-foreground">
                      Applicants must upload resume
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Cover Letter</Label>
                    <p className="text-sm text-muted-foreground">
                      Applicants must submit cover letter
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Send Acknowledgement Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Send confirmation when application received
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Employee Referrals</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employees to refer candidates
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Interview Settings</CardTitle>
                </div>
                <CardDescription>Configure interview workflow and stages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Interview Stages</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Stage (Final Interview)</SelectItem>
                      <SelectItem value="2">2 Stages (Screening + Final)</SelectItem>
                      <SelectItem value="3">3 Stages (Screening + Technical + Final)</SelectItem>
                      <SelectItem value="4">4 Stages (Full Process)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Interview Feedback Template</Label>
                  <Textarea
                    rows={4}
                    placeholder="Define standard interview feedback questions..."
                    defaultValue="1. Technical Skills (1-5):\n2. Communication (1-5):\n3. Cultural Fit (1-5):\n4. Overall Recommendation:"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Video Interviews</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow scheduling virtual interviews
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Send Interview Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-send reminders to interviewers and candidates
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Settings */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Goal Management</CardTitle>
                </div>
                <CardDescription>Configure goal setting and tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Goal Setting Period</Label>
                    <Select defaultValue="quarterly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Goals per Period</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Manager Approval for Goals</Label>
                    <p className="text-sm text-muted-foreground">
                      Manager must approve employee goals
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Goal Editing After Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Permit modifications to approved goals
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Goal Cascading</Label>
                    <p className="text-sm text-muted-foreground">
                      Link team goals to company objectives
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Performance Reviews</CardTitle>
                </div>
                <CardDescription>Configure review cycles and evaluation criteria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Review Frequency</Label>
                    <Select defaultValue="annually">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rating Scale</Label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3-Point Scale</SelectItem>
                        <SelectItem value="5">5-Point Scale</SelectItem>
                        <SelectItem value="10">10-Point Scale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Self-Assessment</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employees to evaluate themselves
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable 360° Feedback</Label>
                    <p className="text-sm text-muted-foreground">
                      Collect feedback from peers and subordinates
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Competency Assessment</Label>
                    <p className="text-sm text-muted-foreground">
                      Evaluate against defined competencies
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Link Reviews to Compensation</Label>
                    <p className="text-sm text-muted-foreground">
                      Performance affects salary adjustments
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Promotion & Career</CardTitle>
                </div>
                <CardDescription>Configure career progression settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Minimum Time in Role (months)</Label>
                    <Input type="number" defaultValue="12" />
                  </div>
                  <div className="space-y-2">
                    <Label>Promotion Review Period</Label>
                    <Select defaultValue="annually">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Career Path Planning</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable career progression mapping
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Performance Minimum for Promotion</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce minimum rating for promotion eligibility
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Rating for Promotion</Label>
                  <Select defaultValue="4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 (Meets Expectations)</SelectItem>
                      <SelectItem value="4">4 (Exceeds Expectations)</SelectItem>
                      <SelectItem value="5">5 (Outstanding)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benefits Settings */}
          <TabsContent value="benefits" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Health Insurance</CardTitle>
                </div>
                <CardDescription>Configure health coverage and HMO settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Health Insurance</Label>
                    <p className="text-sm text-muted-foreground">
                      Provide health coverage to employees
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Coverage Type</Label>
                    <Select defaultValue="employee-family">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee Only</SelectItem>
                        <SelectItem value="employee-spouse">Employee + Spouse</SelectItem>
                        <SelectItem value="employee-family">Employee + Family</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Dependents</Label>
                    <Input type="number" defaultValue="4" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company Contribution (%)</Label>
                    <Input type="number" defaultValue="100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Annual Coverage Limit</Label>
                    <Input type="number" defaultValue="5000000" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Dental Coverage</Label>
                    <p className="text-sm text-muted-foreground">
                      Include dental care in health plan
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Vision Coverage</Label>
                    <p className="text-sm text-muted-foreground">
                      Include eye care in health plan
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Life & Disability Insurance</CardTitle>
                </div>
                <CardDescription>Configure life insurance and disability coverage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Life Insurance</Label>
                    <p className="text-sm text-muted-foreground">
                      Provide life insurance coverage
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Life Insurance Multiplier</Label>
                  <Select defaultValue="3x">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1x">1x Annual Salary</SelectItem>
                      <SelectItem value="2x">2x Annual Salary</SelectItem>
                      <SelectItem value="3x">3x Annual Salary</SelectItem>
                      <SelectItem value="5x">5x Annual Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Disability Insurance</Label>
                    <p className="text-sm text-muted-foreground">
                      Coverage for work-related disability
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Short-term Disability (%)</Label>
                    <Input type="number" defaultValue="70" />
                    <p className="text-xs text-muted-foreground">% of salary during disability</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Long-term Disability (%)</Label>
                    <Input type="number" defaultValue="60" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Other Benefits</CardTitle>
                </div>
                <CardDescription>Configure additional employee benefits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Transport Allowance</Label>
                    <p className="text-sm text-muted-foreground">
                      Monthly transport allowance for employees
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Meal Allowance</Label>
                    <p className="text-sm text-muted-foreground">
                      Daily or monthly meal subsidy
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Housing Allowance</Label>
                    <p className="text-sm text-muted-foreground">
                      Housing support for eligible employees
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Phone Allowance</Label>
                    <p className="text-sm text-muted-foreground">
                      Mobile phone reimbursement
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Gym Membership</Label>
                    <p className="text-sm text-muted-foreground">
                      Subsidized fitness membership
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Employee Stock Options</Label>
                    <p className="text-sm text-muted-foreground">
                      ESOP for eligible employees
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Settings */}
          <TabsContent value="training" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Training & Development</CardTitle>
                </div>
                <CardDescription>Configure employee training programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Annual Training Budget (per employee)</Label>
                    <Input type="number" defaultValue="200000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Training Hours (per year)</Label>
                    <Input type="number" defaultValue="40" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Online Learning Platform</Label>
                    <p className="text-sm text-muted-foreground">
                      Access to e-learning courses
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Manager Approval for Training</Label>
                    <p className="text-sm text-muted-foreground">
                      Manager must approve training requests
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Training Certificates</Label>
                    <p className="text-sm text-muted-foreground">
                      Issue certificates for completed training
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Training Effectiveness</Label>
                    <p className="text-sm text-muted-foreground">
                      Measure ROI and effectiveness of training
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Education Support</CardTitle>
                </div>
                <CardDescription>Configure education assistance programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Tuition Reimbursement</Label>
                    <p className="text-sm text-muted-foreground">
                      Support employees pursuing further education
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Annual Tuition Limit</Label>
                    <Input type="number" defaultValue="500000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Tenure Required (months)</Label>
                    <Input type="number" defaultValue="12" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Professional Certification Support</Label>
                    <p className="text-sm text-muted-foreground">
                      Fund professional certifications
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Conference Attendance</Label>
                    <p className="text-sm text-muted-foreground">
                      Support industry conference participation
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Annual Conference Budget</Label>
                  <Input type="number" defaultValue="300000" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Onboarding</CardTitle>
                </div>
                <CardDescription>Configure new employee onboarding process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Onboarding Duration (days)</Label>
                  <Input type="number" defaultValue="14" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Onboarding Checklist</Label>
                    <p className="text-sm text-muted-foreground">
                      Structured checklist for new hires
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Assign Onboarding Buddy</Label>
                    <p className="text-sm text-muted-foreground">
                      Pair new hires with mentors
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable IT Provisioning Workflow</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-request equipment for new hires
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Schedule 30/60/90 Day Check-ins</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-schedule onboarding check-ins
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Email Notifications</CardTitle>
                </div>
                <CardDescription>Configure email alerts for HR events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Leave Request Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Email when leave requests are submitted
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Leave Approval Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Email when leave is approved/rejected
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Birthday Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send birthday wishes to employees
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Work Anniversary Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Celebrate employee milestones
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payslip Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when payslips are ready
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Document Expiry Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when documents are expiring
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Manager Notifications</CardTitle>
                </div>
                <CardDescription>Alerts specifically for managers and HR</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Team Leave Calendar</Label>
                    <p className="text-sm text-muted-foreground">
                      Weekly team absence summary
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Probation End Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert before probation periods end
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Contract Renewal Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify before contracts expire
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Performance Review Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when reviews are due
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Attendance Anomaly Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Flag unusual attendance patterns
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payroll Processing Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify on payroll status changes
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Notification Preferences</CardTitle>
                </div>
                <CardDescription>General notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Digest Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Digest Send Time</Label>
                  <Input type="time" defaultValue="08:00" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications within the application
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send critical alerts via SMS
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Mobile push notifications
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
