import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";
import {
  Timer,
  Clock,
  Search,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Coffee,
  LogIn,
  LogOut,
  TrendingUp,
  Download,
  RefreshCw,
  MapPin,
  Smartphone,
  Monitor,
  Filter,
} from "lucide-react";

// Mock attendance data synced from Tymer
const mockAttendanceData = [
  {
    id: 1,
    employeeId: "EMP-2024-001",
    name: "Adebayo Johnson",
    department: "Finance",
    date: "2024-01-08",
    clockIn: "08:55",
    clockOut: "17:30",
    breakTime: 60,
    totalHours: "7h 35m",
    status: "present",
    source: "tymer-mobile",
    location: "Head Office",
  },
  {
    id: 2,
    employeeId: "EMP-2024-002",
    name: "Chioma Eze",
    department: "Sales",
    date: "2024-01-08",
    clockIn: "09:15",
    clockOut: "18:00",
    breakTime: 45,
    totalHours: "7h 45m",
    status: "late",
    source: "tymer-web",
    location: "Head Office",
  },
  {
    id: 3,
    employeeId: "EMP-2024-003",
    name: "Ibrahim Yusuf",
    department: "IT",
    date: "2024-01-08",
    clockIn: "08:30",
    clockOut: "17:00",
    breakTime: 60,
    totalHours: "7h 30m",
    status: "present",
    source: "tymer-biometric",
    location: "Head Office",
  },
  {
    id: 4,
    employeeId: "EMP-2024-004",
    name: "Ngozi Okonkwo",
    department: "HR",
    date: "2024-01-08",
    clockIn: null,
    clockOut: null,
    breakTime: 0,
    totalHours: "-",
    status: "absent",
    source: null,
    location: null,
  },
  {
    id: 5,
    employeeId: "EMP-2024-005",
    name: "Emeka Nwosu",
    department: "Operations",
    date: "2024-01-08",
    clockIn: "08:45",
    clockOut: null,
    breakTime: 30,
    totalHours: "In Progress",
    status: "present",
    source: "tymer-mobile",
    location: "Remote",
  },
  {
    id: 6,
    employeeId: "EMP-2024-006",
    name: "Fatima Mohammed",
    department: "Marketing",
    date: "2024-01-08",
    clockIn: "09:45",
    clockOut: "18:30",
    breakTime: 60,
    totalHours: "7h 45m",
    status: "very-late",
    source: "tymer-web",
    location: "Head Office",
  },
  {
    id: 7,
    employeeId: "EMP-2024-007",
    name: "Oluwaseun Adeleke",
    department: "Finance",
    date: "2024-01-08",
    clockIn: null,
    clockOut: null,
    breakTime: 0,
    totalHours: "-",
    status: "leave",
    source: null,
    location: null,
  },
];

const todaySummary = {
  total: 7,
  present: 3,
  late: 1,
  veryLate: 1,
  absent: 1,
  onLeave: 1,
  avgClockIn: "08:58",
  avgHours: "7h 38m",
};

export default function HRAttendancePage() {
  const moduleColor = getModuleColor("hr");
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("2024-01-08");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Sync Complete",
        description: "Attendance data has been synced from Tymer.",
      });
    }, 2000);
  };

  const handleManualEntry = () => {
    toast({
      title: "Attendance Recorded",
      description: "Manual attendance entry has been saved.",
    });
    setIsManualEntryOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Present</Badge>;
      case "late":
        return <Badge className="bg-yellow-500"><AlertCircle className="w-3 h-3 mr-1" />Late</Badge>;
      case "very-late":
        return <Badge className="bg-orange-500"><AlertCircle className="w-3 h-3 mr-1" />Very Late</Badge>;
      case "absent":
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" />Absent</Badge>;
      case "leave":
        return <Badge className="bg-blue-500"><Calendar className="w-3 h-3 mr-1" />On Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSourceIcon = (source: string | null) => {
    if (!source) return null;
    switch (source) {
      case "tymer-mobile":
        return <Smartphone className="w-4 h-4 text-muted-foreground" />;
      case "tymer-web":
        return <Monitor className="w-4 h-4 text-muted-foreground" />;
      case "tymer-biometric":
        return <Timer className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const filteredData = mockAttendanceData.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <SidebarLayout moduleId="hr">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-display font-bold tracking-tight">Attendance</h1>
              <Badge className="bg-green-500 text-xs">
                <Timer className="w-3 h-3 mr-1" />
                Tymer Connected
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Track employee attendance synced from Tymer</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing..." : "Sync Tymer"}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
              <DialogTrigger asChild>
                <Button
                  className="text-white shadow-lg hover:opacity-90 border-0"
                  style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Manual Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Manual Attendance Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Employee</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAttendanceData.map((emp) => (
                          <SelectItem key={emp.id} value={emp.employeeId}>
                            {emp.name} ({emp.employeeId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" defaultValue="2024-01-08" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Clock In</Label>
                      <Input type="time" />
                    </div>
                    <div className="space-y-2">
                      <Label>Clock Out</Label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Reason for Manual Entry</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forgot">Forgot to clock in/out</SelectItem>
                        <SelectItem value="device-issue">Device issue</SelectItem>
                        <SelectItem value="network">Network problem</SelectItem>
                        <SelectItem value="correction">Correction</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsManualEntryOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleManualEntry}
                    className="text-white"
                    style={{ backgroundColor: moduleColor }}
                  >
                    Save Entry
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: moduleColor }} />
                <span className="text-2xl font-bold">{todaySummary.total}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600">{todaySummary.present}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Late</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">{todaySummary.late + todaySummary.veryLate}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold text-red-600">{todaySummary.absent}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Clock In</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <LogIn className="w-5 h-5" style={{ color: moduleColor }} />
                <span className="text-2xl font-bold">{todaySummary.avgClockIn}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: moduleColor }} />
                <span className="text-2xl font-bold">{todaySummary.avgHours}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tymer Status Banner */}
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-800 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-400">Tymer Integration Active</p>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    Real-time sync enabled | Last sync: 2 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex gap-2 text-sm text-green-600 dark:text-green-500">
                <span className="flex items-center gap-1">
                  <Smartphone className="w-4 h-4" /> 45 Mobile
                </span>
                <span className="flex items-center gap-1">
                  <Monitor className="w-4 h-4" /> 12 Web
                </span>
                <span className="flex items-center gap-1">
                  <Timer className="w-4 h-4" /> 8 Biometric
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, ID, or department..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-40"
                    />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="very-late">Very Late</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Attendance</CardTitle>
                <CardDescription>
                  Showing {filteredData.length} of {mockAttendanceData.length} records for {dateFilter}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Break</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
                            >
                              {record.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-medium">{record.name}</p>
                              <p className="text-xs text-muted-foreground">{record.employeeId}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{record.department}</TableCell>
                        <TableCell>
                          {record.clockIn ? (
                            <div className="flex items-center gap-1">
                              <LogIn className="w-3 h-3 text-green-500" />
                              <span>{record.clockIn}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {record.clockOut ? (
                            <div className="flex items-center gap-1">
                              <LogOut className="w-3 h-3 text-red-500" />
                              <span>{record.clockOut}</span>
                            </div>
                          ) : record.clockIn ? (
                            <Badge variant="outline" className="text-xs">Working</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {record.breakTime > 0 ? (
                            <div className="flex items-center gap-1">
                              <Coffee className="w-3 h-3 text-muted-foreground" />
                              <span>{record.breakTime}m</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{record.totalHours}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          {record.source ? (
                            <div className="flex items-center gap-2">
                              {getSourceIcon(record.source)}
                              {record.location && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {record.location}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>Attendance overview for the current week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                    <Card key={day} className={i === 0 ? "border-2" : ""} style={i === 0 ? { borderColor: moduleColor } : {}}>
                      <CardContent className="pt-4">
                        <p className="text-sm font-medium text-muted-foreground">{day}</p>
                        <p className="text-xs text-muted-foreground mb-2">Jan {6 + i}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Present</span>
                            <span className="font-medium text-green-600">{5 - i > 0 ? 5 - i : 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Late</span>
                            <span className="font-medium text-yellow-600">{i % 2}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Absent</span>
                            <span className="font-medium text-red-600">{i > 2 ? 1 : 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Reports</CardTitle>
                <CardDescription>Generate and download attendance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: moduleColor }} />
                      <p className="font-medium">Monthly Report</p>
                      <p className="text-sm text-muted-foreground">Full month attendance</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <Users className="w-10 h-10 mx-auto mb-3" style={{ color: moduleColor }} />
                      <p className="font-medium">Department Report</p>
                      <p className="text-sm text-muted-foreground">By department breakdown</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="w-10 h-10 mx-auto mb-3" style={{ color: moduleColor }} />
                      <p className="font-medium">Trend Analysis</p>
                      <p className="text-sm text-muted-foreground">Attendance patterns</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
