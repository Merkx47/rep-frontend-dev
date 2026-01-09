import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  CreditCard,
  TrendingUp,
  Clock,
  FileText,
  Plus,
  Edit,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarDays,
  Banknote,
  Award,
  History
} from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getModuleColor } from "@/contexts/module-context";

// Grade structure with base salaries - when grade changes, salary auto-updates
const gradeStructure = [
  { id: "grade-001", name: "Executive (C-Suite)", code: "EX", level: 1, baseSalary: 8500000, housing: 20, transport: 10, utility: 5, annualLeave: 30 },
  { id: "grade-002", name: "Director", code: "DR", level: 2, baseSalary: 5500000, housing: 20, transport: 10, utility: 5, annualLeave: 28 },
  { id: "grade-003", name: "Senior Manager", code: "SM", level: 3, baseSalary: 3500000, housing: 18, transport: 8, utility: 4, annualLeave: 25 },
  { id: "grade-004", name: "Manager", code: "MG", level: 4, baseSalary: 2200000, housing: 18, transport: 8, utility: 4, annualLeave: 23 },
  { id: "grade-005", name: "Senior Consultant", code: "SC", level: 5, baseSalary: 1500000, housing: 15, transport: 8, utility: 3, annualLeave: 21 },
  { id: "grade-006", name: "Consultant", code: "CN", level: 6, baseSalary: 950000, housing: 15, transport: 8, utility: 3, annualLeave: 21 },
  { id: "grade-007", name: "Associate", code: "AS", level: 7, baseSalary: 550000, housing: 12, transport: 6, utility: 2, annualLeave: 21 },
  { id: "grade-008", name: "Intern/NYSC", code: "IN", level: 8, baseSalary: 150000, housing: 10, transport: 5, utility: 2, annualLeave: 15 },
];

// Career path definitions - shows progression paths
const careerPaths = {
  "Engineering": {
    name: "Engineering Track",
    levels: [
      { grade: "grade-008", title: "Engineering Intern", isJunior: true },
      { grade: "grade-007", title: "Associate Engineer", isJunior: true },
      { grade: "grade-006", title: "Software Engineer", isJunior: false },
      { grade: "grade-005", title: "Senior Software Engineer", isJunior: false },
      { grade: "grade-004", title: "Engineering Manager", isJunior: false },
      { grade: "grade-003", title: "Senior Engineering Manager", isJunior: false },
      { grade: "grade-002", title: "Director of Engineering", isJunior: false },
      { grade: "grade-001", title: "CTO / VP Engineering", isJunior: false },
    ]
  },
  "Cloud & DevOps": {
    name: "Cloud & Infrastructure Track",
    levels: [
      { grade: "grade-008", title: "Cloud Intern", isJunior: true },
      { grade: "grade-007", title: "Junior DevOps Engineer", isJunior: true },
      { grade: "grade-006", title: "DevOps Engineer", isJunior: false },
      { grade: "grade-005", title: "Senior DevOps Engineer", isJunior: false },
      { grade: "grade-004", title: "Cloud Architect", isJunior: false },
      { grade: "grade-003", title: "Principal Architect", isJunior: false },
      { grade: "grade-002", title: "Head of Cloud & DevOps", isJunior: false },
      { grade: "grade-001", title: "CTO", isJunior: false },
    ]
  },
  "Business Development": {
    name: "Business Development Track",
    levels: [
      { grade: "grade-008", title: "BD Intern", isJunior: true },
      { grade: "grade-007", title: "BD Associate", isJunior: true },
      { grade: "grade-006", title: "BD Executive", isJunior: false },
      { grade: "grade-005", title: "Senior BD Executive", isJunior: false },
      { grade: "grade-004", title: "BD Manager", isJunior: false },
      { grade: "grade-003", title: "Senior BD Manager", isJunior: false },
      { grade: "grade-002", title: "Director of BD", isJunior: false },
      { grade: "grade-001", title: "Chief Commercial Officer", isJunior: false },
    ]
  },
  "Finance": {
    name: "Finance Track",
    levels: [
      { grade: "grade-008", title: "Finance Intern", isJunior: true },
      { grade: "grade-007", title: "Accountant", isJunior: true },
      { grade: "grade-006", title: "Senior Accountant", isJunior: false },
      { grade: "grade-005", title: "Financial Analyst", isJunior: false },
      { grade: "grade-004", title: "Finance Manager", isJunior: false },
      { grade: "grade-003", title: "Senior Finance Manager", isJunior: false },
      { grade: "grade-002", title: "Finance Director", isJunior: false },
      { grade: "grade-001", title: "CFO", isJunior: false },
    ]
  },
  "HR": {
    name: "Human Resources Track",
    levels: [
      { grade: "grade-008", title: "HR Intern", isJunior: true },
      { grade: "grade-007", title: "HR Associate", isJunior: true },
      { grade: "grade-006", title: "HR Executive", isJunior: false },
      { grade: "grade-005", title: "Senior HR Executive", isJunior: false },
      { grade: "grade-004", title: "HR Manager", isJunior: false },
      { grade: "grade-003", title: "Senior HR Manager", isJunior: false },
      { grade: "grade-002", title: "HR Director", isJunior: false },
      { grade: "grade-001", title: "Chief People Officer", isJunior: false },
    ]
  },
  "Executive": {
    name: "Executive Track",
    levels: [
      { grade: "grade-001", title: "CEO / C-Suite", isJunior: false },
    ]
  },
};

// Calculate salary from grade
const calculateSalaryFromGrade = (gradeId: string) => {
  const grade = gradeStructure.find(g => g.id === gradeId);
  if (!grade) return null;

  const basic = grade.baseSalary;
  const housing = basic * (grade.housing / 100);
  const transport = basic * (grade.transport / 100);
  const utility = basic * (grade.utility / 100);
  const gross = basic + housing + transport + utility;
  const tax = gross * 0.15; // 15% PAYE
  const pension = basic * 0.08; // 8% pension
  const net = gross - tax - pension;

  return { basic, housing, transport, utility, gross, tax, pension, net };
};

// Mock data for employee details - in real app this would come from API
const getEmployeeById = (id: string) => {
  const employees: Record<string, any> = {
    "emp-001": {
      id: "emp-001",
      number: "QUC-001",
      firstName: "Yinka",
      lastName: "Daramola",
      email: "yinka.daramola@qucoon.com",
      phone: "+234 803 000 0001",
      address: "Lekki Phase 1, Lagos",
      department: "Executive",
      jobTitle: "CEO",
      gradeId: "grade-001",
      grade: "Executive (C-Suite)",
      gradeLevel: 1,
      careerPath: "Executive",
      hireDate: "2016-01-15",
      status: "active",
      bankName: "GTBank",
      bankAccountNumber: "0011223344",
      bankAccountName: "Olayinka Daramola",
      nin: "12345678901",
      salary: calculateSalaryFromGrade("grade-001"),
      leaveBalance: {
        annual: { total: 30, used: 5, pending: 2 },
        sick: { total: 12, used: 2, pending: 0 },
        compassionate: { total: 5, used: 0, pending: 0 },
      },
      leaveHistory: [
        { id: "lv-001", type: "Annual Leave", startDate: "2024-12-20", endDate: "2024-12-27", days: 5, status: "approved", reason: "Year-end vacation" },
        { id: "lv-002", type: "Sick Leave", startDate: "2024-10-15", endDate: "2024-10-16", days: 2, status: "approved", reason: "Medical appointment" },
        { id: "lv-003", type: "Annual Leave", startDate: "2025-02-10", endDate: "2025-02-12", days: 2, status: "pending", reason: "Personal matters" },
      ],
      promotionHistory: [
        { id: "pr-001", date: "2016-01-15", fromGrade: "N/A", toGrade: "Executive (C-Suite)", fromTitle: "N/A", toTitle: "CEO", remarks: "Founder", salaryChange: { from: 0, to: 8500000 } },
      ],
      salaryHistory: [
        { id: "sh-001", effectiveDate: "2024-01-01", gradeId: "grade-001", basic: 8500000, gross: 11475000, reason: "Grade Review" },
        { id: "sh-002", effectiveDate: "2023-01-01", gradeId: "grade-001", basic: 7500000, gross: 10125000, reason: "Annual Review" },
      ],
      reportingTo: null,
      directReports: ["emp-002", "emp-003"],
    },
    "emp-002": {
      id: "emp-002",
      number: "QUC-002",
      firstName: "Tope",
      lastName: "Olakunle",
      email: "tope.olakunle@qucoon.com",
      phone: "+234 803 000 0002",
      address: "Victoria Island, Lagos",
      department: "Engineering",
      jobTitle: "CTO",
      gradeId: "grade-001",
      grade: "Executive (C-Suite)",
      gradeLevel: 1,
      careerPath: "Engineering",
      hireDate: "2016-03-01",
      status: "active",
      bankName: "Zenith Bank",
      bankAccountNumber: "1122334455",
      bankAccountName: "Tope Olakunle",
      nin: "23456789012",
      salary: calculateSalaryFromGrade("grade-001"),
      leaveBalance: {
        annual: { total: 30, used: 8, pending: 0 },
        sick: { total: 12, used: 1, pending: 0 },
        compassionate: { total: 5, used: 0, pending: 0 },
      },
      leaveHistory: [
        { id: "lv-004", type: "Annual Leave", startDate: "2024-08-05", endDate: "2024-08-12", days: 5, status: "approved", reason: "Family vacation" },
        { id: "lv-005", type: "Annual Leave", startDate: "2024-04-15", endDate: "2024-04-17", days: 3, status: "approved", reason: "Personal matters" },
      ],
      promotionHistory: [
        { id: "pr-002", date: "2020-01-01", fromGrade: "Director", toGrade: "Executive (C-Suite)", fromTitle: "VP Engineering", toTitle: "CTO", remarks: "Promoted to C-suite", salaryChange: { from: 5500000, to: 8500000 } },
        { id: "pr-003", date: "2018-07-01", fromGrade: "Senior Manager", toGrade: "Director", fromTitle: "Engineering Manager", toTitle: "VP Engineering", remarks: "Exceptional performance", salaryChange: { from: 3500000, to: 5500000 } },
        { id: "pr-004", date: "2016-03-01", fromGrade: "N/A", toGrade: "Senior Manager", fromTitle: "N/A", toTitle: "Engineering Manager", remarks: "Joined as founding team", salaryChange: { from: 0, to: 3500000 } },
      ],
      salaryHistory: [
        { id: "sh-004", effectiveDate: "2024-01-01", gradeId: "grade-001", basic: 8500000, gross: 11475000, reason: "Annual Review" },
        { id: "sh-005", effectiveDate: "2020-01-01", gradeId: "grade-001", basic: 8500000, gross: 11475000, reason: "Promotion to CTO" },
        { id: "sh-006", effectiveDate: "2018-07-01", gradeId: "grade-002", basic: 5500000, gross: 7425000, reason: "Promotion to VP Engineering" },
      ],
      reportingTo: "emp-001",
      directReports: ["emp-004", "emp-005", "emp-010", "emp-011"],
    },
    "emp-010": {
      id: "emp-010",
      number: "QUC-010",
      firstName: "Tunde",
      lastName: "Adekunle",
      email: "tunde.adekunle@qucoon.com",
      phone: "+234 803 000 0010",
      address: "Gbagada, Lagos",
      department: "Engineering",
      jobTitle: "Senior Backend Engineer",
      gradeId: "grade-005",
      grade: "Senior Consultant",
      gradeLevel: 5,
      careerPath: "Engineering",
      hireDate: "2021-01-10",
      status: "active",
      bankName: "Zenith Bank",
      bankAccountNumber: "9900112233",
      bankAccountName: "Tunde Adekunle",
      nin: "01234567890",
      salary: calculateSalaryFromGrade("grade-005"),
      leaveBalance: {
        annual: { total: 21, used: 3, pending: 0 },
        sick: { total: 12, used: 0, pending: 0 },
        compassionate: { total: 5, used: 0, pending: 0 },
      },
      leaveHistory: [
        { id: "lv-010", type: "Annual Leave", startDate: "2024-11-20", endDate: "2024-11-22", days: 3, status: "approved", reason: "Family event" },
      ],
      promotionHistory: [
        { id: "pr-010", date: "2023-07-01", fromGrade: "Consultant", toGrade: "Senior Consultant", fromTitle: "Backend Engineer", toTitle: "Senior Backend Engineer", remarks: "Performance promotion", salaryChange: { from: 950000, to: 1500000 } },
        { id: "pr-011", date: "2021-01-10", fromGrade: "N/A", toGrade: "Consultant", fromTitle: "N/A", toTitle: "Backend Engineer", remarks: "New hire", salaryChange: { from: 0, to: 950000 } },
      ],
      salaryHistory: [
        { id: "sh-010", effectiveDate: "2023-07-01", gradeId: "grade-005", basic: 1500000, gross: 1890000, reason: "Promotion" },
        { id: "sh-011", effectiveDate: "2021-01-10", gradeId: "grade-006", basic: 950000, gross: 1197000, reason: "New hire" },
      ],
      reportingTo: "emp-002",
      directReports: [],
    },
    "emp-016": {
      id: "emp-016",
      number: "QUC-016",
      firstName: "Chinedu",
      lastName: "Anyanwu",
      email: "chinedu.anyanwu@qucoon.com",
      phone: "+234 803 000 0016",
      address: "Maryland, Lagos",
      department: "Engineering",
      jobTitle: "Frontend Developer",
      gradeId: "grade-007",
      grade: "Associate",
      gradeLevel: 7,
      careerPath: "Engineering",
      hireDate: "2024-01-15",
      status: "active",
      bankName: "Access Bank",
      bankAccountNumber: "5566778800",
      bankAccountName: "Chinedu Anyanwu",
      nin: "66789012345",
      salary: calculateSalaryFromGrade("grade-007"),
      leaveBalance: {
        annual: { total: 21, used: 0, pending: 0 },
        sick: { total: 12, used: 0, pending: 0 },
        compassionate: { total: 5, used: 0, pending: 0 },
      },
      leaveHistory: [],
      promotionHistory: [
        { id: "pr-016", date: "2024-01-15", fromGrade: "N/A", toGrade: "Associate", fromTitle: "N/A", toTitle: "Frontend Developer", remarks: "New hire - Junior role", salaryChange: { from: 0, to: 550000 } },
      ],
      salaryHistory: [
        { id: "sh-016", effectiveDate: "2024-01-15", gradeId: "grade-007", basic: 550000, gross: 660000, reason: "New hire" },
      ],
      reportingTo: "emp-005",
      directReports: [],
    },
  };

  // Generate generic data for other employees
  if (!employees[id]) {
    const numId = id.split('-')[1];
    const gradeId = "grade-006";
    return {
      id,
      number: `QUC-${numId}`,
      firstName: "Employee",
      lastName: numId,
      email: `employee${numId}@qucoon.com`,
      phone: "+234 803 000 0000",
      address: "Lagos, Nigeria",
      department: "General",
      jobTitle: "Consultant",
      gradeId: gradeId,
      grade: "Consultant",
      gradeLevel: 6,
      careerPath: "Engineering",
      hireDate: "2023-01-01",
      status: "active",
      bankName: "GTBank",
      bankAccountNumber: "0000000000",
      bankAccountName: "Employee Name",
      nin: "00000000000",
      salary: calculateSalaryFromGrade(gradeId),
      leaveBalance: {
        annual: { total: 21, used: 0, pending: 0 },
        sick: { total: 12, used: 0, pending: 0 },
        compassionate: { total: 5, used: 0, pending: 0 },
      },
      leaveHistory: [],
      promotionHistory: [],
      salaryHistory: [],
      reportingTo: null,
      directReports: [],
    };
  }

  return employees[id];
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default function EmployeeDetailPage() {
  const moduleColor = getModuleColor("hr");
  const params = useParams();
  const employeeId = params.id || "emp-001";
  const employee = getEmployeeById(employeeId);
  const { toast } = useToast();

  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLeaveRequest = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsLeaveDialogOpen(false);
    toast({
      title: "Leave Request Submitted",
      description: "The leave request has been submitted for approval.",
    });
  };

  const handlePromotion = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsPromotionDialogOpen(false);
    toast({
      title: "Promotion Recorded",
      description: "The promotion has been recorded successfully.",
    });
  };

  const handleSalaryUpdate = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSalaryDialogOpen(false);
    toast({
      title: "Salary Updated",
      description: "The salary change has been recorded.",
    });
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/hr">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h2>
                <p className="text-muted-foreground">{employee.jobTitle} - {employee.department}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{employee.number}</Badge>
                  <Badge className={
                    employee.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700'
                  }>
                    {employee.status === 'active' ? 'Active' : employee.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4 hidden sm:block" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="leave" className="gap-2">
              <CalendarDays className="h-4 w-4 hidden sm:block" />
              Leave
            </TabsTrigger>
            <TabsTrigger value="salary" className="gap-2">
              <Banknote className="h-4 w-4 hidden sm:block" />
              Salary
            </TabsTrigger>
            <TabsTrigger value="grades" className="gap-2">
              <Award className="h-4 w-4 hidden sm:block" />
              Grade
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4 hidden sm:block" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{employee.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{employee.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">NIN</p>
                      <p className="font-medium">{employee.nin}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{employee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Job Title</p>
                      <p className="font-medium">{employee.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Grade Level</p>
                      <p className="font-medium">{employee.grade} (Level {employee.gradeLevel})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Hire Date</p>
                      <p className="font-medium">{formatDate(employee.hireDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Bank Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Bank Name</p>
                        <p className="font-medium">{employee.bankName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Number</p>
                      <p className="font-medium">{employee.bankAccountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Name</p>
                      <p className="font-medium">{employee.bankAccountName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leave Tab */}
          <TabsContent value="leave" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Leave Management</h3>
              <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Request Leave
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Leave Request</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Leave Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annual">Annual Leave</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="compassionate">Compassionate Leave</SelectItem>
                          <SelectItem value="maternity">Maternity Leave</SelectItem>
                          <SelectItem value="paternity">Paternity Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason</Label>
                      <Textarea placeholder="Enter reason for leave..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleLeaveRequest} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Submit Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Leave Balance Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Annual Leave</span>
                    <Badge variant="outline">{employee.leaveBalance.annual.total} days</Badge>
                  </div>
                  <Progress
                    value={(employee.leaveBalance.annual.used / employee.leaveBalance.annual.total) * 100}
                    className="h-2 mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Used: {employee.leaveBalance.annual.used}</span>
                    <span>Pending: {employee.leaveBalance.annual.pending}</span>
                    <span>Available: {employee.leaveBalance.annual.total - employee.leaveBalance.annual.used - employee.leaveBalance.annual.pending}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Sick Leave</span>
                    <Badge variant="outline">{employee.leaveBalance.sick.total} days</Badge>
                  </div>
                  <Progress
                    value={(employee.leaveBalance.sick.used / employee.leaveBalance.sick.total) * 100}
                    className="h-2 mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Used: {employee.leaveBalance.sick.used}</span>
                    <span>Pending: {employee.leaveBalance.sick.pending}</span>
                    <span>Available: {employee.leaveBalance.sick.total - employee.leaveBalance.sick.used}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Compassionate</span>
                    <Badge variant="outline">{employee.leaveBalance.compassionate.total} days</Badge>
                  </div>
                  <Progress
                    value={(employee.leaveBalance.compassionate.used / employee.leaveBalance.compassionate.total) * 100}
                    className="h-2 mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Used: {employee.leaveBalance.compassionate.used}</span>
                    <span>Available: {employee.leaveBalance.compassionate.total - employee.leaveBalance.compassionate.used}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leave History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leave History</CardTitle>
              </CardHeader>
              <CardContent>
                {employee.leaveHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No leave history found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employee.leaveHistory.map((leave: any) => (
                        <TableRow key={leave.id}>
                          <TableCell className="font-medium">{leave.type}</TableCell>
                          <TableCell>{formatDate(leave.startDate)}</TableCell>
                          <TableCell>{formatDate(leave.endDate)}</TableCell>
                          <TableCell>{leave.days}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{leave.reason}</TableCell>
                          <TableCell>
                            <Badge className={
                              leave.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : leave.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-red-100 text-red-700'
                            }>
                              {leave.status === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {leave.status === 'pending' && <AlertCircle className="h-3 w-3 mr-1" />}
                              {leave.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                              {leave.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Salary Tab */}
          <TabsContent value="salary" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Salary Information</h3>
              <Dialog open={isSalaryDialogOpen} onOpenChange={setIsSalaryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Salary
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Salary</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Effective Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Basic Salary</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Housing Allowance</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Transport Allowance</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                      <div className="space-y-2">
                        <Label>Utility Allowance</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Reason for Change</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annual">Annual Review</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                          <SelectItem value="adjustment">Market Adjustment</SelectItem>
                          <SelectItem value="performance">Performance Bonus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSalaryDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSalaryUpdate} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Salary Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Basic Salary</span>
                    <span className="font-medium">{formatCurrency(employee.salary.basic)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Housing Allowance</span>
                    <span className="font-medium">{formatCurrency(employee.salary.housing)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Transport Allowance</span>
                    <span className="font-medium">{formatCurrency(employee.salary.transport)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Utility Allowance</span>
                    <span className="font-medium">{formatCurrency(employee.salary.utility)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b bg-muted/50 -mx-6 px-6">
                    <span className="font-semibold">Gross Salary</span>
                    <span className="font-bold text-primary">{formatCurrency(employee.salary.gross)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Deductions & Net Pay</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Gross Salary</span>
                    <span className="font-medium">{formatCurrency(employee.salary.gross)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-red-600">
                    <span>PAYE Tax (15%)</span>
                    <span>-{formatCurrency(employee.salary.tax)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b text-red-600">
                    <span>Pension (8%)</span>
                    <span>-{formatCurrency(employee.salary.pension)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between py-2 bg-emerald-50 dark:bg-emerald-900/20 -mx-6 px-6 rounded">
                    <span className="font-semibold">Net Salary</span>
                    <span className="font-bold text-emerald-600">{formatCurrency(employee.salary.net)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Salary History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Salary History</CardTitle>
              </CardHeader>
              <CardContent>
                {employee.salaryHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No salary history found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Effective Date</TableHead>
                        <TableHead>Basic Salary</TableHead>
                        <TableHead>Gross Salary</TableHead>
                        <TableHead>Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employee.salaryHistory.map((record: any) => (
                        <TableRow key={record.id}>
                          <TableCell>{formatDate(record.effectiveDate)}</TableCell>
                          <TableCell>{formatCurrency(record.basic)}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(record.gross)}</TableCell>
                          <TableCell>{record.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Grade & Career Path</h3>
              <Dialog open={isPromotionDialogOpen} onOpenChange={setIsPromotionDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Change Grade
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Change Employee Grade</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                      <p className="font-medium mb-1">Note: Salary Auto-Updates with Grade</p>
                      <p className="text-muted-foreground">When you change an employee's grade, their salary will automatically update to match the new grade's salary structure.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Effective Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Grade</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {gradeStructure.map((grade) => (
                            <SelectItem key={grade.id} value={grade.id}>
                              <div className="flex items-center justify-between gap-4">
                                <span>{grade.name} (L{grade.level})</span>
                                <span className="text-muted-foreground text-xs">{formatCurrency(grade.baseSalary)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>New Job Title</Label>
                      <Input placeholder="e.g., Senior Engineer" />
                    </div>
                    <div className="space-y-2">
                      <Label>Remarks</Label>
                      <Textarea placeholder="Reason for grade change..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsPromotionDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handlePromotion} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Update Grade
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Current Grade & Salary Info */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Grade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{employee.grade}</h3>
                      <p className="text-muted-foreground">Level {employee.gradeLevel}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {employee.jobTitle}
                      </p>
                      {employee.gradeLevel >= 7 && (
                        <Badge className="mt-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Junior Role
                        </Badge>
                      )}
                      {employee.gradeLevel <= 2 && (
                        <Badge className="mt-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                          Senior Leadership
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Grade Salary Structure</CardTitle>
                  <CardDescription>Salary based on current grade</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {employee.salary && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base Salary</span>
                        <span className="font-medium">{formatCurrency(employee.salary.basic)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">+ Housing (20%)</span>
                        <span>{formatCurrency(employee.salary.housing)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">+ Transport</span>
                        <span>{formatCurrency(employee.salary.transport)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Gross Monthly</span>
                        <span className="font-bold text-primary">{formatCurrency(employee.salary.gross)}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Career Path Visualization */}
            {employee.careerPath && careerPaths[employee.careerPath as keyof typeof careerPaths] && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Career Path: {careerPaths[employee.careerPath as keyof typeof careerPaths].name}</CardTitle>
                  <CardDescription>Your progression track from junior to senior roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-primary" />
                    <div className="space-y-4">
                      {careerPaths[employee.careerPath as keyof typeof careerPaths].levels.slice().reverse().map((level, index) => {
                        const gradeInfo = gradeStructure.find(g => g.id === level.grade);
                        const isCurrent = employee.gradeId === level.grade;
                        const isPast = gradeInfo && gradeInfo.level > employee.gradeLevel;

                        return (
                          <div key={level.grade} className={`relative pl-10 ${isCurrent ? '' : 'opacity-60'}`}>
                            <div className={`absolute left-2 w-4 h-4 rounded-full border-2 border-background ${
                              isCurrent
                                ? 'bg-primary ring-4 ring-primary/20'
                                : isPast
                                  ? 'bg-emerald-500'
                                  : 'bg-muted-foreground/30'
                            }`} />
                            <div className={`p-3 rounded-lg ${isCurrent ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${isCurrent ? 'text-primary' : ''}`}>{level.title}</span>
                                  {level.isJunior && (
                                    <Badge variant="outline" className="text-xs">Junior</Badge>
                                  )}
                                  {isCurrent && (
                                    <Badge className="bg-primary text-primary-foreground text-xs">Current</Badge>
                                  )}
                                  {isPast && (
                                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">Achieved</Badge>
                                  )}
                                </div>
                                {gradeInfo && (
                                  <span className="text-sm text-muted-foreground">{formatCurrency(gradeInfo.baseSalary)}/mo</span>
                                )}
                              </div>
                              {gradeInfo && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {gradeInfo.name} (Level {gradeInfo.level}) | {gradeInfo.annualLeave} days annual leave
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grade Structure Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company Grade Structure</CardTitle>
                <CardDescription>All grades with associated salaries and benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Base Salary</TableHead>
                      <TableHead>Annual Leave</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradeStructure.map((grade) => (
                      <TableRow key={grade.id} className={employee.gradeId === grade.id ? 'bg-primary/5' : ''}>
                        <TableCell>
                          <Badge variant="outline">L{grade.level}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {grade.name}
                          {employee.gradeId === grade.id && (
                            <Badge className="ml-2 bg-primary text-primary-foreground text-xs">Current</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(grade.baseSalary)}</TableCell>
                        <TableCell>{grade.annualLeave} days</TableCell>
                        <TableCell>
                          {grade.level >= 7 ? (
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Junior</Badge>
                          ) : grade.level <= 2 ? (
                            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Senior</Badge>
                          ) : (
                            <Badge variant="outline">Mid-Level</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Promotion History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grade Change History</CardTitle>
              </CardHeader>
              <CardContent>
                {employee.promotionHistory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No grade change history found</p>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-6">
                      {employee.promotionHistory.map((promo: any, index: number) => (
                        <div key={promo.id} className="relative pl-10">
                          <div className="absolute left-2 w-4 h-4 rounded-full bg-primary border-2 border-background" />
                          <Card>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-semibold">{promo.toTitle}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {promo.fromTitle !== 'N/A' ? `From: ${promo.fromTitle}` : 'Initial Position'}
                                  </p>
                                </div>
                                <Badge variant="outline">{formatDate(promo.date)}</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm mb-2">
                                <Badge variant="secondary">{promo.fromGrade !== 'N/A' ? promo.fromGrade : 'New'}</Badge>
                                <span>→</span>
                                <Badge className="bg-primary/10 text-primary">{promo.toGrade}</Badge>
                              </div>
                              {promo.salaryChange && (
                                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>
                                    Salary: {promo.salaryChange.from > 0 ? formatCurrency(promo.salaryChange.from) : 'N/A'} → {formatCurrency(promo.salaryChange.to)}
                                  </span>
                                </div>
                              )}
                              {promo.remarks && (
                                <p className="text-sm text-muted-foreground mt-2">{promo.remarks}</p>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Employment Timeline</CardTitle>
                <CardDescription>Complete history of changes and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-4">
                    {/* Combine all history items and sort by date */}
                    {[
                      ...employee.promotionHistory.map((p: any) => ({ ...p, type: 'promotion', date: p.date })),
                      ...employee.salaryHistory.map((s: any) => ({ ...s, type: 'salary', date: s.effectiveDate })),
                      ...employee.leaveHistory.map((l: any) => ({ ...l, type: 'leave', date: l.startDate })),
                    ]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((item: any, index: number) => (
                        <div key={`${item.type}-${index}`} className="relative pl-10">
                          <div className={`absolute left-2 w-4 h-4 rounded-full border-2 border-background ${
                            item.type === 'promotion' ? 'bg-purple-500' :
                            item.type === 'salary' ? 'bg-emerald-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">{formatDate(item.date)}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.type === 'promotion' ? 'Promotion' : item.type === 'salary' ? 'Salary Change' : 'Leave'}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">
                            {item.type === 'promotion' && `Promoted to ${item.toTitle} (${item.toGrade})`}
                            {item.type === 'salary' && `Salary updated to ${formatCurrency(item.gross)} - ${item.reason}`}
                            {item.type === 'leave' && `${item.type} - ${item.days} day(s) - ${item.reason}`}
                          </p>
                        </div>
                      ))}
                    <div className="relative pl-10">
                      <div className="absolute left-2 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{formatDate(employee.hireDate)}</span>
                        <Badge variant="outline" className="text-xs">Hired</Badge>
                      </div>
                      <p className="text-sm mt-1">Joined as {employee.jobTitle}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
