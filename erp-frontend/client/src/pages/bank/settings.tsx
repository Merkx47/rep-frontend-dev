import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getModuleColor } from "@/contexts/module-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  RefreshCw,
  Shield,
  Bell,
  Save,
  Wallet,
  CreditCard,
  ArrowLeftRight,
  FileText,
  Settings,
  Landmark,
  TrendingUp,
  Lock,
  Globe,
} from "lucide-react";

export default function BankSettingsPage() {
  const moduleColor = getModuleColor("bank");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Bank settings have been updated successfully.",
    });
  };

  return (
    <SidebarLayout moduleId="bank">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Bank Settings</h1>
            <p className="text-muted-foreground mt-1">Configure bank accounts, transfers, and reconciliation</p>
          </div>
          <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1 w-full">
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="transfers">Transfers</TabsTrigger>
            <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Accounts Settings */}
          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Landmark className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Bank Account Settings</CardTitle>
                </div>
                <CardDescription>Configure bank account preferences and defaults</CardDescription>
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
                    <Label>Primary Account</Label>
                    <Select defaultValue="main">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Main Operating Account</SelectItem>
                        <SelectItem value="payroll">Payroll Account</SelectItem>
                        <SelectItem value="savings">Savings Account</SelectItem>
                        <SelectItem value="petty">Petty Cash Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Account Number Format</Label>
                    <Select defaultValue="nuban">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nuban">NUBAN (10 digits)</SelectItem>
                        <SelectItem value="iban">IBAN</SelectItem>
                        <SelectItem value="custom">Custom Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Account Code Prefix</Label>
                    <Input defaultValue="BA" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Multi-Currency Accounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Support multiple currency bank accounts
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Opening Balance</Label>
                    <p className="text-sm text-muted-foreground">
                      Maintain opening balance for accounts
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Overdraft Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track overdraft limits and usage
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Interest Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track interest earned on accounts
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Bank Information</CardTitle>
                </div>
                <CardDescription>Configure bank details for payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Bank Details on Invoices</Label>
                    <p className="text-sm text-muted-foreground">
                      Display payment information on invoices
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Bank Details on Quotations</Label>
                    <p className="text-sm text-muted-foreground">
                      Display payment information on quotations
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Bank Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Verify account numbers before transfers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transfers Settings */}
          <TabsContent value="transfers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Transfer Settings</CardTitle>
                </div>
                <CardDescription>Configure bank transfer rules and limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Transfer Reference Format</Label>
                    <Input defaultValue="TRF-{YYYY}{MM}{DD}-{####}" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Transfer Type</Label>
                    <Select defaultValue="internal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal Transfer</SelectItem>
                        <SelectItem value="domestic">Domestic Transfer</SelectItem>
                        <SelectItem value="international">International Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Internal Transfers</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow transfers between company accounts
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable External Transfers</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow transfers to external accounts
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Scheduled Transfers</Label>
                    <p className="text-sm text-muted-foreground">
                      Schedule transfers for future dates
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Recurring Transfers</Label>
                    <p className="text-sm text-muted-foreground">
                      Set up automatic recurring transfers
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
                  <CardTitle>Transfer Limits</CardTitle>
                </div>
                <CardDescription>Configure transfer limits and thresholds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Daily Transfer Limit (₦)</Label>
                    <Input type="number" defaultValue="10000000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Single Transfer Limit (₦)</Label>
                    <Input type="number" defaultValue="5000000" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Monthly Transfer Limit (₦)</Label>
                    <Input type="number" defaultValue="100000000" />
                  </div>
                  <div className="space-y-2">
                    <Label>International Transfer Limit (USD)</Label>
                    <Input type="number" defaultValue="50000" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval Above Limit</Label>
                    <p className="text-sm text-muted-foreground">
                      Need approval for transfers exceeding limits
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Approval Threshold (₦)</Label>
                  <Input type="number" defaultValue="500000" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reconciliation Settings */}
          <TabsContent value="reconciliation" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Reconciliation Settings</CardTitle>
                </div>
                <CardDescription>Configure bank statement reconciliation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Reconciliation Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tolerance Amount (₦)</Label>
                    <Input type="number" defaultValue="100" />
                    <p className="text-xs text-muted-foreground">
                      Allow minor discrepancies up to this amount
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-match Transactions</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically match bank transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Auto-Match Criteria</Label>
                  <Select defaultValue="amount-date">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="amount">Amount Only</SelectItem>
                      <SelectItem value="amount-date">Amount + Date</SelectItem>
                      <SelectItem value="reference">Reference Number</SelectItem>
                      <SelectItem value="all">All Criteria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Create Rules from Matches</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-create matching rules for recurring transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Categorize Transactions</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically categorize based on patterns
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
                  <CardTitle>Statement Import</CardTitle>
                </div>
                <CardDescription>Configure bank statement import settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable CSV Import</Label>
                    <p className="text-sm text-muted-foreground">
                      Import statements in CSV format
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable OFX/QFX Import</Label>
                    <p className="text-sm text-muted-foreground">
                      Import statements in OFX/QFX format
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable PDF Import</Label>
                    <p className="text-sm text-muted-foreground">
                      Extract transactions from PDF statements
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Detect Duplicates</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically detect duplicate transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Date Format for Import</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Settings */}
          <TabsContent value="payments" className="space-y-4">
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
                    <Label>Enable Bank Transfer</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept bank transfer payments
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Card Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept debit/credit card payments
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable USSD Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept payments via USSD
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Mobile Money</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept mobile money payments
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Cash Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Record cash payment receipts
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Cheque Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept cheque payments
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Payment Processing</CardTitle>
                </div>
                <CardDescription>Configure payment processing settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Apply Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically apply payments to oldest invoices
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Application Order</Label>
                  <Select defaultValue="oldest">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oldest">Oldest First (FIFO)</SelectItem>
                      <SelectItem value="largest">Largest First</SelectItem>
                      <SelectItem value="smallest">Smallest First</SelectItem>
                      <SelectItem value="manual">Manual Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Send Payment Receipt</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-send receipt when payment is recorded
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Partial Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept payments less than invoice total
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Overpayments</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept payments more than invoice total (credit)
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Settings */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Bank Reports</CardTitle>
                </div>
                <CardDescription>Configure bank reporting preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Cash Flow Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Generate cash flow statements
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Bank Summary Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Daily/weekly/monthly bank summaries
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Transaction Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Detailed transaction reports
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Reconciliation Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Bank reconciliation reports
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Default Report Period</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Foreign Currency</CardTitle>
                </div>
                <CardDescription>Configure foreign exchange settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Foreign Currency Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Track foreign currency accounts separately
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Update Exchange Rates</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically fetch exchange rates
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Exchange Rate Update Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Exchange Gain/Loss</Label>
                    <p className="text-sm text-muted-foreground">
                      Record realized and unrealized forex gains
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Access Control</CardTitle>
                </div>
                <CardDescription>Configure bank account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval for Large Transfers</Label>
                    <p className="text-sm text-muted-foreground">
                      Manager approval for transfers above threshold
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Approval Threshold (₦)</Label>
                  <Input type="number" defaultValue="500000" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor for Transfers</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all bank transfers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dual Authorization</Label>
                    <p className="text-sm text-muted-foreground">
                      Require two users to authorize transfers
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Restriction</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict bank access to specific IPs
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Audit & Logging</CardTitle>
                </div>
                <CardDescription>Configure audit trail and logging</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Log All Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Maintain audit log of all bank module access
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Log All Transactions</Label>
                    <p className="text-sm text-muted-foreground">
                      Record all transaction activities
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Log Configuration Changes</Label>
                    <p className="text-sm text-muted-foreground">
                      Track changes to bank settings
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Audit Log Retention (days)</Label>
                  <Input type="number" defaultValue="365" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Fraud Detection Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert on suspicious activity
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
                  <CardTitle>Transaction Alerts</CardTitle>
                </div>
                <CardDescription>Configure transaction-related notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for bank account transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Large Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify for transactions above threshold
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Large Transaction Threshold (₦)</Label>
                  <Input type="number" defaultValue="1000000" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Failed Transfer Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when transfers fail
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pending Approval Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify of transfers awaiting approval
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
                  <CardTitle>Account Alerts</CardTitle>
                </div>
                <CardDescription>Configure account-related notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Balance Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert when balance falls below threshold
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Low Balance Threshold (₦)</Label>
                  <Input type="number" defaultValue="100000" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reconciliation Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Remind to reconcile bank accounts
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Statement Available Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new statements are ready
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Unreconciled Transaction Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert for old unreconciled transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" style={{ color: moduleColor }} />
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
