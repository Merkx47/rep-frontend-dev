import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  FileText,
  Mail,
  CreditCard,
  Bell,
  Save,
  Palette,
  Shield,
  AlertTriangle,
  Clock,
  Receipt,
  Settings,
  FileCheck,
  Printer,
  Globe,
} from "lucide-react";

export default function InvoiceSettingsPage() {
  const moduleColor = getModuleColor("invoice");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Invoice settings have been updated successfully.",
    });
  };

  return (
    <SidebarLayout moduleId="invoice">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Invoice Settings</h1>
            <p className="text-muted-foreground mt-1">Configure invoice generation, templates, and delivery</p>
          </div>
          <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Invoice Numbering</CardTitle>
                </div>
                <CardDescription>Configure invoice numbering and format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Invoice Prefix</Label>
                    <Input defaultValue="INV" />
                  </div>
                  <div className="space-y-2">
                    <Label>Starting Number</Label>
                    <Input type="number" defaultValue="1001" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Invoice Number Format</Label>
                    <Select defaultValue="prefix-year-num">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prefix-num">INV-0001</SelectItem>
                        <SelectItem value="prefix-year-num">INV-2026-0001</SelectItem>
                        <SelectItem value="year-prefix-num">2026-INV-0001</SelectItem>
                        <SelectItem value="prefix-month-num">INV-01-0001</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Number Length</Label>
                    <Select defaultValue="4">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 digits (001)</SelectItem>
                        <SelectItem value="4">4 digits (0001)</SelectItem>
                        <SelectItem value="5">5 digits (00001)</SelectItem>
                        <SelectItem value="6">6 digits (000001)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-generate Invoice Numbers</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign sequential invoice numbers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reset Numbers Yearly</Label>
                    <p className="text-sm text-muted-foreground">
                      Restart numbering each year
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Manual Override</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow changing auto-generated numbers
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Invoice Defaults</CardTitle>
                </div>
                <CardDescription>Configure default invoice settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Due Days</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
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
                </div>
                <div className="space-y-2">
                  <Label>Default Notes</Label>
                  <Textarea
                    rows={3}
                    placeholder="Thank you for your business!"
                    defaultValue="Thank you for your business. Payment is due within the specified terms."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Terms & Conditions</Label>
                  <Textarea
                    rows={3}
                    defaultValue="1. Payment is due within the specified number of days.\n2. Late payments may incur additional charges.\n3. Goods remain property of seller until full payment."
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Terms on Invoices</Label>
                    <p className="text-sm text-muted-foreground">
                      Show terms and conditions on all invoices
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Settings */}
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Invoice Templates</CardTitle>
                </div>
                <CardDescription>Configure invoice appearance and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Template</Label>
                    <Select defaultValue="professional">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Paper Size</Label>
                    <Select defaultValue="a4">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="a4">A4</SelectItem>
                        <SelectItem value="letter">Letter</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <Input type="color" defaultValue="#3B82F6" className="h-10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select defaultValue="inter">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inter">Inter</SelectItem>
                        <SelectItem value="roboto">Roboto</SelectItem>
                        <SelectItem value="arial">Arial</SelectItem>
                        <SelectItem value="times">Times New Roman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Company Logo</Label>
                    <p className="text-sm text-muted-foreground">
                      Display company logo on invoices
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Company Stamp</Label>
                    <p className="text-sm text-muted-foreground">
                      Display company stamp/seal on invoices
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Bank Details</Label>
                    <p className="text-sm text-muted-foreground">
                      Display payment bank information
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Item Images</Label>
                    <p className="text-sm text-muted-foreground">
                      Display product images on line items
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show QR Code</Label>
                    <p className="text-sm text-muted-foreground">
                      Include QR code for payment verification
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Printer className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Print Settings</CardTitle>
                </div>
                <CardDescription>Configure printing options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Print on Creation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically print when invoice is created
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Default Print Copies</Label>
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 copy</SelectItem>
                      <SelectItem value="2">2 copies</SelectItem>
                      <SelectItem value="3">3 copies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Print in Color</Label>
                    <p className="text-sm text-muted-foreground">
                      Use color printing by default
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Payment Methods</CardTitle>
                </div>
                <CardDescription>Configure accepted payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bank Transfer</Label>
                    <p className="text-sm text-muted-foreground">Accept bank transfer payments</p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Credit/Debit Card</Label>
                    <p className="text-sm text-muted-foreground">Accept card payments online</p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cash</Label>
                    <p className="text-sm text-muted-foreground">Accept cash payments</p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mobile Money</Label>
                    <p className="text-sm text-muted-foreground">Accept mobile money payments</p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cheque</Label>
                    <p className="text-sm text-muted-foreground">Accept cheque payments</p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Online Payment Link</Label>
                    <p className="text-sm text-muted-foreground">Include payment link on invoices</p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Payment Terms</CardTitle>
                </div>
                <CardDescription>Configure payment terms and policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Late Payment Fee (%)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Late Fee Grace Period (days)</Label>
                    <Input type="number" defaultValue="7" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Early Payment Discount (%)</Label>
                    <Input type="number" defaultValue="2" />
                  </div>
                  <div className="space-y-2">
                    <Label>Early Discount Days</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Partial Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept partial invoice payments
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Apply Late Fees</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically add late fees after grace period
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require PO Number</Label>
                    <p className="text-sm text-muted-foreground">
                      Require purchase order number on invoices
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reminders Settings */}
          <TabsContent value="reminders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Payment Reminders</CardTitle>
                </div>
                <CardDescription>Configure automatic payment reminder schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Auto-Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically send payment reminders
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <Separator />
                <div className="space-y-4">
                  <Label>Reminder Schedule</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm">First Reminder (days before due)</Label>
                      <Input type="number" defaultValue="7" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Second Reminder (days before due)</Label>
                      <Input type="number" defaultValue="3" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm">Due Date Reminder</Label>
                      <Select defaultValue="yes">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Send on Due Date</SelectItem>
                          <SelectItem value="no">Skip</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Overdue Reminder Frequency</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="3days">Every 3 Days</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Stop After Max Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Stop sending after a certain number of reminders
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Reminders</Label>
                  <Input type="number" defaultValue="5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Overdue Actions</CardTitle>
                </div>
                <CardDescription>Configure actions for overdue invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Escalate to Manager</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify manager for severely overdue invoices
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Escalation Threshold (days overdue)</Label>
                  <Input type="number" defaultValue="30" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Block New Orders</Label>
                    <p className="text-sm text-muted-foreground">
                      Prevent new orders for customers with overdue invoices
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Flag for Collections</Label>
                    <p className="text-sm text-muted-foreground">
                      Mark severely overdue invoices for collections
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Collections Threshold (days overdue)</Label>
                  <Input type="number" defaultValue="90" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Email Configuration</CardTitle>
                </div>
                <CardDescription>Configure invoice email delivery settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>From Email</Label>
                    <Input defaultValue="invoices@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Reply-To Email</Label>
                    <Input defaultValue="accounts@company.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Subject Template</Label>
                  <Input defaultValue="Invoice #{invoice_number} from {company_name}" />
                  <p className="text-xs text-muted-foreground">
                    Variables: {`{invoice_number}, {company_name}, {customer_name}, {due_date}, {amount}`}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Email Body Template</Label>
                  <Textarea
                    rows={5}
                    defaultValue={`Dear {customer_name},

Please find attached your invoice #{invoice_number} for {amount}.

Payment is due by {due_date}.

Thank you for your business.

Best regards,
{company_name}`}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Email Options</CardTitle>
                </div>
                <CardDescription>Configure email behavior and attachments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-send on Creation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically email invoice when created
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Attach PDF</Label>
                    <p className="text-sm text-muted-foreground">
                      Include PDF attachment in emails
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Payment Link</Label>
                    <p className="text-sm text-muted-foreground">
                      Add online payment link in email
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Request Read Receipt</Label>
                    <p className="text-sm text-muted-foreground">
                      Request confirmation when email is opened
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>BCC Finance Team</Label>
                    <p className="text-sm text-muted-foreground">
                      Send copy to finance department
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>BCC Email Address</Label>
                  <Input defaultValue="finance@company.com" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Taxes Settings */}
          <TabsContent value="taxes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Tax Configuration</CardTitle>
                </div>
                <CardDescription>Configure tax calculations for invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default VAT Rate (%)</Label>
                    <Input type="number" defaultValue="7.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Calculation</Label>
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
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Tax</Label>
                    <p className="text-sm text-muted-foreground">
                      Apply tax to invoices
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Tax Breakdown</Label>
                    <p className="text-sm text-muted-foreground">
                      Display tax details on invoices
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Multiple Tax Rates</Label>
                    <p className="text-sm text-muted-foreground">
                      Use different tax rates per item
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
                  <CardTitle>Tax Compliance</CardTitle>
                </div>
                <CardDescription>Configure tax compliance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Tax Registration Number</Label>
                    <p className="text-sm text-muted-foreground">
                      Display company TIN/VAT number on invoices
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Tax Registration Number</Label>
                  <Input defaultValue="12345678-0001" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Tax-Exempt Invoices</Label>
                    <p className="text-sm text-muted-foreground">
                      Create invoices without tax
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Tax-Exempt Reason</Label>
                    <p className="text-sm text-muted-foreground">
                      Require reason for tax-exempt invoices
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
                  <CardTitle>Invoice Notifications</CardTitle>
                </div>
                <CardDescription>Configure invoice-related alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Invoice Created</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new invoices are created
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Invoice Sent</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when invoices are sent to customers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Invoice Viewed</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when customer views the invoice
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Payment Received</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when invoice payment is received
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Invoice Overdue</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when invoices become overdue
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Large Invoice Alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for invoices above threshold
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Large Invoice Threshold (₦)</Label>
                  <Input type="number" defaultValue="1000000" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Notification Preferences</CardTitle>
                </div>
                <CardDescription>Configure how notifications are delivered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Notification Frequency</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send alerts via email
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show alerts within the application
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send critical alerts via SMS
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily invoice summary report
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
