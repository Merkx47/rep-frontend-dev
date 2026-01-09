import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Shield,
  TrendingUp,
  Bell,
  Save,
  Users,
  Receipt,
  Lock,
  Globe,
  FileText,
} from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function CorporateCardsSettingsPage() {
  const moduleColor = getModuleColor("corporate-cards");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Corporate cards settings have been updated successfully.",
    });
  };

  return (
    <SidebarLayout moduleId="corporate-cards">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Corporate Cards Settings</h1>
            <p className="text-muted-foreground mt-1">Configure card policies and spending controls</p>
          </div>
          <Button
            className="text-gray-900 shadow-lg hover:opacity-90 border-0"
            style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="cards">Card Types</TabsTrigger>
            <TabsTrigger value="limits">Spending Limits</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <CardTitle>Card Settings</CardTitle>
                </div>
                <CardDescription>Configure general card settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Card Provider</Label>
                    <Select defaultValue="visa">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="verve">Verve</SelectItem>
                        <SelectItem value="amex">American Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Card Currency</Label>
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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Card Name Format</Label>
                    <Select defaultValue="company-employee">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company-employee">Company Name - Employee</SelectItem>
                        <SelectItem value="employee-only">Employee Name Only</SelectItem>
                        <SelectItem value="department">Department Name</SelectItem>
                        <SelectItem value="custom">Custom Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Card Validity (years)</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Year</SelectItem>
                        <SelectItem value="2">2 Years</SelectItem>
                        <SelectItem value="3">3 Years</SelectItem>
                        <SelectItem value="5">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Virtual Cards</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow issuing virtual cards for online purchases
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Physical Cards</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow issuing physical plastic cards
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-categorize Transactions</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically categorize card transactions
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
                  <CardTitle>Card Assignment</CardTitle>
                </div>
                <CardDescription>Configure how cards are assigned to employees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Assignment Method</Label>
                    <Select defaultValue="request">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-assign to New Employees</SelectItem>
                        <SelectItem value="request">Request-based</SelectItem>
                        <SelectItem value="role">Role-based</SelectItem>
                        <SelectItem value="department">Department-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cards per Employee Limit</Label>
                    <Input type="number" defaultValue="2" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Manager Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Manager must approve card requests
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Multiple Cards</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow employees to have multiple cards
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <CardTitle>Card Types</CardTitle>
                </div>
                <CardDescription>Configure available card types and their features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Standard Employee Card</h4>
                        <p className="text-sm text-muted-foreground">Basic card for everyday expenses</p>
                      </div>
                      <Switch defaultChecked color={moduleColor} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Daily Limit (₦)</Label>
                        <Input type="number" defaultValue="50000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Limit (₦)</Label>
                        <Input type="number" defaultValue="500000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Single Transaction (₦)</Label>
                        <Input type="number" defaultValue="100000" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Executive Card</h4>
                        <p className="text-sm text-muted-foreground">Higher limits for managers and executives</p>
                      </div>
                      <Switch defaultChecked color={moduleColor} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Daily Limit (₦)</Label>
                        <Input type="number" defaultValue="200000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Limit (₦)</Label>
                        <Input type="number" defaultValue="2000000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Single Transaction (₦)</Label>
                        <Input type="number" defaultValue="500000" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Travel Card</h4>
                        <p className="text-sm text-muted-foreground">Multi-currency card for business travel</p>
                      </div>
                      <Switch defaultChecked color={moduleColor} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Daily Limit (₦)</Label>
                        <Input type="number" defaultValue="300000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Limit (₦)</Label>
                        <Input type="number" defaultValue="3000000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Single Transaction (₦)</Label>
                        <Input type="number" defaultValue="1000000" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Procurement Card</h4>
                        <p className="text-sm text-muted-foreground">For purchasing and procurement teams</p>
                      </div>
                      <Switch defaultChecked color={moduleColor} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Daily Limit (₦)</Label>
                        <Input type="number" defaultValue="500000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Limit (₦)</Label>
                        <Input type="number" defaultValue="5000000" />
                      </div>
                      <div className="space-y-2">
                        <Label>Single Transaction (₦)</Label>
                        <Input type="number" defaultValue="2000000" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="limits" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <CardTitle>Default Spending Limits</CardTitle>
                </div>
                <CardDescription>Configure default spending limits for all cards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Daily Limit (₦)</Label>
                    <Input type="number" defaultValue="100000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Monthly Limit (₦)</Label>
                    <Input type="number" defaultValue="1000000" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Single Transaction Limit (₦)</Label>
                    <Input type="number" defaultValue="500000" />
                  </div>
                  <div className="space-y-2">
                    <Label>ATM Withdrawal Limit (₦)</Label>
                    <Input type="number" defaultValue="200000" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Online Transaction Limit (₦)</Label>
                    <Input type="number" defaultValue="300000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contactless Payment Limit (₦)</Label>
                    <Input type="number" defaultValue="50000" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow International Transactions</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable cards for international purchases
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow ATM Withdrawals</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable ATM cash withdrawals
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Online Purchases</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable online/e-commerce transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Limits</CardTitle>
                <CardDescription>Set spending limits by merchant category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Travel & Hotels</Label>
                    <Input type="number" defaultValue="500000" placeholder="Monthly limit" />
                  </div>
                  <div className="space-y-2">
                    <Label>Restaurants & Dining</Label>
                    <Input type="number" defaultValue="100000" placeholder="Monthly limit" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Office Supplies</Label>
                    <Input type="number" defaultValue="200000" placeholder="Monthly limit" />
                  </div>
                  <div className="space-y-2">
                    <Label>Software & Subscriptions</Label>
                    <Input type="number" defaultValue="300000" placeholder="Monthly limit" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Fuel & Transportation</Label>
                    <Input type="number" defaultValue="150000" placeholder="Monthly limit" />
                  </div>
                  <div className="space-y-2">
                    <Label>Entertainment</Label>
                    <Input type="number" defaultValue="50000" placeholder="Monthly limit" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enforce Category Limits</Label>
                    <p className="text-sm text-muted-foreground">
                      Block transactions exceeding category limits
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Expense Policies</CardTitle>
                </div>
                <CardDescription>Configure expense reporting and receipt requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Receipt Upload</Label>
                    <p className="text-sm text-muted-foreground">
                      Require receipts for all transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Receipt Required Above (₦)</Label>
                    <Input type="number" defaultValue="5000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Receipt Upload Deadline (days)</Label>
                    <Input type="number" defaultValue="7" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Expense Description</Label>
                    <p className="text-sm text-muted-foreground">
                      Require business justification for expenses
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Manager Approval for Large Expenses</Label>
                    <p className="text-sm text-muted-foreground">
                      Require approval for expenses above threshold
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Approval Threshold (₦)</Label>
                  <Input type="number" defaultValue="50000" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Merchant Restrictions</CardTitle>
                <CardDescription>Configure blocked merchant categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Block Gambling</Label>
                    <p className="text-sm text-muted-foreground">
                      Block all gambling-related merchants
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Block Adult Content</Label>
                    <p className="text-sm text-muted-foreground">
                      Block adult entertainment merchants
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Block Cryptocurrency</Label>
                    <p className="text-sm text-muted-foreground">
                      Block cryptocurrency exchanges
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Block Personal Transfers</Label>
                    <p className="text-sm text-muted-foreground">
                      Block P2P money transfers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Block Cash Advances</Label>
                    <p className="text-sm text-muted-foreground">
                      Block cash advance transactions
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Security Settings</CardTitle>
                </div>
                <CardDescription>Configure card security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require PIN for Purchases</Label>
                    <p className="text-sm text-muted-foreground">
                      Always require PIN for card transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable 3D Secure</Label>
                    <p className="text-sm text-muted-foreground">
                      Additional verification for online purchases
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Send SMS for every transaction
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Fraud Monitoring</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable AI-powered fraud detection
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Auto-lock After Failed Attempts</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 attempts</SelectItem>
                      <SelectItem value="5">5 attempts</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  <CardTitle>Card Controls</CardTitle>
                </div>
                <CardDescription>Configure card freeze and lock options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Employee Self-Freeze</Label>
                    <p className="text-sm text-muted-foreground">
                      Employees can freeze their own cards
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-freeze on Suspicious Activity</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically freeze cards with unusual patterns
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Freeze Inactive Cards</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-freeze cards not used for extended period
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Inactive Days Before Freeze</Label>
                  <Input type="number" defaultValue="90" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-cancel on Employee Termination</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically cancel cards when employee leaves
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle>Geographic Controls</CardTitle>
                </div>
                <CardDescription>Configure location-based restrictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Allowed Regions</Label>
                  <Select defaultValue="nigeria">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nigeria">Nigeria Only</SelectItem>
                      <SelectItem value="africa">Africa</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="custom">Custom Regions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Block High-Risk Countries</Label>
                    <p className="text-sm text-muted-foreground">
                      Block transactions from flagged countries
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval for International</Label>
                    <p className="text-sm text-muted-foreground">
                      Pre-approve international transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Transaction Notifications</CardTitle>
                </div>
                <CardDescription>Configure card transaction alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>All Transactions</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for every card transaction
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Large Transactions Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Only notify for transactions above threshold
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Large Transaction Threshold (₦)</Label>
                  <Input type="number" defaultValue="50000" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Declined Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when transactions are declined
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>International Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for all international transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limit & Policy Alerts</CardTitle>
                <CardDescription>Configure spending limit notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Approaching Limit Warning</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when approaching spending limits
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Warning at % of Limit</Label>
                  <Input type="number" defaultValue="80" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Limit Reached Alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when spending limit is reached
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Missing Receipt Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Remind employees about missing receipts
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Card Expiry Reminder</Label>
                    <p className="text-sm text-muted-foreground">
                      Remind before cards expire
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Notifications</CardTitle>
                <CardDescription>Configure notifications for administrators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Card Request</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when employee requests a card
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Policy Violation Alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when spending policy is violated
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Suspicious Activity Alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert for potential fraudulent activity
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Finance Admin Email</Label>
                    <Input type="email" defaultValue="finance@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Security Admin Email</Label>
                    <Input type="email" defaultValue="security@company.com" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Spending Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Send daily summary of all card spending
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Monthly Expense Report</Label>
                    <p className="text-sm text-muted-foreground">
                      Send monthly detailed expense report
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
