import { useState, useRef } from "react";
import { PlatformLayout } from "@/components/platform-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Shield,
  Bell,
  Palette,
  Key,
  Database,
  Save,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Exhaustive color palette for branding
const brandColorPalette = [
  // Reds
  { name: "Red 500", hex: "#EF4444" },
  { name: "Red 600", hex: "#DC2626" },
  { name: "Red 700", hex: "#B91C1C" },
  { name: "Rose 500", hex: "#F43F5E" },
  { name: "Rose 600", hex: "#E11D48" },
  // Oranges
  { name: "Orange 500", hex: "#F97316" },
  { name: "Orange 600", hex: "#EA580C" },
  { name: "Amber 500", hex: "#F59E0B" },
  { name: "Amber 600", hex: "#D97706" },
  // Yellows
  { name: "Yellow 500", hex: "#EAB308" },
  { name: "Yellow 600", hex: "#CA8A04" },
  // Greens
  { name: "Lime 500", hex: "#84CC16" },
  { name: "Lime 600", hex: "#65A30D" },
  { name: "Green 500", hex: "#22C55E" },
  { name: "Green 600", hex: "#16A34A" },
  { name: "Emerald 500", hex: "#10B981" },
  { name: "Emerald 600", hex: "#059669" },
  { name: "Teal 500", hex: "#14B8A6" },
  { name: "Teal 600", hex: "#0D9488" },
  // Cyans
  { name: "Cyan 500", hex: "#06B6D4" },
  { name: "Cyan 600", hex: "#0891B2" },
  { name: "Sky 500", hex: "#0EA5E9" },
  { name: "Sky 600", hex: "#0284C7" },
  // Blues
  { name: "Blue 500", hex: "#3B82F6" },
  { name: "Blue 600", hex: "#2563EB" },
  { name: "Blue 700", hex: "#1D4ED8" },
  // Indigos
  { name: "Indigo 500", hex: "#6366F1" },
  { name: "Indigo 600", hex: "#4F46E5" },
  { name: "Indigo 700", hex: "#4338CA" },
  // Violets & Purples
  { name: "Violet 500", hex: "#8B5CF6" },
  { name: "Violet 600", hex: "#7C3AED" },
  { name: "Purple 500", hex: "#A855F7" },
  { name: "Purple 600", hex: "#9333EA" },
  // Pinks
  { name: "Fuchsia 500", hex: "#D946EF" },
  { name: "Fuchsia 600", hex: "#C026D3" },
  { name: "Pink 500", hex: "#EC4899" },
  { name: "Pink 600", hex: "#DB2777" },
  // Neutrals
  { name: "Slate 600", hex: "#475569" },
  { name: "Slate 700", hex: "#334155" },
  { name: "Slate 800", hex: "#1E293B" },
  { name: "Gray 600", hex: "#4B5563" },
  { name: "Gray 700", hex: "#374151" },
  { name: "Zinc 700", hex: "#3F3F46" },
  { name: "Neutral 700", hex: "#404040" },
  { name: "Stone 700", hex: "#44403C" },
];

export default function AdminSettings() {
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Branding state
  const [primaryColor, setPrimaryColor] = useState("#6366F1");
  const [secondaryColor, setSecondaryColor] = useState("#9333EA");
  const [accentColor, setAccentColor] = useState("#10B981");
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);

  // File upload refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo must be less than 2MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
        toast({
          title: "Logo Uploaded",
          description: "Your logo has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        toast({
          title: "File too large",
          description: "Favicon must be less than 500KB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFaviconPreview(event.target?.result as string);
        toast({
          title: "Favicon Uploaded",
          description: "Your favicon has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const ColorPickerPopup = ({
    isOpen,
    onClose,
    currentColor,
    onSelectColor,
    label,
  }: {
    isOpen: boolean;
    onClose: () => void;
    currentColor: string;
    onSelectColor: (color: string) => void;
    label: string;
  }) => {
    const [customColor, setCustomColor] = useState(currentColor);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
          <div className="p-4 border-b border-slate-300 dark:border-slate-600 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Select {label}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Custom color input */}
            <div className="space-y-2">
              <Label>Custom Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer border border-slate-300 dark:border-slate-600"
                />
                <Input
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#000000"
                  className="font-mono uppercase"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    onSelectColor(customColor);
                    onClose();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Preset colors */}
            <div className="space-y-2">
              <Label>Preset Colors</Label>
              <div className="grid grid-cols-8 gap-2">
                {brandColorPalette.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => {
                      onSelectColor(color.hex);
                      onClose();
                    }}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                      currentColor.toUpperCase() === color.hex.toUpperCase()
                        ? "border-slate-900 dark:border-white ring-2 ring-offset-2 ring-indigo-500"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.hex})`}
                  >
                    {currentColor.toUpperCase() === color.hex.toUpperCase() && (
                      <Check className="w-4 h-4 text-white mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2 pt-4 border-t">
              <Label>Preview</Label>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl"
                  style={{ backgroundColor: customColor }}
                />
                <div className="space-y-1">
                  <p className="font-mono text-sm text-slate-900 dark:text-white">
                    {customColor.toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-500">
                    Click a preset or enter a custom hex code
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleRegenerateApiKey = () => {
    toast({
      title: "API Key Regenerated",
      description: "A new API key has been generated. Make sure to update your integrations.",
    });
  };

  return (
    <PlatformLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Platform Settings
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Configure your platform settings and preferences
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-slate-100 dark:bg-slate-800 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="general" className="gap-2">
              <Building2 className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="branding" className="gap-2">
              <Palette className="w-4 h-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Key className="w-4 h-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="database" className="gap-2">
              <Database className="w-4 h-4" />
              Database
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Platform Information</CardTitle>
                <CardDescription>Basic information about your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      defaultValue="Qorpy ERP"
                      className="bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      defaultValue="Enterprise Resource Planning for African Businesses"
                      className="bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Platform Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="Qorpy ERP is a comprehensive enterprise resource planning solution designed specifically for African businesses, offering modules for accounting, HR, sales, inventory, and more."
                    className="bg-white dark:bg-slate-900 min-h-[100px]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      Support Email
                    </Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      defaultValue="support@qorpy.com"
                      className="bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportPhone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      Support Phone
                    </Label>
                    <Input
                      id="supportPhone"
                      defaultValue="+234 800 123 4567"
                      className="bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-500" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      defaultValue="https://qorpy.com"
                      className="bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      Address
                    </Label>
                    <Input
                      id="address"
                      defaultValue="Lagos, Nigeria"
                      className="bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select defaultValue="africa-lagos">
                      <SelectTrigger className="bg-white dark:bg-slate-900">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa-lagos">Africa/Lagos (WAT)</SelectItem>
                        <SelectItem value="africa-johannesburg">Africa/Johannesburg (SAST)</SelectItem>
                        <SelectItem value="africa-nairobi">Africa/Nairobi (EAT)</SelectItem>
                        <SelectItem value="africa-cairo">Africa/Cairo (EET)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="ngn">
                      <SelectTrigger className="bg-white dark:bg-slate-900">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ngn">Nigerian Naira (₦)</SelectItem>
                        <SelectItem value="usd">US Dollar ($)</SelectItem>
                        <SelectItem value="eur">Euro (€)</SelectItem>
                        <SelectItem value="gbp">British Pound (£)</SelectItem>
                        <SelectItem value="zar">South African Rand (R)</SelectItem>
                        <SelectItem value="kes">Kenyan Shilling (KSh)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Settings */}
          <TabsContent value="branding" className="space-y-6">
            <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Logo & Branding</CardTitle>
                <CardDescription>Customize your platform's visual identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <Label>Primary Logo</Label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                      {logoPreview ? (
                        <div className="relative">
                          <img
                            src={logoPreview}
                            alt="Logo Preview"
                            className="w-32 h-32 mx-auto object-contain rounded-xl mb-4"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-8 w-8 bg-red-100 hover:bg-red-200 text-red-600"
                            onClick={() => setLogoPreview(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="w-32 h-32 mx-auto rounded-xl flex items-center justify-center mb-4"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                          }}
                        >
                          <span className="text-4xl font-bold text-white">Q</span>
                        </div>
                      )}
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => logoInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </Button>
                      <p className="text-xs text-slate-500 mt-2">PNG, JPG or SVG. Max 2MB.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label>Favicon</Label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                      {faviconPreview ? (
                        <div className="relative inline-block">
                          <img
                            src={faviconPreview}
                            alt="Favicon Preview"
                            className="w-16 h-16 mx-auto object-contain rounded-lg mb-4"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 bg-red-100 hover:bg-red-200 text-red-600"
                            onClick={() => setFaviconPreview(null)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className="w-16 h-16 mx-auto rounded-lg flex items-center justify-center mb-4"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                          }}
                        >
                          <span className="text-xl font-bold text-white">Q</span>
                        </div>
                      )}
                      <input
                        ref={faviconInputRef}
                        type="file"
                        accept="image/png,image/x-icon,image/ico"
                        onChange={handleFaviconUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => faviconInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Favicon
                      </Button>
                      <p className="text-xs text-slate-500 mt-2">ICO or PNG. 32x32 or 64x64.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Brand Colors</Label>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Primary Color</Label>
                      <button
                        onClick={() => setShowPrimaryPicker(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-indigo-400 transition-colors bg-white dark:bg-slate-900"
                      >
                        <div
                          className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600"
                          style={{ backgroundColor: primaryColor }}
                        />
                        <div className="text-left">
                          <p className="font-mono text-sm text-slate-900 dark:text-white">
                            {primaryColor.toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-500">Click to change</p>
                        </div>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Secondary Color</Label>
                      <button
                        onClick={() => setShowSecondaryPicker(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-indigo-400 transition-colors bg-white dark:bg-slate-900"
                      >
                        <div
                          className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600"
                          style={{ backgroundColor: secondaryColor }}
                        />
                        <div className="text-left">
                          <p className="font-mono text-sm text-slate-900 dark:text-white">
                            {secondaryColor.toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-500">Click to change</p>
                        </div>
                      </button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Accent Color</Label>
                      <button
                        onClick={() => setShowAccentPicker(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-indigo-400 transition-colors bg-white dark:bg-slate-900"
                      >
                        <div
                          className="w-10 h-10 rounded-lg border border-slate-300 dark:border-slate-600"
                          style={{ backgroundColor: accentColor }}
                        />
                        <div className="text-left">
                          <p className="font-mono text-sm text-slate-900 dark:text-white">
                            {accentColor.toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-500">Click to change</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="space-y-4 pt-4 border-t">
                  <Label>Live Preview</Label>
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                        }}
                      >
                        <span className="text-xl font-bold text-white">Q</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">Qorpy ERP</h4>
                        <p className="text-sm text-slate-500">Your business platform</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Primary Button
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        Secondary Button
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                        style={{ backgroundColor: accentColor }}
                      >
                        Accent Button
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Color Picker Modals */}
            <ColorPickerPopup
              isOpen={showPrimaryPicker}
              onClose={() => setShowPrimaryPicker(false)}
              currentColor={primaryColor}
              onSelectColor={setPrimaryColor}
              label="Primary Color"
            />
            <ColorPickerPopup
              isOpen={showSecondaryPicker}
              onClose={() => setShowSecondaryPicker(false)}
              currentColor={secondaryColor}
              onSelectColor={setSecondaryColor}
              label="Secondary Color"
            />
            <ColorPickerPopup
              isOpen={showAccentPicker}
              onClose={() => setShowAccentPicker(false)}
              currentColor={accentColor}
              onSelectColor={setAccentColor}
              label="Accent Color"
            />
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Authentication Settings</CardTitle>
                <CardDescription>Configure login and security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Require 2FA for all admin accounts</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Login Attempt Limits</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Lock accounts after failed attempts</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">Session Timeout</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Auto-logout after inactivity</p>
                      </div>
                    </div>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-32 bg-white dark:bg-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="minPassword">Minimum Password Length</Label>
                    <Select defaultValue="8">
                      <SelectTrigger className="bg-white dark:bg-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 characters</SelectItem>
                        <SelectItem value="8">8 characters</SelectItem>
                        <SelectItem value="10">10 characters</SelectItem>
                        <SelectItem value="12">12 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                    <Select defaultValue="5">
                      <SelectTrigger className="bg-white dark:bg-slate-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                        <SelectItem value="10">10 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Email Notifications</CardTitle>
                <CardDescription>Configure when to send email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">New Tenant Registration</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Get notified when a new tenant signs up</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Subscription Changes</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Notify when tenants upgrade or downgrade</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Payment Failures</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Alert when a payment fails</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Support Tickets</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Notify on new support tickets</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">System Alerts</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Critical system notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Weekly Reports</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Receive weekly platform analytics</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Settings */}
          <TabsContent value="api" className="space-y-6">
            <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">API Configuration</CardTitle>
                <CardDescription>Manage API keys and access settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Platform API Key</Label>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value="sk_live_qorpy_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
                        readOnly
                        className="bg-slate-50 dark:bg-slate-900 font-mono pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <Button variant="outline" onClick={handleRegenerateApiKey}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    This key provides full access to the platform API. Keep it secure.
                  </p>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <h4 className="font-medium text-slate-900 dark:text-white">Rate Limiting</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Requests per Minute</Label>
                      <Select defaultValue="1000">
                        <SelectTrigger className="bg-white dark:bg-slate-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100 requests</SelectItem>
                          <SelectItem value="500">500 requests</SelectItem>
                          <SelectItem value="1000">1,000 requests</SelectItem>
                          <SelectItem value="5000">5,000 requests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Requests per Day</Label>
                      <Select defaultValue="100000">
                        <SelectTrigger className="bg-white dark:bg-slate-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10000">10,000 requests</SelectItem>
                          <SelectItem value="50000">50,000 requests</SelectItem>
                          <SelectItem value="100000">100,000 requests</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <h4 className="font-medium text-slate-900 dark:text-white">Webhook Settings</h4>
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input
                      id="webhookUrl"
                      placeholder="https://your-server.com/webhook"
                      className="bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Enable Webhooks</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Send events to your webhook endpoint</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Settings */}
          <TabsContent value="database" className="space-y-6">
            <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Database Status</CardTitle>
                <CardDescription>View database health and perform maintenance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-emerald-700 dark:text-emerald-400">Connected</span>
                    </div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Database Status</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">2.4 GB</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Storage Used</p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">156</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Total Tenants</p>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <h4 className="font-medium text-slate-900 dark:text-white">Maintenance</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-lg border border-slate-300 dark:border-slate-600">
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2">Database Backup</h5>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Last backup: Today at 3:00 AM
                      </p>
                      <Button variant="outline" size="sm">
                        <Database className="w-4 h-4 mr-2" />
                        Backup Now
                      </Button>
                    </div>
                    <div className="p-4 rounded-lg border border-slate-300 dark:border-slate-600">
                      <h5 className="font-medium text-slate-900 dark:text-white mb-2">Clear Cache</h5>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                        Cache size: 128 MB
                      </p>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Clear Cache
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Automatic Backups</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Daily backups at 3:00 AM WAT</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PlatformLayout>
  );
}
