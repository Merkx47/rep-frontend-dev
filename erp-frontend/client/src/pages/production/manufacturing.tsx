import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { getModuleColor } from "@/contexts/module-context";
import {
  Search,
  Factory,
  Gauge,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Settings,
} from "lucide-react";

interface ProductionLine {
  id: string;
  name: string;
  status: "running" | "idle" | "maintenance" | "offline";
  currentOrder: string | null;
  efficiency: number;
  output: number;
  target: number;
  operator: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

// Mock data
const mockProductionLines: ProductionLine[] = [
  { id: "1", name: "Line A - Assembly", status: "running", currentOrder: "WO-2024-001", efficiency: 94, output: 45, target: 50, operator: "John Smith", lastMaintenance: "2024-01-10", nextMaintenance: "2024-02-10" },
  { id: "2", name: "Line B - Electronics", status: "running", currentOrder: "WO-2024-002", efficiency: 88, output: 230, target: 250, operator: "Sarah Johnson", lastMaintenance: "2024-01-05", nextMaintenance: "2024-02-05" },
  { id: "3", name: "Line C - Molding", status: "idle", currentOrder: null, efficiency: 0, output: 0, target: 500, operator: "Mike Davis", lastMaintenance: "2024-01-15", nextMaintenance: "2024-02-15" },
  { id: "4", name: "Line D - Packaging", status: "maintenance", currentOrder: null, efficiency: 0, output: 0, target: 1000, operator: "Emily Brown", lastMaintenance: "2024-01-20", nextMaintenance: "2024-01-22" },
  { id: "5", name: "Line E - Quality Test", status: "running", currentOrder: "WO-2024-004", efficiency: 96, output: 28, target: 30, operator: "David Wilson", lastMaintenance: "2024-01-08", nextMaintenance: "2024-02-08" },
];

export default function ManufacturingPage() {
  const moduleColor = getModuleColor("production");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredLines = mockProductionLines.filter((line) => {
    const matchesSearch = line.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || line.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const runningLines = mockProductionLines.filter((l) => l.status === "running").length;
  const idleLines = mockProductionLines.filter((l) => l.status === "idle").length;
  const maintenanceLines = mockProductionLines.filter((l) => l.status === "maintenance").length;
  const avgEfficiency = Math.round(
    mockProductionLines.filter((l) => l.status === "running").reduce((sum, l) => sum + l.efficiency, 0) /
      runningLines || 0
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Running</Badge>;
      case "idle":
        return <Badge variant="secondary">Idle</Badge>;
      case "maintenance":
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-200">Maintenance</Badge>;
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600";
    if (efficiency >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <SidebarLayout moduleId="production">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Manufacturing</h1>
            <p className="text-muted-foreground mt-1">Monitor production lines and manufacturing operations</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Running Lines</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{runningLines}</div>
              <p className="text-xs text-muted-foreground">Active production</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Idle Lines</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{idleLines}</div>
              <p className="text-xs text-muted-foreground">Ready for orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Maintenance</CardTitle>
              <Settings className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{maintenanceLines}</div>
              <p className="text-xs text-muted-foreground">Under service</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Efficiency</CardTitle>
              <Gauge className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getEfficiencyColor(avgEfficiency)}`}>{avgEfficiency}%</div>
              <p className="text-xs text-muted-foreground">Running lines</p>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search production lines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <Settings className="w-4 h-4 mr-2" />
            Schedule Maintenance
          </Button>
        </div>

        {/* Production Lines Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Production Line</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current Order</TableHead>
                  <TableHead>Output Progress</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Factory className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{line.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(line.status)}</TableCell>
                    <TableCell>
                      {line.currentOrder ? (
                        <span className="font-mono text-sm">{line.currentOrder}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[180px]">
                      {line.status === "running" ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{line.output} / {line.target}</span>
                            <span>{Math.round((line.output / line.target) * 100)}%</span>
                          </div>
                          <Progress value={(line.output / line.target) * 100} className="h-2" />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {line.status === "running" ? (
                        <div className="flex items-center gap-1">
                          <Gauge className={`h-4 w-4 ${getEfficiencyColor(line.efficiency)}`} />
                          <span className={`font-medium ${getEfficiencyColor(line.efficiency)}`}>
                            {line.efficiency}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{line.operator}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {new Date(line.nextMaintenance) <= new Date() ? (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span>{line.nextMaintenance}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredLines.length === 0 && (
          <div className="text-center py-12">
            <Factory className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No production lines found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
