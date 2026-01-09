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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  Calendar,
  FileText,
  Calculator,
  Building2,
  Save,
  CreditCard,
  Bell,
  Settings,
  BookOpen,
  Shield,
} from "lucide-react";

export default function AccountingSettingsPage() {
  const { toast } = useToast();
  const moduleColor = getModuleColor("accounting");
  const [fiscalYearStart, setFiscalYearStart] = useState("january");
  const [currency, setCurrency] = useState("NGN");
  const [taxRate, setTaxRate] = useState("7.5");
  const [multiCurrency, setMultiCurrency] = useState(false);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Accounting settings have been updated successfully.",
    });
  };

  return (
    <SidebarLayout moduleId="accounting">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Accounting Settings</h1>
            <p className="text-muted-foreground mt-1">Configure accounting preferences and defaults</p>
          </div>
          <Button
            onClick={handleSave}
            className="text-white shadow-lg hover:opacity-90 border-0"
            style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="fiscal">Fiscal Year</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
            <TabsTrigger value="chart">Chart of Accounts</TabsTrigger>
            <TabsTrigger value="journals">Journals</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  <CardTitle>Currency Settings</CardTitle>
                </div>
                <CardDescription>Configure your base currency and multi-currency options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="baseCurrency">Base Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
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
                    <Label htmlFor="currencyFormat">Currency Format</Label>
                    <Select defaultValue="symbol-before">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="symbol-before">₦1,000.00</SelectItem>
                        <SelectItem value="symbol-after">1,000.00₦</SelectItem>
                        <SelectItem value="code-before">NGN 1,000.00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Decimal Places</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - No decimals</SelectItem>
                        <SelectItem value="2">2 - Standard</SelectItem>
                        <SelectItem value="4">4 - Extended precision</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Thousands Separator</Label>
                    <Select defaultValue="comma">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comma">Comma (1,000,000)</SelectItem>
                        <SelectItem value="space">Space (1 000 000)</SelectItem>
                        <SelectItem value="dot">Dot (1.000.000)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Multi-Currency Support</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable transactions in multiple currencies
                    </p>
                  </div>
                  <Switch checked={multiCurrency} onCheckedChange={setMultiCurrency} color={moduleColor} />
                </div>
                {multiCurrency && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-update Exchange Rates</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically fetch daily exchange rates
                        </p>
                      </div>
                      <Switch defaultChecked color={moduleColor} />
                    </div>
                    <div className="space-y-2">
                      <Label>Exchange Rate Source</Label>
                      <Select defaultValue="cbn">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cbn">Central Bank of Nigeria</SelectItem>
                          <SelectItem value="openexchange">Open Exchange Rates</SelectItem>
                          <SelectItem value="manual">Manual Entry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <CardTitle>Accounting Method</CardTitle>
                </div>
                <CardDescription>Configure your accounting basis and methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Accounting Basis</Label>
                    <Select defaultValue="accrual">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accrual">Accrual Basis</SelectItem>
                        <SelectItem value="cash">Cash Basis</SelectItem>
                        <SelectItem value="hybrid">Hybrid Method</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Accrual basis records income when earned and expenses when incurred
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Inventory Method</Label>
                    <Select defaultValue="fifo">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fifo">FIFO (First In, First Out)</SelectItem>
                        <SelectItem value="lifo">LIFO (Last In, First Out)</SelectItem>
                        <SelectItem value="weighted">Weighted Average</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Departments</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable departmental tracking for transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Projects</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable project-based accounting
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Cost Centers</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable cost center allocation
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fiscal" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle>Fiscal Year</CardTitle>
                </div>
                <CardDescription>Configure your fiscal year settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Fiscal Year Starts</Label>
                    <Select value={fiscalYearStart} onValueChange={setFiscalYearStart}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">January</SelectItem>
                        <SelectItem value="february">February</SelectItem>
                        <SelectItem value="march">March</SelectItem>
                        <SelectItem value="april">April</SelectItem>
                        <SelectItem value="may">May</SelectItem>
                        <SelectItem value="june">June</SelectItem>
                        <SelectItem value="july">July</SelectItem>
                        <SelectItem value="august">August</SelectItem>
                        <SelectItem value="september">September</SelectItem>
                        <SelectItem value="october">October</SelectItem>
                        <SelectItem value="november">November</SelectItem>
                        <SelectItem value="december">December</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Fiscal Year</Label>
                    <Input value="2024" readOnly className="bg-muted" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Fiscal Year Format</Label>
                    <Select defaultValue="calendar">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calendar">Calendar Year (2024)</SelectItem>
                        <SelectItem value="range">Range (2024-2025)</SelectItem>
                        <SelectItem value="fiscal">Fiscal (FY2024)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Periods per Year</Label>
                    <Select defaultValue="12">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 (Monthly)</SelectItem>
                        <SelectItem value="4">4 (Quarterly)</SelectItem>
                        <SelectItem value="13">13 (4-Week Periods)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Period Controls</CardTitle>
                <CardDescription>Configure period locking and closing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Closing Period Lock</Label>
                  <Select defaultValue="previous">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Lock</SelectItem>
                      <SelectItem value="previous">Lock Previous Month</SelectItem>
                      <SelectItem value="quarter">Lock Previous Quarter</SelectItem>
                      <SelectItem value="year">Lock Previous Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Prevent modifications to transactions in closed periods
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-close Periods</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically close periods after month-end
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Auto-close Delay (days)</Label>
                  <Input type="number" defaultValue="5" />
                  <p className="text-xs text-muted-foreground">
                    Days after month-end before auto-closing
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval to Reopen</Label>
                    <p className="text-sm text-muted-foreground">
                      Manager approval needed to reopen closed periods
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Year-End Closing</CardTitle>
                <CardDescription>Configure year-end procedures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-create Closing Entries</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate year-end closing entries
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Retained Earnings Account</Label>
                  <Select defaultValue="3100">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3100">3100 - Retained Earnings</SelectItem>
                      <SelectItem value="3200">3200 - Accumulated Profits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notify Before Year-End</Label>
                    <p className="text-sm text-muted-foreground">
                      Send reminder before fiscal year ends
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="taxes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <CardTitle>Tax Configuration</CardTitle>
                </div>
                <CardDescription>Configure tax rates and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vatRate">Default VAT Rate (%)</Label>
                    <Input
                      id="vatRate"
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whtRate">Default WHT Rate (%)</Label>
                    <Input id="whtRate" type="number" defaultValue="5" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company Income Tax Rate (%)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Education Tax Rate (%)</Label>
                    <Input type="number" defaultValue="2" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Tax Calculation</Label>
                  <Select defaultValue="exclusive">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exclusive">Tax Exclusive (add tax to amount)</SelectItem>
                      <SelectItem value="inclusive">Tax Inclusive (tax included in amount)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-calculate Tax</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically apply tax rates to transactions
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compound Tax Calculation</Label>
                    <p className="text-sm text-muted-foreground">
                      Calculate tax on tax (e.g., VAT on gross amount including other taxes)
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Accounts</CardTitle>
                <CardDescription>Configure default tax accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>VAT Payable Account</Label>
                    <Select defaultValue="2100">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2100">2100 - VAT Payable</SelectItem>
                        <SelectItem value="2110">2110 - Output VAT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>VAT Receivable Account</Label>
                    <Select defaultValue="1200">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1200">1200 - VAT Receivable</SelectItem>
                        <SelectItem value="1210">1210 - Input VAT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>WHT Payable Account</Label>
                    <Select defaultValue="2150">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2150">2150 - WHT Payable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>WHT Credit Account</Label>
                    <Select defaultValue="1250">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1250">1250 - WHT Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Compliance</CardTitle>
                <CardDescription>Configure tax compliance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Tax Filing Deadlines</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders for tax filing deadlines
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-generate Tax Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate VAT and WHT reports
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Tax Return Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chart" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <CardTitle>Chart of Accounts Settings</CardTitle>
                </div>
                <CardDescription>Configure chart of accounts structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Account Code Format</Label>
                    <Select defaultValue="4-digit">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4-digit">4-Digit (1000)</SelectItem>
                        <SelectItem value="6-digit">6-Digit (100000)</SelectItem>
                        <SelectItem value="segmented">Segmented (10-100-00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Hierarchy Levels</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Levels</SelectItem>
                        <SelectItem value="3">3 Levels</SelectItem>
                        <SelectItem value="4">4 Levels</SelectItem>
                        <SelectItem value="5">5 Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Sub-accounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable creation of sub-accounts under parent accounts
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Account Description</Label>
                    <p className="text-sm text-muted-foreground">
                      Require descriptions when creating accounts
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Inactive Accounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Mark accounts as inactive instead of deleting
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Default Accounts</CardTitle>
                <CardDescription>Configure system default accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Accounts Receivable</Label>
                    <Select defaultValue="1100">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1100">1100 - Accounts Receivable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Accounts Payable</Label>
                    <Select defaultValue="2000">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2000">2000 - Accounts Payable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Sales Revenue</Label>
                    <Select defaultValue="4000">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4000">4000 - Sales Revenue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Cost of Goods Sold</Label>
                    <Select defaultValue="5000">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5000">5000 - Cost of Goods Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Cash Account</Label>
                    <Select defaultValue="1000">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1000">1000 - Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Account</Label>
                    <Select defaultValue="1010">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1010">1010 - Bank Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journals" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Journal Entry Settings</CardTitle>
                </div>
                <CardDescription>Configure journal entry defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Journal Number Prefix</Label>
                    <Input defaultValue="JE" />
                  </div>
                  <div className="space-y-2">
                    <Label>Starting Number</Label>
                    <Input type="number" defaultValue="1001" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Number Format</Label>
                  <Select defaultValue="year-seq">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seq">JE-0001</SelectItem>
                      <SelectItem value="year-seq">JE-2024-0001</SelectItem>
                      <SelectItem value="month-seq">JE-202401-0001</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Journal entries require approval before posting
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Backdating</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow posting entries to past dates
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Backdate Days</Label>
                  <Input type="number" defaultValue="30" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recurring Journals</CardTitle>
                <CardDescription>Configure recurring journal settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Recurring Journals</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow creating recurring journal entries
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-post Recurring Entries</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically post recurring entries on schedule
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notify Before Auto-post</Label>
                    <p className="text-sm text-muted-foreground">
                      Send notification before recurring entry is posted
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Journal Validation</CardTitle>
                <CardDescription>Configure journal entry validation rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Balanced Entries</Label>
                    <p className="text-sm text-muted-foreground">
                      Debits must equal credits (always recommended)
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Reference</Label>
                    <p className="text-sm text-muted-foreground">
                      Reference/memo required for all entries
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Supporting Document</Label>
                    <p className="text-sm text-muted-foreground">
                      Attachment required for all journal entries
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Warn on Large Amounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Show warning for entries above threshold
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Warning Threshold (₦)</Label>
                  <Input type="number" defaultValue="1000000" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Report Settings</CardTitle>
                </div>
                <CardDescription>Configure financial report preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
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
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Comparison Period</Label>
                    <Select defaultValue="previous">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Comparison</SelectItem>
                        <SelectItem value="previous">Previous Period</SelectItem>
                        <SelectItem value="year-ago">Same Period Last Year</SelectItem>
                        <SelectItem value="budget">Budget</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Zero Balance Accounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Show accounts with zero balance in reports
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Comparative Period</Label>
                    <p className="text-sm text-muted-foreground">
                      Display previous period for comparison
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Variance Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Include variance (difference and %) in reports
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Account Codes</Label>
                    <p className="text-sm text-muted-foreground">
                      Display account codes in financial reports
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Format</CardTitle>
                <CardDescription>Configure report output formats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Export Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
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
                <div className="space-y-2">
                  <Label>Report Header/Footer</Label>
                  <Textarea
                    placeholder="Enter custom header or footer text for reports"
                    defaultValue="Confidential - For Internal Use Only"
                    rows={2}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Company Logo</Label>
                    <p className="text-sm text-muted-foreground">
                      Add company logo to report headers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Configure automatic report generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-generate Monthly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Generate reports at month-end automatically
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Reports to Management</Label>
                    <p className="text-sm text-muted-foreground">
                      Send monthly reports to management team
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Report Recipients</Label>
                  <Input placeholder="email1@company.com, email2@company.com" />
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
                <CardDescription>Configure accounting notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Journal Entry Pending Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when journal entry needs approval
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Journal Entry Approved</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when entry is approved and posted
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Journal Entry Rejected</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when entry is rejected
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Large Transaction Alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert for transactions above threshold
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Period & Deadline Alerts</CardTitle>
                <CardDescription>Configure period-related notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Month-End Reminder</Label>
                    <p className="text-sm text-muted-foreground">
                      Remind before month-end closing
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Days Before Month-End</Label>
                  <Input type="number" defaultValue="3" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tax Filing Reminder</Label>
                    <p className="text-sm text-muted-foreground">
                      Remind before tax filing deadlines
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Fiscal Year-End Reminder</Label>
                    <p className="text-sm text-muted-foreground">
                      Remind before fiscal year-end closing
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Recipients</CardTitle>
                <CardDescription>Configure who receives notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Finance Manager Email</Label>
                    <Input type="email" defaultValue="finance@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Chief Accountant Email</Label>
                    <Input type="email" defaultValue="accountant@company.com" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Summary Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Send daily transaction summary
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reconciliation Report</Label>
                    <p className="text-sm text-muted-foreground">
                      Send weekly account reconciliation status
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
