import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Save, Calculator, FileText, Bell, Shield, Calendar } from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function FixedAssetsSettingsPage() {
  const moduleColor = getModuleColor("fixed-assets");
  const { toast } = useToast();
  const [autoDepreciation, setAutoDepreciation] = useState(true);
  const [disposalApproval, setDisposalApproval] = useState(true);
  const [assetTagging, setAssetTagging] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your Fixed Assets settings have been updated.",
    });
  };

  return (
    <SidebarLayout moduleId="fixed-assets">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Configure Fixed Assets module preferences</p>
          </div>
          <Button
            className="text-white shadow-lg hover:opacity-90 border-0"
            style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="depreciation">Depreciation</TabsTrigger>
            <TabsTrigger value="numbering">Numbering</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" style={{ color: moduleColor }} />
                  <CardTitle className="text-lg">General Settings</CardTitle>
                </div>
                <CardDescription>Basic module configuration options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Asset Tagging</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable physical asset tagging with barcodes/QR codes
                    </p>
                  </div>
                  <Switch checked={assetTagging} onCheckedChange={setAssetTagging} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Disposal Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Require manager approval for asset disposals
                    </p>
                  </div>
                  <Switch checked={disposalApproval} onCheckedChange={setDisposalApproval} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
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
                    <Label htmlFor="fiscalYear">Fiscal Year Start</Label>
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
          </TabsContent>

          <TabsContent value="depreciation" className="space-y-6">
            {/* Depreciation Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" style={{ color: moduleColor }} />
                  <CardTitle className="text-lg">Depreciation Settings</CardTitle>
                </div>
                <CardDescription>Configure how depreciation is calculated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Depreciation</Label>
                    <p className="text-sm text-muted-foreground">
                      Run depreciation automatically at month-end
                    </p>
                  </div>
                  <Switch checked={autoDepreciation} onCheckedChange={setAutoDepreciation} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultMethod">Default Depreciation Method</Label>
                    <Select defaultValue="straight-line">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="straight-line">Straight Line</SelectItem>
                        <SelectItem value="reducing-balance">Reducing Balance</SelectItem>
                        <SelectItem value="sum-of-years">Sum of Years' Digits</SelectItem>
                        <SelectItem value="units-of-production">Units of Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depFrequency">Depreciation Frequency</Label>
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="residualValue">Default Residual Value (%)</Label>
                    <Input id="residualValue" type="number" defaultValue="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="threshold">Capitalization Threshold (₦)</Label>
                    <Input id="threshold" type="number" defaultValue="100000" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Depreciation Schedule */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" style={{ color: moduleColor }} />
                  <CardTitle className="text-lg">Depreciation Schedule</CardTitle>
                </div>
                <CardDescription>Set when depreciation should be calculated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="runDay">Run Day</Label>
                    <Select defaultValue="last">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st of the month</SelectItem>
                        <SelectItem value="15">15th of the month</SelectItem>
                        <SelectItem value="last">Last day of the month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postTo">Post Depreciation To</Label>
                    <Select defaultValue="auto">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-post to GL</SelectItem>
                        <SelectItem value="draft">Create Draft Journal</SelectItem>
                        <SelectItem value="manual">Manual Posting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="numbering" className="space-y-6">
            {/* Asset Numbering */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" style={{ color: moduleColor }} />
                  <CardTitle className="text-lg">Asset Numbering</CardTitle>
                </div>
                <CardDescription>Configure asset ID format and sequence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prefix">Asset ID Prefix</Label>
                  <Input id="prefix" defaultValue="FA" placeholder="e.g., FA, AST" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="separator">Separator</Label>
                    <Select defaultValue="-">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-">Hyphen (-)</SelectItem>
                        <SelectItem value="/">Slash (/)</SelectItem>
                        <SelectItem value=".">Period (.)</SelectItem>
                        <SelectItem value="">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="digits">Number of Digits</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 digits (001-999)</SelectItem>
                        <SelectItem value="4">4 digits (0001-9999)</SelectItem>
                        <SelectItem value="5">5 digits (00001-99999)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Year</Label>
                    <p className="text-sm text-muted-foreground">
                      Include year in asset ID (e.g., FA-2024-001)
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <Label className="text-sm">Preview</Label>
                  <p className="text-lg font-mono mt-1">FA-2024-001</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5" style={{ color: moduleColor }} />
                  <CardTitle className="text-lg">Notification Settings</CardTitle>
                </div>
                <CardDescription>Configure email and system notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email alerts for important events
                    </p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="space-y-4">
                  <Label>Notify me when:</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New asset is created</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Asset disposal is requested</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Depreciation run is completed</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Asset is fully depreciated</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Asset maintenance is due</span>
                      <Switch />
                    </div>
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
