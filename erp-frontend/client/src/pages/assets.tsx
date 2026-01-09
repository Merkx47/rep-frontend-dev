import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Laptop, Car, Printer, Loader2 } from "lucide-react";
import { NairaSign } from "@/components/ui/naira-icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAssets, useAssetCategories, useCreateAsset } from "@/hooks/use-assets";
import { Skeleton } from "@/components/ui/skeleton";
import { getModuleColor } from "@/contexts/module-context";

function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(num);
}

// Calculate current value using straight-line depreciation
function calculateCurrentValue(purchasePrice: number, purchaseDate: Date | string, depreciationRate: number): number {
  const purchase = new Date(purchaseDate);
  const now = new Date();
  const yearsHeld = (now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  // Straight-line depreciation: Current Value = Purchase Price - (Purchase Price * Rate * Years)
  const depreciation = purchasePrice * (depreciationRate / 100) * yearsHeld;
  const currentValue = Math.max(0, purchasePrice - depreciation);

  return currentValue;
}

// Calculate depreciation percentage
function calculateDepreciationPercent(purchasePrice: number, currentValue: number): number {
  if (purchasePrice === 0) return 0;
  return ((purchasePrice - currentValue) / purchasePrice) * 100;
}

export default function AssetsPage() {
  const moduleColor = getModuleColor("accounting");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: assets = [], isLoading: assetsLoading } = useAssets();
  const { data: categories = [], isLoading: categoriesLoading } = useAssetCategories();
  const createAsset = useCreateAsset();

  const form = useForm({
    defaultValues: {
      name: "",
      categoryId: "",
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: "",
      location: "",
      serialNumber: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await createAsset.mutateAsync({
        ...data,
        purchasePrice: parseFloat(data.purchasePrice),
        status: "in_use",
      });
      toast({
        title: "Asset Added",
        description: "The asset has been added to the register.",
      });
      setIsDialogOpen(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add asset.",
        variant: "destructive",
      });
    }
  };

  // Get category depreciation rate
  const getCategoryDepreciationRate = (categoryId: string): number => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category?.depreciationRate || 20; // Default 20% if not found
  };

  // Calculate current values for all assets
  const assetsWithCalculatedValues = assets.map((asset: any) => {
    const depRate = getCategoryDepreciationRate(asset.categoryId);
    const calculatedCurrentValue = calculateCurrentValue(
      asset.purchasePrice || 0,
      asset.purchaseDate,
      depRate
    );
    return {
      ...asset,
      calculatedCurrentValue,
      depreciationPercent: calculateDepreciationPercent(asset.purchasePrice || 0, calculatedCurrentValue),
    };
  });

  const isLoading = assetsLoading || categoriesLoading;

  const totalPurchaseCost = assetsWithCalculatedValues.reduce((sum: number, asset: any) => sum + (asset.purchasePrice || 0), 0);
  const totalCurrentValue = assetsWithCalculatedValues.reduce((sum: number, asset: any) => sum + asset.calculatedCurrentValue, 0);
  const totalDepreciation = totalPurchaseCost - totalCurrentValue;
  const inUseAssets = assetsWithCalculatedValues.filter((a: any) => a.status === 'in_use').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_use':
        return <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-200">In Use</Badge>;
      case 'maintenance':
        return <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-200">Maintenance</Badge>;
      case 'disposed':
        return <Badge variant="outline">Disposed</Badge>;
      case 'available':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-200">Available</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c: any) => c.id === categoryId);
    switch (category?.code) {
      case 'CE':
        return <Laptop className="h-4 w-4" />;
      case 'MV':
        return <Car className="h-4 w-4" />;
      case 'OE':
        return <Printer className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  return (
    <SidebarLayout moduleId="accounting">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight" data-testid="text-assets-title">Assets</h2>
            <p className="text-muted-foreground mt-1">Manage fixed assets and track depreciation.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} data-testid="button-add-asset">
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Asset name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MacBook Pro 16 inch" {...field} data-testid="input-asset-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-asset-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat: any) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name} ({cat.depreciationRate}% p.a.)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="purchaseDate"
                      rules={{ required: "Purchase date is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} data-testid="input-asset-date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="purchasePrice"
                      rules={{ required: "Purchase price is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Price (NGN)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" {...field} data-testid="input-asset-cost" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      rules={{ required: "Location is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Head Office" {...field} data-testid="input-asset-location" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="serialNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serial Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Optional" {...field} data-testid="input-asset-serial" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={createAsset.isPending} data-testid="button-submit-asset">
                    {createAsset.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Asset"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-total-assets">{assetsWithCalculatedValues.length}</div>
                  <p className="text-xs text-muted-foreground">{inUseAssets} in use</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Purchase Value</CardTitle>
              <NairaSign size={16} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold" data-testid="text-purchase-cost">{formatCurrency(totalPurchaseCost)}</div>
                  <p className="text-xs text-muted-foreground">Original cost</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Asset Register</CardTitle>
            <CardDescription>Complete list of company assets with automatic depreciation calculation</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : assetsWithCalculatedValues.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No assets registered yet.</p>
                <p className="text-sm">Click "Add Asset" to register your first asset.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead className="text-right">Purchase Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetsWithCalculatedValues.map((asset: any) => (
                    <TableRow key={asset.id} data-testid={`row-asset-${asset.id}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">{asset.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(asset.categoryId)}
                          <span>{getCategoryName(asset.categoryId)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(asset.purchaseDate).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(asset.purchasePrice || 0)}
                      </TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
