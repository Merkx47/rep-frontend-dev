import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { getModuleColor } from "@/contexts/module-context";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Users,
  UserCheck,
  UserX,
  Clock,
  ChevronRight,
} from "lucide-react";

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  jobTitle: string;
  status: "active" | "on_leave" | "terminated";
  hireDate: string;
  manager: string;
}

// Mock data
const mockEmployees: Employee[] = [
  { id: "1", employeeId: "EMP-001", firstName: "Adebayo", lastName: "Okonkwo", email: "adebayo.okonkwo@company.com", phone: "+234 801 234 5678", department: "Engineering", jobTitle: "Senior Software Engineer", status: "active", hireDate: "2022-03-15", manager: "Chidi Eze" },
  { id: "2", employeeId: "EMP-002", firstName: "Ngozi", lastName: "Adeyemi", email: "ngozi.adeyemi@company.com", phone: "+234 802 345 6789", department: "Marketing", jobTitle: "Marketing Manager", status: "active", hireDate: "2021-08-20", manager: "Funke Akindele" },
  { id: "3", employeeId: "EMP-003", firstName: "Chidi", lastName: "Eze", email: "chidi.eze@company.com", phone: "+234 803 456 7890", department: "Engineering", jobTitle: "Engineering Director", status: "active", hireDate: "2020-01-10", manager: "Emeka Nwosu" },
  { id: "4", employeeId: "EMP-004", firstName: "Amara", lastName: "Okwu", email: "amara.okwu@company.com", phone: "+234 804 567 8901", department: "Finance", jobTitle: "Financial Analyst", status: "on_leave", hireDate: "2023-02-01", manager: "Bola Tinubu" },
  { id: "5", employeeId: "EMP-005", firstName: "Emeka", lastName: "Nwosu", email: "emeka.nwosu@company.com", phone: "+234 805 678 9012", department: "Executive", jobTitle: "Chief Executive Officer", status: "active", hireDate: "2019-06-01", manager: "-" },
  { id: "6", employeeId: "EMP-006", firstName: "Funke", lastName: "Akindele", email: "funke.akindele@company.com", phone: "+234 806 789 0123", department: "Marketing", jobTitle: "Chief Marketing Officer", status: "active", hireDate: "2020-03-15", manager: "Emeka Nwosu" },
  { id: "7", employeeId: "EMP-007", firstName: "Yusuf", lastName: "Ibrahim", email: "yusuf.ibrahim@company.com", phone: "+234 807 890 1234", department: "Operations", jobTitle: "Operations Manager", status: "active", hireDate: "2021-11-01", manager: "Emeka Nwosu" },
  { id: "8", employeeId: "EMP-008", firstName: "Chiamaka", lastName: "Obi", email: "chiamaka.obi@company.com", phone: "+234 808 901 2345", department: "HR", jobTitle: "HR Specialist", status: "active", hireDate: "2022-07-15", manager: "Bola Tinubu" },
  { id: "9", employeeId: "EMP-009", firstName: "Tunde", lastName: "Bakare", email: "tunde.bakare@company.com", phone: "+234 809 012 3456", department: "Engineering", jobTitle: "Junior Developer", status: "terminated", hireDate: "2023-01-10", manager: "Chidi Eze" },
  { id: "10", employeeId: "EMP-010", firstName: "Bola", lastName: "Tinubu", email: "bola.tinubu@company.com", phone: "+234 810 123 4567", department: "Finance", jobTitle: "Chief Financial Officer", status: "active", hireDate: "2019-09-01", manager: "Emeka Nwosu" },
];

const departments = [
  "Executive",
  "Engineering",
  "Marketing",
  "Finance",
  "HR",
  "Operations",
  "Sales",
  "Product",
];

export default function EmployeesPage() {
  const moduleColor = getModuleColor("hr");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      jobTitle: "",
      manager: "",
    },
  });

  const onSubmit = (data: any) => {
    toast({
      title: "Employee Added",
      description: `${data.firstName} ${data.lastName} has been added to the directory.`,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  const handleDelete = (employee: Employee) => {
    toast({
      title: "Employee Removed",
      description: `${employee.firstName} ${employee.lastName} has been removed from the directory.`,
      variant: "destructive",
    });
  };

  // Filter employees
  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesSearch =
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === "all" || employee.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Stats
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter((e) => e.status === "active").length;
  const onLeaveEmployees = mockEmployees.filter((e) => e.status === "on_leave").length;
  const terminatedEmployees = mockEmployees.filter((e) => e.status === "terminated").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Active</Badge>;
      case "on_leave":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">On Leave</Badge>;
      case "terminated":
        return <Badge variant="destructive">Terminated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <SidebarLayout moduleId="hr">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground mt-1">Manage your organization's employee directory</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 rounded-xl border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      rules={{ required: "First name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      rules={{ required: "Last name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ required: "Email is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+234 801 234 5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="department"
                      rules={{ required: "Department is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      rules={{ required: "Job title is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Software Engineer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="manager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reporting Manager</FormLabel>
                        <FormControl>
                          <Input placeholder="Manager name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    Add Employee
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeEmployees}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                On Leave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{onLeaveEmployees}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserX className="h-4 w-4" />
                Terminated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{terminatedEmployees}</div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Employees Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No employees found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/hr/employee/${employee.id}`}>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
                            >
                              {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium hover:text-primary hover:underline">
                                {employee.firstName} {employee.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">{employee.employeeId}</p>
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.jobTitle}</TableCell>
                      <TableCell className="text-muted-foreground">{employee.manager}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(employee.hireDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/hr/employee/${employee.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(employee)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
