import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/theme-provider";
import { QorpyBot } from "@/components/qorpy-bot";
import { LogOut, Sun, Moon, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  AccountingIcon,
  HRIcon,
  ProductionIcon,
  SalesIcon,
  CorporateCardsIcon,
  NRSInvoiceIcon,
  InvoiceIcon,
  BankIcon,
  FixedAssetsIcon,
} from "@/components/app-icons";

interface AppModule {
  id: string;
  name: string;
  shortDescription: string;
  icon: React.FC<{ className?: string; size?: number }>;
  href: string;
  color: string;
  category: string;
}

const modules: AppModule[] = [
  {
    id: "sales",
    name: "Sales",
    shortDescription: "Manage customers, leads, quotations and orders",
    icon: SalesIcon,
    href: "/sales",
    color: "#2196F3",
    category: "Sales",
  },
  {
    id: "accounting",
    name: "Accounting",
    shortDescription: "Double-entry bookkeeping and financial reports",
    icon: AccountingIcon,
    href: "/accounting",
    color: "#4CAF50",
    category: "Finance",
  },
  {
    id: "hr",
    name: "HR",
    shortDescription: "Complete employee management and payroll",
    icon: HRIcon,
    href: "/hr",
    color: "#E91E63",
    category: "Human Resources",
  },
  {
    id: "production",
    name: "Production",
    shortDescription: "Manufacturing orders and quality control",
    icon: ProductionIcon,
    href: "/production",
    color: "#607D8B",
    category: "Operations",
  },
  {
    id: "invoice",
    name: "Invoice",
    shortDescription: "Create and send professional invoices",
    icon: InvoiceIcon,
    href: "/invoice",
    color: "#3F51B5",
    category: "Finance",
  },
  {
    id: "bank",
    name: "Bank",
    shortDescription: "Bank account management and reconciliation",
    icon: BankIcon,
    href: "/bank",
    color: "#00BCD4",
    category: "Finance",
  },
  {
    id: "fixed-assets",
    name: "Fixed Assets",
    shortDescription: "Track company assets and depreciation",
    icon: FixedAssetsIcon,
    href: "/fixed-assets",
    color: "#009688",
    category: "Finance",
  },
  {
    id: "corporate-cards",
    name: "Corporate Cards",
    shortDescription: "Issue and manage company expense cards",
    icon: CorporateCardsIcon,
    href: "/corporate-cards",
    color: "#FFC107",
    category: "Finance",
  },
  {
    id: "nrs-einvoice",
    name: "NRS E-Invoice",
    shortDescription: "Nigerian tax compliance and e-invoicing",
    icon: NRSInvoiceIcon,
    href: "/nrs-einvoice",
    color: "#F44336",
    category: "Compliance",
  },
];

// Group apps by category
const categories = [
  { name: "All Apps", filter: null },
  { name: "Sales", filter: "Sales" },
  { name: "Finance", filter: "Finance" },
  { name: "Human Resources", filter: "Human Resources" },
  { name: "Operations", filter: "Operations" },
  { name: "Compliance", filter: "Compliance" },
];

export default function Dashboard() {
  const { user, tenant, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getEffectiveTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/");
      },
    });
  };

  const toggleTheme = () => {
    const effectiveTheme = getEffectiveTheme();
    setTheme(effectiveTheme === "dark" ? "light" : "dark");
  };

  const isDark = getEffectiveTheme() === "dark";

  const filteredModules = selectedCategory
    ? modules.filter((m) => m.category === selectedCategory)
    : modules;

  const currentCategoryName = selectedCategory || "All Apps";
  const currentCategoryDescription = selectedCategory
    ? `Explore ${selectedCategory.toLowerCase()} tools to boost your productivity`
    : "Select an app to get started with your business operations";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="h-full px-4 lg:px-8 flex items-center justify-between">
          {/* Left - Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link href="/">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">Qorpy</span>
              </div>
            </Link>
          </div>

          {/* Right - User Actions */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {tenant?.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Categories (Fixed) */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            top-16 h-[calc(100vh-4rem)] overflow-hidden
          `}
        >
          <div className="p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Apps
            </h2>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    setSelectedCategory(category.filter);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      (category.filter === null && selectedCategory === null) ||
                      category.filter === selectedCategory
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <span>{category.name}</span>
                  {((category.filter === null && selectedCategory === null) ||
                    category.filter === selectedCategory) && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ))}
            </nav>

            {/* Administration Section */}
            <div className="mt-6 pt-6 border-t border-border">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Administration
              </h2>
              <nav className="space-y-1">
                <Link href="/admin/users">
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span>Account Management</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden top-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content (Scrollable) */}
        <main className="flex-1 p-6 lg:p-8 lg:ml-64 overflow-y-auto">
          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">{currentCategoryName}</h1>
            <p className="text-muted-foreground mt-1">{currentCategoryDescription}</p>
          </div>

          {/* App Cards Grid - Zoho Style */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredModules.map((module) => (
              <Card
                key={module.id}
                className="group border-2 hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-800 overflow-hidden"
                style={{
                  borderColor: module.color,
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 40px ${module.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                <div className="p-4">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${module.color}15` }}
                  >
                    <module.icon size={24} />
                  </div>

                  {/* Name */}
                  <h3
                    className="text-base font-semibold mb-1"
                    style={{ color: module.color }}
                  >
                    {module.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {module.shortDescription}
                  </p>

                  {/* Try Now Link */}
                  <Link href={module.href}>
                    <button
                      className="inline-flex items-center gap-1 text-xs font-medium transition-colors hover:gap-2"
                      style={{ color: module.color }}
                    >
                      TRY NOW
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* AI Assistant */}
      <QorpyBot />
    </div>
  );
}
