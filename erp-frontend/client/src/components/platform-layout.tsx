import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Building2,
  Users,
  LayoutGrid,
  Settings,
  CreditCard,
  HeadphonesIcon,
  LayoutDashboard,
  FolderTree,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PLATFORM_COLOR = "#6366F1";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/platform/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Tenants",
    href: "/platform/tenants",
    icon: Building2,
  },
  {
    name: "Subscriptions",
    href: "/platform/subscriptions",
    icon: CreditCard,
  },
  {
    name: "Categories",
    href: "/platform/categories",
    icon: FolderTree,
  },
  {
    name: "Apps",
    href: "/platform/apps",
    icon: LayoutGrid,
  },
  {
    name: "Team",
    href: "/platform/team",
    icon: Users,
  },
  {
    name: "Support",
    href: "/platform/support",
    icon: HeadphonesIcon,
  },
  {
    name: "Settings",
    href: "/platform/settings",
    icon: Settings,
  },
];

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export function PlatformLayout({ children }: PlatformLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Get admin user from localStorage
  const adminAuth = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("adminAuth") || "{}")
    : {};

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("qucoon-theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("qucoon-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    window.location.href = "/platform/login";
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on all screen sizes */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 h-screen overflow-hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center px-4 border-b border-border gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">Platform Admin</span>
            <button
              className="ml-auto lg:hidden text-muted-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location === item.href || location.startsWith(item.href + "/");
              const ItemIcon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "text-white"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    style={isActive ? { backgroundColor: PLATFORM_COLOR } : undefined}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <ItemIcon
                      className="w-4 h-4"
                      style={{ color: isActive ? "white" : undefined }}
                    />
                    {item.name}
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
              >
                {adminAuth.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {adminAuth.name || "Platform Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{adminAuth.email || "admin@qorpy.com"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-8 w-8"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="flex-1 justify-start text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Offset by sidebar width on large screens */}
      <main className="flex-1 lg:ml-64 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:hidden sticky top-0 bg-background z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">Platform Admin</span>
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
