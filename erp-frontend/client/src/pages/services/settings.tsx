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
  Settings,
  Clock,
  DollarSign,
  Bell,
  Save,
  Users,
  Calendar,
  FileText,
  Star,
  Truck,
} from "lucide-react";

export default function ServicesSettingsPage() {
  const moduleColor = getModuleColor("services");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Services settings have been updated successfully.",
    });
  };

  return (
    <SidebarLayout moduleId="services">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Services Settings</h1>
            <p className="text-muted-foreground mt-1">Configure service catalog and delivery settings</p>
          </div>
          <Button onClick={handleSave} className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="catalog">Service Catalog</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <CardTitle>Service Settings</CardTitle>
                </div>
                <CardDescription>Configure general service settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Service Code Prefix</Label>
                    <Input defaultValue="SVC" />
                  </div>
                  <div className="space-y-2">
                    <Label>Starting Number</Label>
                    <Input type="number" defaultValue="1001" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Duration Unit</Label>
                    <Select defaultValue="hours">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select defaultValue="professional">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional Services</SelectItem>
                        <SelectItem value="technical">Technical Services</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="support">Support Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Service Scheduling</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow scheduling services in advance
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Service Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Log hours spent on each service
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Service Contracts</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow creating recurring service contracts
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>Team Settings</CardTitle>
                </div>
                <CardDescription>Configure service team management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Team Assignment Method</Label>
                    <Select defaultValue="manual">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Assignment</SelectItem>
                        <SelectItem value="auto-skill">Auto by Skill Match</SelectItem>
                        <SelectItem value="auto-availability">Auto by Availability</SelectItem>
                        <SelectItem value="round-robin">Round Robin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Concurrent Services per Team Member</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Individual Performance</Label>
                    <p className="text-sm text-muted-foreground">
                      Monitor service delivery metrics per team member
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Self-Assignment</Label>
                    <p className="text-sm text-muted-foreground">
                      Team members can assign themselves to services
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="catalog" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Service Catalog Settings</CardTitle>
                </div>
                <CardDescription>Configure service catalog options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Catalog Organization</Label>
                    <Select defaultValue="category">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">By Category</SelectItem>
                        <SelectItem value="type">By Service Type</SelectItem>
                        <SelectItem value="department">By Department</SelectItem>
                        <SelectItem value="flat">Flat List</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Service Category</Label>
                    <Select defaultValue="general">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Services</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="training">Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Service Descriptions</Label>
                    <p className="text-sm text-muted-foreground">
                      Display detailed descriptions in catalog
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Pricing in Catalog</Label>
                    <p className="text-sm text-muted-foreground">
                      Display prices in the service catalog
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Service Bundles</Label>
                    <p className="text-sm text-muted-foreground">
                      Create bundled service packages
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Service Add-ons</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow optional add-ons for services
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Level Agreements (SLA)</CardTitle>
                <CardDescription>Configure default SLA settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Response Time (hours)</Label>
                    <Input type="number" defaultValue="4" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Resolution Time (hours)</Label>
                    <Input type="number" defaultValue="24" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable SLA Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track SLA compliance for all services
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SLA Breach Escalation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically escalate when SLA is breached
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle>Scheduling Settings</CardTitle>
                </div>
                <CardDescription>Configure service scheduling options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Booking Window (days ahead)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Advance Booking (hours)</Label>
                    <Input type="number" defaultValue="24" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Time Slot Duration</Label>
                    <Select defaultValue="60">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 Minutes</SelectItem>
                        <SelectItem value="60">1 Hour</SelectItem>
                        <SelectItem value="90">1.5 Hours</SelectItem>
                        <SelectItem value="120">2 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Buffer Between Services (minutes)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Same-Day Booking</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable booking services for same day
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Recurring Services</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable scheduling recurring services
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-confirm Bookings</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically confirm service bookings
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
                <CardDescription>Configure default service availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="time" defaultValue="09:00" />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="time" defaultValue="18:00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Working Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <Button
                        key={day}
                        variant={["Sat", "Sun"].includes(day) ? "outline" : "default"}
                        size="sm"
                        className={["Sat", "Sun"].includes(day) ? "" : "bg-primary"}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Weekend Services</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable scheduling on weekends
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Respect Public Holidays</Label>
                    <p className="text-sm text-muted-foreground">
                      Block scheduling on public holidays
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <CardTitle>Delivery Settings</CardTitle>
                </div>
                <CardDescription>Configure service delivery options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Lead Time (days)</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <Label>Buffer Time (hours)</Label>
                    <Input type="number" defaultValue="2" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Delivery Method</Label>
                    <Select defaultValue="onsite">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onsite">On-site</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Service Location Radius (km)</Label>
                    <Input type="number" defaultValue="50" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Express Delivery</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable expedited service delivery option
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Express Delivery Surcharge (%)</Label>
                  <Input type="number" defaultValue="50" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Delivery Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Customer must confirm service delivery
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Digital Signature</Label>
                    <p className="text-sm text-muted-foreground">
                      Collect digital signature on completion
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <CardTitle>Quality & Feedback</CardTitle>
                </div>
                <CardDescription>Configure service quality tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Request Customer Feedback</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically request feedback after service
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Feedback Request Delay (hours)</Label>
                    <Input type="number" defaultValue="24" />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating Scale</Label>
                    <Select defaultValue="5-star">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-star">5 Star Rating</SelectItem>
                        <SelectItem value="10-point">10 Point Scale</SelectItem>
                        <SelectItem value="nps">Net Promoter Score</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Service Report</Label>
                    <p className="text-sm text-muted-foreground">
                      Team must submit report after service
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Photo Documentation</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow uploading photos as service evidence
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <CardTitle>Pricing Settings</CardTitle>
                </div>
                <CardDescription>Configure service pricing options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Billing Method</Label>
                    <Select defaultValue="fixed">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                        <SelectItem value="daily">Daily Rate</SelectItem>
                        <SelectItem value="project">Project Based</SelectItem>
                        <SelectItem value="subscription">Subscription</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Hourly Rate (₦)</Label>
                    <Input type="number" defaultValue="15000" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input type="number" defaultValue="7.5" step="0.1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Calculation</Label>
                    <Select defaultValue="exclusive">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inclusive">Tax Inclusive</SelectItem>
                        <SelectItem value="exclusive">Tax Exclusive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Custom Pricing</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable custom quotes for services
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Volume Discounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Offer discounts for bulk service orders
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Price Negotiation</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable price negotiation with customers
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure service payment options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Deposit</Label>
                    <p className="text-sm text-muted-foreground">
                      Require upfront payment before service
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Deposit (%)</Label>
                    <Input type="number" defaultValue="50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Due (days after service)</Label>
                    <Input type="number" defaultValue="14" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Partial Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept payment in installments
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-generate Invoice</Label>
                    <p className="text-sm text-muted-foreground">
                      Create invoice when service is completed
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Late Payment Fee (%)</Label>
                  <Input type="number" defaultValue="2" step="0.5" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Service Notifications</CardTitle>
                </div>
                <CardDescription>Configure service-related alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Service Request</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new service is requested
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Booking Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when booking is confirmed
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Service Started</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when service delivery begins
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Service Completed</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when service is completed
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Service Cancelled</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when service is cancelled
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reminder Notifications</CardTitle>
                <CardDescription>Configure automatic reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Upcoming Service Reminder</Label>
                    <p className="text-sm text-muted-foreground">
                      Remind before scheduled service
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Reminder (hours before)</Label>
                    <Input type="number" defaultValue="24" />
                  </div>
                  <div className="space-y-2">
                    <Label>Second Reminder (hours before)</Label>
                    <Input type="number" defaultValue="2" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Overdue Service Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when services are past due date
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SLA Warning Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when SLA deadline is approaching
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Channels</CardTitle>
                <CardDescription>Configure how notifications are delivered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via email
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notifications via SMS
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send in-app push notifications
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Service Manager Email</Label>
                    <Input type="email" defaultValue="services@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Escalation Email</Label>
                    <Input type="email" defaultValue="manager@company.com" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
