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
  Package,
  Boxes,
  Tags,
  Bell,
  Save,
  Barcode,
  Warehouse,
  Truck,
  Image,
  FileText,
  Settings,
  Layers,
  Scale,
  RefreshCw,
} from "lucide-react";

export default function ProductsSettingsPage() {
  const moduleColor = getModuleColor("products");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Products settings have been updated successfully.",
    });
  };

  return (
    <SidebarLayout moduleId="products">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Products Settings</h1>
            <p className="text-muted-foreground mt-1">Configure product catalog, inventory, and pricing settings</p>
          </div>
          <Button onClick={handleSave} className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="flex flex-wrap justify-start h-auto gap-1 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Product Identification</CardTitle>
                </div>
                <CardDescription>Configure product code and identification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>SKU Prefix</Label>
                    <Input defaultValue="PRD" />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU Format</Label>
                    <Select defaultValue="prefix-category-number">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prefix-category-number">PRD-CAT-001</SelectItem>
                        <SelectItem value="prefix-number">PRD-001</SelectItem>
                        <SelectItem value="category-number">CAT-001</SelectItem>
                        <SelectItem value="auto">Auto-generated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>SKU Starting Number</Label>
                    <Input type="number" defaultValue="1001" />
                  </div>
                  <div className="space-y-2">
                    <Label>SKU Number Length</Label>
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
                    <Label>Auto-generate SKU</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate SKU for new products
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Duplicate Names</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow products with the same name
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Unique SKU</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce unique SKU across all products
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Barcode className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Barcode Settings</CardTitle>
                </div>
                <CardDescription>Configure barcode generation and scanning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Barcode Generation</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-generate barcodes for new products
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Barcode Format</Label>
                    <Select defaultValue="ean13">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ean13">EAN-13</SelectItem>
                        <SelectItem value="ean8">EAN-8</SelectItem>
                        <SelectItem value="upc">UPC-A</SelectItem>
                        <SelectItem value="code128">Code 128</SelectItem>
                        <SelectItem value="code39">Code 39</SelectItem>
                        <SelectItem value="qr">QR Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Barcode Prefix</Label>
                    <Input defaultValue="234" />
                    <p className="text-xs text-muted-foreground">Country/Company prefix</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Barcode Scanning</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow barcode scanning in the application
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Print Barcode Labels</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable barcode label printing
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Units of Measure</CardTitle>
                </div>
                <CardDescription>Configure default measurement units</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Weight Unit</Label>
                    <Select defaultValue="kg">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="g">Grams (g)</SelectItem>
                        <SelectItem value="lb">Pounds (lb)</SelectItem>
                        <SelectItem value="oz">Ounces (oz)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Dimension Unit</Label>
                    <Select defaultValue="cm">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">Centimeters (cm)</SelectItem>
                        <SelectItem value="m">Meters (m)</SelectItem>
                        <SelectItem value="in">Inches (in)</SelectItem>
                        <SelectItem value="ft">Feet (ft)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Volume Unit</Label>
                    <Select defaultValue="l">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="l">Liters (L)</SelectItem>
                        <SelectItem value="ml">Milliliters (mL)</SelectItem>
                        <SelectItem value="gal">Gallons (gal)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Stock Unit</Label>
                    <Select defaultValue="pcs">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                        <SelectItem value="box">Boxes</SelectItem>
                        <SelectItem value="carton">Cartons</SelectItem>
                        <SelectItem value="pack">Packs</SelectItem>
                        <SelectItem value="dozen">Dozens</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Catalog Settings */}
          <TabsContent value="catalog" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Category Settings</CardTitle>
                </div>
                <CardDescription>Configure product category structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Maximum Category Depth</Label>
                    <Select defaultValue="4">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 levels</SelectItem>
                        <SelectItem value="3">3 levels</SelectItem>
                        <SelectItem value="4">4 levels</SelectItem>
                        <SelectItem value="5">5 levels</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category Code Format</Label>
                    <Input defaultValue="CAT-{###}" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Category</Label>
                    <p className="text-sm text-muted-foreground">
                      Products must belong to a category
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Multiple Categories</Label>
                    <p className="text-sm text-muted-foreground">
                      Products can belong to multiple categories
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Category Tree</Label>
                    <p className="text-sm text-muted-foreground">
                      Display categories in hierarchical tree view
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Product Images</CardTitle>
                </div>
                <CardDescription>Configure product image settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Maximum Images per Product</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum File Size (MB)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Thumbnail Size</Label>
                    <Select defaultValue="200">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100x100 px</SelectItem>
                        <SelectItem value="150">150x150 px</SelectItem>
                        <SelectItem value="200">200x200 px</SelectItem>
                        <SelectItem value="300">300x300 px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Allowed Formats</Label>
                    <Input defaultValue="JPG, PNG, WEBP" disabled />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-compress Images</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically compress uploaded images
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Primary Image</Label>
                    <p className="text-sm text-muted-foreground">
                      Products must have at least one image
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Image Gallery</Label>
                    <p className="text-sm text-muted-foreground">
                      Display images in gallery view
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
                  <CardTitle>Product Attributes</CardTitle>
                </div>
                <CardDescription>Configure custom attributes and variants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Custom Attributes</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow custom fields for products
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Product Variants</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow size, color, and other variants
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Product Bundles</Label>
                    <p className="text-sm text-muted-foreground">
                      Group products into bundles
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Serial Numbers</Label>
                    <p className="text-sm text-muted-foreground">
                      Track individual items by serial number
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Batch/Lot Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track products by batch or lot number
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Settings */}
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Boxes className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Stock Management</CardTitle>
                </div>
                <CardDescription>Configure stock tracking and management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Inventory</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable inventory tracking for products
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Low Stock Threshold</Label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Critical Stock Threshold</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Reorder Point</Label>
                    <Input type="number" defaultValue="20" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Reorder Quantity</Label>
                    <Input type="number" defaultValue="100" />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum Stock Level</Label>
                    <Input type="number" defaultValue="1000" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Negative Stock</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow selling items when stock is zero
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reserve Stock on Order</Label>
                    <p className="text-sm text-muted-foreground">
                      Reserve stock when sales order is created
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Stock Aging</Label>
                    <p className="text-sm text-muted-foreground">
                      Track age of stock items
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Stock Adjustments</CardTitle>
                </div>
                <CardDescription>Configure stock adjustment rules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Adjustment Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Manager must approve stock adjustments
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Adjustment Reason</Label>
                    <p className="text-sm text-muted-foreground">
                      Reason must be provided for adjustments
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Auto-Adjustment Threshold</Label>
                  <Input type="number" defaultValue="10" />
                  <p className="text-xs text-muted-foreground">
                    Adjustments below this quantity can be auto-approved
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Cycle Counting</Label>
                    <p className="text-sm text-muted-foreground">
                      Schedule periodic inventory counts
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Cycle Count Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
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
                  <Settings className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Inventory Valuation</CardTitle>
                </div>
                <CardDescription>Configure stock valuation methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Valuation Method</Label>
                  <Select defaultValue="average">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fifo">FIFO (First In, First Out)</SelectItem>
                      <SelectItem value="lifo">LIFO (Last In, First Out)</SelectItem>
                      <SelectItem value="average">Weighted Average</SelectItem>
                      <SelectItem value="specific">Specific Identification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Calculate Cost</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically calculate product cost
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Landed Cost</Label>
                    <p className="text-sm text-muted-foreground">
                      Include shipping and duties in cost
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Warehouse Settings */}
          <TabsContent value="warehouse" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Warehouse className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Warehouse Management</CardTitle>
                </div>
                <CardDescription>Configure warehouse and location settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Multi-Warehouse</Label>
                    <p className="text-sm text-muted-foreground">
                      Track stock across multiple warehouses
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Default Warehouse</Label>
                    <Select defaultValue="main">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Main Warehouse</SelectItem>
                        <SelectItem value="secondary">Secondary Warehouse</SelectItem>
                        <SelectItem value="store">Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Warehouse Code Format</Label>
                    <Input defaultValue="WH-{###}" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Location/Bin Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track items by specific location/bin
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Location Format</Label>
                  <Input defaultValue="Zone-Aisle-Shelf-Bin" />
                  <p className="text-xs text-muted-foreground">e.g., A-01-03-005</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Stock Transfers</CardTitle>
                </div>
                <CardDescription>Configure inter-warehouse transfers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Stock Transfers</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow transfers between warehouses
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Transfer Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Manager must approve transfers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Transfer ID Format</Label>
                  <Input defaultValue="TRF-{YYYY}-{####}" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable In-Transit Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Track items while in transit
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Receive on Arrival</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically receive transferred items
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Settings */}
          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Tags className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>General Pricing</CardTitle>
                </div>
                <CardDescription>Configure pricing and markup options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Default Markup (%)</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Margin (%)</Label>
                    <Input type="number" defaultValue="23" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default VAT Rate (%)</Label>
                    <Input type="number" defaultValue="7.5" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Price Rounding</Label>
                    <Select defaultValue="nearest-10">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Rounding</SelectItem>
                        <SelectItem value="nearest-10">Nearest ₦10</SelectItem>
                        <SelectItem value="nearest-50">Nearest ₦50</SelectItem>
                        <SelectItem value="nearest-100">Nearest ₦100</SelectItem>
                        <SelectItem value="up">Round Up</SelectItem>
                        <SelectItem value="down">Round Down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Decimal Places</Label>
                    <Select defaultValue="2">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 decimal places</SelectItem>
                        <SelectItem value="2">2 decimal places</SelectItem>
                        <SelectItem value="4">4 decimal places</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Prices Include Tax</Label>
                    <p className="text-sm text-muted-foreground">
                      Product prices are inclusive of VAT
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Cost Price</Label>
                    <p className="text-sm text-muted-foreground">
                      Display cost price in product listings
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Margin</Label>
                    <p className="text-sm text-muted-foreground">
                      Display profit margin percentage
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
                  <CardTitle>Price Lists</CardTitle>
                </div>
                <CardDescription>Configure multiple price lists</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Price Lists</Label>
                    <p className="text-sm text-muted-foreground">
                      Create multiple price lists for different customers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Wholesale Pricing</Label>
                    <p className="text-sm text-muted-foreground">
                      Special pricing for bulk purchases
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Volume Discounts</Label>
                    <p className="text-sm text-muted-foreground">
                      Quantity-based pricing tiers
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
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Time-Based Pricing</Label>
                    <p className="text-sm text-muted-foreground">
                      Schedule price changes in advance
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suppliers Settings */}
          <TabsContent value="suppliers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Supplier Management</CardTitle>
                </div>
                <CardDescription>Configure supplier and purchasing settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Supplier Code Format</Label>
                    <Input defaultValue="SUP-{####}" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default Payment Terms</Label>
                    <Select defaultValue="net30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net45">Net 45</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Multiple Suppliers per Product</Label>
                    <p className="text-sm text-muted-foreground">
                      Link products to multiple suppliers
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Track Supplier Lead Time</Label>
                    <p className="text-sm text-muted-foreground">
                      Record delivery lead times per supplier
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Supplier Ratings</Label>
                    <p className="text-sm text-muted-foreground">
                      Rate suppliers based on performance
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Auto-Reorder</CardTitle>
                </div>
                <CardDescription>Configure automatic reordering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Auto-Reorder</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically create purchase orders when stock is low
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Auto-Reorder Trigger</Label>
                  <Select defaultValue="reorder-point">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reorder-point">At Reorder Point</SelectItem>
                      <SelectItem value="low-stock">At Low Stock Threshold</SelectItem>
                      <SelectItem value="critical">At Critical Stock Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Select Preferred Supplier</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-select best supplier for reorders
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Supplier Selection Criteria</Label>
                  <Select defaultValue="price">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Lowest Price</SelectItem>
                      <SelectItem value="lead-time">Shortest Lead Time</SelectItem>
                      <SelectItem value="rating">Highest Rating</SelectItem>
                      <SelectItem value="preferred">Preferred Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval Before Sending</Label>
                    <p className="text-sm text-muted-foreground">
                      Review auto-generated POs before sending
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
                  <CardTitle>Stock Alerts</CardTitle>
                </div>
                <CardDescription>Configure inventory-related notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when products reach low stock threshold
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Critical Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Urgent notification for critical stock levels
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Out of Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when products are completely out of stock
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Overstock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when stock exceeds maximum level
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Expiry Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify before products expire
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Alert Days Before</Label>
                  <Input type="number" defaultValue="30" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5" style={{ color: moduleColor }} />
                  <CardTitle>Other Notifications</CardTitle>
                </div>
                <CardDescription>Configure additional product notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Price Change Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when product prices are updated
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Product Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when new products are added
                    </p>
                  </div>
                  <Switch color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Stock Adjustment Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when stock adjustments are made
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Transfer Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify on stock transfer status changes
                    </p>
                  </div>
                  <Switch defaultChecked color={moduleColor} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Purchase Order Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify when POs are received or overdue
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
                  <Label>Alert Frequency</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
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
