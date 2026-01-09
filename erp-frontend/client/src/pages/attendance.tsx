import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, LogIn, LogOut, Users, Calendar, Timer } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface AttendanceRecord {
  id: number;
  employeeName: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  hoursWorked: string;
  status: string;
}

const mockAttendance: AttendanceRecord[] = [
  { id: 1, employeeName: "Chidi Okoro", date: "2025-01-06", clockIn: "08:45", clockOut: "17:30", hoursWorked: "8h 45m", status: "present" },
  { id: 2, employeeName: "Ngozi Adebayo", date: "2025-01-06", clockIn: "09:00", clockOut: "18:00", hoursWorked: "9h 0m", status: "present" },
  { id: 3, employeeName: "Olumide Bakare", date: "2025-01-06", clockIn: "08:30", clockOut: null, hoursWorked: "-", status: "in_progress" },
  { id: 4, employeeName: "Fatima Hassan", date: "2025-01-06", clockIn: null, clockOut: null, hoursWorked: "-", status: "absent" },
  { id: 5, employeeName: "Emmanuel Nwosu", date: "2025-01-06", clockIn: "10:15", clockOut: "18:45", hoursWorked: "8h 30m", status: "late" },
  { id: 6, employeeName: "Adaeze Obi", date: "2025-01-06", clockIn: "08:55", clockOut: "17:45", hoursWorked: "8h 50m", status: "present" },
  { id: 7, employeeName: "Yusuf Ibrahim", date: "2025-01-06", clockIn: "08:30", clockOut: "17:30", hoursWorked: "9h 0m", status: "present" },
  { id: 8, employeeName: "Blessing Eze", date: "2025-01-06", clockIn: "08:40", clockOut: null, hoursWorked: "-", status: "in_progress" },
  { id: 9, employeeName: "Tunde Afolabi", date: "2025-01-06", clockIn: "10:30", clockOut: "19:00", hoursWorked: "8h 30m", status: "late" },
  { id: 10, employeeName: "Amaka Chukwu", date: "2025-01-06", clockIn: "08:50", clockOut: "17:50", hoursWorked: "9h 0m", status: "present" },
  { id: 11, employeeName: "Segun Adeleke", date: "2025-01-06", clockIn: "08:35", clockOut: "17:35", hoursWorked: "9h 0m", status: "present" },
  { id: 12, employeeName: "Funke Alabi", date: "2025-01-06", clockIn: null, clockOut: null, hoursWorked: "-", status: "absent" },
  { id: 13, employeeName: "Kayode Ogundimu", date: "2025-01-06", clockIn: "08:45", clockOut: null, hoursWorked: "-", status: "in_progress" },
  { id: 14, employeeName: "Chioma Nwachukwu", date: "2025-01-06", clockIn: "08:20", clockOut: "17:20", hoursWorked: "9h 0m", status: "present" },
  { id: 15, employeeName: "Musa Abdullahi", date: "2025-01-06", clockIn: "08:55", clockOut: "17:55", hoursWorked: "9h 0m", status: "present" },
  { id: 16, employeeName: "Grace Okonkwo", date: "2025-01-06", clockIn: "08:40", clockOut: "17:40", hoursWorked: "9h 0m", status: "present" },
  { id: 17, employeeName: "Emeka Nnadi", date: "2025-01-06", clockIn: "09:45", clockOut: "18:30", hoursWorked: "8h 45m", status: "late" },
  { id: 18, employeeName: "Halima Bello", date: "2025-01-06", clockIn: "08:30", clockOut: "17:30", hoursWorked: "9h 0m", status: "present" },
  { id: 19, employeeName: "Olu Fashola", date: "2025-01-06", clockIn: "08:25", clockOut: null, hoursWorked: "-", status: "in_progress" },
  { id: 20, employeeName: "Chiamaka Igwe", date: "2025-01-06", clockIn: null, clockOut: null, hoursWorked: "-", status: "absent" },
];

const weeklyStats = [
  { day: "Mon", present: 16, absent: 2, late: 2 },
  { day: "Tue", present: 15, absent: 3, late: 2 },
  { day: "Wed", present: 17, absent: 1, late: 2 },
  { day: "Thu", present: 14, absent: 3, late: 3 },
  { day: "Fri", present: 13, absent: 4, late: 3 },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  const handleClockIn = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setClockInTime(time);
    setIsClockedIn(true);
    toast({
      title: "Clocked In",
      description: `You clocked in at ${time}`,
    });
  };

  const handleClockOut = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setIsClockedIn(false);
    toast({
      title: "Clocked Out",
      description: `You clocked out at ${time}`,
    });
    setClockInTime(null);
  };

  const totalEmployees = mockAttendance.length;
  const presentToday = mockAttendance.filter(r => r.status === 'present' || r.status === 'in_progress' || r.status === 'late').length;
  const absentToday = mockAttendance.filter(r => r.status === 'absent').length;
  const lateToday = mockAttendance.filter(r => r.status === 'late').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-200">Present</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">Working</Badge>;
      case 'late':
        return <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-200">Late</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight" data-testid="text-attendance-title">Time & Attendance</h2>
            <p className="text-muted-foreground mt-1">Track employee attendance and work hours.</p>
          </div>
          <div className="flex gap-2">
            {!isClockedIn ? (
              <Button onClick={handleClockIn} className="gap-2 bg-green-600 hover:bg-green-700" data-testid="button-clock-in">
                <LogIn className="w-4 h-4" />
                Clock In
              </Button>
            ) : (
              <Button onClick={handleClockOut} variant="destructive" className="gap-2" data-testid="button-clock-out">
                <LogOut className="w-4 h-4" />
                Clock Out
              </Button>
            )}
          </div>
        </div>

        {isClockedIn && clockInTime && (
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <Timer className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-700 dark:text-green-400">Currently Working</p>
                  <p className="text-sm text-muted-foreground">Clocked in at {clockInTime}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600" data-testid="text-current-session">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-sm text-muted-foreground">Current Time</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-employees">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">Active staff</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <LogIn className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="text-present-today">{presentToday}</div>
              <p className="text-xs text-muted-foreground">{Math.round((presentToday / totalEmployees) * 100)}% attendance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <LogOut className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive" data-testid="text-absent-today">{absentToday}</div>
              <p className="text-xs text-muted-foreground">{Math.round((absentToday / totalEmployees) * 100)}% absent</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600" data-testid="text-late-today">{lateToday}</div>
              <p className="text-xs text-muted-foreground">After 9:00 AM</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>Employee attendance for {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttendance.map((record) => (
                    <TableRow key={record.id} data-testid={`row-attendance-${record.id}`}>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{record.clockIn || "-"}</TableCell>
                      <TableCell>{record.clockOut || "-"}</TableCell>
                      <TableCell className="font-medium">{record.hoursWorked}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
              <CardDescription>This week's attendance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyStats.map((day, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-muted-foreground">{day.present} present</span>
                    </div>
                    <div className="flex gap-1 h-2">
                      <div 
                        className="bg-green-500 rounded-l-full" 
                        style={{ width: `${(day.present / totalEmployees) * 100}%` }}
                      />
                      <div 
                        className="bg-orange-500" 
                        style={{ width: `${(day.late / totalEmployees) * 100}%` }}
                      />
                      <div 
                        className="bg-red-500 rounded-r-full" 
                        style={{ width: `${(day.absent / totalEmployees) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 pt-4 border-t text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Late</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Absent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}
