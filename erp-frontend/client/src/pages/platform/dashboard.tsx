import { PlatformLayout } from "@/components/platform-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  AppWindow,
  Ticket,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for dashboard metrics
const metrics = {
  totalTenants: 156,
  tenantsGrowth: 12.5,
  activeTenants: 142,
  mrr: 485000,
  mrrGrowth: 8.3,
  arr: 5820000,
  activeSubscriptions: 142,
  subscriptionsGrowth: 5.2,
  trialSubscriptions: 14,
  enabledApps: 9,
  totalApps: 12,
  openTickets: 23,
  ticketGrowth: -15.2,
};

// Recent tenants data
const recentTenants = [
  {
    id: "1",
    name: "TechCorp Industries",
    email: "admin@techcorp.com",
    plan: "Enterprise",
    status: "active",
    createdAt: "2024-01-10",
    mrr: 25000,
  },
  {
    id: "2",
    name: "GreenLeaf Solutions",
    email: "contact@greenleaf.ng",
    plan: "Professional",
    status: "active",
    createdAt: "2024-01-09",
    mrr: 15000,
  },
  {
    id: "3",
    name: "BlueSky Enterprises",
    email: "info@bluesky.com",
    plan: "Starter",
    status: "trial",
    createdAt: "2024-01-08",
    mrr: 0,
  },
  {
    id: "4",
    name: "MetroBank Financial",
    email: "tech@metrobank.ng",
    plan: "Enterprise",
    status: "active",
    createdAt: "2024-01-07",
    mrr: 45000,
  },
  {
    id: "5",
    name: "AgriGrow Farms",
    email: "admin@agrigrow.com",
    plan: "Professional",
    status: "pending",
    createdAt: "2024-01-06",
    mrr: 0,
  },
];

// Recent tickets data
const recentTickets = [
  {
    id: "TKT-001",
    subject: "Unable to generate invoice",
    tenant: "TechCorp Industries",
    priority: "high",
    status: "open",
    createdAt: "2 hours ago",
  },
  {
    id: "TKT-002",
    subject: "Request for custom report",
    tenant: "MetroBank Financial",
    priority: "medium",
    status: "in_progress",
    createdAt: "5 hours ago",
  },
  {
    id: "TKT-003",
    subject: "API integration help needed",
    tenant: "GreenLeaf Solutions",
    priority: "low",
    status: "open",
    createdAt: "1 day ago",
  },
];

// Revenue trend data (last 6 months)
const revenueTrend = [
  { month: "Aug", revenue: 380000 },
  { month: "Sep", revenue: 420000 },
  { month: "Oct", revenue: 445000 },
  { month: "Nov", revenue: 460000 },
  { month: "Dec", revenue: 475000 },
  { month: "Jan", revenue: 485000 },
];

const getPlanColor = (plan: string) => {
  switch (plan.toLowerCase()) {
    case "enterprise":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    case "professional":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "starter":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "trial":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "pending":
      return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
    case "suspended":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    case "medium":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    case "low":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getTicketStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    case "in_progress":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "resolved":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    default:
      return <Clock className="w-4 h-4 text-slate-500" />;
  }
};

export default function AdminDashboard() {
  const maxRevenue = Math.max(...revenueTrend.map((d) => d.revenue));

  return (
    <PlatformLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard Overview
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitor your platform performance and key metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Tenants */}
          <Card className="relative overflow-hidden border border-slate-300 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100/80 to-transparent dark:from-indigo-900/20 rounded-bl-full" />
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${metrics.tenantsGrowth >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {metrics.tenantsGrowth >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(metrics.tenantsGrowth)}%
                </div>
              </div>
              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tenants</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
                  {metrics.totalTenants.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">{metrics.activeTenants}</span> active
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Recurring Revenue */}
          <Card className="relative overflow-hidden border border-slate-300 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-100/80 to-transparent dark:from-emerald-900/20 rounded-bl-full" />
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="text-2xl font-bold text-white">₦</span>
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${metrics.mrrGrowth >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {metrics.mrrGrowth >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(metrics.mrrGrowth)}%
                </div>
              </div>
              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Revenue</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
                  ₦{(metrics.mrr / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  ARR: <span className="text-emerald-600 dark:text-emerald-400 font-medium">₦{(metrics.arr / 1000000).toFixed(1)}M</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Active Subscriptions */}
          <Card className="relative overflow-hidden border border-slate-300 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/80 to-transparent dark:from-blue-900/20 rounded-bl-full" />
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <CreditCard className="w-7 h-7 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${metrics.subscriptionsGrowth >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {metrics.subscriptionsGrowth >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(metrics.subscriptionsGrowth)}%
                </div>
              </div>
              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Subscriptions</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
                  {metrics.activeSubscriptions}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">{metrics.trialSubscriptions}</span> in trial
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Open Tickets */}
          <Card className="relative overflow-hidden border border-slate-300 dark:border-slate-600 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100/80 to-transparent dark:from-amber-900/20 rounded-bl-full" />
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Ticket className="w-7 h-7 text-white" />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${metrics.ticketGrowth <= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {metrics.ticketGrowth <= 0 ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5" />
                  )}
                  {Math.abs(metrics.ticketGrowth)}%
                </div>
              </div>
              <div className="mt-5">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Open Tickets</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
                  {metrics.openTickets}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{metrics.enabledApps}/{metrics.totalApps}</span> apps enabled
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart & Quick Stats */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Trend Chart */}
          <Card className="lg:col-span-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-slate-900 dark:text-white">Revenue Trend</CardTitle>
                <CardDescription>Monthly recurring revenue over the last 6 months</CardDescription>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  +{metrics.mrrGrowth}%
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {/* Chart Area */}
              <div className="flex gap-3">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between h-48 text-right">
                  {[500, 400, 300, 200, 100, 0].map((value) => (
                    <span
                      key={value}
                      className="text-[11px] font-medium text-slate-400 dark:text-slate-500 leading-none w-10"
                    >
                      ₦{value}K
                    </span>
                  ))}
                </div>

                {/* Chart Area with Grid and Bars */}
                <div className="flex-1">
                  {/* Grid and Bars Container */}
                  <div className="relative h-48 border-b-2 border-l border-slate-300 dark:border-slate-600">
                    {/* Horizontal Grid Lines */}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="absolute w-full border-t border-dashed border-slate-300 dark:border-slate-600"
                        style={{ top: `${(i / 5) * 100}%` }}
                      />
                    ))}

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-around px-4">
                      {revenueTrend.map((data, index) => {
                        const isCurrentMonth = index === revenueTrend.length - 1;
                        const barHeightPx = (data.revenue / 500000) * 192; // 192px = h-48

                        return (
                          <div
                            key={data.month}
                            className="flex flex-col items-center group cursor-pointer"
                          >
                            {/* Value label above bar */}
                            <div className={`mb-1 text-[10px] font-semibold ${
                              isCurrentMonth
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-slate-500 dark:text-slate-400"
                            }`}>
                              {(data.revenue / 1000).toFixed(0)}K
                            </div>

                            {/* Bar */}
                            <div
                              className={`w-10 rounded-t-sm transition-all duration-300 ${
                                isCurrentMonth
                                  ? "bg-indigo-500 hover:bg-indigo-600 shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
                                  : "bg-slate-400 dark:bg-slate-500 hover:bg-slate-500 dark:hover:bg-slate-400"
                              }`}
                              style={{ height: `${barHeightPx}px` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* X-Axis Labels */}
                  <div className="flex justify-around px-4 mt-2">
                    {revenueTrend.map((data, index) => {
                      const isCurrentMonth = index === revenueTrend.length - 1;
                      return (
                        <span
                          key={data.month}
                          className={`text-xs font-medium w-10 text-center ${
                            isCurrentMonth
                              ? "text-indigo-600 dark:text-indigo-400"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {data.month}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-8 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-slate-400 dark:bg-slate-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Previous Months</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Current Month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Quick Stats</CardTitle>
              <CardDescription>Platform health indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">System Status</span>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Avg Response Time</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">124ms</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Active Users Today</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">1,247</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <AppWindow className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">API Requests (24h)</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">45.2K</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Conversion Rate</span>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">24.8%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tenants & Tickets */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Tenants */}
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-slate-900 dark:text-white">Recent Tenants</CardTitle>
                <CardDescription>Latest organizations that signed up</CardDescription>
              </div>
              <Link href="/platform/tenants">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">MRR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTenants.map((tenant) => (
                    <TableRow key={tenant.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{tenant.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{tenant.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getPlanColor(tenant.plan)}>
                          {tenant.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(tenant.status)}>
                          {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {tenant.mrr > 0 ? `₦${tenant.mrr.toLocaleString()}` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Tickets */}
          <Card className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-slate-900 dark:text-white">Recent Tickets</CardTitle>
                <CardDescription>Latest support requests from tenants</CardDescription>
              </div>
              <Link href="/platform/support">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <div className="mt-0.5">{getTicketStatusIcon(ticket.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          {ticket.id}
                        </span>
                        <Badge variant="secondary" className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white mt-1 truncate">
                        {ticket.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {ticket.tenant}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {ticket.createdAt}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Assign to Team</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PlatformLayout>
  );
}
