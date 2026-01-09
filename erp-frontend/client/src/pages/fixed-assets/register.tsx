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
  Filter,
  Download,
} from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function AssetRegisterPage() {
  const moduleColor = getModuleColor("fixed-assets");
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  const handleAddAsset = () => {
    toast({
      title: "Asset Added",
      description: "New asset has been added to the register.",
    });
    setIsAddAssetOpen(false);
  };

  const assets = [
    {
      id: "FA-2024-001",
      name: "Dell OptiPlex 7090",
      category: "Computer Equipment",
      location: "Head Office - Floor 2",
      purchaseDate: "2024-01-05",
      cost: 850000,
      currentValue: 765000,
      depreciationMethod: "Straight Line",
      usefulLife: 5,
      status: "Active",
      icon: Monitor,
    },
    {
      id: "FA-2024-002",
      name: "Toyota Hilux 2024",
      category: "Vehicles",
      location: "Head Office - Parking",
      purchaseDate: "2024-01-03",
      cost: 45000000,
      currentValue: 42750000,
      depreciationMethod: "Reducing Balance",
      usefulLife: 8,
      status: "Active",
      icon: Car,
    },
    {
      id: "FA-2023-156",
      name: "Office Building - Lekki",
      category: "Buildings",
      location: "Lekki Phase 1",
      purchaseDate: "2023-06-15",
      cost: 180000000,
      currentValue: 171000000,
      depreciationMethod: "Straight Line",
      usefulLife: 40,
      status: "Active",
      icon: Building2,
    },
    {
      id: "FA-2023-089",
      name: "Executive Office Furniture Set",
      category: "Furniture & Fixtures",
      location: "Head Office - Executive Suite",
      purchaseDate: "2023-08-20",
      cost: 4500000,
      currentValue: 3825000,
      depreciationMethod: "Straight Line",
      usefulLife: 10,
      status: "Active",
      icon: Armchair,
    },
    {
      id: "FA-2023-045",
      name: "Industrial Generator 500KVA",
      category: "Machinery",
      location: "Factory - Generator Room",
      purchaseDate: "2023-03-10",
      cost: 25000000,
      currentValue: 21250000,
      depreciationMethod: "Straight Line",
      usefulLife: 15,
      status: "Active",
      icon: Cog,
    },
    {
      id: "FA-2022-112",
      name: "HP ProBook Laptop",
      category: "Computer Equipment",
      location: "Sales Department",
      purchaseDate: "2022-11-15",
      cost: 650000,
      currentValue: 390000,
      depreciationMethod: "Straight Line",
      usefulLife: 5,
      status: "Active",
      icon: Monitor,
    },
    {
      id: "FA-2021-034",
      name: "Office Chairs (Set of 20)",
      category: "Furniture & Fixtures",
      location: "Head Office - Open Plan",
      purchaseDate: "2021-05-22",
      cost: 2000000,
      currentValue: 1000000,
      depreciationMethod: "Straight Line",
      usefulLife: 10,
      status: "Active",
      icon: Armchair,
    },
    {
      id: "FA-2020-008",
      name: "Old Server Rack",
      category: "Computer Equipment",
      location: "Data Center",
      purchaseDate: "2020-02-18",
      cost: 3500000,
      currentValue: 0,
      depreciationMethod: "Straight Line",
      usefulLife: 5,
      status: "Fully Depreciated",
      icon: Monitor,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(assets.map((a) => a.category)));

  return (
    <SidebarLayout moduleId="fixed-assets">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Asset Register</h1>
            <p className="text-muted-foreground mt-1">Complete list of all fixed assets</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
              <DialogTrigger asChild>
                <Button
                  className="text-white shadow-lg hover:opacity-90 border-0"
                  style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Asset
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Asset</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assetId">Asset ID</Label>
                      <Input id="assetId" placeholder="FA-2024-XXX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assetName">Asset Name</Label>
                      <Input id="assetName" placeholder="Enter asset name" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer">Computer Equipment</SelectItem>
                          <SelectItem value="vehicles">Vehicles</SelectItem>
                          <SelectItem value="buildings">Buildings</SelectItem>
                          <SelectItem value="furniture">Furniture & Fixtures</SelectItem>
                          <SelectItem value="machinery">Machinery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Enter location" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchaseDate">Purchase Date</Label>
                      <Input id="purchaseDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost">Purchase Cost (₦)</Label>
                      <Input id="cost" type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="depMethod">Depreciation Method</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="usefulLife">Useful Life (Years)</Label>
                      <Input id="usefulLife" type="number" placeholder="5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Asset description..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input id="serialNumber" placeholder="Enter serial number (optional)" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsAddAssetOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddAsset}
                    className="text-white"
                    style={{ backgroundColor: moduleColor }}
                  >
                    Add Asset
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Assets Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Assets</CardTitle>
            <CardDescription>
              Showing {filteredAssets.length} of {assets.length} assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
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
                    <TableCell className="text-muted-foreground text-sm">{asset.location}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(asset.cost)}</TableCell>
                    <TableCell
                      className="font-medium"
                      style={{ color: asset.currentValue > 0 ? moduleColor : "inherit" }}
                    >
                      {formatCurrency(asset.currentValue)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          asset.status === "Active"
                            ? "bg-green-500"
                            : asset.status === "Fully Depreciated"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }
                      >
                        {asset.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Asset</DropdownMenuItem>
                          <DropdownMenuItem>View Depreciation</DropdownMenuItem>
                          <DropdownMenuItem>Transfer Asset</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Dispose Asset</DropdownMenuItem>
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
