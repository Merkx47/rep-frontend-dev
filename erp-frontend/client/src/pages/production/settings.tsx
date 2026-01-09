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
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  Factory,
  ClipboardList,
  Shield,
  Bell,
  Save,
  Settings,
  Users,
  Package,
  Wrench,
  Calendar,
  BarChart3,
} from "lucide-react";

export default function ProductionSettingsPage() {
  const moduleColor = getModuleColor("production");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Production settings have been updated successfully.",
    });
  };

  return (
    <SidebarLayout moduleId="production">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Production Settings</h1>
            <p className="text-muted-foreground mt-1">Configure production and manufacturing preferences</p>
          </div>
          <Button onClick={handleSave} className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="workorders">Work Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="machines">Machines</TabsTrigger>
            <TabsTrigger value="quality">Quality Control</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  <CardTitle>Manufacturing Settings</CardTitle>
                </div>
                <CardDescription>Configure general production settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Production Line</Label>
                    <Select defaultValue="line-a">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line-a">Line A - Assembly</SelectItem>
                        <SelectItem value="line-b">Line B - Electronics</SelectItem>
                        <SelectItem value="line-c">Line C - Molding</SelectItem>
                        <SelectItem value="line-d">Line D - Packaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Production Mode</Label>
                    <Select defaultValue="continuous">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="continuous">Continuous Production</SelectItem>
                        <SelectItem value="batch">Batch Production</SelectItem>
                        <SelectItem value="job">Job Order Production</SelectItem>
                        <SelectItem value="mixed">Mixed Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Shift Duration (hours)</Label>
                    <Input type="number" defaultValue="8" />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Shifts per Day</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Shift</SelectItem>
                        <SelectItem value="2">2 Shifts</SelectItem>
                        <SelectItem value="3">3 Shifts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Machine Downtime</Label>
                    <p className="text-sm text-muted-foreground">
                      Log and monitor machine downtime automatically
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Barcode Scanning</Label>
                    <p className="text-sm text-muted-foreground">
                      Use barcode scanning for production tracking
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-calculate Production Costs</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically calculate cost per unit produced
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle>Scheduling Settings</CardTitle>
                </div>
                <CardDescription>Configure production scheduling preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Scheduling Method</Label>
                    <Select defaultValue="fifo">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fifo">First In, First Out (FIFO)</SelectItem>
                        <SelectItem value="priority">Priority Based</SelectItem>
                        <SelectItem value="deadline">Deadline Based</SelectItem>
                        <SelectItem value="capacity">Capacity Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Lead Time (days)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Schedule Work Orders</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign work orders to available slots
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Overtime Scheduling</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow scheduling beyond normal shift hours
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workorders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  <CardTitle>Work Order Settings</CardTitle>
                </div>
                <CardDescription>Configure work order creation and processing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Work Order Prefix</Label>
                    <Input defaultValue="WO" />
                  </div>
                  <div className="space-y-2">
                    <Label>Starting Number</Label>
                    <Input type="number" defaultValue="1001" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Number Format</Label>
                    <Select defaultValue="prefix-year-seq">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prefix-seq">WO-0001</SelectItem>
                        <SelectItem value="prefix-year-seq">WO-2024-0001</SelectItem>
                        <SelectItem value="prefix-month-seq">WO-202401-0001</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-assign to Line</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign work orders based on capacity
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Require manager approval before starting production
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Partial Completion</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow marking work orders as partially complete
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-release Materials</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically reserve materials when work order is approved
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Work Order Stages</CardTitle>
                <CardDescription>Configure production workflow stages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Workflow</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (Draft → Approved → In Progress → QC → Complete)</SelectItem>
                      <SelectItem value="simple">Simple (Draft → In Progress → Complete)</SelectItem>
                      <SelectItem value="detailed">Detailed (Draft → Approved → Materials → Production → QC → Packaging → Complete)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Stage Sign-off</Label>
                    <p className="text-sm text-muted-foreground">
                      Require supervisor sign-off at each stage
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Time per Stage</Label>
                    <p className="text-sm text-muted-foreground">
                      Record time spent at each production stage
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <CardTitle>Raw Materials Settings</CardTitle>
                </div>
                <CardDescription>Configure raw material handling for production</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Material Consumption Method</Label>
                    <Select defaultValue="fifo">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fifo">First In, First Out (FIFO)</SelectItem>
                        <SelectItem value="lifo">Last In, First Out (LIFO)</SelectItem>
                        <SelectItem value="fefo">First Expired, First Out (FEFO)</SelectItem>
                        <SelectItem value="average">Average Cost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Wastage Allowance (%)</Label>
                    <Input type="number" defaultValue="2" step="0.5" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Check Material Availability</Label>
                    <p className="text-sm text-muted-foreground">
                      Verify materials are available before starting production
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Material Substitution</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow using alternative materials if primary is unavailable
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-deduct Materials</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically deduct materials from inventory when consumed
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Finished Goods Settings</CardTitle>
                <CardDescription>Configure finished goods inventory handling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Finished Goods Prefix</Label>
                    <Input defaultValue="FG" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Storage Location</Label>
                    <Select defaultValue="warehouse-a">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                        <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                        <SelectItem value="staging">Staging Area</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-add to Inventory</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically add finished goods to inventory after QC pass
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Generate Batch Numbers</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate batch/lot numbers for finished goods
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Expiry Dates</Label>
                    <p className="text-sm text-muted-foreground">
                      Record expiry dates for finished products
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="machines" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  <CardTitle>Machine Settings</CardTitle>
                </div>
                <CardDescription>Configure machine and equipment management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Machine ID Prefix</Label>
                    <Input defaultValue="MCH" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Operating Speed (%)</Label>
                    <Input type="number" defaultValue="85" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Machine Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Log operating hours for each machine
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable OEE Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track Overall Equipment Effectiveness metrics
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Status Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable real-time machine status monitoring
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Settings</CardTitle>
                <CardDescription>Configure preventive and corrective maintenance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Maintenance Schedule</Label>
                    <Select defaultValue="hours">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Based on Operating Hours</SelectItem>
                        <SelectItem value="calendar">Calendar Based</SelectItem>
                        <SelectItem value="production">Based on Production Volume</SelectItem>
                        <SelectItem value="condition">Condition Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Maintenance Interval</Label>
                    <Input type="number" defaultValue="500" placeholder="Hours" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-schedule Maintenance</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically schedule maintenance based on intervals
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Warning Days</Label>
                    <p className="text-sm text-muted-foreground">
                      Days before due to show maintenance warning
                    </p>
                  </div>
                  <Input type="number" defaultValue="7" className="w-24" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Block Production for Overdue Maintenance</Label>
                    <p className="text-sm text-muted-foreground">
                      Prevent using machines with overdue maintenance
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Quality Control Settings</CardTitle>
                </div>
                <CardDescription>Configure quality assurance parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Sample Size (%)</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Acceptable Defect Rate (%)</Label>
                    <Input type="number" defaultValue="2" step="0.1" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>QC Check Frequency</Label>
                    <Select defaultValue="per-batch">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="per-unit">Per Unit</SelectItem>
                        <SelectItem value="per-batch">Per Batch</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="per-shift">Per Shift</SelectItem>
                        <SelectItem value="random">Random Sampling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Inspection Level</Label>
                    <Select defaultValue="normal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reduced">Reduced</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="tightened">Tightened</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mandatory QC Check</Label>
                    <p className="text-sm text-muted-foreground">
                      Require QC check before marking order complete
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-reject High Defect Batches</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically reject batches exceeding defect threshold
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Photos for Defects</Label>
                    <p className="text-sm text-muted-foreground">
                      Require photographic evidence for defect reports
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Non-Conformance Handling</CardTitle>
                <CardDescription>Configure how to handle defective products</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Non-Conformance Action</Label>
                  <Select defaultValue="quarantine">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quarantine">Quarantine for Review</SelectItem>
                      <SelectItem value="rework">Send for Rework</SelectItem>
                      <SelectItem value="scrap">Mark as Scrap</SelectItem>
                      <SelectItem value="downgrade">Downgrade Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Root Cause Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Require RCA for all non-conformance reports
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-create Corrective Action</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically create CAPA for recurring issues
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Production Notifications</CardTitle>
                </div>
                <CardDescription>Configure production alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Work Order Created</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new work order is created
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Work Order Approved</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify production team when order is approved
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Completion Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when work orders are completed
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Deadline Approaching</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when work order deadline is approaching
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory & Quality Alerts</CardTitle>
                <CardDescription>Configure material and quality notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when raw materials are running low
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Quality Failure Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when QC checks fail
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Machine Downtime Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when machines go offline
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Due Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when machine maintenance is due
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Delivery</CardTitle>
                <CardDescription>Configure how notifications are delivered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Production Manager Email</Label>
                    <Input type="email" defaultValue="production@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Quality Manager Email</Label>
                    <Input type="email" defaultValue="quality@company.com" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Send SMS for critical production alerts
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Production Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Send daily summary of production activities
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
