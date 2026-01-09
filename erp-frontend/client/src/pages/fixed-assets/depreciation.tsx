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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingDown,
  Calculator,
  Calendar,
  FileText,
  Download,
  Play,
  CheckCircle,
  Clock,
} from "lucide-react";
import { getModuleColor } from "@/contexts/module-context";

export default function DepreciationPage() {
  const moduleColor = getModuleColor("fixed-assets");
  const [selectedPeriod, setSelectedPeriod] = useState("2024-01");
  const { toast } = useToast();

  const handleRunDepreciation = () => {
    toast({
      title: "Depreciation Calculated",
      description: "Monthly depreciation has been calculated and recorded.",
    });
  };

  const depreciationSummary = {
    monthlyDepreciation: 2375000,
    ytdDepreciation: 2375000,
    totalAssets: 156,
    lastRunDate: "2024-01-01",
    pendingPeriods: 0,
  };

  const depreciationSchedule = [
    {
      id: "FA-2024-001",
      name: "Dell OptiPlex 7090",
      category: "Computer Equipment",
      cost: 850000,
      accumulatedDep: 85000,
      monthlyDep: 14167,
      netBookValue: 765000,
      method: "Straight Line",
      status: "Calculated",
    },
    {
      id: "FA-2024-002",
      name: "Toyota Hilux 2024",
      category: "Vehicles",
      cost: 45000000,
      accumulatedDep: 2250000,
      monthlyDep: 468750,
      netBookValue: 42750000,
      method: "Reducing Balance",
      status: "Calculated",
    },
    {
      id: "FA-2023-156",
      name: "Office Building - Lekki",
      category: "Buildings",
      cost: 180000000,
      accumulatedDep: 9000000,
      monthlyDep: 375000,
      netBookValue: 171000000,
      method: "Straight Line",
      status: "Calculated",
    },
    {
      id: "FA-2023-089",
      name: "Executive Office Furniture Set",
      category: "Furniture & Fixtures",
      cost: 4500000,
      accumulatedDep: 675000,
      monthlyDep: 37500,
      netBookValue: 3825000,
      method: "Straight Line",
      status: "Calculated",
    },
    {
      id: "FA-2023-045",
      name: "Industrial Generator 500KVA",
      category: "Machinery",
      cost: 25000000,
      accumulatedDep: 3750000,
      monthlyDep: 138889,
      netBookValue: 21250000,
      method: "Straight Line",
      status: "Calculated",
    },
    {
      id: "FA-2020-008",
      name: "Old Server Rack",
      category: "Computer Equipment",
      cost: 3500000,
      accumulatedDep: 3500000,
      monthlyDep: 0,
      netBookValue: 0,
      method: "Straight Line",
      status: "Fully Depreciated",
    },
  ];

  const depreciationHistory = [
    { period: "January 2024", amount: 2375000, assets: 155, status: "Completed", date: "2024-01-31" },
    { period: "December 2023", amount: 2350000, assets: 152, status: "Completed", date: "2023-12-31" },
    { period: "November 2023", amount: 2320000, assets: 150, status: "Completed", date: "2023-11-30" },
    { period: "October 2023", amount: 2300000, assets: 148, status: "Completed", date: "2023-10-31" },
    { period: "September 2023", amount: 2280000, assets: 145, status: "Completed", date: "2023-09-30" },
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
            <h1 className="text-3xl font-display font-bold tracking-tight">Depreciation</h1>
            <p className="text-muted-foreground mt-1">Calculate and manage asset depreciation</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button
              className="text-white shadow-lg hover:opacity-90 border-0"
              style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
              onClick={handleRunDepreciation}
            >
              <Play className="w-4 h-4 mr-2" />
              Run Depreciation
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Depreciation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" style={{ color: moduleColor }} />
                <span className="text-2xl font-bold" style={{ color: moduleColor }}>
                  {formatCurrency(depreciationSummary.monthlyDepreciation)}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">YTD Depreciation</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{formatCurrency(depreciationSummary.ytdDepreciation)}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Assets Depreciated</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">{depreciationSummary.totalAssets}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Run</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-lg font-medium">{depreciationSummary.lastRunDate}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Selector */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">Select Period:</span>
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-01">January 2024</SelectItem>
                  <SelectItem value="2023-12">December 2023</SelectItem>
                  <SelectItem value="2023-11">November 2023</SelectItem>
                  <SelectItem value="2023-10">October 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Depreciation Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Depreciation Schedule</CardTitle>
            <CardDescription>Asset-wise depreciation for selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Original Cost</TableHead>
                  <TableHead>Accumulated</TableHead>
                  <TableHead>Monthly</TableHead>
                  <TableHead>Net Book Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depreciationSchedule.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-mono text-sm">{asset.id}</TableCell>
                    <TableCell className="font-medium">{asset.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{asset.category}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(asset.cost)}</TableCell>
                    <TableCell className="text-red-600">{formatCurrency(asset.accumulatedDep)}</TableCell>
                    <TableCell className="font-medium" style={{ color: moduleColor }}>
                      {formatCurrency(asset.monthlyDep)}
                    </TableCell>
                    <TableCell className="font-medium text-green-600">
                      {formatCurrency(asset.netBookValue)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          asset.status === "Calculated"
                            ? "bg-green-500"
                            : asset.status === "Fully Depreciated"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }
                      >
                        {asset.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Depreciation History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Depreciation History</CardTitle>
                <CardDescription>Previous depreciation runs</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                View Full History
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Assets</TableHead>
                  <TableHead>Run Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {depreciationHistory.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{record.period}</TableCell>
                    <TableCell className="font-medium" style={{ color: moduleColor }}>
                      {formatCurrency(record.amount)}
                    </TableCell>
                    <TableCell>{record.assets}</TableCell>
                    <TableCell className="text-muted-foreground">{record.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">{record.status}</span>
                      </div>
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
