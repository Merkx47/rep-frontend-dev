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
import {
  ShoppingCart,
  FileCheck,
  Users,
  Bell,
  Save,
  Package,
  Truck,
  CreditCard,
  Percent,
  Target,
  Award,
  Settings,
  BarChart3,
  Receipt,
  UserCheck,
  Globe,
  MapPin,
} from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function SalesSettingsPage() {
  const moduleColor = getModuleColor("sales");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Sales settings have been updated successfully.",
    });
  };

  return (
    <SidebarLayout moduleId="sales">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Sales Settings</h1>
            <p className="text-muted-foreground mt-1">Configure sales orders, quotations, customers, and team settings</p>
          </div>
          <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1 w-full">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="team">Sales Team</TabsTrigger>
            <TabsTrigger value="leads">Leads & CRM</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Orders Settings */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Order Processing</CardTitle>
                </div>
                <CardDescription>Configure sales order processing and numbering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Order Number Prefix</Label>
                    <Input defaultValue="SO" />
                  </div>
                  <div className="space-y-2">
                    <Label>Starting Number</Label>
                    <Input type="number" defaultValue="1001" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Order Number Format</Label>
                    <Select defaultValue="prefix-year-num">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prefix-num">SO-0001</SelectItem>
                        <SelectItem value="prefix-year-num">SO-2026-0001</SelectItem>
                        <SelectItem value="year-prefix-num">2026-SO-0001</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Order Type</Label>
                    <Select defaultValue="sales">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Order</SelectItem>
                        <SelectItem value="cash">Cash Sale</SelectItem>
                        <SelectItem value="credit">Credit Sale</SelectItem>
                        <SelectItem value="consignment">Consignment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Default Payment Terms</Label>
                  <Select defaultValue="net-30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                      <SelectItem value="net-7">Net 7</SelectItem>
                      <SelectItem value="net-15">Net 15</SelectItem>
                      <SelectItem value="net-30">Net 30</SelectItem>
                      <SelectItem value="net-45">Net 45</SelectItem>
                      <SelectItem value="net-60">Net 60</SelectItem>
                      <SelectItem value="net-90">Net 90</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-generate Invoice</Label>
                    <p className="text-sm text-muted-foreground">
                      Create invoice when order is confirmed
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Stock Check</Label>
                    <p className="text-sm text-muted-foreground">
                      Verify stock availability before confirming
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Partial Fulfillment</Label>
                    <p className="text-sm text-muted-foreground">
                      Ship available items and backorder the rest
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Manager Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Orders above threshold need approval
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Approval Threshold (₦)</Label>
                  <Input type="number" defaultValue="1000000" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Order Workflow</CardTitle>
                </div>
                <CardDescription>Configure order status workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Order Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Require confirmation step before processing
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Order Editing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow changes after order is placed
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Order Cancellation</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow cancelling orders before delivery
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Cancellation Policy</Label>
                  <Select defaultValue="before-delivery">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anytime">Anytime</SelectItem>
                      <SelectItem value="before-delivery">Before Delivery Only</SelectItem>
                      <SelectItem value="within-24h">Within 24 Hours</SelectItem>
                      <SelectItem value="approval">Requires Approval</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quotations Settings */}
          <TabsContent value="quotations" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Quotation Settings</CardTitle>
                </div>
                <CardDescription>Configure quotation creation and validity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Quotation Prefix</Label>
                    <Input defaultValue="QT" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Validity (days)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Quotation Format</Label>
                    <Select defaultValue="prefix-year-num">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prefix-num">QT-0001</SelectItem>
                        <SelectItem value="prefix-year-num">QT-2026-0001</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Reminder Before Expiry (days)</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Discount</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable discounts on quotations
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Discount (%)</Label>
                  <Input type="number" defaultValue="20" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval for High Discounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Manager approval for discounts above threshold
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Discount Approval Threshold (%)</Label>
                  <Input type="number" defaultValue="15" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Convert to Order</Label>
                    <p className="text-sm text-muted-foreground">
                      Convert accepted quotations to orders automatically
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
                  <CardTitle>Quotation Template</CardTitle>
                </div>
                <CardDescription>Configure quotation document settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Terms & Conditions</Label>
                    <p className="text-sm text-muted-foreground">
                      Add T&C to quotation documents
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Default Terms & Conditions</Label>
                  <Textarea
                    rows={4}
                    placeholder="Enter default terms..."
                    defaultValue="1. This quotation is valid for the period specified above.\n2. Prices are in Nigerian Naira and exclude VAT unless stated.\n3. Delivery dates are estimates and subject to stock availability."
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Company Logo</Label>
                    <p className="text-sm text-muted-foreground">
                      Display logo on quotation documents
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Bank Details</Label>
                    <p className="text-sm text-muted-foreground">
                      Show payment information on quotations
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Settings */}
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Customer Management</CardTitle>
                </div>
                <CardDescription>Configure customer management options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Customer ID Prefix</Label>
                    <Input defaultValue="CUS" />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer ID Format</Label>
                    <Select defaultValue="prefix-num">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prefix-num">CUS-0001</SelectItem>
                        <SelectItem value="prefix-year-num">CUS-2026-0001</SelectItem>
                        <SelectItem value="auto">Auto-generated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Credit Limit (₦)</Label>
                    <Input type="number" defaultValue="500000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Payment Terms</Label>
                    <Select defaultValue="net-30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prepaid">Prepaid</SelectItem>
                        <SelectItem value="net-15">Net 15</SelectItem>
                        <SelectItem value="net-30">Net 30</SelectItem>
                        <SelectItem value="net-60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Credit Limits</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce credit limits for customers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Block Over Credit Limit</Label>
                    <p className="text-sm text-muted-foreground">
                      Prevent orders when credit limit exceeded
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Customer for Orders</Label>
                    <p className="text-sm text-muted-foreground">
                      Must select a customer when creating orders
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Walk-in Customers</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable POS-style sales without customer
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Customer Categories</CardTitle>
                </div>
                <CardDescription>Configure customer segmentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Customer Categories</Label>
                    <p className="text-sm text-muted-foreground">
                      Categorize customers for pricing and reporting
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Customer Tiers</Label>
                    <p className="text-sm text-muted-foreground">
                      Bronze, Silver, Gold, Platinum tiers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Upgrade Tiers</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically upgrade based on purchase history
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Customer History</Label>
                    <p className="text-sm text-muted-foreground">
                      Maintain purchase history for customers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Settings */}
          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Discounts & Pricing</CardTitle>
                </div>
                <CardDescription>Configure discount policies and pricing rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Line Item Discounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow discounts on individual items
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Order-Level Discounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow discounts on entire orders
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Maximum Line Discount (%)</Label>
                    <Input type="number" defaultValue="25" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Order Discount (%)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Promotional Pricing</Label>
                    <p className="text-sm text-muted-foreground">
                      Schedule time-limited promotions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Volume Pricing</Label>
                    <p className="text-sm text-muted-foreground">
                      Quantity-based price breaks
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Customer-Specific Pricing</Label>
                    <p className="text-sm text-muted-foreground">
                      Set custom prices per customer
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Tax Settings</CardTitle>
                </div>
                <CardDescription>Configure tax calculations for sales</CardDescription>
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
                    <Label>Enable Tax Exemptions</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow tax-exempt customers and products
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Tax Breakdown</Label>
                    <p className="text-sm text-muted-foreground">
                      Display tax details on documents
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Settings */}
          <TabsContent value="delivery" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Delivery Options</CardTitle>
                </div>
                <CardDescription>Configure shipping and delivery settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Delivery</Label>
                    <p className="text-sm text-muted-foreground">
                      Offer delivery for orders
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Delivery Method</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">Customer Pickup</SelectItem>
                        <SelectItem value="standard">Standard Delivery</SelectItem>
                        <SelectItem value="express">Express Delivery</SelectItem>
                        <SelectItem value="same-day">Same Day Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lead Time (days)</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Charge Delivery Fee</Label>
                    <p className="text-sm text-muted-foreground">
                      Add delivery charges to orders
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Standard Delivery Fee (₦)</Label>
                    <Input type="number" defaultValue="2000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Free Delivery Threshold (₦)</Label>
                    <Input type="number" defaultValue="50000" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Delivery Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track shipment status
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Delivery Zones</CardTitle>
                </div>
                <CardDescription>Configure delivery areas and restrictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Delivery Zones</Label>
                    <p className="text-sm text-muted-foreground">
                      Set different rates by location
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Restrict Delivery Areas</Label>
                    <p className="text-sm text-muted-foreground">
                      Only deliver to configured zones
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Address Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Validate delivery addresses
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Team Settings */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Sales Targets</CardTitle>
                </div>
                <CardDescription>Configure sales goals and quotas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Sales Targets</Label>
                    <p className="text-sm text-muted-foreground">
                      Set and track sales goals
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Target Period</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Type</Label>
                    <Select defaultValue="revenue">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="units">Units Sold</SelectItem>
                        <SelectItem value="orders">Number of Orders</SelectItem>
                        <SelectItem value="customers">New Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Target Progress</Label>
                    <p className="text-sm text-muted-foreground">
                      Display progress on dashboards
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
                  <CardTitle>Commissions</CardTitle>
                </div>
                <CardDescription>Configure sales commission structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Sales Commission</Label>
                    <p className="text-sm text-muted-foreground">
                      Calculate commissions for sales reps
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Commission Rate (%)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Commission Basis</Label>
                    <Select defaultValue="revenue">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revenue">Total Revenue</SelectItem>
                        <SelectItem value="profit">Gross Profit</SelectItem>
                        <SelectItem value="collected">Collected Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Tiered Commission</Label>
                    <p className="text-sm text-muted-foreground">
                      Higher rates for exceeding targets
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pay on Payment Receipt</Label>
                    <p className="text-sm text-muted-foreground">
                      Commission earned when payment received
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Territories</CardTitle>
                </div>
                <CardDescription>Configure sales territory assignments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Sales Territories</Label>
                    <p className="text-sm text-muted-foreground">
                      Assign geographic areas to reps
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Assign Customers</Label>
                    <p className="text-sm text-muted-foreground">
                      Assign customers to territory reps
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Territory Overlap</Label>
                    <p className="text-sm text-muted-foreground">
                      Multiple reps can cover same area
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leads & CRM Settings */}
          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Lead Management</CardTitle>
                </div>
                <CardDescription>Configure lead capture and qualification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Lead ID Prefix</Label>
                    <Input defaultValue="LD" />
                  </div>
                  <div className="space-y-2">
                    <Label>Lead ID Format</Label>
                    <Select defaultValue="prefix-year-num">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prefix-num">LD-0001</SelectItem>
                        <SelectItem value="prefix-year-num">LD-2026-0001</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Lead Scoring</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically score leads by engagement
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Assign Leads</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically assign to sales reps
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Lead Assignment Method</Label>
                  <Select defaultValue="round-robin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round-robin">Round Robin</SelectItem>
                      <SelectItem value="territory">By Territory</SelectItem>
                      <SelectItem value="workload">By Workload</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Lead Source</Label>
                    <p className="text-sm text-muted-foreground">
                      Record where leads come from
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Pipeline Settings</CardTitle>
                </div>
                <CardDescription>Configure sales pipeline stages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Sales Pipeline</Label>
                    <p className="text-sm text-muted-foreground">
                      Track deals through stages
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Default Pipeline Stages</Label>
                  <Textarea
                    rows={4}
                    defaultValue="Prospecting\nQualification\nProposal\nNegotiation\nClosed Won\nClosed Lost"
                  />
                  <p className="text-xs text-muted-foreground">One stage per line</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Deal Probability</Label>
                    <p className="text-sm text-muted-foreground">
                      Track win probability per stage
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Expected Close Date</Label>
                    <p className="text-sm text-muted-foreground">
                      Track expected closing dates
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
                  <CardTitle>Order Notifications</CardTitle>
                </div>
                <CardDescription>Configure order-related alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Order Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new orders are placed
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Confirmation Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when orders are confirmed
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Cancellation Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when orders are cancelled
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Large Order Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for orders above threshold
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Large Order Threshold (₦)</Label>
                  <Input type="number" defaultValue="500000" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Customer Notifications</CardTitle>
                </div>
                <CardDescription>Configure customer-related alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Credit Limit Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when customers approach credit limit
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Overdue Payment Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for overdue customer payments
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Quotation Expiry Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify before quotations expire
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Customer Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new customers are added
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
