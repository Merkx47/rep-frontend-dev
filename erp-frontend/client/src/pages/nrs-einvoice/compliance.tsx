import { SidebarLayout } from "@/components/layout-sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getModuleColor } from "@/contexts/module-context";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Calendar,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react";

interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  status: "passed" | "failed" | "warning";
  lastCheck: string;
}

interface FilingDeadline {
  id: string;
  name: string;
  period: string;
  dueDate: string;
  status: "submitted" | "pending" | "overdue";
  filedDate: string | null;
}

// Mock data
const complianceChecks: ComplianceCheck[] = [
  { id: "1", name: "TIN Validation", description: "All customer TINs are valid and verified", status: "passed", lastCheck: "2024-01-25 14:30" },
  { id: "2", name: "VAT Calculation", description: "VAT rates applied correctly (7.5%)", status: "passed", lastCheck: "2024-01-25 14:30" },
  { id: "3", name: "Invoice Numbering", description: "Sequential invoice numbering maintained", status: "passed", lastCheck: "2024-01-25 14:30" },
  { id: "4", name: "Digital Signature", description: "All submitted invoices are digitally signed", status: "passed", lastCheck: "2024-01-25 14:30" },
  { id: "5", name: "Submission Timeline", description: "Invoices submitted within 72 hours", status: "warning", lastCheck: "2024-01-25 14:30" },
  { id: "6", name: "Data Completeness", description: "All required fields are populated", status: "passed", lastCheck: "2024-01-25 14:30" },
];

const filingDeadlines: FilingDeadline[] = [
  { id: "1", name: "Monthly VAT Return", period: "January 2024", dueDate: "2024-02-21", status: "pending", filedDate: null },
  { id: "2", name: "Monthly VAT Return", period: "December 2023", dueDate: "2024-01-21", status: "submitted", filedDate: "2024-01-18" },
  { id: "3", name: "Monthly VAT Return", period: "November 2023", dueDate: "2023-12-21", status: "submitted", filedDate: "2023-12-15" },
  { id: "4", name: "Quarterly WHT Return", period: "Q4 2023", dueDate: "2024-01-31", status: "pending", filedDate: null },
  { id: "5", name: "Annual Tax Return", period: "2023", dueDate: "2024-06-30", status: "pending", filedDate: null },
];

export default function CompliancePage() {
  const moduleColor = getModuleColor("nrs-einvoice");
  // Calculate compliance score
  const passedChecks = complianceChecks.filter((c) => c.status === "passed").length;
  const totalChecks = complianceChecks.length;
  const complianceScore = Math.round((passedChecks / totalChecks) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getFilingStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-green-500/10 text-green-600 border-green-200">Submitted</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200">Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <SidebarLayout moduleId="nrs-einvoice">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Compliance</h1>
            <p className="text-muted-foreground mt-1">Monitor NRS compliance status and filing deadlines</p>
          </div>
          <Button className="text-white shadow-lg hover:opacity-90 border-0" style={{ backgroundColor: moduleColor, boxShadow: `0 10px 25px ${moduleColor}40` }}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Compliance Check
          </Button>
        </div>

        {/* Compliance Score */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Score
              </CardTitle>
              <CardDescription>Overall NRS compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeDasharray={`${(complianceScore / 100) * 352} 352`}
                      className={complianceScore >= 90 ? "text-green-500" : complianceScore >= 70 ? "text-yellow-500" : "text-red-500"}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{complianceScore}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {passedChecks} of {totalChecks} checks passed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Approved</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">45</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-600">Pending</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                  <p className="text-xs text-muted-foreground">Awaiting NRS</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Rejected</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-xs text-muted-foreground">Needs attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="checks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="checks">Compliance Checks</TabsTrigger>
            <TabsTrigger value="deadlines">Filing Deadlines</TabsTrigger>
          </TabsList>

          <TabsContent value="checks" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Status</TableHead>
                      <TableHead>Check</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Last Checked</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceChecks.map((check) => (
                      <TableRow key={check.id}>
                        <TableCell>{getStatusIcon(check.status)}</TableCell>
                        <TableCell className="font-medium">{check.name}</TableCell>
                        <TableCell className="text-muted-foreground">{check.description}</TableCell>
                        <TableCell className="text-sm">{check.lastCheck}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filing Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Filed Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filingDeadlines.map((deadline) => (
                      <TableRow key={deadline.id}>
                        <TableCell className="font-medium">{deadline.name}</TableCell>
                        <TableCell>{deadline.period}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {deadline.dueDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          {deadline.filedDate || <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell>{getFilingStatusBadge(deadline.status)}</TableCell>
                        <TableCell>
                          {deadline.status === "submitted" ? (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Receipt
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Prepare
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
