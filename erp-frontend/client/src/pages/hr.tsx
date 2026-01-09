import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, ChevronRight } from "lucide-react";
import { useEmployees, useCreateEmployee } from "@/hooks/use-hr";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmployeeSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { z } from "zod";
import { Link } from "wouter";
import { getModuleColor } from "@/contexts/module-context";

const createEmployeeSchema = insertEmployeeSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  jobTitle: true,
}).extend({
  role: z.enum(["admin", "manager", "user", "viewer"]).default("user"),
  departmentId: z.string().optional(),
  gradeId: z.string().optional(),
});
type EmployeeFormValues = z.infer<typeof createEmployeeSchema>;

const roleDescriptions: Record<string, string> = {
  admin: "Full access to all modules and settings. Can manage users and company settings.",
  manager: "Can approve expenses, leaves, and manage team members. Limited settings access.",
  user: "Standard access to assigned modules. Can submit expenses and leave requests.",
  viewer: "Read-only access to reports and dashboards. Cannot make changes.",
};

const departments = [
  { id: "dept-001", name: "Executive" },
  { id: "dept-002", name: "Operations" },
  { id: "dept-003", name: "Engineering" },
  { id: "dept-004", name: "Product" },
  { id: "dept-005", name: "Sales" },
  { id: "dept-006", name: "Finance" },
  { id: "dept-007", name: "HR" },
  { id: "dept-008", name: "Marketing" },
];

const grades = [
  { id: "grade-001", name: "Executive", level: 1 },
  { id: "grade-002", name: "Senior Management", level: 2 },
  { id: "grade-003", name: "Management", level: 3 },
  { id: "grade-004", name: "Senior Staff", level: 4 },
  { id: "grade-005", name: "Staff", level: 5 },
  { id: "grade-006", name: "Junior Staff", level: 6 },
  { id: "grade-007", name: "Entry Level", level: 7 },
  { id: "grade-008", name: "Intern", level: 8 },
];

export default function HRPage() {
  const moduleColor = getModuleColor("hr");
  const { data: employees, isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      role: "user",
      departmentId: "",
      gradeId: "",
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = (data: EmployeeFormValues) => {
    createEmployee.mutate(data, {
      onSuccess: () => {
        setIsOpen(false);
        form.reset();
      }
    });
  };

  return (
    <SidebarLayout moduleId="hr">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">HR & Payroll</h2>
            <p className="text-muted-foreground mt-1">Manage employees and processing payroll.</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="text-white shadow-lg hover:opacity-90 rounded-xl border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Onboard New Employee</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl><Input placeholder="John" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email</FormLabel>
                        <FormControl><Input type="email" placeholder="john.doe@company.com" {...field} /></FormControl>
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
                        <FormControl><Input type="tel" placeholder="+234 801 234 5678" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl><Input placeholder="Software Engineer" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="departmentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gradeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {grades.map((grade) => (
                                <SelectItem key={grade.id} value={grade.id}>
                                  {grade.name} (L{grade.level})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Access Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          {selectedRole && roleDescriptions[selectedRole]}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }} disabled={createEmployee.isPending}>
                    {createEmployee.isPending ? "Creating..." : "Onboard Employee"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
            <CardDescription>All active employees in the organization</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? (
               <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : employees?.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground text-sm">No employees found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees?.map((emp) => (
                    <TableRow key={emp.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <Link href={`/hr/employee/${emp.id}`}>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
                            >
                              {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                            </div>
                            <span className="hover:text-primary hover:underline">{emp.firstName} {emp.lastName}</span>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>{emp.jobTitle || 'N/A'}</TableCell>
                      <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          emp.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : emp.status === 'on_leave'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {emp.status === 'active' ? 'Active' : emp.status === 'on_leave' ? 'On Leave' : emp.status || 'Unknown'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Link href={`/hr/employee/${emp.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
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
