import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "wouter";
import {
  Monitor,
  Car,
  Building2,
  Armchair,
  TrendingDown,
  AlertTriangle,
  Plus,
  ArrowRight,
  Package
} from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function FixedAssetsPage() {
  const moduleColor = getModuleColor("fixed-assets");

  const stats = {
    totalAssets: 156,
    totalValue: 285000000,
    depreciatedValue: 142500000,
    assetsThisMonth: 8,
    pendingDisposal: 5,
    fullyDepreciated: 12,
  };

  const recentAssets = [
    {
      id: "FA-2024-001",
      name: "Dell OptiPlex 7090",
      category: "Computer Equipment",
      purchaseDate: "2024-01-05",
      cost: 850000,
      currentValue: 765000,
      status: "Active",
      icon: Monitor,
    },
    {
      id: "FA-2024-002",
      name: "Toyota Hilux 2024",
      category: "Vehicles",
      purchaseDate: "2024-01-03",
      cost: 45000000,
      currentValue: 42750000,
      status: "Active",
      icon: Car,
    },
    {
      id: "FA-2023-156",
      name: "Office Building - Lekki",
      category: "Buildings",
      purchaseDate: "2023-06-15",
      cost: 180000000,
      currentValue: 171000000,
      status: "Active",
      icon: Building2,
    },
    {
      id: "FA-2023-089",
      name: "Executive Office Furniture Set",
      category: "Furniture & Fixtures",
      purchaseDate: "2023-08-20",
      cost: 4500000,
      currentValue: 3825000,
      status: "Active",
      icon: Armchair,
    },
  ];

  const categoryBreakdown = [
    { name: "Computer Equipment", count: 45, value: 38250000, color: "#2196F3" },
    { name: "Vehicles", count: 12, value: 95000000, color: "#4CAF50" },
    { name: "Buildings", count: 3, value: 180000000, color: "#FF9800" },
    { name: "Furniture & Fixtures", count: 68, value: 28500000, color: "#9C27B0" },
    { name: "Machinery", count: 28, value: 42750000, color: "#F44336" },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <SidebarLayout moduleId="fixed-assets">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Fixed Assets</h1>
            <p className="text-muted-foreground mt-1">Manage and track your company's fixed assets</p>
          </div>
          <Link href="/fixed-assets/register">
            <Button
              className="text-white shadow-lg hover:opacity-90 border-0"
              style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Asset
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{stats.totalAssets}</span>
                <Package className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">+{stats.assetsThisMonth} this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Asset Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalValue)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Original purchase cost</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Book Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold" style={{ color: moduleColor }}>{formatCurrency(stats.depreciatedValue)}</span>
                <TrendingDown className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">After depreciation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-yellow-600">{stats.pendingDisposal + stats.fullyDepreciated}</span>
                <AlertTriangle className="w-8 h-8 text-yellow-500/50" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stats.pendingDisposal} disposal, {stats.fullyDepreciated} fully depreciated</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Asset Categories</CardTitle>
                <CardDescription>Distribution of assets by category</CardDescription>
              </div>
              <Link href="/fixed-assets/categories">
                <Button variant="outline" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {categoryBreakdown.map((category) => (
                <div
                  key={category.name}
                  className="p-4 rounded-lg border-2 hover:shadow-md transition-shadow"
                  style={{ borderColor: category.color + "40" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium truncate">{category.name}</span>
                  </div>
                  <p className="text-2xl font-bold">{category.count}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(category.value)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Assets */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Assets</CardTitle>
                <CardDescription>Latest assets added to the register</CardDescription>
              </div>
              <Link href="/fixed-assets/register">
                <Button variant="outline" size="sm">
                  View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-mono text-sm">{asset.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: moduleColor + "20" }}
                        >
                          <asset.icon className="w-4 h-4" style={{ color: moduleColor }} />
                        </div>
                        <span className="font-medium">{asset.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{asset.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{asset.purchaseDate}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(asset.cost)}</TableCell>
                    <TableCell className="font-medium" style={{ color: moduleColor }}>
                      {formatCurrency(asset.currentValue)}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{asset.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/fixed-assets/depreciation">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: moduleColor + "20" }}
                  >
                    <TrendingDown className="w-6 h-6" style={{ color: moduleColor }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Run Depreciation</h3>
                    <p className="text-sm text-muted-foreground">Calculate monthly depreciation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/fixed-assets/disposal">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Asset Disposal</h3>
                    <p className="text-sm text-muted-foreground">{stats.pendingDisposal} pending disposal</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/fixed-assets/settings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Module Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure depreciation methods</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </SidebarLayout>
  );
}
