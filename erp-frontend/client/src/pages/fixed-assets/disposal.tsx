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
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
} from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function DisposalPage() {
  const moduleColor = getModuleColor("fixed-assets");
  const [isDisposeAssetOpen, setIsDisposeAssetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleDisposeAsset = () => {
    toast({
      title: "Disposal Initiated",
      description: "Asset disposal request has been submitted for approval.",
    });
    setIsDisposeAssetOpen(false);
  };

  const disposalStats = {
    pendingDisposal: 5,
    approvedDisposal: 3,
    completedThisYear: 12,
    totalGainLoss: -850000,
  };

  const disposalRequests = [
    {
      id: "DSP-2024-001",
      assetId: "FA-2020-008",
      assetName: "Old Server Rack",
      category: "Computer Equipment",
      originalCost: 3500000,
      netBookValue: 0,
      disposalValue: 150000,
      gainLoss: 150000,
      reason: "End of useful life",
      requestDate: "2024-01-05",
      status: "Pending Approval",
    },
    {
      id: "DSP-2024-002",
      assetId: "FA-2019-045",
      assetName: "HP LaserJet Printer",
      category: "Computer Equipment",
      originalCost: 450000,
      netBookValue: 0,
      disposalValue: 25000,
      gainLoss: 25000,
      reason: "Obsolete technology",
      requestDate: "2024-01-04",
      status: "Pending Approval",
    },
    {
      id: "DSP-2024-003",
      assetId: "FA-2018-112",
      assetName: "Toyota Corolla 2018",
      category: "Vehicles",
      originalCost: 12000000,
      netBookValue: 2400000,
      disposalValue: 3500000,
      gainLoss: 1100000,
      reason: "High maintenance cost",
      requestDate: "2024-01-03",
      status: "Approved",
    },
    {
      id: "DSP-2023-089",
      assetId: "FA-2017-034",
      assetName: "Office Desk (Damaged)",
      category: "Furniture & Fixtures",
      originalCost: 250000,
      netBookValue: 50000,
      disposalValue: 0,
      gainLoss: -50000,
      reason: "Damaged beyond repair",
      requestDate: "2023-12-15",
      status: "Completed",
    },
    {
      id: "DSP-2023-088",
      assetId: "FA-2016-078",
      assetName: "Industrial Drill Machine",
      category: "Machinery",
      originalCost: 8500000,
      netBookValue: 1700000,
      disposalValue: 1200000,
      gainLoss: -500000,
      reason: "Sold to vendor",
      requestDate: "2023-12-10",
      status: "Completed",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredDisposals = disposalRequests.filter(
    (d) =>
      d.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.assetId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending Approval":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Approval":
        return "bg-yellow-500";
      case "Approved":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <SidebarLayout moduleId="fixed-assets">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Asset Disposal</h1>
            <p className="text-muted-foreground mt-1">Manage asset disposals and write-offs</p>
          </div>
          <Dialog open={isDisposeAssetOpen} onOpenChange={setIsDisposeAssetOpen}>
            <DialogTrigger asChild>
              <Button
                className="text-white shadow-lg hover:opacity-90 border-0"
                style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Dispose Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Dispose Asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="asset">Select Asset</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose asset to dispose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FA-2020-008">FA-2020-008 - Old Server Rack</SelectItem>
                      <SelectItem value="FA-2019-045">FA-2019-045 - HP LaserJet Printer</SelectItem>
                      <SelectItem value="FA-2018-067">FA-2018-067 - Dell Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disposalType">Disposal Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="scrap">Scrap</SelectItem>
                      <SelectItem value="donation">Donation</SelectItem>
                      <SelectItem value="writeoff">Write-off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disposalValue">Disposal Value (₦)</Label>
                  <Input id="disposalValue" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disposalDate">Disposal Date</Label>
                  <Input id="disposalDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Disposal</Label>
                  <Textarea id="reason" placeholder="Enter reason..." />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDisposeAssetOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDisposeAsset}
                  className="text-white"
                  style={{ backgroundColor: moduleColor }}
                >
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">{disposalStats.pendingDisposal}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-blue-600">{disposalStats.approvedDisposal}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed (YTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{disposalStats.completedThisYear}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Gain/Loss (YTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-red-500" />
                <span
                  className={`text-2xl font-bold ${
                    disposalStats.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(disposalStats.totalGainLoss)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search disposals..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Disposal Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Disposal Requests</CardTitle>
            <CardDescription>All asset disposal requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Net Book Value</TableHead>
                  <TableHead>Disposal Value</TableHead>
                  <TableHead>Gain/Loss</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDisposals.map((disposal) => (
                  <TableRow key={disposal.id}>
                    <TableCell className="font-mono text-sm">{disposal.id}</TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">{disposal.assetName}</span>
                        <p className="text-xs text-muted-foreground">{disposal.assetId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{disposal.category}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(disposal.netBookValue)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(disposal.disposalValue)}</TableCell>
                    <TableCell
                      className={`font-medium ${
                        disposal.gainLoss >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {disposal.gainLoss >= 0 ? "+" : ""}
                      {formatCurrency(disposal.gainLoss)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(disposal.status)}
                        <Badge className={getStatusColor(disposal.status)}>{disposal.status}</Badge>
                      </div>
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
                          {disposal.status === "Pending Approval" && (
                            <>
                              <DropdownMenuItem>Approve</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Reject</DropdownMenuItem>
                            </>
                          )}
                          {disposal.status === "Approved" && (
                            <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                          )}
                          <DropdownMenuItem>Download Report</DropdownMenuItem>
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
