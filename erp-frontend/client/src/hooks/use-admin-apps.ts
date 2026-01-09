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

// Action definitions for each module
export interface ModuleAction {
  id: string;
  name: string;
  description: string;
}

// Module with its available actions
export interface AppModule {
  id: string;
  name: string;
  description: string;
  actions: ModuleAction[];
}

export interface AppRole {
  id: string;
  name: string;
  description?: string;
  isSystem: boolean;
  permissions: string[]; // e.g., ["employees.view", "employees.create", "leave.approve"]
}

export interface AdminApp {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string; size?: number }>;
  color: string;
  isEnabled: boolean;
  modules: AppModule[];
  roles: AppRole[];
}

// Initial apps configuration
const initialApps: AdminApp[] = [
  {
    id: "sales",
    name: "Sales",
    description: "Manage customers, leads, quotations and orders",
    icon: SalesIcon,
    color: "#2196F3",
    isEnabled: true,
    modules: [
      {
        id: "customers",
        name: "Customers",
        description: "Customer management",
        actions: [
          { id: "view", name: "View", description: "View customer details and list" },
          { id: "create", name: "Create", description: "Add new customers" },
          { id: "edit", name: "Edit", description: "Modify customer information" },
          { id: "delete", name: "Delete", description: "Remove customers" },
          { id: "export", name: "Export", description: "Export customer data" },
        ],
      },
      {
        id: "leads",
        name: "Leads",
        description: "Lead and prospect management",
        actions: [
          { id: "view", name: "View", description: "View leads" },
          { id: "create", name: "Create", description: "Add new leads" },
          { id: "edit", name: "Edit", description: "Update lead information" },
          { id: "delete", name: "Delete", description: "Remove leads" },
          { id: "convert", name: "Convert", description: "Convert lead to customer" },
          { id: "assign", name: "Assign", description: "Assign leads to sales reps" },
        ],
      },
      {
        id: "quotations",
        name: "Quotations",
        description: "Sales quotation management",
        actions: [
          { id: "view", name: "View", description: "View quotations" },
          { id: "create", name: "Create", description: "Create new quotations" },
          { id: "edit", name: "Edit", description: "Modify quotations" },
          { id: "delete", name: "Delete", description: "Remove quotations" },
          { id: "send", name: "Send", description: "Send quotations to customers" },
          { id: "approve", name: "Approve", description: "Approve quotations" },
          { id: "convert", name: "Convert", description: "Convert to sales order" },
        ],
      },
      {
        id: "orders",
        name: "Orders",
        description: "Sales order management",
        actions: [
          { id: "view", name: "View", description: "View sales orders" },
          { id: "create", name: "Create", description: "Create new orders" },
          { id: "edit", name: "Edit", description: "Modify orders" },
          { id: "delete", name: "Delete", description: "Cancel orders" },
          { id: "approve", name: "Approve", description: "Approve sales orders" },
          { id: "fulfill", name: "Fulfill", description: "Mark orders as fulfilled" },
        ],
      },
      {
        id: "products",
        name: "Products",
        description: "Product catalog management",
        actions: [
          { id: "view", name: "View", description: "View products" },
          { id: "create", name: "Create", description: "Add new products" },
          { id: "edit", name: "Edit", description: "Modify product details" },
          { id: "delete", name: "Delete", description: "Remove products" },
          { id: "manage_pricing", name: "Manage Pricing", description: "Set product prices" },
          { id: "manage_inventory", name: "Manage Inventory", description: "Update stock levels" },
        ],
      },
      {
        id: "reports",
        name: "Reports",
        description: "Sales reports and analytics",
        actions: [
          { id: "view", name: "View", description: "View sales reports" },
          { id: "export", name: "Export", description: "Export reports" },
        ],
      },
    ],
    roles: [
      { id: "sales-admin", name: "Sales Admin", description: "Full access to all sales features", isSystem: true, permissions: ["customers.*", "leads.*", "quotations.*", "orders.*", "products.*", "reports.*"] },
      { id: "sales-manager", name: "Sales Manager", description: "Manage orders and customers", isSystem: true, permissions: ["customers.view", "customers.create", "customers.edit", "leads.*", "quotations.*", "orders.view", "orders.create", "orders.edit", "orders.approve", "products.view", "reports.view"] },
      { id: "sales-rep", name: "Sales Rep", description: "Handle leads and quotations", isSystem: true, permissions: ["customers.view", "customers.create", "leads.view", "leads.create", "leads.edit", "quotations.view", "quotations.create", "quotations.edit", "quotations.send", "orders.view", "products.view"] },
      { id: "sales-viewer", name: "Sales Viewer", description: "View-only access", isSystem: true, permissions: ["customers.view", "leads.view", "quotations.view", "orders.view", "products.view", "reports.view"] },
    ],
  },
  {
    id: "accounting",
    name: "Accounting",
    description: "Double-entry bookkeeping and financial reports",
    icon: AccountingIcon,
    color: "#4CAF50",
    isEnabled: true,
    modules: [
      {
        id: "chart_of_accounts",
        name: "Chart of Accounts",
        description: "Manage account structure",
        actions: [
          { id: "view", name: "View", description: "View chart of accounts" },
          { id: "create", name: "Create", description: "Add new accounts" },
          { id: "edit", name: "Edit", description: "Modify accounts" },
          { id: "delete", name: "Delete", description: "Remove accounts" },
        ],
      },
      {
        id: "journal_entries",
        name: "Journal Entries",
        description: "Record financial transactions",
        actions: [
          { id: "view", name: "View", description: "View journal entries" },
          { id: "create", name: "Create", description: "Create journal entries" },
          { id: "edit", name: "Edit", description: "Modify draft entries" },
          { id: "delete", name: "Delete", description: "Delete draft entries" },
          { id: "post", name: "Post", description: "Post entries to ledger" },
          { id: "reverse", name: "Reverse", description: "Reverse posted entries" },
          { id: "approve", name: "Approve", description: "Approve entries for posting" },
        ],
      },
      {
        id: "reports",
        name: "Financial Reports",
        description: "View financial statements",
        actions: [
          { id: "view", name: "View", description: "View financial reports" },
          { id: "export", name: "Export", description: "Export reports to PDF/Excel" },
          { id: "generate", name: "Generate", description: "Generate custom reports" },
        ],
      },
      {
        id: "bank",
        name: "Bank Management",
        description: "Bank account and reconciliation",
        actions: [
          { id: "view", name: "View", description: "View bank accounts" },
          { id: "reconcile", name: "Reconcile", description: "Perform bank reconciliation" },
          { id: "import", name: "Import", description: "Import bank statements" },
        ],
      },
      {
        id: "fiscal_periods",
        name: "Fiscal Periods",
        description: "Manage accounting periods",
        actions: [
          { id: "view", name: "View", description: "View fiscal periods" },
          { id: "open", name: "Open", description: "Open new periods" },
          { id: "close", name: "Close", description: "Close periods" },
          { id: "reopen", name: "Reopen", description: "Reopen closed periods" },
        ],
      },
    ],
    roles: [
      { id: "acc-admin", name: "Accounting Admin", description: "Full access to accounting", isSystem: true, permissions: ["chart_of_accounts.*", "journal_entries.*", "reports.*", "bank.*", "fiscal_periods.*"] },
      { id: "senior-accountant", name: "Senior Accountant", description: "Post and approve entries", isSystem: true, permissions: ["chart_of_accounts.view", "journal_entries.*", "reports.*", "bank.view", "bank.reconcile", "fiscal_periods.view"] },
      { id: "accountant", name: "Accountant", description: "Create and manage entries", isSystem: true, permissions: ["chart_of_accounts.view", "journal_entries.view", "journal_entries.create", "journal_entries.edit", "reports.view", "bank.view"] },
      { id: "acc-viewer", name: "Accounting Viewer", description: "View reports only", isSystem: true, permissions: ["chart_of_accounts.view", "journal_entries.view", "reports.view", "bank.view", "fiscal_periods.view"] },
    ],
  },
  {
    id: "hr",
    name: "HR",
    description: "Complete employee management and payroll",
    icon: HRIcon,
    color: "#E91E63",
    isEnabled: true,
    modules: [
      {
        id: "employees",
        name: "Employees",
        description: "Employee records and profiles",
        actions: [
          { id: "view", name: "View", description: "View employee profiles" },
          { id: "view_own", name: "View Own", description: "View own profile only" },
          { id: "create", name: "Create", description: "Add new employees" },
          { id: "edit", name: "Edit", description: "Update employee information" },
          { id: "edit_own", name: "Edit Own", description: "Update own profile" },
          { id: "delete", name: "Delete", description: "Remove employees" },
          { id: "export", name: "Export", description: "Export employee data" },
        ],
      },
      {
        id: "leave",
        name: "Leave Management",
        description: "Leave requests and approvals",
        actions: [
          { id: "view", name: "View", description: "View all leave requests" },
          { id: "view_own", name: "View Own", description: "View own leave requests" },
          { id: "view_team", name: "View Team", description: "View team leave requests" },
          { id: "request", name: "Request", description: "Submit leave requests" },
          { id: "approve", name: "Approve", description: "Approve leave requests" },
          { id: "reject", name: "Reject", description: "Reject leave requests" },
          { id: "cancel", name: "Cancel", description: "Cancel leave requests" },
          { id: "configure", name: "Configure", description: "Configure leave types and policies" },
        ],
      },
      {
        id: "payroll",
        name: "Payroll",
        description: "Salary and payments",
        actions: [
          { id: "view", name: "View", description: "View payroll records" },
          { id: "view_own", name: "View Own", description: "View own payslips" },
          { id: "run", name: "Run", description: "Run payroll" },
          { id: "approve", name: "Approve", description: "Approve payroll for processing" },
          { id: "export", name: "Export", description: "Export payroll reports" },
          { id: "configure", name: "Configure", description: "Configure salary structures" },
        ],
      },
      {
        id: "attendance",
        name: "Attendance",
        description: "Time tracking and attendance",
        actions: [
          { id: "view", name: "View", description: "View all attendance records" },
          { id: "view_own", name: "View Own", description: "View own attendance" },
          { id: "view_team", name: "View Team", description: "View team attendance" },
          { id: "clock_in", name: "Clock In", description: "Record clock in" },
          { id: "clock_out", name: "Clock Out", description: "Record clock out" },
          { id: "edit", name: "Edit", description: "Modify attendance records" },
          { id: "approve", name: "Approve", description: "Approve attendance corrections" },
          { id: "export", name: "Export", description: "Export attendance reports" },
        ],
      },
      {
        id: "departments",
        name: "Departments",
        description: "Organizational structure",
        actions: [
          { id: "view", name: "View", description: "View departments" },
          { id: "create", name: "Create", description: "Create departments" },
          { id: "edit", name: "Edit", description: "Modify departments" },
          { id: "delete", name: "Delete", description: "Remove departments" },
        ],
      },
    ],
    roles: [
      { id: "hr-admin", name: "HR Admin", description: "Full access to HR module", isSystem: true, permissions: ["employees.*", "leave.*", "payroll.*", "attendance.*", "departments.*"] },
      { id: "hr-manager", name: "HR Manager", description: "Manage employees and leave", isSystem: true, permissions: ["employees.view", "employees.create", "employees.edit", "leave.view", "leave.view_team", "leave.approve", "leave.reject", "payroll.view", "attendance.view", "attendance.view_team", "attendance.approve", "departments.view"] },
      { id: "team-lead", name: "Team Lead", description: "Manage team attendance and leave", isSystem: true, permissions: ["employees.view", "leave.view_own", "leave.view_team", "leave.request", "leave.approve", "attendance.view_own", "attendance.view_team", "attendance.clock_in", "attendance.clock_out"] },
      { id: "employee", name: "Employee", description: "Self-service access", isSystem: true, permissions: ["employees.view_own", "employees.edit_own", "leave.view_own", "leave.request", "leave.cancel", "payroll.view_own", "attendance.view_own", "attendance.clock_in", "attendance.clock_out"] },
      { id: "hr-viewer", name: "HR Viewer", description: "View employee information", isSystem: true, permissions: ["employees.view", "leave.view", "payroll.view", "attendance.view", "departments.view"] },
    ],
  },
  {
    id: "production",
    name: "Production",
    description: "Manufacturing orders and quality control",
    icon: ProductionIcon,
    color: "#607D8B",
    isEnabled: true,
    modules: [
      {
        id: "work_orders",
        name: "Work Orders",
        description: "Production work orders",
        actions: [
          { id: "view", name: "View", description: "View work orders" },
          { id: "create", name: "Create", description: "Create work orders" },
          { id: "edit", name: "Edit", description: "Modify work orders" },
          { id: "delete", name: "Delete", description: "Delete work orders" },
          { id: "start", name: "Start", description: "Start production" },
          { id: "pause", name: "Pause", description: "Pause production" },
          { id: "complete", name: "Complete", description: "Mark as complete" },
          { id: "cancel", name: "Cancel", description: "Cancel work orders" },
        ],
      },
      {
        id: "manufacturing",
        name: "Manufacturing",
        description: "Manufacturing operations",
        actions: [
          { id: "view", name: "View", description: "View manufacturing status" },
          { id: "record_output", name: "Record Output", description: "Record production output" },
          { id: "record_waste", name: "Record Waste", description: "Record material waste" },
          { id: "assign_workers", name: "Assign Workers", description: "Assign workers to operations" },
        ],
      },
      {
        id: "quality",
        name: "Quality Control",
        description: "Quality inspections",
        actions: [
          { id: "view", name: "View", description: "View quality inspections" },
          { id: "create", name: "Create", description: "Create inspection records" },
          { id: "pass", name: "Pass", description: "Mark inspection as passed" },
          { id: "fail", name: "Fail", description: "Mark inspection as failed" },
          { id: "request_rework", name: "Request Rework", description: "Request product rework" },
        ],
      },
      {
        id: "bom",
        name: "Bill of Materials",
        description: "Product BOMs",
        actions: [
          { id: "view", name: "View", description: "View BOMs" },
          { id: "create", name: "Create", description: "Create BOMs" },
          { id: "edit", name: "Edit", description: "Modify BOMs" },
          { id: "delete", name: "Delete", description: "Delete BOMs" },
        ],
      },
    ],
    roles: [
      { id: "prod-admin", name: "Production Admin", description: "Full access to production", isSystem: true, permissions: ["work_orders.*", "manufacturing.*", "quality.*", "bom.*"] },
      { id: "prod-manager", name: "Production Manager", description: "Manage manufacturing orders", isSystem: true, permissions: ["work_orders.*", "manufacturing.view", "manufacturing.assign_workers", "quality.view", "bom.view"] },
      { id: "prod-operator", name: "Production Operator", description: "Execute production orders", isSystem: true, permissions: ["work_orders.view", "work_orders.start", "work_orders.pause", "work_orders.complete", "manufacturing.view", "manufacturing.record_output", "manufacturing.record_waste"] },
      { id: "quality-control", name: "Quality Control", description: "Manage quality inspections", isSystem: false, permissions: ["work_orders.view", "quality.*"] },
    ],
  },
  {
    id: "invoice",
    name: "Invoice",
    description: "Create and send professional invoices",
    icon: InvoiceIcon,
    color: "#3F51B5",
    isEnabled: true,
    modules: [
      {
        id: "invoices",
        name: "Invoices",
        description: "Invoice management",
        actions: [
          { id: "view", name: "View", description: "View invoices" },
          { id: "create", name: "Create", description: "Create invoices" },
          { id: "edit", name: "Edit", description: "Modify draft invoices" },
          { id: "delete", name: "Delete", description: "Delete invoices" },
          { id: "send", name: "Send", description: "Send invoices to customers" },
          { id: "void", name: "Void", description: "Void issued invoices" },
          { id: "record_payment", name: "Record Payment", description: "Record payments received" },
        ],
      },
      {
        id: "recurring",
        name: "Recurring Invoices",
        description: "Automated recurring invoices",
        actions: [
          { id: "view", name: "View", description: "View recurring templates" },
          { id: "create", name: "Create", description: "Create recurring invoices" },
          { id: "edit", name: "Edit", description: "Modify recurring settings" },
          { id: "pause", name: "Pause", description: "Pause recurring invoices" },
          { id: "delete", name: "Delete", description: "Delete recurring templates" },
        ],
      },
      {
        id: "templates",
        name: "Templates",
        description: "Invoice templates",
        actions: [
          { id: "view", name: "View", description: "View templates" },
          { id: "create", name: "Create", description: "Create templates" },
          { id: "edit", name: "Edit", description: "Modify templates" },
          { id: "delete", name: "Delete", description: "Delete templates" },
          { id: "set_default", name: "Set Default", description: "Set default template" },
        ],
      },
    ],
    roles: [
      { id: "inv-admin", name: "Invoice Admin", description: "Full access to invoicing", isSystem: true, permissions: ["invoices.*", "recurring.*", "templates.*"] },
      { id: "inv-manager", name: "Invoice Manager", description: "Create and manage invoices", isSystem: true, permissions: ["invoices.view", "invoices.create", "invoices.edit", "invoices.send", "invoices.record_payment", "recurring.view", "recurring.create", "recurring.edit", "templates.view"] },
      { id: "inv-clerk", name: "Invoice Clerk", description: "Create invoices", isSystem: true, permissions: ["invoices.view", "invoices.create", "invoices.edit", "invoices.send", "templates.view"] },
      { id: "inv-viewer", name: "Invoice Viewer", description: "View invoices only", isSystem: true, permissions: ["invoices.view", "recurring.view", "templates.view"] },
    ],
  },
  {
    id: "bank",
    name: "Bank",
    description: "Bank account management and reconciliation",
    icon: BankIcon,
    color: "#00BCD4",
    isEnabled: true,
    modules: [
      {
        id: "accounts",
        name: "Bank Accounts",
        description: "Bank account management",
        actions: [
          { id: "view", name: "View", description: "View bank accounts" },
          { id: "create", name: "Create", description: "Add bank accounts" },
          { id: "edit", name: "Edit", description: "Modify account details" },
          { id: "delete", name: "Delete", description: "Remove accounts" },
          { id: "view_balance", name: "View Balance", description: "View account balances" },
        ],
      },
      {
        id: "transactions",
        name: "Transactions",
        description: "Bank transactions",
        actions: [
          { id: "view", name: "View", description: "View transactions" },
          { id: "create", name: "Create", description: "Record transactions" },
          { id: "edit", name: "Edit", description: "Modify transactions" },
          { id: "delete", name: "Delete", description: "Delete transactions" },
          { id: "import", name: "Import", description: "Import bank statements" },
          { id: "categorize", name: "Categorize", description: "Categorize transactions" },
        ],
      },
      {
        id: "reconciliation",
        name: "Reconciliation",
        description: "Bank reconciliation",
        actions: [
          { id: "view", name: "View", description: "View reconciliation status" },
          { id: "perform", name: "Perform", description: "Perform reconciliation" },
          { id: "approve", name: "Approve", description: "Approve reconciliation" },
          { id: "undo", name: "Undo", description: "Undo reconciliation" },
        ],
      },
      {
        id: "transfers",
        name: "Transfers",
        description: "Inter-account transfers",
        actions: [
          { id: "view", name: "View", description: "View transfers" },
          { id: "create", name: "Create", description: "Create transfers" },
          { id: "approve", name: "Approve", description: "Approve transfers" },
        ],
      },
    ],
    roles: [
      { id: "bank-admin", name: "Bank Admin", description: "Full access to banking", isSystem: true, permissions: ["accounts.*", "transactions.*", "reconciliation.*", "transfers.*"] },
      { id: "bank-manager", name: "Bank Manager", description: "Manage transactions", isSystem: true, permissions: ["accounts.view", "accounts.view_balance", "transactions.*", "reconciliation.view", "reconciliation.perform", "transfers.*"] },
      { id: "bank-clerk", name: "Bank Clerk", description: "Record transactions", isSystem: true, permissions: ["accounts.view", "accounts.view_balance", "transactions.view", "transactions.create", "transactions.categorize", "transfers.view"] },
      { id: "bank-viewer", name: "Bank Viewer", description: "View transactions only", isSystem: true, permissions: ["accounts.view", "accounts.view_balance", "transactions.view", "reconciliation.view", "transfers.view"] },
    ],
  },
  {
    id: "fixed-assets",
    name: "Fixed Assets",
    description: "Track company assets and depreciation",
    icon: FixedAssetsIcon,
    color: "#009688",
    isEnabled: true,
    modules: [
      {
        id: "register",
        name: "Asset Register",
        description: "Asset registry",
        actions: [
          { id: "view", name: "View", description: "View assets" },
          { id: "create", name: "Create", description: "Add new assets" },
          { id: "edit", name: "Edit", description: "Modify asset details" },
          { id: "delete", name: "Delete", description: "Remove assets" },
          { id: "transfer", name: "Transfer", description: "Transfer asset location/department" },
          { id: "assign", name: "Assign", description: "Assign assets to users" },
        ],
      },
      {
        id: "categories",
        name: "Asset Categories",
        description: "Asset categorization",
        actions: [
          { id: "view", name: "View", description: "View categories" },
          { id: "create", name: "Create", description: "Create categories" },
          { id: "edit", name: "Edit", description: "Modify categories" },
          { id: "delete", name: "Delete", description: "Delete categories" },
        ],
      },
      {
        id: "depreciation",
        name: "Depreciation",
        description: "Asset depreciation",
        actions: [
          { id: "view", name: "View", description: "View depreciation schedules" },
          { id: "calculate", name: "Calculate", description: "Run depreciation calculation" },
          { id: "post", name: "Post", description: "Post depreciation to accounting" },
          { id: "configure", name: "Configure", description: "Configure depreciation methods" },
        ],
      },
      {
        id: "disposal",
        name: "Disposal",
        description: "Asset disposal",
        actions: [
          { id: "view", name: "View", description: "View disposal records" },
          { id: "request", name: "Request", description: "Request asset disposal" },
          { id: "approve", name: "Approve", description: "Approve disposal requests" },
          { id: "execute", name: "Execute", description: "Execute disposal" },
        ],
      },
    ],
    roles: [
      { id: "fa-admin", name: "Asset Admin", description: "Full access to fixed assets", isSystem: true, permissions: ["register.*", "categories.*", "depreciation.*", "disposal.*"] },
      { id: "fa-manager", name: "Asset Manager", description: "Manage assets and depreciation", isSystem: true, permissions: ["register.view", "register.create", "register.edit", "register.transfer", "register.assign", "categories.view", "depreciation.view", "depreciation.calculate", "disposal.view", "disposal.approve"] },
      { id: "fa-custodian", name: "Asset Custodian", description: "Track and maintain assets", isSystem: true, permissions: ["register.view", "register.edit", "register.transfer", "categories.view", "disposal.view", "disposal.request"] },
      { id: "fa-viewer", name: "Asset Viewer", description: "View assets only", isSystem: true, permissions: ["register.view", "categories.view", "depreciation.view", "disposal.view"] },
    ],
  },
  {
    id: "corporate-cards",
    name: "Corporate Cards",
    description: "Issue and manage company expense cards",
    icon: CorporateCardsIcon,
    color: "#FFC107",
    isEnabled: false,
    modules: [
      {
        id: "cards",
        name: "Cards",
        description: "Card management",
        actions: [
          { id: "view", name: "View", description: "View cards" },
          { id: "view_own", name: "View Own", description: "View own card" },
          { id: "issue", name: "Issue", description: "Issue new cards" },
          { id: "block", name: "Block", description: "Block/freeze cards" },
          { id: "unblock", name: "Unblock", description: "Unblock cards" },
          { id: "cancel", name: "Cancel", description: "Cancel cards" },
        ],
      },
      {
        id: "transactions",
        name: "Transactions",
        description: "Card transactions",
        actions: [
          { id: "view", name: "View", description: "View all transactions" },
          { id: "view_own", name: "View Own", description: "View own transactions" },
          { id: "export", name: "Export", description: "Export transactions" },
          { id: "categorize", name: "Categorize", description: "Categorize transactions" },
          { id: "flag", name: "Flag", description: "Flag suspicious transactions" },
        ],
      },
      {
        id: "limits",
        name: "Spending Limits",
        description: "Card spending limits",
        actions: [
          { id: "view", name: "View", description: "View limits" },
          { id: "set", name: "Set", description: "Set spending limits" },
          { id: "request_increase", name: "Request Increase", description: "Request limit increase" },
          { id: "approve_increase", name: "Approve Increase", description: "Approve limit increase" },
        ],
      },
      {
        id: "reports",
        name: "Reports",
        description: "Expense reports",
        actions: [
          { id: "view", name: "View", description: "View expense reports" },
          { id: "generate", name: "Generate", description: "Generate reports" },
          { id: "export", name: "Export", description: "Export reports" },
        ],
      },
    ],
    roles: [
      { id: "cc-admin", name: "Card Admin", description: "Full access to corporate cards", isSystem: true, permissions: ["cards.*", "transactions.*", "limits.*", "reports.*"] },
      { id: "cc-manager", name: "Card Manager", description: "Manage cards and limits", isSystem: true, permissions: ["cards.view", "cards.issue", "cards.block", "cards.unblock", "transactions.view", "transactions.export", "transactions.categorize", "limits.*", "reports.*"] },
      { id: "cc-holder", name: "Cardholder", description: "Card user", isSystem: true, permissions: ["cards.view_own", "transactions.view_own", "limits.view", "limits.request_increase"] },
      { id: "cc-viewer", name: "Card Viewer", description: "View transactions only", isSystem: true, permissions: ["cards.view", "transactions.view", "limits.view", "reports.view"] },
    ],
  },
  {
    id: "nrs-einvoice",
    name: "NRS E-Invoice",
    description: "Nigerian tax compliance and e-invoicing",
    icon: NRSInvoiceIcon,
    color: "#F44336",
    isEnabled: false,
    modules: [
      {
        id: "invoices",
        name: "E-Invoices",
        description: "Electronic invoices",
        actions: [
          { id: "view", name: "View", description: "View e-invoices" },
          { id: "create", name: "Create", description: "Create e-invoices" },
          { id: "submit", name: "Submit", description: "Submit to NRS" },
          { id: "cancel", name: "Cancel", description: "Cancel submissions" },
          { id: "resubmit", name: "Resubmit", description: "Resubmit failed invoices" },
        ],
      },
      {
        id: "compliance",
        name: "Compliance",
        description: "Tax compliance",
        actions: [
          { id: "view", name: "View", description: "View compliance status" },
          { id: "generate_reports", name: "Generate Reports", description: "Generate compliance reports" },
          { id: "file_returns", name: "File Returns", description: "File tax returns" },
          { id: "view_audit", name: "View Audit", description: "View audit trail" },
        ],
      },
      {
        id: "certificates",
        name: "Certificates",
        description: "Digital certificates",
        actions: [
          { id: "view", name: "View", description: "View certificates" },
          { id: "upload", name: "Upload", description: "Upload certificates" },
          { id: "renew", name: "Renew", description: "Renew certificates" },
          { id: "revoke", name: "Revoke", description: "Revoke certificates" },
        ],
      },
    ],
    roles: [
      { id: "nrs-admin", name: "NRS Admin", description: "Full access to NRS e-invoicing", isSystem: true, permissions: ["invoices.*", "compliance.*", "certificates.*"] },
      { id: "nrs-manager", name: "NRS Manager", description: "Manage compliance submissions", isSystem: true, permissions: ["invoices.view", "invoices.create", "invoices.submit", "invoices.resubmit", "compliance.view", "compliance.generate_reports", "certificates.view"] },
      { id: "nrs-clerk", name: "NRS Clerk", description: "Create and submit invoices", isSystem: true, permissions: ["invoices.view", "invoices.create", "invoices.submit", "compliance.view"] },
      { id: "nrs-viewer", name: "NRS Viewer", description: "View submissions only", isSystem: true, permissions: ["invoices.view", "compliance.view", "certificates.view"] },
    ],
  },
];

export function useAdminApps() {
  const [apps, setApps] = useState<AdminApp[]>(initialApps);

  const toggleApp = (appId: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, isEnabled: !app.isEnabled } : app
      )
    );
  };

  const updateApp = (appId: string, updates: Partial<AdminApp>) => {
    setApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, ...updates } : app))
    );
  };

  const addRole = (appId: string, roleData: Omit<AppRole, "id">) => {
    const newRole: AppRole = {
      ...roleData,
      id: `role-${Date.now()}`,
    };
    setApps((prev) =>
      prev.map((app) =>
        app.id === appId ? { ...app, roles: [...app.roles, newRole] } : app
      )
    );
    return newRole;
  };

  const updateRole = (appId: string, roleId: string, updates: Partial<AppRole>) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              roles: app.roles.map((role) =>
                role.id === roleId ? { ...role, ...updates } : role
              ),
            }
          : app
      )
    );
  };

  const deleteRole = (appId: string, roleId: string) => {
    setApps((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, roles: app.roles.filter((role) => role.id !== roleId) }
          : app
      )
    );
  };

  const getAppById = (appId: string) => {
    return apps.find((app) => app.id === appId);
  };

  const getEnabledApps = () => {
    return apps.filter((app) => app.isEnabled);
  };

  // Get all permissions for an app (expanded from modules)
  const getAppPermissions = (appId: string): string[] => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return [];

    const permissions: string[] = [];
    for (const module of app.modules) {
      for (const action of module.actions) {
        permissions.push(`${module.id}.${action.id}`);
      }
    }
    return permissions;
  };

  // Expand wildcard permissions (e.g., "employees.*" -> ["employees.view", "employees.create", ...])
  const expandPermissions = (appId: string, permissions: string[]): string[] => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return permissions;

    const expanded: string[] = [];
    for (const perm of permissions) {
      if (perm.endsWith(".*")) {
        const moduleId = perm.replace(".*", "");
        const module = app.modules.find((m) => m.id === moduleId);
        if (module) {
          for (const action of module.actions) {
            expanded.push(`${moduleId}.${action.id}`);
          }
        }
      } else {
        expanded.push(perm);
      }
    }
    return Array.from(new Set(expanded)); // Remove duplicates
  };

  // Check if a role has a specific permission
  const roleHasPermission = (appId: string, roleId: string, permission: string): boolean => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return false;

    const role = app.roles.find((r) => r.id === roleId);
    if (!role) return false;

    // Check for direct permission
    if (role.permissions.includes(permission)) return true;

    // Check for wildcard permission
    const [moduleId] = permission.split(".");
    if (role.permissions.includes(`${moduleId}.*`)) return true;

    return false;
  };

  // Get permission count for a role (expanded)
  const getRolePermissionCount = (appId: string, roleId: string): number => {
    const app = apps.find((a) => a.id === appId);
    if (!app) return 0;

    const role = app.roles.find((r) => r.id === roleId);
    if (!role) return 0;

    return expandPermissions(appId, role.permissions).length;
  };

  return {
    apps,
    toggleApp,
    updateApp,
    addRole,
    updateRole,
    deleteRole,
    getAppById,
    getEnabledApps,
    getAppPermissions,
    expandPermissions,
    roleHasPermission,
    getRolePermissionCount,
  };
}
