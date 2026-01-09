import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Grid3X3,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { QorpyBot } from "@/components/qorpy-bot";
import { getModuleById, SubModule } from "@/config/modules";
import { getModuleIcon } from "@/components/app-icons";
import { ModuleProvider, moduleColors } from "@/contexts/module-context";
import qorpyLogo from "@assets/qorpy-logo.png";

// Use shared module colors from context
const moduleBackgroundColors: Record<string, string> = moduleColors;

interface SidebarLayoutProps {
  children: React.ReactNode;
  moduleId: string;
}

// NavItem component for rendering nested navigation
function NavItem({ item, location, level = 0, moduleColor }: { item: SubModule; location: string; level?: number; moduleColor: string }) {
  const hasChildren = item.children && item.children.length > 0;
  const ItemIcon = item.icon;

  // Check if this item or any of its children is active
  const isActive = item.path === location;
  const hasActiveChild = hasChildren && item.children?.some(child => child.path === location);

  // Only expand if a child is active, otherwise collapsed by default
  const [isExpanded, setIsExpanded] = useState(hasActiveChild);

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
            hasActiveChild
              ? "text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <ItemIcon
            className="w-5 h-5"
            style={{ color: hasActiveChild ? moduleColor : undefined }}
          />
          {item.name}
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 ml-auto" />
          ) : (
            <ChevronRight className="w-4 h-4 ml-auto" />
          )}
        </button>
        {isExpanded && (
          <div className="ml-4 pl-4 border-l border-border space-y-1">
            {item.children?.map((child) => (
              <NavItem key={child.path || child.name} item={child} location={location} level={level + 1} moduleColor={moduleColor} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.path || "#"}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
        !isActive && "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      style={isActive ? {
        backgroundColor: `${moduleColor}15`,
        color: moduleColor,
        boxShadow: 'none',
      } : undefined}
    >
      <ItemIcon
        className="w-4 h-4"
        style={{ color: isActive ? moduleColor : undefined }}
      />
      {item.name}
    </Link>
  );
}

export function SidebarLayout({ children, moduleId }: SidebarLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, tenant, logoutMutation } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Get module config
  const module = getModuleById(moduleId);

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

  const toggleSidebar = () => setIsOpen(!isOpen);

  if (!module) {
    return <div>Module not found</div>;
  }

  // Use custom SVG icon from app-icons.tsx
  const ModuleIcon = getModuleIcon(moduleId);

  return (
    <ModuleProvider moduleId={moduleId} moduleColor={moduleBackgroundColors[moduleId] || "#4B6BF5"}>
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Back to Apps + Logo */}
          <div className="h-16 flex items-center px-4 border-b border-border gap-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9" title="Back to Apps">
                <Grid3X3 className="w-5 h-5" />
              </Button>
            </Link>
            {/* Logo removed */}
            <button
              className="ml-auto lg:hidden text-muted-foreground"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Module Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${moduleBackgroundColors[moduleId] || "#gray"}20`,
                }}
              >
                <ModuleIcon size={36} />
              </div>
              <div>
                <p className="font-semibold text-sm">{module.name}</p>
                <p className="text-xs text-muted-foreground">{tenant?.name}</p>
              </div>
            </div>
          </div>

          {/* Navigation - Module Sub-items */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {module.subModules.map((item) => (
              <NavItem
                key={item.path || item.name}
                item={item}
                location={location}
                moduleColor={moduleBackgroundColors[moduleId] || "#4B6BF5"}
              />
            ))}
          </nav>

          {/* User Profile + Logout */}
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                style={{
                  backgroundColor: `${moduleBackgroundColors[moduleId] || "#4B6BF5"}20`,
                  color: moduleBackgroundColors[moduleId] || "#4B6BF5",
                }}
              >
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="font-medium text-sm truncate">{user?.firstName} {user?.lastName}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <header className="h-16 flex-shrink-0 border-b border-border bg-card/50 backdrop-blur-sm z-30 flex items-center px-4 lg:px-8 justify-between lg:justify-end">
          <button
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={toggleSidebar}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline-block">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-enter">
            {children}
          </div>
        </main>
      </div>

      {/* AI Assistant */}
      <QorpyBot moduleColor={moduleBackgroundColors[moduleId] || "#4B6BF5"} />
    </div>
    </ModuleProvider>
  );
}
