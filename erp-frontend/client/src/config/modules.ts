import {
  HiOutlineCalculator,
  HiOutlineUserGroup,
  HiOutlineShoppingCart,
  HiOutlineCreditCard,
  HiOutlineDocumentText,
  HiOutlineReceiptTax,
  HiOutlineLibrary,
  HiOutlineDesktopComputer,
} from "react-icons/hi";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import {
  LayoutDashboard,
  List,
  FileText,
  BarChart3,
  Users,
  Wallet,
  Calendar,
  Package,
  FolderTree,
  Boxes,
  ShoppingCart,
  UserCircle,
  FileCheck,
  CreditCard,
  Receipt,
  TrendingUp,
  Settings,
  FileOutput,
  Shield,
  Clock,
  RefreshCw,
  FileStack,
  Building2,
  ArrowLeftRight,
  Factory,
  ClipboardList,
  Cog,
  PackageCheck,
  BookOpen,
  PieChart,
  Landmark,
  Timer,
} from "lucide-react";

export interface SubModule {
  name: string;
  path?: string;
  icon: React.ElementType;
  children?: SubModule[];
}

export interface ModuleConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  basePath: string;
  subModules: SubModule[];
}

export const moduleConfig: Record<string, ModuleConfig> = {
  accounting: {
    id: "accounting",
    name: "Accounting",
    icon: HiOutlineCalculator,
    color: "bg-[#4CAF50]",
    basePath: "/accounting",
    subModules: [
      { name: "Overview", path: "/accounting", icon: LayoutDashboard },
      {
        name: "General Ledger",
        icon: BookOpen,
        children: [
          { name: "Chart of Accounts", path: "/accounting/accounts", icon: List },
          { name: "Journal Entries", path: "/accounting/journals", icon: FileText },
        ],
      },
      {
        name: "Financial Reports",
        icon: PieChart,
        children: [
          { name: "Profit & Loss", path: "/accounting/reports/profit-loss", icon: BarChart3 },
          { name: "Balance Sheet", path: "/accounting/reports/balance-sheet", icon: FileText },
        ],
      },
      { name: "Bank Management", path: "/accounting/bank", icon: Landmark },
      { name: "Settings", path: "/accounting/settings", icon: Settings },
    ],
  },
  hr: {
    id: "hr",
    name: "HR",
    icon: HiOutlineUserGroup,
    color: "bg-[#E91E63]",
    basePath: "/hr",
    subModules: [
      { name: "Overview", path: "/hr", icon: LayoutDashboard },
      { name: "Employees", path: "/hr/employees", icon: Users },
      { name: "Attendance (Tymer)", path: "/hr/attendance", icon: Timer },
      { name: "Payroll", path: "/hr/payroll", icon: Wallet },
      { name: "Leave Management", path: "/hr/leave", icon: Calendar },
      { name: "Settings", path: "/hr/settings", icon: Settings },
    ],
  },
  production: {
    id: "production",
    name: "Production",
    icon: HiOutlineOfficeBuilding,
    color: "bg-[#607D8B]",
    basePath: "/production",
    subModules: [
      { name: "Overview", path: "/production", icon: LayoutDashboard },
      { name: "Work Orders", path: "/production/orders", icon: ClipboardList },
      { name: "Manufacturing", path: "/production/manufacturing", icon: Factory },
      { name: "Quality Control", path: "/production/quality", icon: PackageCheck },
      { name: "Settings", path: "/production/settings", icon: Settings },
    ],
  },
  sales: {
    id: "sales",
    name: "Sales",
    icon: HiOutlineShoppingCart,
    color: "bg-[#2196F3]",
    basePath: "/sales",
    subModules: [
      { name: "Overview", path: "/sales", icon: LayoutDashboard },
      {
        name: "General Ledger",
        icon: BookOpen,
        children: [
          { name: "Chart of Accounts", path: "/sales/accounts", icon: List },
          { name: "Journal Entries", path: "/sales/journals", icon: FileText },
        ],
      },
      {
        name: "Financial Reports",
        icon: PieChart,
        children: [
          { name: "Profit & Loss", path: "/sales/reports/profit-loss", icon: BarChart3 },
          { name: "Balance Sheet", path: "/sales/reports/balance-sheet", icon: FileText },
        ],
      },
      { name: "Orders", path: "/sales/orders", icon: ShoppingCart },
      { name: "Customers", path: "/sales/customers", icon: UserCircle },
      { name: "Quotations", path: "/sales/quotations", icon: FileCheck },
      { name: "Leads", path: "/sales/leads", icon: TrendingUp },
      {
        name: "Products",
        icon: Package,
        children: [
          { name: "Product List", path: "/sales/products", icon: Package },
          { name: "Product Categories", path: "/sales/products/categories", icon: FolderTree },
          { name: "Inventory", path: "/sales/products/inventory", icon: Boxes },
        ],
      },
      {
        name: "Services",
        icon: Cog,
        children: [
          { name: "Service List", path: "/sales/services", icon: List },
          { name: "Service Categories", path: "/sales/services/categories", icon: FolderTree },
          { name: "Delivery", path: "/sales/services/delivery", icon: Clock },
        ],
      },
      { name: "Bank Management", path: "/sales/bank", icon: Landmark },
      { name: "Settings", path: "/sales/settings", icon: Settings },
    ],
  },
  "corporate-cards": {
    id: "corporate-cards",
    name: "Corporate Cards",
    icon: HiOutlineCreditCard,
    color: "bg-[#FFC107]",
    basePath: "/corporate-cards",
    subModules: [
      { name: "Overview", path: "/corporate-cards", icon: LayoutDashboard },
      { name: "Cards", path: "/corporate-cards/cards", icon: CreditCard },
      { name: "Transactions", path: "/corporate-cards/transactions", icon: Receipt },
      { name: "Limits", path: "/corporate-cards/limits", icon: TrendingUp },
      { name: "Settings", path: "/corporate-cards/settings", icon: Settings },
    ],
  },
  "nrs-einvoice": {
    id: "nrs-einvoice",
    name: "NRS E-Invoice",
    icon: HiOutlineDocumentText,
    color: "bg-[#F44336]",
    basePath: "/nrs-einvoice",
    subModules: [
      { name: "Overview", path: "/nrs-einvoice", icon: LayoutDashboard },
      { name: "Invoices", path: "/nrs-einvoice/invoices", icon: FileOutput },
      { name: "Compliance", path: "/nrs-einvoice/compliance", icon: Shield },
      { name: "Settings", path: "/nrs-einvoice/settings", icon: Settings },
    ],
  },
  invoice: {
    id: "invoice",
    name: "Invoice",
    icon: HiOutlineReceiptTax,
    color: "bg-[#3F51B5]",
    basePath: "/invoice",
    subModules: [
      { name: "Overview", path: "/invoice", icon: LayoutDashboard },
      { name: "Invoices", path: "/invoice/list", icon: FileStack },
      { name: "Recurring", path: "/invoice/recurring", icon: RefreshCw },
      { name: "Templates", path: "/invoice/templates", icon: FileText },
      { name: "Settings", path: "/invoice/settings", icon: Settings },
    ],
  },
  bank: {
    id: "bank",
    name: "Bank",
    icon: HiOutlineLibrary,
    color: "bg-[#00BCD4]",
    basePath: "/bank",
    subModules: [
      { name: "Overview", path: "/bank", icon: LayoutDashboard },
      { name: "Accounts", path: "/bank/accounts", icon: Building2 },
      { name: "Transactions", path: "/bank/transactions", icon: ArrowLeftRight },
      { name: "Reconciliation", path: "/bank/reconciliation", icon: RefreshCw },
      { name: "Settings", path: "/bank/settings", icon: Settings },
    ],
  },
  "fixed-assets": {
    id: "fixed-assets",
    name: "Fixed Assets",
    icon: HiOutlineDesktopComputer,
    color: "bg-[#009688]",
    basePath: "/fixed-assets",
    subModules: [
      { name: "Overview", path: "/fixed-assets", icon: LayoutDashboard },
      { name: "Asset Register", path: "/fixed-assets/register", icon: List },
      { name: "Asset Categories", path: "/fixed-assets/categories", icon: FolderTree },
      { name: "Depreciation", path: "/fixed-assets/depreciation", icon: TrendingUp },
      { name: "Disposal", path: "/fixed-assets/disposal", icon: FileOutput },
      { name: "Settings", path: "/fixed-assets/settings", icon: Settings },
    ],
  },
};

// Helper to get module by path
export function getModuleByPath(path: string): ModuleConfig | undefined {
  return Object.values(moduleConfig).find(
    (module) => path === module.basePath || path.startsWith(module.basePath + "/")
  );
}

// Helper to get module by id
export function getModuleById(id: string): ModuleConfig | undefined {
  return moduleConfig[id];
}
