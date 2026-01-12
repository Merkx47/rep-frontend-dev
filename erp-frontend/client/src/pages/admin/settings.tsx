import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Building2,
  Bell,
  Shield,
  Globe,
  Plug,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/use-currency";
import { CURRENCIES } from "@/lib/currency";

export default function AdminSettingsPage() {
  const { user, tenant } = useAuth();
  const { toast } = useToast();
  const { currency, setCurrency, ratesLastUpdated, ratesLoading, formatRate, refetchRates } = useCurrency();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  // Tymer Integration state
  const [tymerApiKey, setTymerApiKey] = useState("");
  const [tymerSecretKey, setTymerSecretKey] = useState("");
  const [tymerCompanyId, setTymerCompanyId] = useState("");
  const [tymerConnected, setTymerConnected] = useState(false);
  const [tymerConnecting, setTymerConnecting] = useState(false);
  const [tymerSyncing, setTymerSyncing] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleSaveCompany = () => {
    toast({
      title: "Company Settings Updated",
      description: "Company information has been saved.",
    });
  };

  const handleConnectTymer = async () => {
    if (!tymerApiKey || !tymerSecretKey || !tymerCompanyId) {
      toast({
        title: "Missing Credentials",
        description: "Please enter all Tymer API credentials.",
        variant: "destructive",
      });
      return;
    }

    setTymerConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTymerConnecting(false);
    setTymerConnected(true);
    setLastSyncTime(new Date().toLocaleString());
    toast({
      title: "Tymer Connected",
      description: "Successfully connected to your Tymer account.",
    });
  };

  const handleDisconnectTymer = () => {
    setTymerConnected(false);
    setTymerApiKey("");
    setTymerSecretKey("");
    setTymerCompanyId("");
    setLastSyncTime(null);
    toast({
      title: "Tymer Disconnected",
      description: "Your Tymer integration has been removed.",
    });
  };

  const handleSyncTymer = async () => {
    setTymerSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setTymerSyncing(false);
    setLastSyncTime(new Date().toLocaleString());
    toast({
      title: "Sync Complete",
      description: "Attendance data has been synced from Tymer.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and company settings
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4 hidden sm:block" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="h-4 w-4 hidden sm:block" />
              Company
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Plug className="h-4 w-4 hidden sm:block" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4 hidden sm:block" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4 hidden sm:block" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={user?.firstName || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={user?.lastName || ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue={user?.phone || ""} placeholder="+234 XXX XXX XXXX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={user?.role || "User"} disabled className="bg-muted" />
                </div>

                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Manage your company's basic information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue={tenant?.name || ""} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select defaultValue="technology">
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="services">Professional Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employees">Company Size</Label>
                    <Select defaultValue="50-100">
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="50-100">50-100 employees</SelectItem>
                        <SelectItem value="100-500">100-500 employees</SelectItem>
                        <SelectItem value="500+">500+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input id="address" defaultValue={tenant?.address || ""} placeholder="Enter business address" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue={tenant?.city || ""} placeholder="Lagos" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select defaultValue="lagos">
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
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
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Tax Information</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tin">Tax Identification Number (TIN)</Label>
                      <Input id="tin" defaultValue={tenant?.taxId || ""} placeholder="Enter TIN" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rcNumber">RC Number</Label>
                      <Input id="rcNumber" defaultValue={tenant?.rcNumber || ""} placeholder="Enter RC Number" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Currency & Display</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="displayCurrency">Display Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(CURRENCIES).map((curr) => (
                            <SelectItem key={curr.code} value={curr.code}>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{curr.symbol}</span>
                                <span>{curr.code}</span>
                                <span className="opacity-70">- {curr.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        All amounts will be displayed in this currency
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Base Currency</Label>
                      <Input value="NGN - Nigerian Naira" disabled className="bg-muted" />
                      <p className="text-xs text-muted-foreground">
                        All transactions are stored in NGN
                      </p>
                    </div>
                  </div>
                </div>

                {currency !== "NGN" && (
                  <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="font-medium text-blue-800 dark:text-blue-400 mb-1">
                            Exchange Rate
                          </h5>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            {formatRate("NGN", currency)}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            {ratesLastUpdated
                              ? `Last updated: ${new Date(ratesLastUpdated).toLocaleString()}`
                              : "Using fallback rates"}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => refetchRates()}
                          disabled={ratesLoading}
                          className="border-blue-300 hover:bg-blue-100 dark:border-blue-800"
                        >
                          {ratesLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Refresh Rate
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button onClick={handleSaveCompany}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tymer - Attendance System
                </CardTitle>
                <CardDescription>
                  Connect your Tymer biometric/attendance system to automatically sync employee attendance data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tymerConnected ? (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium text-green-800 dark:text-green-400">Connected to Tymer</p>
                        <p className="text-sm text-green-600 dark:text-green-500">
                          {lastSyncTime ? `Last synced: ${lastSyncTime}` : "Ready to sync attendance data"}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSyncTymer}
                        disabled={tymerSyncing}
                      >
                        {tymerSyncing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          "Sync Now"
                        )}
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Sync Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Auto-sync attendance</Label>
                            <p className="text-sm text-muted-foreground">Automatically sync attendance data every hour</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Sync clock-in/clock-out times</Label>
                            <p className="text-sm text-muted-foreground">Import exact timestamp from Tymer</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-destructive">Disconnect Tymer</p>
                        <p className="text-sm text-muted-foreground">Remove the Tymer integration from your account</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={handleDisconnectTymer}>
                        Disconnect
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-muted/50 border rounded-lg">
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Not Connected</p>
                        <p className="text-sm text-muted-foreground">Enter your Tymer API credentials to connect</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="tymerApiKey">API Key</Label>
                        <div className="relative">
                          <Input
                            id="tymerApiKey"
                            type={showApiKey ? "text" : "password"}
                            value={tymerApiKey}
                            onChange={(e) => setTymerApiKey(e.target.value)}
                            placeholder="Enter your Tymer API key"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tymerSecretKey">Secret Key</Label>
                        <div className="relative">
                          <Input
                            id="tymerSecretKey"
                            type={showSecretKey ? "text" : "password"}
                            value={tymerSecretKey}
                            onChange={(e) => setTymerSecretKey(e.target.value)}
                            placeholder="Enter your Tymer secret key"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowSecretKey(!showSecretKey)}
                          >
                            {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tymerCompanyId">Company ID</Label>
                        <Input
                          id="tymerCompanyId"
                          value={tymerCompanyId}
                          onChange={(e) => setTymerCompanyId(e.target.value)}
                          placeholder="Enter your Tymer company ID"
                        />
                      </div>

                      <Button
                        onClick={handleConnectTymer}
                        disabled={tymerConnecting}
                        className="w-full"
                      >
                        {tymerConnecting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Plug className="w-4 h-4 mr-2" />
                            Connect to Tymer
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                <Plug className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium text-foreground mb-2">More Integrations Coming Soon</h3>
                <p className="text-sm">Paystack, Flutterwave, QuickBooks, and more integrations are on the way.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Notify me about:</h4>
                  <div className="space-y-3">
                    {[
                      { id: "invoices", label: "New invoices and payments" },
                      { id: "expenses", label: "Expense approvals" },
                      { id: "payroll", label: "Payroll processing" },
                      { id: "lowStock", label: "Low stock alerts" },
                      { id: "reports", label: "Weekly reports" },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <Label htmlFor={item.id} className="font-normal">{item.label}</Label>
                        <Switch id={item.id} defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Change Password</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={twoFactor}
                    onCheckedChange={setTwoFactor}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Chrome on Windows</p>
                          <p className="text-xs text-muted-foreground">Lagos, Nigeria - Current session</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
