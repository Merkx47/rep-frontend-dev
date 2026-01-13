import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  Settings,
  Key,
  Building2,
  Globe,
  Bell,
  Shield,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Save,
  FileText,
  Clock,
  Upload,
} from "lucide-react";

export default function NRSSettingsPage() {
  const moduleColor = getModuleColor("nrs-einvoice");
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(true);
  const [autoSubmit, setAutoSubmit] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [rejectionAlerts, setRejectionAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [batchSubmission, setBatchSubmission] = useState(true);
  const [autoRetry, setAutoRetry] = useState(true);
  const [validationBeforeSubmit, setValidationBeforeSubmit] = useState(true);
  const [archiveSubmitted, setArchiveSubmitted] = useState(true);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your NRS settings have been updated successfully.",
    });
  };

  const handleTestConnection = () => {
    toast({
      title: "Connection Test",
      description: "Successfully connected to NRS API.",
    });
  };

  return (
    <SidebarLayout moduleId="nrs-einvoice">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">NRS Settings</h1>
            <p className="text-muted-foreground mt-1">Configure your NRS integration and preferences</p>
          </div>
          <Button onClick={handleSaveSettings} className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="connection" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1 w-full">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="business">Business Info</TabsTrigger>
            <TabsTrigger value="submission">Submission</TabsTrigger>
            <TabsTrigger value="invoices">Invoice Format</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Connection Tab */}
          <TabsContent value="connection" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    <CardTitle>API Connection</CardTitle>
                  </div>
                  {isConnected ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Disconnected
                    </Badge>
                  )}
                </div>
                <CardDescription>Manage your connection to the NRS e-invoicing system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>API Endpoint</Label>
                    <Input value="https://api.nrs.gov.ng/einvoice/v1" readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Select defaultValue="production">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Connection Timeout (seconds)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>API Version</Label>
                    <Select defaultValue="v1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">Version 1.0</SelectItem>
                        <SelectItem value="v2">Version 2.0 (Beta)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleTestConnection}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  <CardTitle>API Credentials</CardTitle>
                </div>
                <CardDescription>Your NRS API authentication details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input id="clientId" value="QRP-2024-****-****" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientSecret">Client Secret</Label>
                    <Input id="clientSecret" value="••••••••••••••••" type="password" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Token Expiry</Label>
                    <Input value="24 hours" readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Token Refresh</Label>
                    <Input value="2 hours ago" readOnly className="bg-muted" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep your credentials secure. Never share them with unauthorized parties.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Info Tab */}
          <TabsContent value="business" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <CardTitle>Business Information</CardTitle>
                </div>
                <CardDescription>Your registered business details with NRS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" defaultValue="Qorpy Technologies Ltd" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tradeName">Trade Name (if different)</Label>
                    <Input id="tradeName" placeholder="Optional trading name" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tin">Tax Identification Number (TIN)</Label>
                    <Input id="tin" defaultValue="12345678-0001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rcNumber">RC Number</Label>
                    <Input id="rcNumber" defaultValue="RC123456" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">VAT Registration Number</Label>
                    <Input id="vatNumber" defaultValue="VAT-2024-12345" />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Type</Label>
                    <Select defaultValue="limited">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sole">Sole Proprietorship</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="limited">Limited Liability Company</SelectItem>
                        <SelectItem value="plc">Public Limited Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea id="address" defaultValue="123 Business District, Lagos, Nigeria" rows={2} />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Select defaultValue="lagos">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">FCT Abuja</SelectItem>
                        <SelectItem value="rivers">Rivers</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        <SelectItem value="oyo">Oyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>LGA</Label>
                    <Input defaultValue="Victoria Island" />
                  </div>
                  <div className="space-y-2">
                    <Label>Postal Code</Label>
                    <Input defaultValue="101241" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Business Email</Label>
                    <Input type="email" defaultValue="finance@qorpy.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Phone</Label>
                    <Input defaultValue="+234 1 234 5678" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Classification</CardTitle>
                <CardDescription>Your business sector for NRS reporting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Primary Sector</Label>
                    <Select defaultValue="technology">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Information Technology</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail & Trade</SelectItem>
                        <SelectItem value="services">Professional Services</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>ISIC Code</Label>
                    <Input defaultValue="6201" placeholder="International Standard Industrial Classification" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submission Tab */}
          <TabsContent value="submission" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <CardTitle>Submission Preferences</CardTitle>
                </div>
                <CardDescription>Configure how invoices are submitted to NRS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Submit Invoices</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically submit invoices to NRS when created
                    </p>
                  </div>
                  <Switch checked={autoSubmit} onCheckedChange={setAutoSubmit} color={moduleColor} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Validate Before Submission</Label>
                    <p className="text-sm text-muted-foreground">
                      Check invoice data for errors before submitting
                    </p>
                  </div>
                  <Switch checked={validationBeforeSubmit} onCheckedChange={setValidationBeforeSubmit} color={moduleColor} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Batch Submission</Label>
                    <p className="text-sm text-muted-foreground">
                      Submit multiple invoices in a single batch
                    </p>
                  </div>
                  <Switch checked={batchSubmission} onCheckedChange={setBatchSubmission} color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="submissionDelay">Submission Delay (hours)</Label>
                    <Input id="submissionDelay" type="number" defaultValue="1" min="0" max="72" />
                    <p className="text-xs text-muted-foreground">
                      Wait time before auto-submitting (0-72 hours)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Batch Size Limit</Label>
                    <Input type="number" defaultValue="100" />
                    <p className="text-xs text-muted-foreground">
                      Maximum invoices per batch submission
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <CardTitle>Retry & Error Handling</CardTitle>
                </div>
                <CardDescription>Configure how failed submissions are handled</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Retry Failed Submissions</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically retry failed submissions
                    </p>
                  </div>
                  <Switch checked={autoRetry} onCheckedChange={setAutoRetry} color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="retryAttempts">Retry Attempts</Label>
                    <Input id="retryAttempts" type="number" defaultValue="3" min="1" max="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Retry Interval (minutes)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>On Permanent Failure</Label>
                  <Select defaultValue="notify">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notify">Notify Administrator</SelectItem>
                      <SelectItem value="queue">Queue for Manual Review</SelectItem>
                      <SelectItem value="both">Notify & Queue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  <CardTitle>Archive Settings</CardTitle>
                </div>
                <CardDescription>Configure how submitted invoices are archived</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Archive Submitted Invoices</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep copies of all submitted invoices locally
                    </p>
                  </div>
                  <Switch checked={archiveSubmitted} onCheckedChange={setArchiveSubmitted} color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Archive Retention (years)</Label>
                    <Select defaultValue="7">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 Years</SelectItem>
                        <SelectItem value="7">7 Years</SelectItem>
                        <SelectItem value="10">10 Years</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Archive Format</Label>
                    <Select defaultValue="xml">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xml">XML</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="all">All Formats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoice Format Tab */}
          <TabsContent value="invoices" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Invoice Format Settings</CardTitle>
                </div>
                <CardDescription>Configure e-invoice format and structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Invoice Number Prefix</Label>
                    <Input defaultValue="NRS-INV" />
                  </div>
                  <div className="space-y-2">
                    <Label>Invoice Number Format</Label>
                    <Select defaultValue="sequential">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sequential">Sequential (001, 002...)</SelectItem>
                        <SelectItem value="year-seq">Year-Sequential (2024-001)</SelectItem>
                        <SelectItem value="month-seq">Month-Sequential (202401-001)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Invoice Type</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Invoice</SelectItem>
                        <SelectItem value="simplified">Simplified Invoice</SelectItem>
                        <SelectItem value="credit">Credit Note</SelectItem>
                        <SelectItem value="debit">Debit Note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency Code</Label>
                    <Select defaultValue="NGN">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tax Calculation Method</Label>
                    <Select defaultValue="exclusive">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exclusive">Tax Exclusive</SelectItem>
                        <SelectItem value="inclusive">Tax Inclusive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default VAT Rate (%)</Label>
                    <Input type="number" defaultValue="7.5" step="0.1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Default Invoice Notes</Label>
                  <Textarea
                    placeholder="Enter default notes to appear on all e-invoices"
                    defaultValue="Thank you for your business. This is an NRS-compliant e-invoice."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Line Item Settings</CardTitle>
                <CardDescription>Configure default settings for invoice line items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Unit of Measure</Label>
                    <Select defaultValue="unit">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unit">Unit (EA)</SelectItem>
                        <SelectItem value="box">Box (BOX)</SelectItem>
                        <SelectItem value="kg">Kilogram (KG)</SelectItem>
                        <SelectItem value="liter">Liter (LTR)</SelectItem>
                        <SelectItem value="hour">Hour (HR)</SelectItem>
                        <SelectItem value="service">Service (SVC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Decimal Places for Quantity</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 (Whole numbers only)</SelectItem>
                        <SelectItem value="2">2 decimal places</SelectItem>
                        <SelectItem value="4">4 decimal places</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Decimal Places for Unit Price</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 decimal places</SelectItem>
                        <SelectItem value="4">4 decimal places</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Rounding Method</Label>
                    <Select defaultValue="half-up">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="half-up">Round Half Up</SelectItem>
                        <SelectItem value="half-down">Round Half Down</SelectItem>
                        <SelectItem value="truncate">Truncate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Email Notifications</CardTitle>
                </div>
                <CardDescription>Configure NRS email notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates for submission status changes
                    </p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} color={moduleColor} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Submission Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Email when invoice is successfully submitted
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rejection Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get immediate alerts when invoices are rejected
                    </p>
                  </div>
                  <Switch checked={rejectionAlerts} onCheckedChange={setRejectionAlerts} color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily summary of all submissions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Certificate Expiry Warning</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify before digital certificate expires
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="notificationEmail">Primary Notification Email</Label>
                  <Input id="notificationEmail" type="email" defaultValue="finance@qorpy.com" />
                </div>
                <div className="space-y-2">
                  <Label>Additional Recipients (comma-separated)</Label>
                  <Input placeholder="accounts@company.com, manager@company.com" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS Notifications</CardTitle>
                <CardDescription>Configure SMS alerts for critical events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive SMS for critical submission events
                    </p>
                  </div>
                  <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Primary Phone Number</Label>
                    <Input placeholder="+234 xxx xxx xxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label>Alert Types</Label>
                    <Select defaultValue="critical">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="critical">Critical Only (Rejections, Failures)</SelectItem>
                        <SelectItem value="failures">Failures Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Digital Certificate</CardTitle>
                </div>
                <CardDescription>Manage your digital signing certificate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Digital Certificate Active</span>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <p>Issued to: Qorpy Technologies Ltd</p>
                    <p>Issued by: NRS Certificate Authority</p>
                    <p>Valid from: January 1, 2024</p>
                    <p>Valid until: December 31, 2024</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    View Certificate
                  </Button>
                  <Button variant="outline">
                    Renew Certificate
                  </Button>
                  <Button variant="outline">
                    Upload New Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Control</CardTitle>
                <CardDescription>Configure who can submit invoices to NRS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Submission Permissions</Label>
                  <Select defaultValue="finance">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrators Only</SelectItem>
                      <SelectItem value="finance">Finance Team & Admins</SelectItem>
                      <SelectItem value="all">All Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval for Submission</Label>
                    <p className="text-sm text-muted-foreground">
                      Manager must approve before submission to NRS
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Log All Submission Activities</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep detailed audit trail of all NRS activities
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Protection</CardTitle>
                <CardDescription>Configure data security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Encrypt Stored Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Encrypt all locally stored invoice data
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mask Sensitive Data in Logs</Label>
                    <p className="text-sm text-muted-foreground">
                      Hide TIN, VAT numbers in activity logs
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>API Key Rotation</Label>
                  <Select defaultValue="90">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">Every 30 Days</SelectItem>
                      <SelectItem value="60">Every 60 Days</SelectItem>
                      <SelectItem value="90">Every 90 Days</SelectItem>
                      <SelectItem value="never">Never (Manual Only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
