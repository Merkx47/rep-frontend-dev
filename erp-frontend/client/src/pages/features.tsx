import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import qorpyLogo from "@assets/qorpy-logo.png";
import {
  BarChart3,
  Users,
  FileText,
  Building2,
  Clock,
  Package,
  Laptop,
  Shield,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Calculator,
  Receipt,
  TrendingUp,
  UserCheck,
  Calendar,
  Briefcase,
  PieChart,
  Settings,
  Lock,
  Cloud
} from "lucide-react";
import { NairaSign } from "@/components/ui/naira-icon";
import { useState } from "react";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          {/* Logo removed */}
        </Link>

        <nav className="hidden md:flex items-center gap-6 flex-wrap">
          <Link href="/features" className="text-sm font-medium text-foreground" data-testid="link-features">
            Features
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3 flex-wrap">
          <Link href="/auth">
            <Button variant="ghost" data-testid="button-login">Log in</Button>
          </Link>
          <Link href="/auth">
            <Button data-testid="button-signup">Start Free Trial</Button>
          </Link>
        </div>

        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          <nav className="flex flex-col gap-4">
            <Link href="/features" className="text-sm font-medium">Features</Link>
            <Link href="/about" className="text-sm font-medium">About</Link>
            <Link href="/contact" className="text-sm font-medium">Contact</Link>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link href="/auth">
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link href="/auth">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              {/* Logo removed */}
            </div>
            <p className="text-sm text-sidebar-foreground/70">
              Enterprise Resource Planning built for Nigerian businesses.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/features" className="hover:text-sidebar-foreground transition-colors">Features</Link></li>
              <li><Link href="/about" className="hover:text-sidebar-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-sidebar-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/about" className="hover:text-sidebar-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-sidebar-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link href="/privacy" className="hover:text-sidebar-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-sidebar-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-sidebar-foreground/10 pt-8 text-center text-sm text-sidebar-foreground/50">
          <p>&copy; {new Date().getFullYear()} Qorpy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const modules = [
  {
    icon: BarChart3,
    title: "Accounting & Finance",
    description: "Complete financial management with Nigerian Chart of Accounts",
    features: [
      "Chart of Accounts (Nigerian template)",
      "General Ledger & Journal Entries",
      "Accounts Payable & Receivable",
      "Bank Reconciliation",
      "Financial Reports (P&L, Balance Sheet, Trial Balance)",
      "Multi-currency Support"
    ],
    color: "bg-blue-500/10 text-blue-600"
  },
  {
    icon: FileText,
    title: "Sales & Invoicing",
    description: "Professional invoicing with automatic tax calculations",
    features: [
      "Customer Management (CRM)",
      "Quote & Invoice Generation",
      "Automatic VAT 7.5% Calculation",
      "Withholding Tax (WHT) Support",
      "Payment Tracking & Receipts",
      "Sales Reports & Analytics"
    ],
    color: "bg-green-500/10 text-green-600"
  },
  {
    icon: Users,
    title: "HR & Payroll",
    description: "PAYE-compliant payroll and employee management",
    features: [
      "Employee Database & Records",
      "Department & Grade Management",
      "PAYE Tax Calculation",
      "Pension & NHF Deductions",
      "Payslip Generation",
      "Leave Management"
    ],
    color: "bg-purple-500/10 text-purple-600"
  },
  {
    icon: Receipt,
    title: "Expense Management",
    description: "Track and control business expenses effectively",
    features: [
      "Expense Categories",
      "Receipt Upload & Storage",
      "Approval Workflows",
      "Budget vs Actual Tracking",
      "Expense Reports",
      "Vendor Management"
    ],
    color: "bg-orange-500/10 text-orange-600"
  },
  {
    icon: Building2,
    title: "Asset Management",
    description: "Track and manage fixed assets throughout their lifecycle",
    features: [
      "Asset Register",
      "Depreciation Calculation",
      "Asset Assignment & Tracking",
      "Maintenance Scheduling",
      "Disposal & Write-off",
      "Asset Reports"
    ],
    color: "bg-red-500/10 text-red-600"
  },
  {
    icon: Package,
    title: "Inventory Control",
    description: "Real-time inventory tracking and stock management",
    features: [
      "Stock Level Tracking",
      "Low Stock Alerts",
      "Stock Adjustments",
      "Batch & Serial Numbers",
      "Multi-location Support",
      "Inventory Valuation"
    ],
    color: "bg-cyan-500/10 text-cyan-600"
  },
  {
    icon: Clock,
    title: "Time & Attendance",
    description: "Track employee time and attendance efficiently",
    features: [
      "Clock In/Out",
      "Attendance Reports",
      "Work Schedules",
      "Overtime Tracking",
      "Timesheet Management",
      "Integration with Payroll"
    ],
    color: "bg-pink-500/10 text-pink-600"
  },
  {
    icon: Laptop,
    title: "Platform Administration",
    description: "Powerful tools for platform owners and administrators",
    features: [
      "Multi-tenant Management",
      "User & Role Management",
      "Subscription Plans",
      "Platform Analytics",
      "Audit Logs",
      "System Settings"
    ],
    color: "bg-indigo-500/10 text-indigo-600"
  }
];

const highlights = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and security protocols to keep your data safe"
  },
  {
    icon: Cloud,
    title: "Cloud-Based",
    description: "Access your data from anywhere, on any device, at any time"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with instant page loads and real-time updates"
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    description: "Granular permissions to control who sees and does what"
  },
  {
    icon: TrendingUp,
    title: "Analytics & Reports",
    description: "Powerful insights and reports to drive better business decisions"
  },
  {
    icon: Settings,
    title: "Customizable",
    description: "Flexible settings to adapt the system to your business needs"
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 lg:py-28 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6">
                Complete ERP Solution
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" data-testid="text-features-title">
                Everything You Need to Run Your Business
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground" data-testid="text-features-subtitle">
                Qorpy brings together all the tools you need to manage accounting, sales, HR, 
                inventory, and more in one unified platform.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Core Modules</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive modules designed to handle every aspect of your business operations
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {modules.map((module, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center flex-shrink-0`}>
                        <module.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="mb-1">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {module.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Platform Highlights</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built with modern technology and best practices for reliability and performance
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((highlight, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <highlight.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{highlight.title}</h3>
                    <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="secondary" className="mb-4">Nigerian Compliance</Badge>
                <h2 className="text-3xl font-bold mb-6">Built for Nigerian Businesses</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calculator className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">VAT 7.5% Compliance</h3>
                      <p className="text-sm text-muted-foreground">Automatic VAT calculation on all applicable transactions with proper reporting for FIRS submission.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Receipt className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Withholding Tax (WHT)</h3>
                      <p className="text-sm text-muted-foreground">Support for all WHT rates (5%, 10%, etc.) with automatic deduction and remittance tracking.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calculator className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">PAYE Tax Calculation</h3>
                      <p className="text-sm text-muted-foreground">Accurate PAYE calculations based on current Nigerian tax bands with automatic payslip generation.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <NairaSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Nigerian Chart of Accounts</h3>
                      <p className="text-sm text-muted-foreground">Pre-configured chart of accounts following Nigerian accounting standards and best practices.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Tax Calculation Example</h3>
                  <p className="text-sm text-muted-foreground">How Qorpy handles a typical invoice</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">NGN 1,000,000.00</span>
                  </div>
                  <div className="flex justify-between text-primary">
                    <span>VAT (7.5%)</span>
                    <span>+ NGN 75,000.00</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>WHT (5%)</span>
                    <span>- NGN 50,000.00</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Total Due</span>
                    <span>NGN 1,025,000.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Streamline Your Operations?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of Nigerian businesses using Qorpy to manage their operations efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
              <Link href="/auth">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start 14-Day Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
