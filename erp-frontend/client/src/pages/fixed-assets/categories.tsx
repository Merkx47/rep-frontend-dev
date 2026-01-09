import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  MoreHorizontal,
  Monitor,
  Car,
  Building2,
  Armchair,
  Cog,
  FolderTree,
} from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function AssetCategoriesPage() {
  const moduleColor = getModuleColor("fixed-assets");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleAddCategory = () => {
    toast({
      title: "Category Added",
      description: "New asset category has been created.",
    });
    setIsAddCategoryOpen(false);
  };

  const categories = [
    {
      id: 1,
      name: "Computer Equipment",
      code: "CE",
      description: "Computers, laptops, servers, and IT equipment",
      assetCount: 45,
      totalValue: 38250000,
      defaultDepreciation: "Straight Line",
      defaultUsefulLife: 5,
      depreciationRate: 20,
      status: "Active",
      icon: Monitor,
    },
    {
      id: 2,
      name: "Vehicles",
      code: "VH",
      description: "Cars, trucks, motorcycles, and other vehicles",
      assetCount: 12,
      totalValue: 95000000,
      defaultDepreciation: "Reducing Balance",
      defaultUsefulLife: 8,
      depreciationRate: 25,
      status: "Active",
      icon: Car,
    },
    {
      id: 3,
      name: "Buildings",
      code: "BL",
      description: "Office buildings, warehouses, and land improvements",
      assetCount: 3,
      totalValue: 180000000,
      defaultDepreciation: "Straight Line",
      defaultUsefulLife: 40,
      depreciationRate: 2.5,
      status: "Active",
      icon: Building2,
    },
    {
      id: 4,
      name: "Furniture & Fixtures",
      code: "FF",
      description: "Office furniture, fixtures, and fittings",
      assetCount: 68,
      totalValue: 28500000,
      defaultDepreciation: "Straight Line",
      defaultUsefulLife: 10,
      depreciationRate: 10,
      status: "Active",
      icon: Armchair,
    },
    {
      id: 5,
      name: "Machinery",
      code: "MC",
      description: "Industrial machinery and manufacturing equipment",
      assetCount: 28,
      totalValue: 42750000,
      defaultDepreciation: "Straight Line",
      defaultUsefulLife: 15,
      depreciationRate: 6.67,
      status: "Active",
      icon: Cog,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarLayout moduleId="fixed-assets">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Asset Categories</h1>
            <p className="text-muted-foreground mt-1">Manage asset classification and depreciation rules</p>
          </div>
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button
                className="text-white shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Asset Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input id="categoryName" placeholder="Enter name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryCode">Code</Label>
                    <Input id="categoryCode" placeholder="e.g., CE" maxLength={3} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Category description..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depMethod">Default Depreciation Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="straight-line">Straight Line</SelectItem>
                      <SelectItem value="reducing-balance">Reducing Balance</SelectItem>
                      <SelectItem value="sum-of-years">Sum of Years' Digits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usefulLife">Default Useful Life (Years)</Label>
                    <Input id="usefulLife" type="number" placeholder="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depRate">Depreciation Rate (%)</Label>
                    <Input id="depRate" type="number" placeholder="20" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCategory}
                  className="text-white"
                  style={{ backgroundColor: moduleColor }}
                >
                  Add Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5" style={{ color: moduleColor }} />
                <span className="text-2xl font-bold">{categories.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">
                {categories.reduce((sum, c) => sum + c.assetCount, 0)}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(categories.reduce((sum, c) => sum + c.totalValue, 0))}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Depreciation</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold" style={{ color: moduleColor }}>
                {(categories.reduce((sum, c) => sum + c.depreciationRate, 0) / categories.length).toFixed(1)}%
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Categories</CardTitle>
            <CardDescription>Asset categories with default depreciation settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Assets</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Depreciation</TableHead>
                  <TableHead>Useful Life</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: moduleColor + "20" }}
                        >
                          <category.icon className="w-4 h-4" style={{ color: moduleColor }} />
                        </div>
                        <div>
                          <span className="font-medium">{category.name}</span>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{category.code}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{category.assetCount}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(category.totalValue)}</TableCell>
                    <TableCell className="text-sm">{category.defaultDepreciation}</TableCell>
                    <TableCell>{category.defaultUsefulLife} years</TableCell>
                    <TableCell className="font-medium" style={{ color: moduleColor }}>
                      {category.depreciationRate}%
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500">{category.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Category</DropdownMenuItem>
                          <DropdownMenuItem>View Assets</DropdownMenuItem>
                          <DropdownMenuItem>Update Depreciation</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
